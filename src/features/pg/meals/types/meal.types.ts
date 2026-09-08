export type MealType = | 'breakfast' | 'lunch' | 'dinner' | 'snacks'

export type MealStatus = | 'scheduled' | 'served' | 'cancelled'

export interface Meal {
    id: string
    organizationId: string
    branchId: string
    mealType: MealType
    mealDate: string
    menu: string
    amount: number
    status: MealStatus
    description?: string
    createdAt?: string
    updatedAt?: string
}

export interface CreateMealInput {
    organizationId: string
    branchId: string
    mealType: MealType
    mealDate: string
    menu: string
    amount: number
    status?: MealStatus
    description?: string
}

export interface UpdateMealInput {
    mealType?: MealType
    mealDate?: string
    menu?: string
    amount?: number
    status?: MealStatus
    description?: string
}

export interface CustomerMeal {
    id: string
    organizationId: string
    branchId: string
    customerId: string
    bookingId: string
    mealId: string
    mealType: MealType
    mealDate: string
    amount: number
    status: 'served' | 'cancelled'
    invoiceId?: string
    createdAt?: string
    updatedAt?: string
}

export interface CreateCustomerMealInput {
    organizationId: string
    branchId: string
    customerId: string
    bookingId: string
    mealId: string
    mealType: MealType
    mealDate: string
    amount: number
    status: 'served' | 'cancelled'
}