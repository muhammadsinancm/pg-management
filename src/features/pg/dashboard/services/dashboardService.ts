import { collection, getDocs, Timestamp } from "firebase/firestore"
import type { DashboardData, DashboardStats, OccupancyData, RecentCustomer, RecentPayment, RevenueData } from "../types/dahsboard.types"
import { firestoreDb } from "@/services/firebase/config"
import { getRooms } from "../../rooms/services/roomService"

const COLLECTIONS = {
    guests: 'guests',
    bookings: 'bookings',
    rooms: 'rooms',
    payments: 'payments',
    expenses: 'expenses',
    invoices: 'invoices',
    branches: 'branches'
} as const

function convertDate(value: unknown): Date | null {
    if (!value) return null

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

    if (typeof value === 'object' && value !== null && 'toDate' in value && typeof value.toDate === 'function') {
        return value.toDate()
    }
    return null

}

function formatDate(value: unknown): string {
    const date = convertDate(value)

    if (!date) return '-'

    return date.toLocaleDateString('en-IN')
}

function getNumber(value: unknown, fallback = 0): number {
    const number = Number(value)

    return Number.isFinite(number) ? number : fallback
}

function normalizeStatus(value: unknown): string {
    if (typeof value !== 'string') {
        return ''
    }

    return value.toLowerCase().trim()
}

function isActiveCustomer(data: Record<string, unknown>): boolean {
    const status = normalizeStatus(data.status)

    if (!status) return true

    return [
        'active',
        'checked_in',
        'checked-in',
        'occupied',
        'confirmed'
    ].includes(status)

}

