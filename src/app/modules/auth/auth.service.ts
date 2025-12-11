import { email } from "zod";
import { prisma } from "../../config/db";
import AppError from "../../error/AppError";
import { generateToken } from "../../utils/generateToken";
import { ChangePasswordInput, TLoginInfo } from "./auth.interface";
import bcrypt from 'bcrypt';
import { envVars } from "../../envConfig";
import { TDecodedUser } from "../../types/UserRole";

const loginUser = async (payload: TLoginInfo) => {
    const isExistUser = await prisma.user.findUnique({
        where: {
            email: payload.email
        }
    });

    if (!isExistUser) {
        throw new AppError(404, 'User not found');
    }
    // Password verification logic should be here
    const isPasswordMatch = await bcrypt.compare(payload.password, isExistUser.password);
    if (!isPasswordMatch) {
        throw new AppError(401, 'Invalid credentials');
    }

    const tokenPayload = {
        email: isExistUser.email,
        role: isExistUser.role,
        userId: isExistUser.id
    }

    const accessToken = generateToken(tokenPayload, envVars.ACCESS_TOKEN_SECRETE, envVars.ACCESS_TOKEN_EXPIRE)
    const refreshToken = generateToken(tokenPayload, envVars.REFRESH_TOKEN_SECRET, envVars.REFRESH_TOKEN_EXPIRE)

    return {
        accessToken,
        refreshToken
    }
}

const getMe = async (userInfo: TDecodedUser) => {
    const isExistUser = await prisma.user.findUniqueOrThrow({
        where: {
            id: userInfo.userId
        },
        include: {
            guideProfile: userInfo.role === 'GUIDE' && true
        }
    })

    return isExistUser
}

export const changeUserPassword = async (userInfo: TDecodedUser, payload: ChangePasswordInput) => {
    // 1. Find user
    const user = await prisma.user.findUnique({
        where: { id: userInfo.userId },
    });

    if (!user) {
        throw new AppError(404, "User not found");
    }

    // 2. Verify old password
    const isMatch = await bcrypt.compare(payload.oldPassword, user.password);

    if (!isMatch) {
        throw new AppError(400, "Current password is incorrect");
    }

    // 3. Hash new password
    const hashedPassword = await bcrypt.hash(payload.newPassword, Number(envVars.BCRYPT_ROUNDS) || 10);

    // 4. Update user password
    const result = await prisma.user.update({
        where: { id: userInfo.userId },
        data: { password: hashedPassword },
    });

    result
};


export const authService = {
    loginUser,
    getMe,
    changeUserPassword
}