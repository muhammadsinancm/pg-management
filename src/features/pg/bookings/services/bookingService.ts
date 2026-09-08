import { firestoreDb } from "@/services/firebase/config"
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, QueryDocumentSnapshot, runTransaction, serverTimestamp, Timestamp, updateDoc, where } from "firebase/firestore"
import { Booking, BookingStatus, CreateBookingInput, UpdateBookingInput } from "../types/booking.types"


const bookingCollection = collection(firestoreDb, 'bookings')

function convertTimestamp(value: unknown): Date | null {
    if (value instanceof Timestamp) {
        return value.toDate()
    }
    if (value instanceof Date) {
        return value
    }
    return null
}

export function mapBooking(document: QueryDocumentSnapshot): Booking {

    const data = document.data()

    return {
        id: document.id,
        organizationId: String(data.organizationId ?? ''),
        branchId: String(data.branchId ?? ''),
        floorId: String(data.floorId ?? ''),
        customerId: String(data.customerId ?? ''),
        roomId: String(data.roomId ?? ''),
        roomNumber: String(data.roomNumber ?? ''),
        bedId: data.bedId !== undefined && data.bedId !== null ? String(data.bedId) : null,
        bedNumber: data.bedNumber !== undefined && data.bedNumber !== null ? String(data.bedNumber) : null,
        bookingNumber: String(data.bookingNumber ?? ''),
        checkInDate: convertTimestamp(data.checkInDate) ?? new Date(),
        checkOutDate: data.checkOutDate ? convertTimestamp(data.checkOutDate) : null,
        status: data.status,
        rentAmount: Number(data.rentAmount ?? 0),
        advanceAmount: Number(data.advanceAmount ?? 0),
        securityDeposit: Number(data.securityDeposit ?? 0),
        paymentStatus: data.paymentStatus ?? 'unpaid',
        notes: data.notes ?? '',
        createdBy: String(data.createdBy ?? ''),
        createdAt: convertTimestamp(data.createdAt) ?? undefined,
        updatedAt: convertTimestamp(data.updatedAt) ?? undefined
    }
}

export async function getBookings(): Promise<Booking[]> {
    const q = query(bookingCollection, orderBy('createdAt', 'desc'))

    const snapshot = await getDocs(q)

    return snapshot.docs.map((item) => mapBooking(item))
}

