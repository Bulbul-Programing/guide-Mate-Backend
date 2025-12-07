import { email } from "zod";
import { prisma } from "../../config/db";
import AppError from "../../error/AppError";
import { generateToken } from "../../utils/generateToken";
import { TLoginInfo } from "./auth.interface";
import bcrypt from 'bcrypt';
import { envVars } from "../../envConfig";

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
    }

    const accessToken = generateToken(tokenPayload, envVars.ACCESS_TOKEN_SECRETE, envVars.ACCESS_TOKEN_EXPIRE)
    const refreshToken = generateToken(tokenPayload, envVars.REFRESH_TOKEN_SECRET, envVars.REFRESH_TOKEN_EXPIRE)

    return {
        accessToken,
        refreshToken
    }
}

export const authService = {
    loginUser
}