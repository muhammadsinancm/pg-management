import { useCallback, useEffect, useState } from "react";
import { CreateCustomerMealInput, CustomerMeal } from "../types/meal.types";
import { cancelCustomerMeal, createCustomerMeal, deleteCustomerMeal, getCustomerMeal, getCustomerMeals, getCustomerMealsByBooking, getCustomerMealsByCustomer } from "../services/customerMealServie";

export function useCustomerMeals() {
    const [customerMeals, setCustomerMeals] = useState<CustomerMeal[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchCustomerMeals = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const data = await getCustomerMeals()

            setCustomerMeals(data)

        } catch (error) {
            console.error('Failed to fetch customer meals', error)
            setError(error instanceof Error ? error.message : 'Failed to fetch customer meals')

        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchCustomerMeals()
    }, [fetchCustomerMeals])

    const addCustomerMeal = async (data: CreateCustomerMealInput) => {
        try {
            setError(null)

            const id = await createCustomerMeal(data)

            await fetchCustomerMeals()

            return id

        } catch (error) {
            console.error('Failed to create customer meal', error)
            const message = error instanceof Error ? error.message : 'Failed to create customer meal'
            setError(message)
            throw new Error(message)
        }
    }

    const findCustomerMeal = async (customerMealId: string): Promise<CustomerMeal | null> => {
        try {
            setError(null)

            return await getCustomerMeal(customerMealId)

        } catch (error) {
            console.error('Failed to fetch customer meal', error)
            const message = error instanceof Error ? error.message : 'Failed to fetch customer meal'
            setError(message)
            throw new Error(message)
        }
    }

    const getMealsByCustomer = async (customerId: string): Promise<CustomerMeal[]> => {
        try {
            setError(null)

            return await getCustomerMealsByCustomer(customerId)

        } catch (error) {
            console.error('Failed to fetch customer meals', error)
            const message = error instanceof Error ? error.message : 'Failed to fetch costomer meals'
            setError(message)
            throw new Error(message)
        }
    }

    const getMealsByBooking = async (bookingId: string): Promise<CustomerMeal[]> => {
        try {
            setError(null)

            return await getCustomerMealsByBooking(bookingId)

        } catch (error) {
            console.error('Failed to fetch booking meals', error)
            const message = error instanceof Error ? error.message : 'Failed to fetch booking meals'
            setError(message)
            throw new Error(message)
        }
    }

    const cancelMeal = async (customerMealId: string) => {
        try {
            setError(null)

            await cancelCustomerMeal(customerMealId)
            await fetchCustomerMeals()

        } catch (error) {
            console.error('Failed to cancel customer meal', error)
            const message = error instanceof Error ? error.message : 'Failed to cancel customer meal'
            setError(message)
            throw new Error(message)
        }
    }

    const removeCustomerMeal = async (customerMealId: string) => {
        try {
            setError(null)

            await deleteCustomerMeal(customerMealId)
            await fetchCustomerMeals()

        } catch (error) {
            console.error('Failed to delete customer meal', error)
            const message = error instanceof Error ? error.message : 'Failed to delete meal'
            setError(message)
            throw new Error(message)
        }
    }

    return {
        customerMeals,
        loading,
        error,
        addCustomerMeal,
        findCustomerMeal,
        getMealsByCustomer,
        getMealsByBooking,
        cancelMeal,
        removeCustomerMeal
    }

}