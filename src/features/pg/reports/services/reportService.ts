import { collection, getDocs, query, QueryConstraint, Timestamp, where } from "firebase/firestore"
import { BookingReportData, ExpenseReportData, IncomeReportData, MealReportData, MonthlyOccupancyData, PaymentReportData, ReportFilters, ReportsData, RevenueReportData } from "../types/report.types"
import { firestoreDb } from "@/services/firebase/config"
import { Room } from "../../rooms/types/room.types"
import { Booking } from "../../bookings/types/booking.types"
import { Meal } from "../../meals/types/meal.types"
import { Expense } from "../types/expense.types"
import { Payment } from "../../payments/types/payment.types"

const ROOMS_COLLECTION = 'rooms'
const PAYMENTS_COLLECTION = 'payments'
const BOOKINGS_COLLECTION = 'bookings'
const MEALS_COLLECTION = 'meals'
const EXPENSES_COLLECTION = 'expenses'

function convertTimestamp(value: unknown): Date | null {
    if (!value) {
        return null
    }
    if (value instanceof Timestamp) {
        return value.toDate()
    }
    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value
    }
    if (typeof value === 'object' && value !== null && 'toDate' in value && typeof (value as { toDate: () => unknown }).toDate === 'function') {
        const d = (value as { toDate: () => unknown }).toDate()
        if (d instanceof Date && !Number.isNaN(d.getTime())) {
            return d
        }
    }
    if (typeof value === 'object' && value !== null && 'seconds' in value && typeof (value as { seconds: unknown }).seconds === 'number') {
        const d = new Date((value as { seconds: number }).seconds * 1000)
        if (!Number.isNaN(d.getTime())) {
            return d
        }
    }
    if (typeof value === 'string' || typeof value === 'number') {
        const date = new Date(value)
        if (!Number.isNaN(date.getTime())) {
            return date
        }
    }

    return null
}

function isDateInRange(value: unknown, startDate?: Date, endDate?: Date): boolean {
    if (!startDate && !endDate) {
        return true
    }

    const date = convertTimestamp(value)
    if (!date) {
        return false
    }

    const time = date.getTime()

    if (startDate && time < startDate.getTime()) {
        return false
    }
    if (endDate && time > endDate.getTime()) {
        return false
    }
    return true
}

function normalizeStatus(value: unknown): string {
    if (typeof value !== 'string') {
        return ''
    }
    return value.toLowerCase().trim()
}

function createQuery(collectionName: string, branchId?: string) {
    const constraints: QueryConstraint[] = []

    if (branchId) {
        constraints.push(where('branchId', '==', branchId))
    }

    return query(collection(firestoreDb, collectionName), ...constraints)
}

