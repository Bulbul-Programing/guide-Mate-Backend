import { prisma } from "../../config/db";
import { TReview } from "./review.interface";



const createBooking = async (payload: TReview) => {
    const result = await prisma.review.create({
        data: payload
    })
}

export const reviewService = {
    createBooking
}