import { useCallback, useEffect, useState } from "react";
import { Billing, CreateBillingInput, UpdateBillingInput } from "../types/billing.types";
import { createBilling, getBilling, getBillings, updateBilling } from "../services/billingService";

export function useBilling() {
    const [billings, setBillings] = useState<Billing[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const loadBillings = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const data = await getBillings()
            setBillings(data)

        } catch (error) {
            console.error('Failed to load billings', error)
            setError(error instanceof Error ? error.message : 'Failed to load billings')

        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadBillings()
    }, [loadBillings])

    const addBillling = useCallback(async (data: CreateBillingInput) => {
        try {
            setError(null)

            const billingId = await createBilling(data)
            await loadBillings()
            return billingId

        } catch (error) {
            console.error('Failed to create billing', error)
            setError(error instanceof Error ? error.message : 'Failed to create billing')
            throw error
        }

    }, [loadBillings])

    const getBillingById = useCallback(async (billingId: string) => {
        try {
            setError(null)

            return await getBilling(billingId)

        } catch (error) {
            console.error('Failed to get billing', error)
            const message = error instanceof Error ? error.message : 'Failed to get billing'
            setError(message)
            throw error
        }
    }, [])

    const editBilling = useCallback(async (billingId: string, data: UpdateBillingInput) => {
        try {
            setError(null)

            await updateBilling(billingId, data)
            await loadBillings()

        } catch (error) {
            console.error('Failed to update billing', error)
            const message = error instanceof Error ? error.message : 'Failed to update billing'
            setError(message)
            throw error
        }
    }, [loadBillings])

    return {
        billings,
        loading,
        error,
        loadBillings,
        addBillling,
        getBillingById,
        editBilling
    }

}
