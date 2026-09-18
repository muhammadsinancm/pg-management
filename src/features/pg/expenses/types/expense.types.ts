export type ExpenseCategory = string
export type ExpensePaymentMethod = | 'cash' | 'upi' | 'bank_transfer' | 'card'

export type ExpenseStatus = | 'pending' | 'paid' | 'cancelled'

export interface Expense {
    id: string
    organizationId: string
    branchId: string
    expenseNumber: string
    category: ExpenseCategory
    amount: number
    expenseDate: string
    paymentMethod: ExpensePaymentMethod
    status: ExpenseStatus
    vendorName?: string
    description?: string
    referenceNumber?: string
    createdAt?: string
    updatedAt?: string
}

export interface CreateExpenseInput {
    organizationId: string
    branchId: string
    category: ExpenseCategory
    amount: number
    expenseDate: string
    paymentMethod: ExpensePaymentMethod
    status?: ExpenseStatus
    vendorName?: string
    description?: string
    referenceNumber?: string
}

export interface UpdateExpenseInput {
    category?: ExpenseCategory
    amount?: number
    expenseDate?: string
    paymentMethod?: ExpensePaymentMethod
    status?: ExpenseStatus
    vendorName?: string
    description?: string
    referenceNumber?: string
}