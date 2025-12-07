import { prisma } from "../config/db"

export const isUserExist = async (email: string) => {
    const result = await prisma.user.findUnique({ where: { email } })
    return result
}