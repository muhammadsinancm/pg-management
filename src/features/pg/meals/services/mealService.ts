import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, Timestamp, updateDoc } from "firebase/firestore";
import { CreateMealInput, Meal, UpdateMealInput } from "../types/meal.types";
import { firestoreDb } from "@/services/firebase/config";

const COLLECTION = 'meals'

function convertData(value: unknown): string | undefined {
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

function mapMeal(id: string, data: Record<string, unknown>): Meal {
    return {
        id,
        organizationId: data.organizationId as string,
        branchId: data.branchId as string,
        mealType: data.mealType as Meal['mealType'],
        mealDate: convertData(data.mealDate) ?? new Date().toISOString(),
        menu: typeof data.menu === 'string' ? data.menu : '',
        amount: Number(data.amount ?? 0),
        status: data.status as Meal['status'],
        description: data.description === 'string' ? data.description : undefined,
        createdAt: convertData(data.createdAt),
        updatedAt: convertData(data.updatedAt)
    }
}

export async function createMeal(data: CreateMealInput): Promise<string> {
    if (data.amount < 0) {
        throw new Error('Meal amount can not be negative')
    }
    if (!data.menu.trim()) {
        throw new Error('Meal menu in required')
    }

    const now = Timestamp.now()

    const mealData: Record<string, unknown> = {
        organizationId: data.organizationId,
        branchId: data.branchId,
        mealType: data.mealType,
        mealDate: data.mealDate,
        menu: data.menu.trim(),
        amount: data.amount,
        status: data.status ?? 'sheduled',
        createdAt: now,
        updatedAt: now
    }

    if (data.description !== undefined) {
        mealData.description = data.description
    }

    const mealRef = await addDoc(collection(firestoreDb, COLLECTION), mealData)
    return mealRef.id
}

export async function getMeals(): Promise<Meal[]> {
    const snapshot = await getDocs(collection(firestoreDb, COLLECTION))

    return snapshot.docs.map((mealDoc) => mapMeal(mealDoc.id, mealDoc.data()))
}

export async function getMeal(mealId: string): Promise<Meal | null> {
    const mealRef = doc(firestoreDb, COLLECTION, mealId)

    const snapshot = await getDoc(mealRef)

    if (!snapshot.exists()) {
        return null
    }

    return mapMeal(snapshot.id, snapshot.data())
}

export async function updateMeal(mealId: string, data: UpdateMealInput): Promise<void> {
    if (data.amount !== undefined && data.amount < 0) {
        throw new Error('Meal amount be negative')
    }
    if (data.menu !== undefined && !data.menu.trim()) {
        throw new Error('Meal menu is required')
    }

    const mealRef = doc(firestoreDb, COLLECTION, mealId)

    const updateData: Record<string, unknown> = {
        ...data,
        updatedAt: Timestamp.now()
    }

    if (data.menu !== undefined) {
        updateData.menu = data.menu.trim()
    }

    Object.keys(updateData).forEach((key) => {
        if (updateData[key] === undefined) {
            delete updateData[key]
        }
    })

    await updateDoc(mealRef, updateData)
}

export async function deleteMeal(mealId: string): Promise<void> {
    const mealRef = doc(firestoreDb, COLLECTION, mealId)

    await deleteDoc(mealRef)
}
