import { collection, getDocs, query, QueryConstraint, Timestamp, where } from "firebase/firestore"
import { BookingReportData, PaymentReportData, ReportFilters, ReportsData, RevenueReportData } from "../types/report.types"
import { firestoreDb } from "@/services/firebase/config"
import { Room } from "../../rooms/types/room.types"
import { Payment } from "../../payments/types/payment.types"
import { Booking } from "../../bookings/types/booking.types"

const ROOMS_COLLECTION = 'rooms'
const PAYMENTS_COLLECTION = 'payments'
const BOOKINGS_COLLECTION = 'bookings'

function convertTimestamp(value: unknown): Date | null {
    if (value instanceof Timestamp) {
        return value.toDate()
    }
    if (value instanceof Date) {
        return value
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

export async function getReports(filters: ReportFilters = {}): Promise<ReportsData> {
    const { branchId, startDate, endDate } = filters

    const roomConstraints: QueryConstraint[] = []
    if (branchId) {
        roomConstraints.push(where('branchId', '==', branchId))
    }

    const roomsQuery = query(collection(firestoreDb, ROOMS_COLLECTION), ...roomConstraints)

    const roomsSnapshot = await getDocs(roomsQuery)

    const rooms: Room[] = roomsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    } as Room))

    const totalRooms = rooms.length

    const occupiedRooms = rooms.filter((room) => room.status === 'occupied').length
    const availableRooms = rooms.filter((room) => room.status === 'available').length
    const maintenanceRooms = rooms.filter((room) => room.status === 'maintenance').length

    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0

    const paymentConstraints: QueryConstraint[] = []

    if (branchId) {
        paymentConstraints.push(where('branchId', '==', branchId))
    }


    const paymentsQuery = query(collection(firestoreDb, PAYMENTS_COLLECTION), ...paymentConstraints)
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


    const bookingConstraints: QueryConstraint[] = []

    if (branchId) {
        bookingConstraints.push(where('branchId', '==', branchId))
    }

    const bookingsQuery = query(collection(firestoreDb, BOOKINGS_COLLECTION), ...bookingConstraints)

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
        payments: paymentReport
    }

}