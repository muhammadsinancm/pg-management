import { useCallback, useEffect, useState } from "react";
import { CreateMealInput, Meal, UpdateMealInput } from "../types/meal.types";
import { createMeal, deleteMeal, getMeal, getMeals, updateMeal } from "../services/mealService";

export function useMeals() {
    const [meals, setMeals] = useState<Meal[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const loadMeals = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const data = await getMeals()

            setMeals(data)

        } catch (error) {
            console.error('Failed to load meals')
            setError(error instanceof Error ? error.message : 'Failed to load meals')

        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadMeals()
    }, [loadMeals])

    const addMeal = useCallback(async (data: CreateMealInput) => {
        try {
            setError(null)

            const mealId = await createMeal(data)
            await loadMeals()

            return mealId

        } catch (error) {
            console.error('Failed to create meal', error)
            setError(error instanceof Error ? error.message : 'Failed to create meal')
            throw error
        }
    }, [loadMeals])

    const getMealById = useCallback(async (mealId: string) => {
        try {
            setError(null)

            return await getMeal(mealId)

        } catch (error) {
            console.error('Failed to get meal', error)
            setError(error instanceof Error ? error.message : 'Failed to get meal')
            throw error
        }
    }, [])

    const editMeal = useCallback(async (mealId: string, data: UpdateMealInput) => {
        try {
            setError(null)

            await updateMeal(mealId, data)

            await loadMeals()

        } catch (error) {
            console.error('Failed to update meal')
            setError(error instanceof Error ? error.message : 'Failed to update meal')
            throw error
        }
    }, [loadMeals])

    const removeMeal = useCallback(async (mealId: string) => {
        try {
            setError(null)

            await deleteMeal(mealId)
            await loadMeals()

        } catch (error) {
            console.error('Failed to delete meal', error)
            setError(error instanceof Error ? error.message : 'Failed to delete meal')
            throw error
        }
    }, [loadMeals])

    return {
        meals,
        loading,
        error,
        loadMeals,
        addMeal,
        getMealById,
        editMeal,
        removeMeal
    }

}