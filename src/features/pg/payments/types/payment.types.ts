export type PaymentMethod = | 'cash' | 'upi' | 'card' | 'back_transfer'

export type PaymentStatus = | 'paid' | 'pending' | 'failed' | 'refunded'

export type PaymentType = | 'rent' | 'advance' | 'deposit' | 'other'

export interface Payment {
    id: string,
    paymentNumber: string
    organizationId: string
    branchId: string
    customerId: string
    bookingId: string | null
    amount: number
    paymentMethod: PaymentMethod
    paymentType: PaymentType
    paymentDate: Date
    status: PaymentStatus
    notes: string

    createdBy: string
    createdAt: Date
    updatedAt: Date
}
