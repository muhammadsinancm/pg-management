import { addDoc, collection, doc, getDoc, getDocs, Timestamp, updateDoc } from "firebase/firestore";
import { Billing, CreateBillingInput, UpdateBillingInput } from "../types/billing.types";
import { firestoreDb } from "@/services/firebase/config";

const COLLECTION = 'billings'

function convetTimestamp(value: unknown): string | undefined {
    if (value instanceof Timestamp) {
        return value.toDate().toISOString()
    }
    if (typeof value === 'string') {
        return value
    }
    return undefined
}

function mapBilling(id: string, data: Record<string, unknown>): Billing {
    return {
        id,
        organizationId: data.organizationId as string,
        branchId: data.branchId as string,
        customerId: data.customerId as string,
        bookingId: data.bookingId as string,
        invoiceId: typeof data.invoiceId === 'string' ? data.invoiceId : undefined,
        billingCycle: data.billingCycle as Billing['billingCycle'],
        billingStartDate: data.billingStartDate as string,
        billingEndDate: data.billingEndDate as string,
        dueDate: data.dueDate as string,
        rentAmount: Number(data.rentAmount ?? 0),
        mealAmount: Number(data.mealAmount ?? 0),
        additionalCharges: Number(data.additionalCharges ?? 0),
        discountAmount: Number(data.discountAmount ?? 0),
        totalAmount: Number(data.totalAmount ?? 0),
        paidAmount: Number(data.paidAmount ?? 0),
        dueAmount: Number(data.dueAmount ?? 0),
        status: data.status as Billing['status'],
        notes: typeof data.notes === 'string' ? data.notes : undefined,
        createdAt: convetTimestamp(data.createdAt),
        updatedAt: convetTimestamp(data.updatedAt)
    }
}

export async function createBilling(data: CreateBillingInput): Promise<string> {
    const now = Timestamp.now()
    
    const billingDate = {
        organizationId: data.organizationId,
        branchId: data.branchId,
        customerId: data.customerId,
        bookingId: data.bookingId,
        billingCycle: data.billingCycle,
        billingStartDate: data.billingStartDate,
        billingEndDate: data.billingEndDate,
        dueDate: data.dueDate,
        rentAmount: data.rentAmount,
        mealAmount: data.mealAmount ?? 0,
        additionalCharges: data.additionalCharges ?? 0,
        discountAmount: data.discountAmount ?? 0,
        totalAmount: data.totalAmount,
        paidAmount: data.paidAmount ?? 0,
        dueAmount: data.dueAmount,
        status: data.status,
        ...(data.invoiceId ? {invoiceId: data.invoiceId} : {}),
        ...(data.notes ? {notes: data.notes}: {}),
        createdAt: now,
        updatedAt: now
    }

    const billingRef = await addDoc(collection(firestoreDb, COLLECTION), billingDate)
    return billingRef.id

}

export async function getBillings(): Promise<Billing[]> {
    const snapshot = await getDocs(collection(firestoreDb, COLLECTION))

    return snapshot.docs.map((doc) => mapBilling(doc.id, doc.data()))
}

export async function getBilling(billingId: string): Promise<Billing | null> {
    const billingRef = doc(firestoreDb, COLLECTION, billingId)
    const snapshot = await getDoc(billingRef)

    if (!snapshot.exists()) {
        return null
    }

    return mapBilling(snapshot.id, snapshot.data())
}

export async function updateBilling(billingId: string, data: UpdateBillingInput): Promise<void> {
    const billingRef = doc(firestoreDb, COLLECTION, billingId)

    const updateData = Object.fromEntries(
        Object.entries({
            ...data,
            updatedAt: Timestamp.now()
        }).filter(([, value]) => value !== undefined)
    )

    await updateDoc(billingRef, updateData)
}