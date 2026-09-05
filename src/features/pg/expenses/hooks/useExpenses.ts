import { useCallback, useEffect, useState } from "react";
import { CreateExpenseInput, Expense, UpdateExpenseInput } from "../types/expense.types";
import { createExpense, deleteExpense, getExpense, getExpenses, updateExpense } from "../services/expenseService";

export function useExpenses() {
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const loadExpenses = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const data = await getExpenses()
            setExpenses(data)

        } catch (error) {
            console.error('Failed to load expenses', error)
            setError(error instanceof Error ? error.message : 'Failed to load expenses')

        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadExpenses()
    }, [loadExpenses])

    const addExpense = useCallback(async (data: CreateExpenseInput) => {
        try {
            setError(null)

            const expenseId = await createExpense(data)
            await loadExpenses()
            return expenseId

        } catch (error) {
            console.error('Failed to create expense', error)
            setError(error instanceof Error ? error.message : 'Failed to create expense')
            throw error
        }
    }, [loadExpenses])

    const getExpenseById = useCallback(async (expenseId: string) => {
        try {
            setError(null)

            return await getExpense(expenseId)

        } catch (error) {
            console.error('Failed to get expense', error)
            setError(error instanceof Error ? error.message : 'Failed to get expense')
            throw error
        }
    }, [])

    const editExpense = useCallback(async (expenseId: string, data: UpdateExpenseInput) => {
        try {
            setError(null)

            await updateExpense(expenseId, data)
            await loadExpenses()

        } catch (error) {
            console.error('Failed to update expense', error)
            setError(error instanceof Error ? error.message : 'Failed to update expense')
            throw error
        }
    }, [loadExpenses])

    const removeExpense = useCallback(async (expenseId: string) => {
        try {
            setError(null)

            await deleteExpense(expenseId)
            await loadExpenses()

        } catch (error) {
            console.error('Failed to delete expense', error)
            setError(error instanceof Error ? error.message : 'Failed to delete expense')
            throw error
        }
    }, [loadExpenses])

    return {
        expenses,
        loading,
        error,
        loadExpenses,
        addExpense,
        getExpenseById,
        editExpense,
        removeExpense
    }

}