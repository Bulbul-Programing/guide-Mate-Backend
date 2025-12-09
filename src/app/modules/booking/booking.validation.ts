
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

export const updateBookingSchema = z.object({
    status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"])
})

export const bookingValidationSchema = {
    createBookingValidationSchema,
    updateBookingSchema
}