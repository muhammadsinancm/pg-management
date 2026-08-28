import { firestoreDb } from "@/services/firebase/config"
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, Timestamp, updateDoc, where } from "firebase/firestore"
import { Payment, PaymentMethod, PaymentStatus, PaymentType } from "../types/payment.types"

const COLLECTION_NAME = 'payments'

const paymentsCollection = collection(firestoreDb, COLLECTION_NAME)

export interface CreatePaymentInput {
    paymentNumber: string
    organizationId: string
    branchId: string
    customerId: string
    bookingId?: string | null
    amount: number
    paymentMethod: PaymentMethod
    paymentType: PaymentType
    paymentDate?: Date
    status?: PaymentStatus
    notes?: string
    createdBy: string
}

export async function getPayments(branchId: string): Promise<Payment[]> {
    if (!branchId) {
        throw new Error('Branch ID is required')
    }

    const paymentsQuery = query(paymentsCollection, where('branchId', '==', branchId))

    const snapshot = await getDocs(paymentsQuery)

    return snapshot.docs.map((paymentDoc) => {

        const data = paymentDoc.data()

        const payment: Payment = {
            id: paymentDoc.id,
            paymentNumber: data.paymentNumber,
            organizationId: data.organizationId,
            branchId: data.branchId,
            customerId: data.customerId,
            bookingId: data.bookingId ?? null,
            amount: data.amount,
            paymentMethod: data.paymentMethod,
            paymentType: data.paymentType,
            paymentDate: data.paymentDate instanceof Timestamp ? data.paymentDate.toDate() : data.paymentDate,
            status: data.status,
            notes: data.notes ?? '',
            createdBy: data.createdBy,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt
        }

        return payment
    })
}

export async function getPaymentById(paymentId: string): Promise<Payment | null> {
    if (!paymentId) {
        throw new Error('Payment ID is required')
    }

    const paymentRef = doc(firestoreDb, COLLECTION_NAME, paymentId)

    const snapshot = await getDoc(paymentRef)

    if (!snapshot.exists()) {
        return null
    }

    const data = snapshot.data()

    return {
        id: snapshot.id,
        ...data,
        paymentDate: data.paymentDate instanceof Timestamp ? data.paymentDate.toDate() : data.paymentDate,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt
    } as Payment

}

export async function createPayment(data: CreatePaymentInput): Promise<string> {
    if (!data.organizationId) {
        throw new Error('Organization ID is required')
    }
    if (!data.branchId) {
        throw new Error('Branch ID is required')
    }
    if (!data.customerId) {
        throw new Error('Customer Id is required')
    }
    if (!data.paymentNumber) {
        throw new Error('Payment number is required')
    }
    if (!Number.isFinite(data.amount) || data.amount <= 0) {
        throw new Error('Payment amount must be greater than zero')
    }

    const now = Timestamp.now()

    const paymentData = {
        paymentNumber: data.paymentNumber,
        organizationId: data.organizationId,
        branchId: data.branchId,
        customerId: data.customerId,
        bookingId: data.bookingId,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        paymentType: data.paymentType,
        paymentDate: data.paymentDate ? Timestamp.fromDate(data.paymentDate) : now,
        status: data.status ?? 'paid',
        notes: data.notes ?? '',
        createdBy: data.createdBy,
        createdAt: now,
        updatedAt: now
    }

    const paymentDoc = await addDoc(paymentsCollection, paymentData)
    return paymentDoc.id
}

export async function updatePayment(paymentId: string, data: Partial<Payment>): Promise<void> {
    if (!paymentId) {
        throw new Error('Payment ID is required')
    }

    const paymentRef = doc(firestoreDb, COLLECTION_NAME, paymentId)

    const updateData: Record<string, unknown> = {
        ...data,
        updatedAt: Timestamp.now()
    }
    delete updateData.id

    if (data.paymentDate instanceof Date) {
        updateData.paymentDate = Timestamp.fromDate(data.paymentDate)
    }
    await updateDoc(paymentRef, updateData)
}

export async function deletePayment(paymentId: string): Promise<void> {
    if (!paymentId) {
        throw new Error('Payment ID is required')
    }
    
    const paymentRef = doc(firestoreDb, COLLECTION_NAME, paymentId)
    await deleteDoc(paymentRef)
}