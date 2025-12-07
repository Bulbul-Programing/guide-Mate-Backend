import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { userService } from "./user.service";

const createUser = catchAsync(async (req: Request, res: Response) => {
    const userInfo = req.body
    const result = await userService.createUser(userInfo);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "User created successfully!",
        data: result
    })
})

const updateGuideProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const guideProfileData = req.body;
    const result = await userService.updateGuideProfile(userId, guideProfileData);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Guide profile updated successfully!",
        data: result
    });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const userData = req.body;
    const result = await userService.updateUser(userId, userData);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User updated successfully!",
        data: result
    });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await userService.getAllUsers(req.query);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Users retrieved successfully!",
        data: result.data,
        meta: result.meta,
    });
})

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const result = await userService.getSingleUser(userId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User retrieved successfully!",
        data: result
    });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    await userService.deleteUser(userId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User deleted successfully!",
        data: null
    });
});

export const userController = {
    createUser,
    updateGuideProfile,
    updateUser,
    getAllUsers,
    getSingleUser,
    deleteUser
}