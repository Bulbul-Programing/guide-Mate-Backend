export type TBooking = {
    id: string
    guideSpotId: string
    touristId: string
    guideId: string
    startDate: Date
    endDate: Date
    totalPrice: number
    status: BookingStatus
}

export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

