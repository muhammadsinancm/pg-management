export interface DashboardStats {
    totalCustomers: number
    activeCustomers: number
    vacantRooms: number
    occupiedRooms: number
    maintenanceRooms: number
    totalRooms: number
    totalBeds: number
    occupiedBeds: number
    availableBeds: number
    dueAmount: number
    totalIncome: number
    totalExpenses: number
    netIncome: number
}

export interface RevenueData {
    income: number
    expenses: number
    netIncome: number
}

export interface OccupancyData {
    totalRooms: number
    occupiedRooms: number
    vacantRooms: number
    maintenanceRooms: number
    occupancyPercentage: number
}

export interface RecentPayment {
    id: string
    customerName: string
    amount: number
    status: string
    paymentDate: string
}

export interface RecentCustomer {
    id: string
    name: string
    roomNumber: string
    status: string
    joinedDate: string
}

export interface DashboardData {
    stats: DashboardStats
    revenue: RevenueData
    occupancy: OccupancyData
    recentPayments: RecentPayment[]
    recentCustomers: RecentCustomer[]
}