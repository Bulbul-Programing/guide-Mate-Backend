import QueryBuilder from "../../builder/QueryBuilder"
import { prisma } from "../../config/db"
import AppError from "../../error/AppError"
import { IOptions, paginateCalculation } from "../../utils/paginateCalculation"
import { guideSearchableFields } from "./guideSpot.const"
import { TGuideSpot } from "./guideSpot.interface"


const creteGuideSpot = async (data: TGuideSpot) => {
    
    const isExistsGuide = await prisma.user.findUnique({
        where: { id: data.guideId }
    })
    if (!isExistsGuide || isExistsGuide.role !== 'GUIDE') {
        throw new AppError(404, 'Guide not found')
    }

    const guideSpot = await prisma.guideSpot.create({
        data: data
    })
    return guideSpot
}

const getAllGuideSpots = async (options: any) => {
    const { page, limit, skip, sortBy, sortOrder } = paginateCalculation(options)

    const guideQueryBuilder = new QueryBuilder(options)
        .searching(guideSearchableFields)
        .category()
        .filter()
        .sort()
        .fields()
        .paginate()

    const result = await prisma.guideSpot.findMany(guideQueryBuilder.prismaQuery)
    const total = await prisma.guideSpot.count({
        where: guideQueryBuilder.prismaQuery.where
    })

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

const updateGuideSpot = async (guideSpotId: string, guideSpotData: Partial<TGuideSpot>) => {
    const isExistGuideSpot = await prisma.guideSpot.findUnique({
        where: { id: guideSpotId }
    })
    if (!isExistGuideSpot) {
        throw new Error('Guide spot not found')
    }
    const updatedGuideSpot = await prisma.guideSpot.update({
        where: { id: guideSpotId },
        data: guideSpotData
    })
    return updatedGuideSpot
}

const deleteGuideSpot = async (guideSpotId: string) => {
    const deleteGuideSpot = await prisma.guideSpot.findUniqueOrThrow({
        where: { id: guideSpotId }
    })
    await prisma.guideSpot.delete({
        where: { id: guideSpotId }
    })

    return deleteGuideSpot
}

export const guideService = {
    creteGuideSpot,
    getAllGuideSpots,
    updateGuideSpot,
    deleteGuideSpot
}