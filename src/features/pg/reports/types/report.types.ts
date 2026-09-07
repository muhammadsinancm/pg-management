export interface ReportFilters {
    branchId?: string
    startDate?: Date
    endDate?: Date
}

export interface ReportSummaryData {
    totalRevenue: number
    totalPayments: number
    totalBookings: number
    occupiedRooms: number
    availableRooms: number
    maintenanceRooms: number
    totalRooms: number
}

export interface RevenueReportData {
    totalRevenue: number
    rentRevenue: number
    advanceRevenue: number
    depositRevenue: number
    otherRevenue: number
}

export interface OccupancyReportData {
    totalRooms: number
    occupiedRooms: number
    availableRooms: number
    maintenanceRooms: number
    occupancyRate: number
}

export interface BookingReportData {
    totalBookings: number
    confirmedBookings: number
    pendingBookings: number
    cancelledBookings: number
    completedBookings: number
}

export interface ExpenseReportData {
    totalExpenses: number
    paidExpenses: number
    pendingExpenses: number
    cancelledExpenses: number
    totalAmount: number
}

export interface PaymentReportData {
    totalPayments: number
    paidPayments: number
    pendingPayments: number
    failedPayments: number
    refundedPayment: number
    totalAmount: number
}

export interface ReportsData {
    summary: ReportSummaryData
    revenue: RevenueReportData
    occupancy: OccupancyReportData
    bookings: BookingReportData
    payments: PaymentReportData
    income: IncomeReportData
    meals: MealReportData
    expenses: ExpenseReportData
}

export interface IncomeReportData {
    totalIncome: number
    rentIncome: number
    mealIncome: number
    otherIncome: number
}

export interface MealReportData {
    totalMeals: number
    breakfast: number
    lunch: number
    dinner: number
    snacks: number
    totalAmount: number
}