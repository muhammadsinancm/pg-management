import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, Timestamp, updateDoc } from "firebase/firestore"
import { CreateCustomerMealInput, CustomerMeal } from "../types/meal.types"
import { firestoreDb } from "@/services/firebase/config"

const COLLECTION = 'customerMeals'

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

function mapCustomerMeal(id: string, data: Record<string, unknown>): CustomerMeal {
    return {
        id,
        organizationId: data.organizationId as string,
        branchId: data.branchId as string,
        customerId: data.customerId as string,
        bookingId: data.bookingId as string,
        mealId: data.mealId as string,
        mealType: data.mealType as CustomerMeal['mealType'],
        mealDate: convertData(data.mealDate) ?? new Date().toISOString(),
        amount: Number(data.amount ?? 0),
        status: data.status as CustomerMeal['status'],
        invoiceId: typeof data.invoiceId === 'string' ? data.invoiceId : undefined,
        createdAt: convertData(data.createdAt),
        updatedAt: convertData(data.updatedAt)
    }
}

export async function createCustomerMeal(data: CreateCustomerMealInput): Promise<string> {
    if (!data.customerId) {
        throw new Error('Customer is required')
    }
    if (!data.bookingId) {
        throw new Error('Booking is required')
    }
    if (!data.mealId) {
        throw new Error('Meal is required')
    }
    if (data.amount < 0) {
        throw new Error('Meal amount can not be negative')
    }

    const now = Timestamp.now()

    const customerMealData: Record<string, unknown> = {
        organizationId: data.organizationId,
        branchId: data.branchId,
        customerId: data.customerId,
        bookingId: data.bookingId,
        mealId: data.mealId,
        mealType: data.mealType,
        mealDate: data.mealDate,
        amount: data.amount,
        status: data.status ?? 'served',
        createdAt: now,
        updatedAt: now
    }

    const customerMealRef = await addDoc(collection(firestoreDb, COLLECTION), customerMealData)

    return customerMealRef.id
}

export async function getCustomerMeals(): Promise<CustomerMeal[]> {
    const snapshot = await getDocs(collection(firestoreDb, COLLECTION))

    return snapshot.docs.map((customerMealDoc) => mapCustomerMeal(
        customerMealDoc.id, customerMealDoc.data()
    ))
}

export async function getCustomerMeal(customerMealId: string): Promise<CustomerMeal | null> {
    const customerMealRef = doc(firestoreDb, COLLECTION, customerMealId)
    const snapshot = await getDoc(customerMealRef)

    if (!snapshot.exists()) {
        return null
    }

    return mapCustomerMeal(snapshot.id, snapshot.data())
}

export async function getCustomerMealsByCustomer(customerId: string): Promise<CustomerMeal[]> {
    const meals = await getCustomerMeals()

    return meals.filter((meal) => meal.customerId === customerId)
}

export async function getCustomerMealsByBooking(bookingId: string): Promise<CustomerMeal[]> {
    const meals = await getCustomerMeals()

    return meals.filter((meal) => meal.bookingId === bookingId)
}

export async function cancelCustomerMeal(customerMealId: string): Promise<void> {
    const customerMealRef = doc(firestoreDb, COLLECTION, customerMealId)

    await updateDoc(customerMealRef, {
        status: 'cancelled',
        updatedAt: Timestamp.now()
    })
}

export async function deleteCustomerMeal(customerMealId: string): Promise<void> {
    const customerMealRef = doc(firestoreDb, COLLECTION, customerMealId)

    await deleteDoc(customerMealRef)
}