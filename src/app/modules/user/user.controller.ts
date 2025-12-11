import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { userService } from "./user.service";
import { guideService } from "../guideSpot/guideSpot.service";

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

const updateMyProfile = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const body = req.body;

    // Split data
    const userFields: Record<string, any> = {};
    const guideFields: Record<string, any> = {};

    const userAllowed = ["name", "phone", "bio", "profilePhoto", "language", "password"];
    const guideAllowed = ["location", "pricePerDay", "isAvailable", "experienceYears"];

    for (const key in body) {
        if (userAllowed.includes(key)) userFields[key] = body[key];
        if (guideAllowed.includes(key)) guideFields[key] = body[key];
    }

    let updatedUser = null;
    let updatedGuide = null;

    // Update user
    if (Object.keys(userFields).length > 0) {
        updatedUser = await userService.updateUser(userId, userFields);
    }

    // Update guide profile only if user is GUIDE
    if (req.user.role === "GUIDE" && Object.keys(guideFields).length > 0) {
        updatedGuide = await userService.updateGuideProfile(userId, guideFields);
    }

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Profile updated successfully",
        data: { updatedUser, updatedGuide },
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
    updateMyProfile,
    getAllUsers,
    getSingleUser,
    deleteUser
}