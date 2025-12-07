import bcrypt from "bcrypt";
import type { TGuideProfile, TUser } from "./user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { UserValidationSchema } from "./validationSchema";
import { prisma } from "../../config/db";
import AppError from "../../error/AppError";
import QueryBuilder from "../../builder/QueryBuilder";
import { paginateCalculation } from "../../utils/paginateCalculation";

const createUser = async (userInfo: TUser) => {
    const isExistUser = await prisma.user.findUnique({
        where: {
            email: userInfo.email
        }
    });
    if (isExistUser) {
        throw new AppError(403, 'User with this email already exists');
    }

    const hashPassword = await bcrypt.hash(userInfo.password, 10);
    userInfo.password = hashPassword;

    const result = await prisma.user.create({
        data: userInfo
    });
    const { password, ...userWithoutPassword } = result;
    return userWithoutPassword;
}

const updateGuideProfile = async (userId: string, guideProfileData: TGuideProfile) => {
    const existingProfile = await prisma.guideProfile.findUnique({
        where: { userId }
    });
    if (!existingProfile) {
        throw new AppError(404, 'Guide profile not found');
    }

    const updatedProfile = await prisma.guideProfile.update({
        where: { userId },
        data: guideProfileData
    });
    return updatedProfile;
}

const updateUser = async (userId: string, userData: Partial<TUser>) => {
    const isExistUser = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });
    if (!isExistUser) {
        throw new AppError(404, 'User not found');
    }
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: userData
    });
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
}

const getAllUsers = async (query: any) => {
    const { page, limit, skip, sortBy, sortOrder } = paginateCalculation(query)

    const courseQuery = new QueryBuilder(query)
        .searching(['name', 'email', 'bio', 'phone'])
        .sort()
        .paginate()
        .fields()

    console.log(courseQuery);

    const result = await prisma.user.findMany(courseQuery.prismaQuery);
    const total = await prisma.user.count({
        where: courseQuery.prismaQuery.where,
    });
    const resultWithMetaData = {
        meta: {
            page: Number(page),
            limit: Number(limit),
            totalPage: Math.ceil(total / Number(limit)),
            total: total,
            skip: Number(skip),
        },
        data: result
    }
    return resultWithMetaData
}

export const userService = {
    createUser,
    updateGuideProfile,
    updateUser,
    getAllUsers
}