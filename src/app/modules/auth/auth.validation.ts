import z from "zod";


const loginValidationSchema = z.object({
    email: z.email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" })
})

export const updatePasswordSchema = z
    .object({
        oldPassword: z
            .string()
            .min(6, "Current password must be at least 6 characters"),
        newPassword: z
            .string()
            .min(6, "New password must be at least 6 characters"),
        confirmPassword: z
            .string()
            .min(6, "Confirm password must be at least 6 characters"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const authValidation = {
    loginValidationSchema,
    updatePasswordSchema
}