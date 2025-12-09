import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { bookingService } from "./booking.service";
import { TDecodedUser } from "../../types/UserRole";

const getAllBooking = catchAsync(async (req: Request, res: Response) => {
    const bookingQuery = req.query
    const result = await bookingService.getAllBooking(bookingQuery)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "All Booking Retrieve successfully!",
        data: result
    });
});

const getMyAllBooking = catchAsync(async (req: Request, res: Response) => {
    const userInfo = req.user as TDecodedUser
    const queryInfo = req.query
    const result = await bookingService.getMyBooking(userInfo, queryInfo)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "My All Booking Retrieve successfully!",
        data: result
    });
});

const createBooking = catchAsync(async (req: Request, res: Response) => {
    const bookingInfo = req.body
    bookingInfo.touristId = req.user.userId
    const result = await bookingService.createBooking(bookingInfo)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Booking created successfully!",
        data: result
    });
});

const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
    const updateInfo = req.body
    const bookingId = req.params.bookingId
    const result = await bookingService.updateBookingStatus(bookingId, updateInfo)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Booking update successfully!",
        data: result
    });
})

export const bookingController = {
    getAllBooking,
    getMyAllBooking,
    createBooking,
    updateBookingStatus
}