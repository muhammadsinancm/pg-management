import { addDoc, collection, doc, getDoc, getDocs, Timestamp, updateDoc } from "firebase/firestore"
import { CreateInvoiceInput, Invoice, UpdateInvoiceInput } from "../types/invoice.types"
import { firestoreDb } from "@/services/firebase/config"

const COLLECTION = 'invoices'

function convertDate(value: unknown): string | undefined {
    if (value instanceof Date) {
        return value.toISOString()
    }
    if (typeof value === 'string') {
        return value
    }
    return undefined
}

function mapInvoice(id: string, data: Record<string, unknown>): Invoice {
    return {
        id,
        organizationId: data.organizationId as string,
        branchId: data.branchId as string,
        customerId: data.customerId as string,
        bookingId: data.bookingId as string,
        invoiceNumber: data.invoiceNumber as string,
        billingId: typeof data.billingId === 'string' ? data.billingId : undefined,
        issueDate: convertDate(data.issueDate) ?? new Date().toISOString(),
        dueDate: convertDate(data.dueDate) ?? new Date().toISOString(),
        rentAmount: Number(data.rentAmount ?? 0),
        mealAmount: Number(data.mealAmount ?? 0),
        additionalCharges: Number(data.additionalCharges ?? 0),
        discountAmount: Number(data.discountAmount ?? 0),
        subtotal: Number(data.subtotal ?? 0),
        totalAmount: Number(data.totalAmount ?? 0),
        paidAmount: Number(data.paidAmount ?? 0),
        dueAmount: Number(data.dueAmount ?? 0),
        status: (data.status as Invoice['status'] ?? 'draft'),
        notes: data.notes as string | undefined,
        createdAt: convertDate(data.createdAt) ?? new Date().toISOString(),
        updatedAt: convertDate(data.updatedAt) ?? new Date().toISOString()
    }
}

export async function createInvoice(data: CreateInvoiceInput): Promise<string> {
    const now = Timestamp.now()

    const invoiceData: Record<string, unknown> = {
        organizationId: data.organizationId,
        branchId: data.branchId,
        customerId: data.customerId,
        bookingId: data.bookingId,
        invoiceNumber: data.invoiceNumber,
        issueDate: data.issueDate,
        dueDate: data.dueDate,
        rentAmount: data.rentAmount,
        mealAmount: data.mealAmount ?? 0,
        additionalCharges: data.additionalCharges ?? 0,
        discountAmount: data.discountAmount ?? 0,
        subtotal: data.subtotal,
        totalAmount: data.totalAmount,
        paidAmount: data.paidAmount ?? 0,
        dueAmount: data.dueAmount,
        status: data.status ?? 'unpaid',
        notes: data.notes ?? '',
        createdAt: now,
        updatedAt: now
    }

    if (data.billingId !== undefined) {
        invoiceData.billingId = data.billingId
    }

    const invoiceRef = await addDoc(collection(firestoreDb, COLLECTION), invoiceData)

    return invoiceRef.id

}

export async function getInvoices(): Promise<Invoice[]> {
    const snapshot = await getDocs(collection(firestoreDb, COLLECTION))

    return snapshot.docs.map((invoiceDoc) => mapInvoice(invoiceDoc.id, invoiceDoc.data()))
}

export async function getInvoice(invoiceId: string): Promise<Invoice | null> {
    const invoiceRef = doc(firestoreDb, COLLECTION, invoiceId)
    const snapshot = await getDoc(invoiceRef)

    if (!snapshot.exists()) {
        return null
    }

    return mapInvoice(snapshot.id, snapshot.data())
}

export async function updateInvoice(invoiceId: string, data: UpdateInvoiceInput): Promise<void> {
    const invoiceRef = doc(firestoreDb, COLLECTION, invoiceId)

    const updateData = Object.fromEntries(
        Object.entries({
            ...data,
            updatedAt: Timestamp.now()
        }).filter(([, value]) => value !== undefined)
    )

    await updateDoc(invoiceRef, updateData)

}