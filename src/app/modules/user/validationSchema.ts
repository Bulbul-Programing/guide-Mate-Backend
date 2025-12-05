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


export const UserValidationSchema = {
    createUserSchema
}