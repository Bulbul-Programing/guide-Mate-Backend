import { prisma } from "../../config/db";
import AppError from "../../error/AppError";
import { TReview } from "./review.interface";

const createReview = async (payload: TReview) => {
    const isExistSpot = await prisma.booking.findUniqueOrThrow({
        where: {
            id: payload.bookingId
        }
    })

    if (isExistSpot.status !== 'COMPLETED') {
        throw new AppError(500, 'Complete your first for give your review!')
    }

    payload.guideId = isExistSpot.guideId
    payload.guideSpotId = isExistSpot.guideSpotId

    const result = await prisma.review.create({
        data: payload
    })
    return result
}

export const reviewService = {
    createBooking: createReview
}