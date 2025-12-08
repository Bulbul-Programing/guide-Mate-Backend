import { prisma } from "../../config/db";
import { envVars } from "../../envConfig";
import AppError from "../../error/AppError";
import { calculateDay } from "../../utils/calculateDay";
import stripe from "../../utils/stripe";
import { TBooking } from "./Booking.interface";

type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"
const statusFlow: Record<BookingStatus, BookingStatus[]> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["COMPLETED"],
    COMPLETED: [],
    CANCELLED: []
}

const createBooking = async (bookingInfo: TBooking) => {
    const isExistGuideSpot = await prisma.guideSpot.findUniqueOrThrow({
        where: { id: bookingInfo.guideSpotId }
    })

    bookingInfo.guideId = isExistGuideSpot.guideId

    // confirm is exist tourist
    await prisma.user.findUniqueOrThrow({
        where: { id: bookingInfo.touristId }
    })

    const isExistGuide = await prisma.user.findUniqueOrThrow({
        where: { id: bookingInfo.guideId },
        include: { guideProfile: true }
    })

    const start = new Date(bookingInfo.startDate)
    const startTimeInMs = start.getTime()

    const nowDate = new Date()
    const nowDateInMs = nowDate.getTime()

    if (startTimeInMs <= nowDateInMs) {
        throw new AppError(400, 'Please select start time after to day!')
    }

    const totalDay = calculateDay(bookingInfo.startDate, bookingInfo.endDate)
    bookingInfo.totalPrice = totalDay * isExistGuide.guideProfile?.pricePerDay!

    const result = await prisma.$transaction(async (tnx) => {
        const createBooking = await tnx.booking.create({
            data: bookingInfo
        })

        // Create transaction id for payment
        const transactionId = `TX-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        const paymentPayload = {
            bookingId: createBooking.id,
            amount: bookingInfo.totalPrice,
            transactionId
        }

        // crete payment
        await tnx.payment.create({
            data: paymentPayload
        })
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            customer_email: isExistGuide.email,
            line_items: [
                {
                    quantity: 1,
                    price_data: {
                        currency: "usd",
                        unit_amount: Math.round(bookingInfo.totalPrice * 100),
                        product_data: {
                            name: `Booking with ${isExistGuide.name}`,
                        },
                    },
                },
            ],
            metadata: {
                bookingId: String(createBooking.id),
                paymentId: String(paymentPayload.bookingId),
            },
            success_url: `${envVars.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${envVars.FRONTEND_URL}/payment/cancel`,
        } as any);

        return {
            paymentUrl: session.url,
        };

    })

    return result
}

const updateBookingStatus = async (bookingId: string, payload: Partial<TBooking>) => {
    const isExistBooking = await prisma.booking.findUniqueOrThrow({
        where: { id: bookingId }
    })
    const isExistGuide = await prisma.user.findUniqueOrThrow({
        where: {
            id: isExistBooking.guideId
        },
        include: {
            guideProfile: true
        }
    })

    let updatePayload: Partial<TBooking> = {}
    const nowBookingStatus = isExistBooking.status
    if (payload.status) {
        const availableUpdateStatus = statusFlow[nowBookingStatus]
        if (!availableUpdateStatus.includes(payload.status)) {
            throw new AppError(500, `Cannot change status from ${nowBookingStatus} to ${payload.status}`)
        }
        updatePayload.status = payload.status
    }

    if (payload.startDate && payload.endDate) {
        const start = new Date(payload.startDate)
        const startTimeInMs = start.getTime()

        const nowDate = new Date()
        const nowDateInMs = nowDate.getTime()

        if (startTimeInMs <= nowDateInMs) {
            throw new AppError(400, 'Please select start time after to day!')
        }

        const totalDay = calculateDay(payload.startDate, payload.endDate)
        payload.totalPrice = totalDay * isExistGuide.guideProfile?.pricePerDay!

        updatePayload.startDate = payload.startDate
        updatePayload.endDate = payload.endDate
    }

    const result = await prisma.$transaction(async (tnx) => {
        const createBooking = await tnx.booking.update({
            where: { id: bookingId },
            data: payload
        })

        if (updatePayload.totalPrice) {
            const paymentData = await tnx.payment.findUniqueOrThrow({
                where: { bookingId: bookingId }
            })



        }

        // Create transaction id for payment
        const transactionId = `TX-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        // const paymentPayload = {
        //     bookingId: createBooking.id,
        //     amount: bookingInfo.totalPrice,
        //     transactionId
        // }

        // crete payment
        // await tnx.payment.create({
        //     data: paymentPayload
        // })
        return createBooking
    })

    return result

}

export const bookingService = {
    createBooking,
    updateBookingStatus
}