import { NextFunction, Request, Response } from "express";
import { TUserRole } from "../types/UserRole";
import catchAsync from "../utils/catchAsync";
import AppError from "../error/AppError";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { isUserExist } from "../utils/isUserExist";

const verifyToken = (...requiredRoles: TUserRole[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const tokenWithBearer = req.headers.authorization;

        if (!tokenWithBearer) {
            throw new AppError(401, 'You are not authorized!');
        }

        const token = tokenWithBearer?.split(' ')[1]

        if (!token) {
            throw new AppError(401, 'Invalid token!');
        }

        const decoded = jwt.verify(
            token,
            '1d2f3g4h5j6k7l8m9n0p'
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