export async function getReports(filters: ReportFilters = {}): Promise<ReportsData> {
    const { branchId, startDate, endDate } = filters

    const roomsQuery = createQuery(ROOMS_COLLECTION, branchId)
    const roomsSnapshot = await getDocs(roomsQuery)

    const rooms: Room[] = roomsSnapshot.docs.map((document) => ({
        id: document.id,
        ...document.data()
    } as Room))

    const totalRooms = rooms.length

    const occupiedRooms = rooms.filter((room) => {
        const s = normalizeStatus(room.status)
        return s === 'occupied' || s === 'booked'
    }).length
    const availableRooms = rooms.filter((room) => {
        const s = normalizeStatus(room.status)
        return s === 'available' || s === 'vacant'
    }).length
    const maintenanceRooms = rooms.filter((room) => {
        const s = normalizeStatus(room.status)
        return s === 'maintenance' || s === 'repair'
    }).length

    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0

    const paymentsQuery = createQuery(PAYMENTS_COLLECTION, branchId)
    const paymentsSnapshot = await getDocs(paymentsQuery)

    const payments: Payment[] = paymentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    } as Payment)).filter((payment) => {
        const raw = payment as unknown as Record<string, unknown>
        return isDateInRange(raw.paymentDate ?? raw.createdAt, startDate, endDate)
    })

    const paidPayments = payments.filter((payment) => {
        const s = normalizeStatus(payment.status)
        return s === 'paid' || s === 'completed' || s === 'success' || s === 'successful' || s === 'settled'
    })
    const pendingPayments = payments.filter((payment) => {
        const s = normalizeStatus(payment.status)
        return s === 'pending' || s === 'unpaid' || s === 'due'
    })
    const failedPayments = payments.filter((payment) => {
        const s = normalizeStatus(payment.status)
        return s === 'failed' || s === 'rejected'
    })
    const refundedPayment = payments.filter((payment) => {
        const s = normalizeStatus(payment.status)
        return s === 'refunded' || s === 'refund'
    })

    const effectivePaidPayments = paidPayments.length > 0 ? paidPayments : payments

    const totalAmount = effectivePaidPayments.reduce((total, payment) => {
        const raw = payment as unknown as Record<string, unknown>
        return total + Number(raw.amount || raw.paidAmount || raw.totalAmount || 0)
    }, 0)

    const rentRevenue = effectivePaidPayments.filter((payment) => {
        const raw = payment as unknown as Record<string, unknown>
        const type = normalizeStatus(raw.paymentType ?? raw.type)
        return type === 'rent' || !type
    }).reduce((total, payment) => total + Number((payment as unknown as Record<string, unknown>).amount || 0), 0)

    const advanceRevenue = effectivePaidPayments.filter((payment) => {
        const raw = payment as unknown as Record<string, unknown>
        const type = normalizeStatus(raw.paymentType ?? raw.type)
        return type === 'advance'
    }).reduce((total, payment) => total + Number((payment as unknown as Record<string, unknown>).amount || 0), 0)

    const depositRevenue = effectivePaidPayments.filter((payment) => {
        const raw = payment as unknown as Record<string, unknown>
        const type = normalizeStatus(raw.paymentType ?? raw.type)
        return type === 'deposit' || type === 'security_deposit'
    }).reduce((total, payment) => total + Number((payment as unknown as Record<string, unknown>).amount || 0), 0)

    const otherRevenue = effectivePaidPayments.filter((payment) => {
        const raw = payment as unknown as Record<string, unknown>
        const type = normalizeStatus(raw.paymentType ?? raw.type)
        return type === 'other'
    }).reduce((total, payment) => total + Number((payment as unknown as Record<string, unknown>).amount || 0), 0)

    const revenue: RevenueReportData = {
        totalRevenue: totalAmount,
        rentRevenue,
        advanceRevenue,
        depositRevenue,
        otherRevenue
    }

    const paymentReport: PaymentReportData = {
        totalPayments: payments.length,
        paidPayments: paidPayments.length > 0 ? paidPayments.length : payments.length,
        pendingPayments: pendingPayments.length,
        failedPayments: failedPayments.length,
        refundedPayment: refundedPayment.length,
        totalAmount: totalAmount
    }

    const rentIncome = rentRevenue

    const otherIncome = advanceRevenue + depositRevenue + otherRevenue

    const mealsQuery = createQuery(MEALS_COLLECTION, branchId)

    const mealsSnapshot = await getDocs(mealsQuery)

    const meals: Meal[] = mealsSnapshot.docs.map((document)=> ({
        id: document.id,
        ...document.data()
    } as Meal)).filter((meal) => {
        const raw = meal as unknown as Record<string, unknown>
        return isDateInRange(raw.mealDate ?? raw.createdAt, startDate, endDate)
    })

    const breakfast = meals.filter((meal) => meal.mealType === 'breakfast').length
    const lunch = meals.filter((meal) => meal.mealType === 'lunch').length
    const dinner = meals.filter((meal) => meal.mealType === 'dinner').length
    const snacks = meals.filter((meal) => meal.mealType === 'snacks').length
    const servedMeals = meals.filter((meal) => meal.status === 'served')

    const totalMealAmount = servedMeals.reduce((total, meal) => total + Number(meal.amount || 0), 0)
    const mealReport: MealReportData = {
        totalMeals: meals.length,
        breakfast,
        lunch,
        dinner,
        snacks,
        totalAmount: totalMealAmount
    }

    const mealIncome = totalMealAmount

    const income: IncomeReportData = {
        totalIncome: rentIncome + mealIncome + otherIncome,
        rentIncome,
        mealIncome,
        otherIncome
    }


    const bookingsQuery = createQuery(BOOKINGS_COLLECTION, branchId)

    const bookingsSnapshot = await getDocs(bookingsQuery)
    
    const bookings: Booking[] = bookingsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    } as Booking)).filter((booking) => {
        const raw = booking as unknown as Record<string, unknown>
        return isDateInRange(raw.checkInDate ?? raw.createdAt ?? raw.startDate, startDate, endDate)
    })

    const confirmedBookings = bookings.filter((booking) => {
        const s = normalizeStatus(booking.status)
        return s === 'confirmed' || s === 'checked_in' || s === 'booked' || s === 'active'
    }).length
    const pendingBookings = bookings.filter((booking) => normalizeStatus(booking.status) === 'pending').length
    const cancelledBookings = bookings.filter((booking) => {
        const s = normalizeStatus(booking.status)
        return s === 'cancelled' || s === 'canceled'
    }).length
    const completedBookings = bookings.filter((booking) => {
        const s = normalizeStatus(booking.status)
        return s === 'checked_out' || s === 'completed' || s === 'checkout'
    }).length

    const bookingReport: BookingReportData = {
        totalBookings: bookings.length,
        confirmedBookings,
        pendingBookings,
        cancelledBookings,
        completedBookings
    }

    const expensesQuery = createQuery(EXPENSES_COLLECTION, branchId)
    const expensesSnapshot = await getDocs(expensesQuery)

    const expenses: Expense[] = expensesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    } as Expense)).filter((expense) => {
        const raw = expense as unknown as Record<string, unknown>
        return isDateInRange(raw.expenseDate ?? raw.createdAt, startDate, endDate)
    })

    const paidExpenses = expenses.filter((expense) => expense.status === 'paid')
    const pendingExpenses = expenses.filter((expense) => expense.status === 'pending')
    const cancelledExpenses = expenses.filter((expense) => expense.status === 'cancelled')

    const totalExpenseAmount = paidExpenses.reduce((total, expense) => total + Number(expense.amount || 0), 0)

    const expenseReport: ExpenseReportData = {
        totalExpenses: expenses.length,
        paidExpenses: paidExpenses.length,
        pendingExpenses: pendingExpenses.length,
        cancelledExpenses: cancelledExpenses.length,
        totalAmount: totalExpenseAmount
    }

    // Generate last 6 months occupancy trend
    const monthlyHistory: MonthlyOccupancyData[] = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthLabel = d.toLocaleString('en-US', { month: 'short' })
        const year = d.getFullYear()
        const monthIndex = d.getMonth()
        const startOfMonth = new Date(year, monthIndex, 1)
        const endOfMonth = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999)

        const activeInMonth = bookings.filter((b) => {
            const raw = b as unknown as Record<string, unknown>
            const checkIn = convertTimestamp(raw.checkInDate ?? raw.createdAt ?? raw.startDate)
            const checkOut = convertTimestamp(raw.checkOutDate ?? raw.endDate)
            if (!checkIn) return false
            return checkIn <= endOfMonth && (!checkOut || checkOut >= startOfMonth)
        }).length

        const activeCount = i === 0 ? Math.max(activeInMonth, occupiedRooms) : activeInMonth
        const rate = totalRooms > 0 ? Math.round((activeCount / totalRooms) * 100) : 0

        monthlyHistory.push({
            month: monthLabel,
            occupancy: rate,
            rooms: activeCount,
        })
    }

    return {
        summary: {
            totalRevenue: totalAmount,
            totalPayments: payments.length,
            totalBookings: bookings.length,
            occupiedRooms,
            availableRooms,
            maintenanceRooms,
            totalRooms,
            occupancyRate,
        },
        revenue,

        occupancy: {
            totalRooms,
            occupiedRooms,
            availableRooms,
            maintenanceRooms,
            occupancyRate,
            monthlyHistory,
        },

        bookings: bookingReport,
        payments: paymentReport,
        income,
        meals: mealReport,
        expenses: expenseReport
    }

}