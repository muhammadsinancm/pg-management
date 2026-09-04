export type BillingCycle = | 'daily' | 'weekly' | 'monthly' | 'custom'

export type BillingStatus = | 'draft' | 'pending' | 'paid' | 'partial' | 'overdue' | 'cancelled'

export interface Billing {
    id: string
    organizationId: string
    branchId: string
    customerId: string
    bookingId: string
    invoiceId?: string
    billingCycle: BillingCycle
    billingStartDate: string
    billingEndDate: string
    dueDate: string
    rentAmount: number
    mealAmount?: number
    additionalCharges?: number
    discountAmount?: number
    totalAmount: number
    paidAmount: number
    dueAmount: number
    status: BillingStatus
    notes?: string
    createdAt?: string
    updatedAt?: string
}

export interface CreateBillingInput {
    organizationId: string
    branchId: string
    customerId: string
    bookingId: string
    invoiceId?: string
    billingCycle: BillingCycle
    billingStartDate: string
    billingEndDate: string
    dueDate: string
    rentAmount: number
    mealAmount?: number
    additionalCharges?: number
    discountAmount?: number
    totalAmount: number
    paidAmount?: number
    dueAmount: number
    status?: BillingStatus
    notes?: string
}

export interface UpdateBillingInput {
    billingCycle?: BillingCycle
    billingStartDate?: string
    billingEndDate?: string
    dueDate?: string
    rentAmount?: number
    mealAmount?: number
    additionalCharges?: number
    discountAmount?: number
    totalAmunt?: number
    paidAmount?: number
    dueAmount?: number
    status?: BillingStatus
    notes?: string
}