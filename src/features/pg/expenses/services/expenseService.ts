import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, Timestamp, updateDoc } from "firebase/firestore";
import { CreateExpenseInput, Expense, UpdateExpenseInput } from "../types/expense.types";
import { firestoreDb } from "@/services/firebase/config";

const COLLECTION = 'expenses'

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

function mapExpense(id: string, data: Record<string, unknown>): Expense {
    return {
        id,
        organizationId: data.organizationId as string,
        branchId: data.branchId as string,
        category: data.category as Expense['category'],
        amount: Number(data.amount ?? 0),
        expenseDate: convertDate(data.expenseDate) ?? new Date().toISOString(),
        paymentMethod: data.paymentMethod as Expense['paymentMethod'],
        status: data.status as Expense['status'],
        description: typeof data.description === 'string' ? data.description : undefined,
        referenceNumber: typeof data.referenceNumber === 'string' ? data.referenceNumber : undefined,
        createdAt: convertDate(data.createdAt),
        updatedAt: convertDate(data.updatedAt)
    }
}

export async function createExpense(data: CreateExpenseInput): Promise<string> {
    const now = Timestamp.now()

    const expenseData: Record<string, unknown> = {
        organizationId: data.organizationId,
        branchId: data.branchId,
        category: data.category,
        amount: data.amount,
        expenseDate: data.expenseDate,
        paymentMethod: data.paymentMethod,
        status: data.status ?? 'paid',
        createdAt: now,
        updatedAt: now
    }

    if (data.description !== undefined) {
        expenseData.description = data.description
    }
    if (data.referenceNumber !== undefined) {
        expenseData.referenceNumber = data.referenceNumber
    }

    const expenseRef = await addDoc(collection(firestoreDb, COLLECTION), expenseData)
    return expenseRef.id

}

export async function getExpenses(): Promise<Expense[]> {
    const snapshot = await getDocs(collection(firestoreDb, COLLECTION))
    
    return snapshot.docs.map((expenseDoc) => mapExpense(expenseDoc.id, expenseDoc.data()))
}

export async function getExpense(expenseId: string): Promise<Expense | null> {
    const expenseRef = doc(firestoreDb, COLLECTION, expenseId)
    const snapshot = await getDoc(expenseRef)

    if (!snapshot.exists()) {
        return null
    }

    return mapExpense(snapshot.id, snapshot.data())
}

export async function updateExpense(expenseId: string, data: UpdateExpenseInput): Promise<void> {
    const expenseRef = doc(firestoreDb, COLLECTION, expenseId)
    const updateData: Record<string, unknown> = {
        ...data,
        updatedAt: Timestamp.now()
    }

    Object.keys(updateData).forEach((key) => {
        if (updateData[key] === undefined) {
            delete updateData[key]
        }
    })

    await updateDoc(expenseRef, updateData)
}

export async function deleteExpense(expenseId: string): Promise<void> {
    const expenseRef = doc(firestoreDb, COLLECTION, expenseId)

    await deleteDoc(expenseRef)
}