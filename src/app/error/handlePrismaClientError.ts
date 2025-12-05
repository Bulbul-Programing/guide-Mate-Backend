import type { Prisma } from "@prisma/client";

export const handlePrismaClientError = (err: Prisma.PrismaClientKnownRequestError) => {
    let message = 'Database Error Occurred!';
    let statusCode = 400;

    let errorSources = [
        {
            path: '',
            message: 'Something went wrong with database query'
        }
    ]

    if (err.code === 'P2002') {
        const field = (err.meta?.target as string) || "a unique field";
        message = `A record with this ${field} already exists. Please use a different value.`;
        errorSources = [
            {
                path: err.meta?.target as string,
                message: `${err.meta?.target} must be unique`,
            },
        ];
        statusCode = 409;
    }
    else if (err.code === 'P2025') {
        message = "Record not found";
        errorSources = [
            {
                path: "",
                message: "The requested resource could not be found",
            },
        ];
        statusCode = 404;
    }
    else if (err.code === "P2003") {
        message = "Foreign key constraint failed";
        errorSources = [
            {
                path: "",
                message: "Invalid foreign key reference",
            },
        ];
        statusCode = 400;
    }
    else {
        message = err.message;
        statusCode = 500;
        errorSources = [
            {
                path: "",
                message: err.message,
            },
        ];
    }

    return {
        statusCode,
        message,
        errorSources,
    };

}