function getCustomerName(data: Record<string, unknown>): string {
    if (typeof data.name === 'string' && data.name.trim()) {
        return data.name.trim()
    }
    if (typeof data.firstName === 'string' || typeof data.lastName === 'string') {
        return `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim()
    }
    if (typeof data.fullName === 'string' && data.fullName.trim()) {
        return data.fullName.trim()
    }
    return 'Unknown Customer'
}

function getRoomNumber(data: Record<string, unknown>): string {
    if (data.roomNumber !== undefined) {
        return String(data.roomNumber)
    }
    if (data.room !== undefined) {
        return String(data.room)
    }
    return '-'
}

export async function getDashboardData(organizationId: string, branchId?: string): Promise<DashboardData> {
    if (!organizationId) {
        throw new Error('Organization ID is required')
    }

    const [guestsSnapshot,
        bookingsSnapshot,
        paymentsSnapshot,
        rooms,
        expensesSnapshot,
        invoicesSnapshot,
        branchesSnapshot] = await Promise.all([
            getDocs(collection(firestoreDb, COLLECTIONS.guests)),
            getDocs(collection(firestoreDb, COLLECTIONS.bookings)),
            getDocs(collection(firestoreDb, COLLECTIONS.payments)),
            getRooms(),
            getDocs(collection(firestoreDb, COLLECTIONS.expenses)),
            getDocs(collection(firestoreDb, COLLECTIONS.invoices)),
            getDocs(collection(firestoreDb, COLLECTIONS.branches))
        ])

    const guests = guestsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })).filter((guest) => {
        const data = guest as Record<string, unknown>

        if (data.organizationId !== organizationId) {
            return false
        }
        if (branchId && data.branchId !== undefined && data.branchId !== branchId) {
            return false
        }
        return true
    })

    const activeGuests = guests.filter((guest) => isActiveCustomer(guest as Record<string, unknown>))

    const organizationBranchIds = new Set(branchesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })).filter((branch) => {
        const data = branch as Record<string, unknown>

        return data.organizationId === organizationId

    }).map((branch) => String(branch.id)))
    const filteredRooms = rooms.filter((room) => {
        const roomBranchId = String(room.branchId ?? '')

        if (!organizationBranchIds.has(roomBranchId)) {
            return false
        }
        if (branchId && roomBranchId !== branchId) {
            return false
        }

        return true
        
    })

    const vacantRooms = filteredRooms.filter((room) => {
        const status = normalizeStatus(room.status)

        return status === 'available' || status === 'vacant'
    })

    const occupiedRooms = filteredRooms.filter((room) => {
        const status = normalizeStatus(room.status)

        return status === 'occupied'
    })

    const maintenanceRooms = filteredRooms.filter((room) => {
        const status = normalizeStatus(room.status)
        return status === 'maintenance'
    })

    let totalBeds = 0
    let occupiedBeds = 0
    let availableBeds = 0

    filteredRooms.forEach((room) => {
        const beds = room.beds ?? []
        
        beds.forEach((bed) => {
            totalBeds++

            const status = normalizeStatus(bed.status)

            if (status === 'occupied' || status === 'booked') {
                occupiedBeds++
            }
            if (status === 'available' || status === 'vacant') {
                availableBeds++
            }
        })
    })
 
    const payments = paymentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })).filter((payment) => {
        const data = payment as Record<string, unknown>

        if (data.organizationId !== organizationId) {
            return false
        }
        if (branchId && data.branchId !== undefined && data.branchId !== branchId) {
            return false
        }
        return true
    })

    const totalIncome = payments.reduce((total, payment) => {
        const data = payment as Record<string, unknown>

        return (total + getNumber(data.amount))
    }, 0)

    const expenses = expensesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })).filter((expense) => {
        const data = expense as Record<string, unknown>

        if (data.organizationId !== organizationId) {
            return false
        }
        if (branchId && data.branchId !== undefined && data.branchId !== branchId) {
            return false
        }

        return true
    })

    const totalExpenses = expenses.reduce((total, expense) => {
        const data = expense as Record<string, unknown>

        return (total + getNumber(data.amount))
    }, 0)

    const invoices = invoicesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })).filter((invoice) => {
        const data = invoice as Record<string, unknown>

        if (data.organizationId !== organizationId) {
            return false
        }
        if (branchId && data.branchId !== undefined && data.branchId !== branchId) {
            return false
        }

        return true

    })

    const dueAmount = invoices.reduce((total, invoice) => {
        const data = invoice as Record<string, unknown>

        if (data.dueAmount !== undefined) {
            return total + getNumber(data.dueAmount)
        }

        const totalAmount = getNumber(data.totalAmount)
        const paidAmount = getNumber(data.paidAmount)

        return total + Math.max(totalAmount - paidAmount, 0)

    }, 0)

    const recentPayments: RecentPayment[] = [...payments].sort((a, b) => {
        const aData = a as Record<string, unknown>
        const bData = b as Record<string, unknown>

        const aDate = convertDate(aData.paymentDate ?? aData.createdAt)?.getTime() ?? 0
        const bDate = convertDate(bData.paymentDate ?? bData.createdAt)?.getTime() ?? 0

        return bDate - aDate
    }).slice(0, 5).map((payment) => {
        const data = payment as Record<string, unknown>

        return {
            id: String(payment.id),
            customerName: typeof data.customerName === 'string' ? data.customerName : 'Unknown Customer',
            amount: getNumber(data.amount),
            status: typeof data.status === 'string' ? data.status : 'completed',
            paymentDate: formatDate(data.paymentDate ?? data.createdAt)
        }
    })

       const bookings = bookingsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })).filter((booking) => {
        const data = booking as Record<string, unknown>

        if (data.organizationId !== organizationId) {
            return false
        }
        if (branchId && data.branchId !== branchId) {
            return false
        }

        return true
    })

    const guestMap = new Map(guests.map((guest) => [
        String(guest.id),
        guest as Record<string, unknown>
    ]))

    const recentCustomers: RecentCustomer[] = [...bookings].filter((booking) => {
        const data = booking as Record<string, unknown>

        return [
            'pending',
            'confirmed',
            'checked_in'
        ].includes(normalizeStatus(data.status))

    }).sort((a, b) => {
        const aData = a as Record<string, unknown>
        const bData = b as Record<string, unknown>

        const aDate = convertDate(aData.createdAt ?? aData.joinedDate ?? aData.checkInDate)?.getTime() ?? 0
        const bDate = convertDate(bData.createdAt ?? bData.joinedDate ?? bData.checkInDate)?.getTime() ?? 0

        return bDate - aDate

    }).slice(0, 5).map((booking) => {
        const data = booking as Record<string, unknown>

        const customerId = String(data.customerId ?? '')
        const guest = guestMap.get(customerId)

        return {
            id: customerId,
            name: guest ? getCustomerName(guest) : 'Unknown Customer',
            roomNumber: String(data.roomNumber ?? '-'),
            status: typeof data.status === 'string' ? data.status : 'confirmed',
            joinedDate: formatDate(data.checkInDate ?? data.createdAt)
        }
    })

    const netIncome = totalIncome - totalExpenses

    const occupancyPercentage = filteredRooms.length > 0 ? Math.round((occupiedRooms.length / filteredRooms.length) * 100) : 0

    const stats: DashboardStats = {
        totalCustomers: guests.length,
        activeCustomers: activeGuests.length,
        totalRooms: filteredRooms.length,
        vacantRooms: vacantRooms.length,
        occupiedRooms: occupiedRooms.length,
        maintenanceRooms: maintenanceRooms.length,
        totalBeds,
        occupiedBeds,
        availableBeds,
        dueAmount,
        totalIncome,
        totalExpenses,
        netIncome
    }

    const revenue: RevenueData = {
        income: totalIncome,
        expenses: totalExpenses,
        netIncome
    }

    const occupancy: OccupancyData = {
        totalRooms: filteredRooms.length,
        occupiedRooms: occupiedRooms.length,
        vacantRooms: vacantRooms.length,
        maintenanceRooms: maintenanceRooms.length,
        occupancyPercentage
    }

    return {
        stats,
        revenue,
        occupancy,
        recentPayments,
        recentCustomers
    }
}