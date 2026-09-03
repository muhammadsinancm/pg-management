export type StaffRole = | 'manager' | 'reception' | 'cook' | 'cleaner' | 'security' | 'maintenance'

export type StaffStatus = | 'active' | 'inactive'

export type SalaryType = | 'monthly' | 'weekly' | 'daily'

export type Gender = | 'male' | 'female' | 'other'

export interface Staff {
    id: string
    branchId: string
    userId?: string
    employeeId?: string
    name: string
    phone: string
    email?: string
    dateOfBirth?: string
    gender?: Gender
    address?: string
    role: StaffRole
    joinedDate: string
    status: StaffStatus
    salary: number
    salaryType: SalaryType
    paymentDay?: number
    createdAt?: string
    updatedAt?: string
}

export type CreateStaffInput = Omit<
    Staff, 'id' | 'createdAt' | 'updatedAt'
>