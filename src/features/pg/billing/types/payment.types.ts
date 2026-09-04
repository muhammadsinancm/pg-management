export type PaymentStatus = | 'completed' | 'pending' | 'failed' | 'refunded'

export type PaymentMethod = | 'cash' | 'upi' | 'card' | 'bacnk_transfer' | 'other'

export interface Payment {
    id: string,
    organizationId: string
    branchId: string
    customerId: string
    bookingId: string
    invoiceId?: string
    paymentNumber: string
    amount: number
    paymentMethod: PaymentMethod
    paymentDate: string
    status: PaymentStatus
    referenceNumber?: string
    notes?: string
    createdAt?: string
    updatedAt?: string
}

export interface CreatePaymentInput {
    organizationId: string
    branchId: string
    customerId: string
    bookingId: string
    invoiceId?: string
    paymentNumber: string
    amount: number
    paymentMethod: PaymentMethod
    paymentDate: string
    status: PaymentStatus
    referenceNumber?: string
    notes?: string
}

export interface UpdatePaymentInput {
    amount?: number
    paymentMethod?: PaymentMethod
    paymentDate?: string
    status?: PaymentStatus
    referenceNumber?: string
    notes?: string
}