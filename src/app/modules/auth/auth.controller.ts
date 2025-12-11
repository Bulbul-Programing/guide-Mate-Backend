import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import { TDecodedUser } from "../../types/UserRole";


const loginUser = catchAsync(async (req: Request, res: Response) => {
    const loginInfo = req.body
    const result = await authService.loginUser(loginInfo)

    res.cookie('accessToken', result.accessToken, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7
    })

    res.cookie('refreshToken', result.refreshToken, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 90
    })

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'User logged in successfully',
        data: result
    })

})

const getMe = catchAsync(async (req: Request, res: Response) => {
    const userInfo = req.user
    const result = await authService.getMe(userInfo as TDecodedUser)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'User Retrieve successfully',
        data: result
    })

})

const changePassword = catchAsync(async (req: Request, res: Response) => {
    const userInfo = req.user
    const payload = req.body
    const result = await authService.changeUserPassword(userInfo as TDecodedUser, payload)
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'User Password change successfully',
        data: result
    })

})

export const authController = {
    loginUser,
    getMe,
    changePassword
}