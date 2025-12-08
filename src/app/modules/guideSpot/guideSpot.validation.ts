import z from "zod";

const TourCategorySchema = z.enum([
    'FOOD',
    'HISTORY',
    'ADVENTURE',
    'PHOTOGRAPHY',
    'NIGHTLIFE',
    'CULTURE',
])

const guideSpotCreationSchema = z.object({
    title: z
        .string()
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title is too long'),

    description: z
        .string()
        .min(20, 'Description must be at least 20 characters'),

    itinerary: z
        .string()
        .min(20, 'Itinerary must be at least 20 characters'),

    category: TourCategorySchema,

    durationDays: z
        .number()
        .int()
        .positive('Duration must be at least 1 day'),

    maxGroupSize: z
        .number()
        .int()
        .positive('Max group size must be at least 1'),

    meetingPoint: z
        .string()
        .min(3, 'Meeting point is required'),

    city: z
        .string()
        .min(2, 'City is required'),

    images: z
        .array(z.string().url('Invalid image URL'))
        .min(1, 'At least one image is required'),

    isActive: z.boolean().optional(),
})

const updateGuideSpotSchema = guideSpotCreationSchema.partial()

export const guideValidationSchemas = { guideSpotCreationSchema, updateGuideSpotSchema }

