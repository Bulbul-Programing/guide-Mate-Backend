export type Booking = {
  id: string
  bookingId: string
  touristId: string
  guideId: string
  startDate: Date
  endDate: Date
  totalPrice: number
  status: BookingStatus
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
