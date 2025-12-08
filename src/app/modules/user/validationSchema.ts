import z from "zod";

const userRoleEnum = z.enum(["TRAVELER", "GUIDE", "ADMIN"]);
const createUserSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(6),
    password: z.string().min(6),
    role: userRoleEnum.optional().default("TRAVELER"),
    profilePhoto: z.string().url().nullable().optional(),
    bio: z.string().max(1000).nullable().optional(),
    language: z.array(z.string()).min(1),
});

export const GuideProfileSchema = z.object({
  location: z.string().min(1, "Location is required"),
  pricePerDay: z.number().int().nonnegative(),
  isAvailable: z.boolean().default(true),
  experienceYears: z.number().int().nonnegative().optional(),
});

export const GuideProfileUpdateSchema = z.object({
  location: z.string().min(1, "Location is required").optional(),
  pricePerDay: z.number().int().nonnegative().optional(),
  isAvailable: z.boolean().default(true).optional(),
  experienceYears: z.number().int().nonnegative().optional(),
});

const updateUserSchema = z.object({
    name: z.string().min(1).optional(),
    phone: z.string().min(6).optional(),
    password: z.string().min(6).optional(),
    role: userRoleEnum.optional(),
    profilePhoto: z.string().url().nullable().optional(),
    bio: z.string().max(1000).nullable().optional(),
    language: z.array(z.string()).min(1).optional(),
});


export const UserValidationSchema = {
    createUserSchema,
    GuideProfileSchema,
    GuideProfileUpdateSchema,
    updateUserSchema
}