import { addDoc, collection, doc, getDoc, getDocs, Timestamp, updateDoc } from "firebase/firestore";
import { CreatePaymentInput, Payment, UpdatePaymentInput } from "../types/payment.types";
import { firestoreDb } from "@/services/firebase/config";

const COLLECTION = 'payments'

function convertDate(value: unknown): string | undefined {
    if (value instanceof Timestamp) {
        return value.toDate().toISOString()
    }
    if (value instanceof Date) {
        return value.toISOString()
    }
    if (typeof value === 'string') {
        return value
    }

    return undefined
}

function mapPayment(id: string, data: Record<string, unknown>): Payment {
    return {
        id,
        organizationId: data.organizationId as string,
        branchId: data.branchId as string,
        customerId: data.customerId as string,
        bookingId: data.bookingId as string,
        invoiceId: typeof data.invoiceId === 'string' ? data.invoiceId : undefined,
        paymentNumber: data.paymentNumber as string,
        amount: Number(data.amount ?? 0),
        paymentDate: convertDate(data.paymentDate) ?? new Date().toISOString(),
        paymentMethod: data.paymentMethod as Payment['paymentMethod'],
        status: data.status as Payment['status'],
        referenceNumber: typeof data.referenceNumber === 'string' ? data.referenceNumber : undefined,
        notes: typeof data.notes === 'string' ? data.notes : undefined,
        createdAt: convertDate(data.createdAt),
        updatedAt: convertDate(data.updatedAt)
    }
}

export async function createPayment(data: CreatePaymentInput): Promise<string> {
    const now = Timestamp.now()

    const paymentData = {
        organizationId: data.organizationId,
        branchId: data.branchId,
        customerId: data.customerId,
        bookingId: data.bookingId,
        paymentNumber: data.paymentNumber,
        amount: data.amount,
        paymentDate: data.paymentDate,
        paymentMethod: data.paymentMethod,
        status: data.status ?? 'completed',
        createdAt: now,
        updatedAt: now,
        ...(data.invoiceId ? { invoiceId: data.invoiceId } : {}),
        ...(data.referenceNumber ? { referenceNumber: data.referenceNumber } : {}),
        ...(data.notes ? { notes: data.notes } : {})
    }

    const paymentRef = await addDoc(collection(firestoreDb, COLLECTION), paymentData)
    return paymentRef.id
}

export async function getPayments(): Promise<Payment[]> {
    const snapshot = await getDocs(collection(firestoreDb, COLLECTION))

    return snapshot.docs.map((paymentDoc) => mapPayment(paymentDoc.id, paymentDoc.data()))
}

export async function getPayment(paymentId: string): Promise<Payment | null> {
    const paymentRef = doc(firestoreDb, COLLECTION, paymentId)
    const snapshot = await getDoc(paymentRef)

    if (!snapshot.exists()) {
        return null
    }

    return mapPayment(snapshot.id, snapshot.data())
}

export async function updatePayment(paymentId: string, data: UpdatePaymentInput): Promise<void> {
    const paymentRef = doc(firestoreDb, COLLECTION, paymentId)

    const updateData = {
        ...data,
        updatedAt: Timestamp.now()
    }

    Object.keys(updateData).forEach((key) => {
        if (updateData[key as keyof typeof updateData] === undefined) {
            delete updateData[key as keyof typeof updateData]
        }
    })

    await updateDoc(paymentRef, updateData)

}