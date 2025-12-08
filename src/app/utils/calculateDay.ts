import AppError from "../error/AppError"

export const calculateDay = (startDate: Date, endDate: Date): number => {
    const start = new Date(startDate)
    const end = new Date(endDate)

    const startTimeInMs = start.getTime()
    const endTimeInMs = end.getTime()

    if (endTimeInMs <= startTimeInMs) {
        throw new AppError(400, 'End time must be grater than start time')
    }

    const timeDiff = endTimeInMs - startTimeInMs

    const totalDay = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))

    return totalDay
}