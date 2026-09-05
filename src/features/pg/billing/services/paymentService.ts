import { collection, doc, getDoc, getDocs, runTransaction, Timestamp, updateDoc } from "firebase/firestore";
import { CreatePaymentInput, Payment, UpdatePaymentInput } from "../types/payment.types";
import { firestoreDb } from "@/services/firebase/config";

const COLLECTION = 'payments'
const INVOICE_COLLECTION = 'invoices'

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

    if (!data.invoiceId) {
        throw new Error('Invoice is required for payment')
    }
    if (data.amount <= 0) {
        throw new Error('Payment amount must be greater than 0')
    }

    const invoiceRef = doc(firestoreDb, INVOICE_COLLECTION, data.invoiceId)
    const paymentRef = doc(collection(firestoreDb, COLLECTION))

    await runTransaction(firestoreDb, async (transaction) => {
        const invoiceSnapshot = await transaction.get(invoiceRef)

        if (!invoiceSnapshot.exists()) {
            throw new Error('Invoice not found')
        }

        const invoice = invoiceSnapshot.data()
        const totalAmount = Number(invoice.totalAmount ?? 0)
        const currentPaidAmount = Number(invoice.paidAmount ?? 0)
        const currentDueAmount = Number(invoice.dueAmount ?? 0)

        if (data.amount > currentDueAmount) {
            throw new Error(`Payment can not due amount of ₹${currentDueAmount}`)
        }

        const newPaidAmount = currentPaidAmount + data.amount
        const newDueAmount = Math.max(totalAmount - newPaidAmount, 0)

        let newStatus: string

        if (newDueAmount === 0) {
            newStatus = 'paid'
        } else if (newPaidAmount > 0) {
            newStatus = 'partial'
        } else {
            newStatus = 'unpaid'
        }

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

        transaction.set(paymentRef, paymentData)

        transaction.update(invoiceRef, {
            paidAmount: newPaidAmount,
            dueAmount: newDueAmount,
            status: newStatus,
            updatedAt: now
        })

    })

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
        if (updateData[key] === undefined) {
            delete updateData[key]
        }
    })

    await updateDoc(paymentRef, updateData)

}