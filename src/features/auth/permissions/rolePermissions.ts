import { UserRole } from "../types";

export const rolePermission: Record<UserRole, string[]> = {
    super_admin: [
        'dashboard',
        'branches',
        'floors',
        'rooms',
        'customers',
        'bookings',
        'payments',
        'billing',
        'meals',
        'expenses',
        'reports',
        'staff',
        'settings'
    ],
    branch_manager: [
        'floors',
        'rooms',
        'customers',
        'bookings',
        'payments',
        'billing',
        'meals',
        'expenses',
        'settings'
    ],
    reception_staff: [
        'rooms',
        'customers',
        'bookings',
        'payments',
        'billing',
        'meals',
    ]
}