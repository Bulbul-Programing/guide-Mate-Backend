import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { reviewService } from "./review.service";
import { sendResponse } from "../../utils/sendResponse";


const createReview = catchAsync(async (req: Request, res: Response) => {
    const reviewPayload = req.body
    reviewPayload.travelerId = req.user.userId
    const result = await reviewService.createBooking(reviewPayload);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Review create successfully!",
        data: result
    })
})

export const reviewController = {
    createReview
}