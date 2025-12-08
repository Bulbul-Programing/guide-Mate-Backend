
export type Payment = {
  id: string
  bookingId: string
  amount: number
  transactionId: string
  status: PaymentStatus
}

export type PaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED'