export type BookingStatus = | 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'

export type BookingPaymentStatus = | 'unpaid' | 'partial' | 'paid'

export interface Booking {
  id: string
  organizationId: string
  branchId: string
  customerId: string
  roomId: string
  roomNumber: string
  bedId?: string | null
  bedNumber?: string | null
  bookingNumber: string
  checkInDate: Date
  checkOutDate: Date | null
  status: BookingStatus
  rentAmount: number
  advanceAmount: number
  securityDeposit: number
  paymentStatus: BookingPaymentStatus
  notes?: string
  createdBy: string
  createdAt?: Date
  updatedAt?: Date
}

export interface CreateBookingInput {
    organizationId: string
    branchId: string
    customerId: string
    roomId: string
    roomNumber: string
    bedId?: string | null
    bedNumber?: string | null
    bookingNumber: string
    checkInDate: Date
    checkOutDate?: Date | null
    status: BookingStatus
    rentAmount: number
    advanceAmount:  number
    securityDeposit: number
    paymentStatus: BookingPaymentStatus
    notes?: string
    createdBy: string
}

export interface UpdateBookingInput {
    customerId?: string
    roomId?: string
    roomNumber?: string
    bedId?: string | null
    bedNumber?: string | null
    checkInDate?: Date
    checkOutDate: Date | null
    status?: BookingStatus
    rentAmount: number
    advanceAmount: number
    securityDeposit: number
    paymentStatus: BookingPaymentStatus
    notes?: string
}