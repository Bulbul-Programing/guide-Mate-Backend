import z from "zod";

export const createReviewValidationSchema = z.object({
    rating: z.number().int().min(0, { message: "rating must be an integer >= 0" }),
    comment: z.string().nullable().optional(),
    bookingId: z.string().min(1, { message: "bookingId is required" }),
});

export const reviewValidationSchema = {
    createReviewValidationSchema
}