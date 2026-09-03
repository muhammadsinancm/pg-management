import { firestoreDb } from "@/services/firebase/config"
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, QueryDocumentSnapshot, serverTimestamp, Timestamp, updateDoc, where } from "firebase/firestore"
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
        checkOutDate: convertTimestamp(data.checkOutDate) ?? new Date(),
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