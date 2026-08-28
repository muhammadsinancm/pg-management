import { firestoreDb } from "@/services/firebase/config"
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, serverTimestamp, Timestamp, updateDoc, where } from "firebase/firestore"
import { Booking, CreateBookingInput, UpdateBookingInput } from "../types/booking.types"

const COLLECTION_NAME = 'bookings'

const bookingCollection = collection(firestoreDb, COLLECTION_NAME)

function convertTimestamp(value: unknown): Date | null {
    if (value instanceof Timestamp) {
        return value.toDate()
    }
    if (value instanceof Date) {
        return value
    }
    return null
}

export function mapBooking(id: string, data: Record<string, unknown>): Booking {
    return {
        id,
        organizationId: String(data.organizationId ?? ''),
        branchId: String(data.branchId ?? ''),
        customerId: String(data.customerId ?? ''),
        roomId: String(data.roomId ?? ''),
        roomNumber: String(data.roomNumber ?? ''),
        bedId: typeof data.bedId === 'string' ? data.bedId : null,
        bedNumber: typeof data.bedNumber === 'string' ? data.bedNumber : null,
        bookingNumber: String(data.bookingNumber ?? ''),
        checkInDate: convertTimestamp(data.checkInDate) ?? new Date(),
        checkOutDate: convertTimestamp(data.checkOutDate),
        status: (data.status as Booking['status']) ?? 'pending',
        rentAmount: Number(data.rentAmount ?? 0),
        advanceAmount: Number(data.advanceAmount ?? 0),
        securityDeposit: Number(data.securityDeposit ?? 0),
        paymentStatus: (data.paymentStatus as Booking['paymentStatus']) ?? 'unpaid',
        notes: typeof data.notes === 'string' ? data.notes : '',
        createdBy: String(data.createdBy ?? ''),
        createdAt: convertTimestamp(data.createdAt) ?? undefined,
        updatedAt: convertTimestamp(data.updatedAt) ?? undefined
    }
}

export async function getBookings(): Promise<Booking[]> {
    const q = query(bookingCollection, orderBy('createdAt', 'desc'))

    const snapshot = await getDocs(q)

    return snapshot.docs.map((item) => mapBooking(item.id, item.data()))
}

export async function getBookingsByBranch(branchId: string): Promise<Booking[]> {
    const q = query(bookingCollection, where('branchId', '==', branchId), orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((item) => mapBooking(item.id, item.data()))
}

export async function getBooking(id: string): Promise<Booking | null> {
    const bookingRef = doc(firestoreDb, COLLECTION_NAME, id)
    const snapshot = await getDoc(bookingRef)

    if (!snapshot.exists()) {
        return null
    }

    return mapBooking(snapshot.id, snapshot.data())
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
    const bookingRef = doc(firestoreDb, COLLECTION_NAME, id)
    await updateDoc(bookingRef, {
        ...input,
        updatedAt: serverTimestamp()
    })
}

export async function deleteBooking(id: string): Promise<void> {
    const bookingRef = doc(firestoreDb, COLLECTION_NAME, id)
    await deleteDoc(bookingRef)
}