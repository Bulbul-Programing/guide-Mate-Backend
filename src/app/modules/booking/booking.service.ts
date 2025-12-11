import { userInfo } from "os";
import QueryBuilder from "../../builder/QueryBuilder";
import { prisma } from "../../config/db";
import { envVars } from "../../envConfig";
import AppError from "../../error/AppError";
import { calculateDay } from "../../utils/calculateDay";
import { IOptions, paginateCalculation } from "../../utils/paginateCalculation";
import stripe from "../../utils/stripe";
import { bookingSearchAbleField } from "./booking.const";
import { TBooking } from "./Booking.interface";
import { TDecodedUser } from "../../types/UserRole";

type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"
const statusFlow: Record<BookingStatus, BookingStatus[]> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["COMPLETED"],
    COMPLETED: [],
    CANCELLED: []
}

const getAllBooking = async (options: any) => {
    const { limit, page, skip } = paginateCalculation(options)

    const result = await prisma.booking.findMany({
        take: limit,
        skip: skip
    });
    const total = await prisma.booking.count();

    const resultWithMetaData = {
        meta: {
            page: Number(page),
            limit: Number(limit),
            totalPage: Math.ceil(total / Number(limit)),
            total: total,
            skip: Number(skip),
        },
        data: result
    }
    return resultWithMetaData

}

const getMyBooking = async (userInfo: TDecodedUser, options: any) => {
    const { limit, page, skip } = paginateCalculation(options);

    if (!userInfo?.userId) {
        throw new AppError(401, 'Unauthorized');
    }

    let whereCondition;

    if (userInfo.role === "TRAVELER") {
        whereCondition = { touristId: userInfo.userId };
    }
    else if (userInfo.role === "GUIDE") {
        whereCondition = { guideId: userInfo.userId };
    }
    else {
        throw new AppError(403, "Invalid role");
    }

    const returnData = await prisma.$transaction(async (tnx) => {
        const data = await tnx.booking.findMany({
            where: whereCondition,
            skip: Number(skip),
            take: Number(limit),
            orderBy: {
                createdAt: "desc",
            },
        })
        const total = await tnx.booking.count({
            where: whereCondition
        })
        return { data, total }
    })

    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            totalPage: Math.ceil(returnData.total / Number(limit)),
            total: returnData.total,
            skip: Number(skip),
        },
        data: returnData.data,
    };
};

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

    const isExistPayment = await prisma.payment.findUniqueOrThrow({
        where: {
            bookingId: bookingId
        }
    })

    if (isExistPayment.status !== 'PAID') {
        throw new AppError(500, 'Please contact your tourist for payment first. Without payment you can not update booking status!')
    }

    let updatePayload: Partial<TBooking> = {}
    const nowBookingStatus = isExistBooking.status
    if (payload.status) {
        const availableUpdateStatus = statusFlow[nowBookingStatus]
        if (!availableUpdateStatus.includes(payload.status)) {
            throw new AppError(500, `Cannot change status from ${nowBookingStatus} to ${payload.status}`)
        }
        updatePayload.status = payload.status
    }

    const result = await prisma.booking.update({
        where: { id: bookingId },
        data: payload
    })

    return result

}

export const bookingService = {
    getAllBooking,
    getMyBooking,
    createBooking,
    updateBookingStatus
}