export type InvoiceStatus = | 'draft' | 'issued' | 'partial' | 'paid' | 'overdue' | 'cancelled'

export interface Invoice {
    id: string
    organizationId: string
    branchId: string
    customerId: string
    bookingId: string
    invoiceNumber: string
    billingId?: string
    issueDate: string
    dueDate: string
    rentAmount: number
    mealAmount: number
    additionalCharges: number
    discountAmount: number
    subtotal: number
    totalAmount: number
    paidAmount: number
    dueAmount: number
    status: InvoiceStatus
    notes?: string
    createdAt: string
    updatedAt: string
}

export interface CreateInvoiceInput {
    organizationId: string
    branchId: string
    customerId: string
    bookingId: string
    invoiceNumber: string
    billingId?: string
    issueDate: string
    dueDate: string
    rentAmount: number
    mealAmount: number
    additionalCharges: number
    discountAmount: number
    subtotal: number
    totalAmount: number
    paidAmount?: number
    dueAmount: number
    status?: InvoiceStatus
    notes?: string
}

export interface UpdateInvoiceInput {
    issueDate?: string
    dueDate?: string
    rentAmount?: number
    mealAmount?: number
    additionalCharges?: number
    discountAmount?: number
    subtotal?: number
    totalAmount?: number
    paidAmount?: number
    dueAmount?: number
    status?: InvoiceStatus
    notes?: string
}