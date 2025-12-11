import bcrypt from "bcrypt";
import type { TGuideProfile, TUser } from "./user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { UserValidationSchema } from "./validationSchema";
import { prisma } from "../../config/db";
import AppError from "../../error/AppError";
import QueryBuilder from "../../builder/QueryBuilder";
import { IOptions, paginateCalculation } from "../../utils/paginateCalculation";
import { th } from "zod/v4/locales";
import { envVars } from "../../envConfig";

const createUser = async (userInfo: TUser) => {
    const isExistUser = await prisma.user.findUnique({
        where: {
            email: userInfo.email
        }
    });
    if (isExistUser) {
        throw new AppError(403, 'User with this email already exists');
    }

    const hashPassword = await bcrypt.hash(userInfo.password, Number(envVars.BCRYPT_ROUNDS));
    userInfo.password = hashPassword;

    const result = await prisma.$transaction(async (tnx) => {
        const createUser = await tnx.user.create({
            data: userInfo
        });
        if (userInfo.role === 'GUIDE') {
            await tnx.guideProfile.create({
                data: {
                    userId: createUser.id
                }
            });
        }
        return createUser;
    })

    const { password, ...userWithoutPassword } = result;
    return userWithoutPassword;
}

const updateGuideProfile = async (userId: string, data: any) => {
    const guide = await prisma.guideProfile.findUnique({ where: { userId } });

    if (!guide) throw new AppError(404, "Guide profile not found");

    return prisma.guideProfile.update({
        where: { userId },
        data,
    });
};


const updateUser = async (userId: string, data: Partial<TUser>) => {
    if (data.email) throw new AppError(400, "Email cannot be updated");
    if (data.role) throw new AppError(400, "Role cannot be updated");

    if (data.language) {
        data.language = data.language.map((l: string) => l.trim());
    }

    const user = await prisma.user.update({
        where: { id: userId },
        data,
    });

    const { password, ...rest } = user;
    return rest;
};


const getAllUsers = async (query: any) => {
    const { page, limit, skip, sortBy, sortOrder } = paginateCalculation(query)

    const courseQuery = new QueryBuilder(query)
        .searching(['name', 'email', 'bio', 'phone'])
        .sort()
        .paginate()
        .fields()

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

const getSingleUser = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });
    if (!user) {
        throw new AppError(404, 'User not found');
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

const deleteUser = async (userId: string) => {
    const isExistUser = await prisma.user.findUnique({
        where: { id: userId }
    });
    if (!isExistUser) {
        throw new AppError(404, 'User not found');
    }
    await prisma.user.delete({
        where: { id: userId }
    });
}

export const userService = {
    createUser,
    updateUser,
    updateGuideProfile,
    getAllUsers,
    getSingleUser,
    deleteUser
}