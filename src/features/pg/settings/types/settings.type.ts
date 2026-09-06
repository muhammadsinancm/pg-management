export type ThemeMode = | 'light' | 'dark' | 'system'

export type Currency = | 'INR' | 'USD' | 'AED' | 'EUR' | 'GBP'

export type DateFormat = | 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'

export type TimeFormat = | '12-hour' | '24-hour'

export interface GeneralSettings {
    organizationId: string
    organizationName: string
    email?: string
    phone?: string
    address?: string
    logoUrl?: string
    currency: Currency
    timezone: string
    dateFormat: DateFormat
    timeFormat: TimeFormat
    theme: ThemeMode
}

export interface BranchSettings {
    branchId: string
    branchName: string
    address?: string
    phone?: string
    email?: string
    managerName?: string
}

export interface BillingSettings {
    organizationId: string
    invoicePrefix: string
    invoiceStartingNumber: number
    paymentDueDays: number
    lateFeeEnabled: boolean
    lateFeeAmount?: number
    taxEnabled: boolean
    taxPercentage?: number
}

export interface MealSettings {
    organizationId: string
    breakfastEnabled: boolean
    lunchEnabled: boolean
    dinnerEnabled: boolean
    snacksEnabled: boolean
    defaultMealPrice: number
}

export interface Settings {
    general: GeneralSettings
    billing: BillingSettings
    meals: MealSettings
}

export interface UpdateGeneralSettingsInput {
    organizationName?: string
    email?: string
    phone?: string
    address?: string
    logoUrl?: string
    currency?: Currency
    timezone?: string
    dateFormat?: DateFormat
    timeFormat?: TimeFormat
    theme?: ThemeMode
}

export interface UpdateBranchSettingsInput {
    branchName?: string
    address?: string
    phone?: string
    email?: string
    managerName?: string
}

export interface UpdateBillingSettingsInput {
    invoicePrefix?: string
    invoiceStartingNumber?: number
    paymentDueDays?: number
    lateFeeEnabled?: boolean
    lateFeeAmount?: number
    taxEnabled?: boolean
    taxPercentage?: number
}

export interface UpdateMealSettingsInput {
    breakfastEnabled?: boolean
    lunchEnabled?: boolean
    dinnerEnabled?: boolean
    snacksEnabled?: boolean
    defaultMealPrice?: number
}