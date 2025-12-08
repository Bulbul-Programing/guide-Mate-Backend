
import { z } from 'zod'

const bookingBaseSchema = {
    guideSpotId: z.uuid({ message: 'Invalid guideSpotId' }),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]).default("PENDING"),
}

export const createBookingValidationSchema = z.object({
    ...bookingBaseSchema,
    status: bookingBaseSchema.status.optional()
}).refine((data) => data.endDate > data.startDate, {
    message: 'endDate must be after startDate',
    path: ['endDate'],
})

export const updateBookingSchema = z
    .object({
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional(),
        status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]).optional(),
    })
    .refine(
        (data) =>
            !data.startDate ||
            !data.endDate ||
            data.endDate > data.startDate,
        {
            message: 'endDate must be after startDate',
            path: ['endDate'],
        }
    )

export const bookingValidationSchema = {
    createBookingValidationSchema,
    updateBookingSchema
}