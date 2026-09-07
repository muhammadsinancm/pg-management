import { collection, getDoc, getDocs, query, QueryConstraint, Timestamp, where } from "firebase/firestore"
import { BookingReportData, ExpenseReportData, IncomeReportData, MealReportData, PaymentReportData, ReportFilters, ReportsData, RevenueReportData } from "../types/report.types"
import { firestoreDb } from "@/services/firebase/config"
import { Room } from "../../rooms/types/room.types"
import { Booking } from "../../bookings/types/booking.types"
import { Meal } from "../../meals/types/meal.types"
import { Expense } from "../types/expense.types"

const ROOMS_COLLECTION = 'rooms'
const PAYMENTS_COLLECTION = 'payments'
const BOOKINGS_COLLECTION = 'bookings'
const MEALS_COLLECTION = 'meals'
const EXPENSES_COLLECTION = 'expenses'

function convertTimestamp(value: unknown): Date | null {
    if (value instanceof Timestamp) {
        return value.toDate()
    }
    if (value instanceof Date) {
        return value
    }
    if (typeof value === 'string') {
        const date = new Date(value)

        if (!Number.isNaN(date.getTime())) {
            return date
        }

    }

    return null
}

function isDateInRange(value: unknown, startDate?: Date, endDate?: Date): Boolean {
    if (!startDate && !endDate) {
        return true
    }

    const date = convertTimestamp(value)
    if (!date) {
        return false
    }
    if (startDate && date < startDate) {
        return false
    }
    if (endDate && date > endDate) {
        return false
    }
    return true
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

    const occupiedRooms = rooms.filter((room) => room.status === 'occupied').length
    const availableRooms = rooms.filter((room) => room.status === 'available').length
    const maintenanceRooms = rooms.filter((room) => room.status === 'maintenance').length

    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0

    const paymentsQuery = createQuery(PAYMENTS_COLLECTION, branchId)
    const paymentsSnapshot = await getDocs(paymentsQuery)

    const payments: Payment[] = paymentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    } as Payment)).filter((payment) => isDateInRange(payment.paymentDate, startDate, endDate))

    const paidPayments = payments.filter((payment) => payment.status === 'paid')
    const pendingPayments = payments.filter((payment) => payment.status === 'pending')
    const failedPayments = payments.filter((payment) => payment.status === 'failed')
    const refundedPayment = payments.filter((payment) => payment.status === 'refunded')

    const totalAmount = paidPayments.reduce((total, payment) => total + Number(payment.amount || 0), 0)

    const rentRevenue = paidPayments.filter((payment) => payment.paymentType === 'rent')
        .reduce((total, payment) => total + Number(payment.amount || 0), 0)

    const advanceRevenue = paidPayments.filter((payment) => payment.paymentType === 'advance')
        .reduce((total, payment) => total + Number(payment.amount || 0), 0)

    const depositRevenue = paidPayments.filter((payment) => payment.paymentType === 'deposit')
    .reduce((total, payment) => total + Number(payment.amount || 0), 0)

    const otherRevenue = paidPayments.filter((payment) => payment.paymentType === 'other')
    .reduce((total, payment) => total + Number(payment.amount || 0), 0)

    const revenue: RevenueReportData = {
        totalRevenue: totalAmount,
        rentRevenue,
        advanceRevenue,
        depositRevenue,
        otherRevenue
    }

    const paymentReport: PaymentReportData = {
        totalPayments: payments.length,
        paidPayments: paidPayments.length,
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
    } as Meal)).filter((meal) => isDateInRange(meal.mealDate, startDate, endDate))

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
        return isDateInRange(booking.checkInDate, startDate, endDate)
    })

    const confirmedBookings = bookings.filter((booking) => booking.status === 'confirmed').length
    const pendingBookings = bookings.filter((booking) => booking.status === 'pending').length
    const cancelledBookings = bookings.filter((booking) => booking.status === 'cancelled').length
    const completedBookings = bookings.filter((booking) => booking.status === 'checked_out').length

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
    } as Expense)).filter((expense) => isDateInRange(expense.expenseDate, startDate, endDate))

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

    return {
        summary: {
            totalRevenue: totalAmount,
            totalPayments: payments.length,
            totalBookings: bookings.length,
            occupiedRooms,
            availableRooms,
            maintenanceRooms,
            totalRooms
        },
        revenue,

        occupancy: {
            totalRooms,
            occupiedRooms,
            availableRooms,
            maintenanceRooms,
            occupancyRate
        },

        bookings: bookingReport,
        payments: paymentReport,
        income,
        meals: mealReport,
        expenses: expenseReport
    }

}