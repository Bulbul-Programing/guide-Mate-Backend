import { NextFunction, Request, Response } from "express";
import { TUserRole } from "../types/UserRole";
import catchAsync from "../utils/catchAsync";
import AppError from "../error/AppError";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { isUserExist } from "../utils/isUserExist";
import { envVars } from "../envConfig";

const verifyToken = (...requiredRoles: TUserRole[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        const token = req.cookies?.accessToken;

        if (!token) {
            throw new AppError(401, 'Invalid token!');
        }

        const decoded = jwt.verify(
            token,
            envVars.ACCESS_TOKEN_SECRETE
        ) as JwtPayload;

        const { email, role } = decoded;
        const user = await isUserExist(email);

        if (!user) {
            throw new AppError(404, 'user not found!');
        }

        if (requiredRoles && !requiredRoles.includes(role)) {
            throw new AppError(401, 'You have no access to this route!');
        }

        req.user = decoded as JwtPayload;
        next();
    });
};

export default verifyToken;