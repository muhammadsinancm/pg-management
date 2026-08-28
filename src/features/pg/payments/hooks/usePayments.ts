import { useCallback, useEffect, useState } from "react";
import { Payment } from "../types/payment.types";
import { createPayment, CreatePaymentInput, deletePayment, getPaymentById, getPayments, updatePayment } from "../services/paymentService";

export function usePayments(branchId: string) {

    const [payments, setPayments] = useState<Payment[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const loadPayments = useCallback(async () => {
        if (!branchId) {
            setPayments([])
            setLoading(false)
            return
        }

        try {
            setLoading(false)
            setError(null)

            const data = await getPayments(branchId)
            setPayments(data)

        } catch (error) {
            console.error('Failed to load payments', error)
            setError(error instanceof Error ? error.message : 'Failed to load payments')

        } finally {
            setLoading(false)
        }
    }, [branchId])

    useEffect(() => {
        loadPayments()
    }, [loadPayments])

    const getPayment = useCallback(async (paymentId: string) => {
        try {
            setError(null)

            return await getPaymentById(paymentId)

        } catch (error) {
            console.error('Failed to get payment', error)
            const message = error instanceof Error ? error.message : 'Failed to get payment'
            setError(message)
            throw error
        }
    }, [])

    const addPayment = useCallback(async (data: CreatePaymentInput) => {
        try {
            setError(null)

            const paymentId = await createPayment(data)
            await loadPayments()
            return paymentId

        } catch (error) {
            console.error('Failed to create payment', error)
            const message = error instanceof Error ? error.message : 'Failed to create payment'
            setError(message)
            throw error
        }
    }, [loadPayments])

    const editPayment = useCallback(async (paymentId: string, data: Partial<Payment>) => {
        try {
            setError(null)

            await updatePayment(paymentId, data)
            await loadPayments()

        } catch (error) {
            console.error('Failed to update payment', error)
            const message = error instanceof Error ? error.message : 'Failed to update payment'
            setError(message)
            throw error
        }
    }, [loadPayments])

    const removePayment = useCallback(async (paymentId: string) => {
        try {
            setError(null)

            await deletePayment(paymentId)
            await loadPayments()

        } catch (error) {
            console.error('Faild to delete payment', error)
            const message = error instanceof Error ? error.message : 'Failed to delete payment'
            setError(message)
            throw error
        }
    }, [loadPayments])

    const refresh = useCallback(async () => {
        await loadPayments()
    }, [loadPayments])

    return {
        payments, loading, error, getPayment, addPayment, editPayment, removePayment, refresh
    }

}