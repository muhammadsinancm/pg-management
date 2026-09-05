 type PaymentMethod = | 'cash' | 'upi' | 'card' | 'back_transfer'

 type PaymentStatus = | 'paid' | 'pending' | 'failed' | 'refunded'

 type PaymentType = | 'rent' | 'advance' | 'deposit' | 'other'

interface Payment {
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