export async function getBookingsByBranch(branchId: string): Promise<Booking[]> {
    const q = query(bookingCollection, where('branchId', '==', branchId), orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((item) => mapBooking(item))
}

export async function getBooking(id: string): Promise<Booking | null> {
    const bookingRef = doc(firestoreDb, 'bookings', id)
    const snapshot = await getDoc(bookingRef)

    if (!snapshot.exists()) {
        return null
    }

    return mapBooking(snapshot)
}

export async function createBooking(input: CreateBookingInput): Promise<string> {
    const bookingRef = await addDoc(bookingCollection, {
        ...input,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    })

    return bookingRef.id
}

export async function updateBooking(id: string, input: UpdateBookingInput): Promise<void> {
    const bookingRef = doc(firestoreDb, 'bookings', id)
    await updateDoc(bookingRef, {
        ...input,
        updatedAt: serverTimestamp()
    })
}

export async function deleteBooking(id: string): Promise<void> {
    const bookingRef = doc(firestoreDb, 'bookings', id)
    await deleteDoc(bookingRef)
}

export async function updateBookingStatus(bookingId: string, status: BookingStatus): Promise<void> {
    const bookingRef = doc(firestoreDb, 'bookings', bookingId)
    await updateDoc(bookingRef, {
        status,
        updatedAt: new Date().toISOString()
    })
}

export async function checkInBooking(bookingId: string, customerName: string): Promise<void> {
    const bookingRef = doc(firestoreDb, 'bookings', bookingId)

    await runTransaction(firestoreDb, async (transaction) => {
        const bookingSnapshot = await transaction.get(bookingRef)

        if (!bookingSnapshot.exists()) {
            throw new Error('Booking not found')
        }

        const booking = bookingSnapshot.data()

        if (booking.status !== 'confirmed') {
            throw new Error('Only confirmed bookings can be checked in')
        }

        if (!booking.roomId) {
            throw new Error('Room is not assigned to this booking')
        }

        if (!booking.bedId) {
            throw new Error('Bed is not assigned to this booking')
        }

        const roomRef = doc(firestoreDb, 'rooms', booking.roomId)
        const roomSnapshot = await transaction.get(roomRef)

        if (!roomSnapshot.exists()) {
            throw new Error('Room not found')
        }

        const room = roomSnapshot.data()

        const beds = Array.isArray(room.beds) ? room.beds : []
        const bedIndex = beds.findIndex((bed: { id: string }) => bed.id === booking.bedId)

        if (bedIndex === -1) {
            throw new Error('Bed not found in the room')
        }

        const bed = beds[bedIndex]

        if (bed.status !== 'available') {
            throw new Error('This bed is no longer available')
        }

        const updatedBeds = beds.map((bed: {
            id: string
            bedNumber: string
            status: string
            guestId?: string | null
            guestName?: string | null
        }) => {
            if (bed.id !== booking.bedId) {
                return bed
            }

            return {
                ...bed,
                status: 'occupied',
                guestId: booking.customerId,
                guestName: customerName
            }
        })

        const occupiedBeds = updatedBeds.filter((bed: { status: string }) => bed.status === 'occupied')

        transaction.update(roomRef, {
            beds: updatedBeds,
            status: occupiedBeds.length > 0 ? 'occupied' : 'available',
            updatedAt: serverTimestamp()
        })

        transaction.update(bookingRef, {
            status: 'checked_in',
            updatedAt: serverTimestamp()
        })
    })

}

export async function checkOutBooking(bookingId: string): Promise<void> {
    const bookingRef = doc(firestoreDb, 'bookings', bookingId)

    await runTransaction(firestoreDb, async (transaction) => {
        const bookingSnapshot = await transaction.get(bookingRef)

        if (!bookingSnapshot.exists()) {
            throw new Error('Booking not found')
        }

        const booking = bookingSnapshot.data()

        if (booking.status !== 'checked_in') {
            throw new Error('Only checked-in bookings can be checked out')
        }

        if (!booking.roomId) {
            throw new Error('Room is not assigned to this booking')
        }

        if (!booking.bedId) {
            throw new Error('Bed is not assigned to this booking')
        }

        const roomRef = doc(firestoreDb, 'rooms', booking.roomId)
        const roomSnapshot = await transaction.get(roomRef)

        if (!roomSnapshot.exists()) {
            throw new Error('Room not found')
        }

        const room = roomSnapshot.data()
        const beds = Array.isArray(room.beds) ? room.beds : []
        const bedIndex = beds.findIndex((bed: { id: string }) => bed.id === booking.bedId)

        if (bedIndex === -1) {
            throw new Error('Bed not found in the room')
        }

        const updatedBeds = beds.map((bed:
            {
                id: string,
                bedNumber: string,
                status: string,
                guestId?: string | null
                guestName?: string | null
            }) => {
            if (bed.id !== booking.bedId) {
                return bed
            }

            return {
                ...bed,
                status: 'available',
                guestId: null,
                guestName: null
            }
        })

        const occupiedBeds = updatedBeds.filter((bed: { status: string }) => bed.status === 'occupied')

        transaction.update(roomRef, {
            beds: updatedBeds,
            status: occupiedBeds.length > 0 ? 'occupied' : 'available',
            updatedAt: serverTimestamp()
        })

        transaction.update(bookingRef, {
            status: 'checked_out',
            checkOutDate: new Date(),
            updatedAt: serverTimestamp()
        })

    })

}