import { includes, tuple } from "zod"
import QueryBuilder from "../../builder/QueryBuilder"
import { prisma } from "../../config/db"
import AppError from "../../error/AppError"
import { IOptions, paginateCalculation } from "../../utils/paginateCalculation"
import { guideSearchableFields } from "./guideSpot.const"
import { TGuideSpot } from "./guideSpot.interface"


const creteGuideSpot = async (data: TGuideSpot) => {

    const isExistsGuide = await prisma.user.findUnique({
        where: { id: data.guideId },
        include: { guideProfile: true }
    })
    if (!isExistsGuide || isExistsGuide.role !== 'GUIDE') {
        throw new AppError(404, 'Guide not found')
    }

    if (!isExistsGuide.guideProfile?.pricePerDay) {
        throw new AppError(400, 'Please complete your guide profile before creating a guide spot')
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

    const result = await prisma.guideSpot.findMany(
        {
            ...guideQueryBuilder.prismaQuery,
            include: {
                guide: {
                    include: {
                        user: true
                    }
                }
            }
        }
    )
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

const getGuideDetails = async (guideId: string) => {
    const isExistGuide = await prisma.guideSpot.findUnique({
        where: {
            id: guideId
        },
        include: {
            reviews: true,
            guide: {
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                            phone: true,
                            profilePhoto: true
                        }
                    }
                }
            }
        }
    })

    return isExistGuide
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
    // Check if GuideSpot exists
    await prisma.guideSpot.findUniqueOrThrow({
        where: { id: guideSpotId },
    });

    // Start a transaction
    const result = await prisma.$transaction(async (tnx) => {
        // Find all bookings for this GuideSpot
        const bookings = await tnx.booking.findMany({
            where: { guideSpotId },
            include: { payment: true, review: true },
        });

        // Delete payments
        await Promise.all(
            bookings
                .filter((b) => b.payment)
                .map((b) => tnx.payment.delete({ where: { bookingId: b.id } }))
        );

        // Delete reviews
        await Promise.all(
            bookings
                .filter((b) => b.review)
                .map((b) => tnx.review.delete({ where: { bookingId: b.id } }))
        );

        // Delete bookings
        await tnx.booking.deleteMany({
            where: { guideSpotId },
        });

        // Delete GuideSpot
        const deletedSpot = await tnx.guideSpot.delete({
            where: { id: guideSpotId },
        });

        return deletedSpot;
    });

    return result;
};

export const getTopCity = async () => {
    // Group by city and get count
    const topCities = await prisma.guideSpot.groupBy({
        by: ["city"],
        _count: {
            city: true,
        },
        orderBy: {
            _count: {
                city: "desc",
            },
        },
        take: 6,
    });

    // Fetch first image for each city
    const result = await Promise.all(
        topCities.map(async (item) => {
            const guideSpot = await prisma.guideSpot.findFirst({
                where: { city: item.city },
                select: { images: true },
                orderBy: { createdAt: "desc" },
            });

            return {
                city: item.city,
                count: item._count.city,
                photo: guideSpot?.images[0] || null, // first image or null
            };
        })
    );

    return result;
};


export const guideService = {
    creteGuideSpot,
    getAllGuideSpots,
    getGuideDetails,
    updateGuideSpot,
    deleteGuideSpot,
    getTopCity
}