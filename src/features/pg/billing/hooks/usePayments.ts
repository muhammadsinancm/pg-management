import { useCallback, useEffect, useState } from "react";
import { CreatePaymentInput, Payment, UpdatePaymentInput } from "../types/payment.types";
import { createPayment, getPayment, getPayments, updatePayment } from "../services/paymentService";

export function usePayments() {
    const [payments, setPayments] = useState<Payment[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const loadPayments = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const data = await getPayments()
            setPayments(data)

        } catch (error) {
            console.error('Failed to load payments', error)
            setError(error instanceof Error ? error.message : 'Failed to load payments')

        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(()=> {
        loadPayments()
    }, [loadPayments])

    const addPayment = useCallback(async (data: CreatePaymentInput) => {
                
        try {
            setError(null)

            const paymentId = await createPayment(data)
            await loadPayments()
            return paymentId

        } catch (error) {
            console.error('Failed to create payment', error)
            setError(error instanceof Error ? error.message : 'Failed to create payment')
            throw error
        }
    }, [loadPayments])

    const getPaymentById = useCallback(async (paymentId: string) => {
        try {
            setError(null)

            return await getPayment(paymentId)

        } catch (error) {
            console.error('Failed to get payment', error)
            setError(error instanceof Error ? error.message : 'Failed to get payment')
            throw error
        }
    }, [])

    const editPayment = useCallback(async (paymentId: string, data: UpdatePaymentInput) => {
        try {
            setError(null)

            await updatePayment(paymentId, data)
            await loadPayments()

        } catch (error) {
            console.error('Failed to update payment', error)
            setError(error instanceof Error ? error.message : 'Failed to update payment')
            throw error
        }
    }, [loadPayments])

    return {
        payments,
        loading,
        error,
        loadPayments,
        addPayment,
        getPaymentById,
        editPayment
    }

}