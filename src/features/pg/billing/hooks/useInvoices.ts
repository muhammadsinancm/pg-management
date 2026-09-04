import { useCallback, useEffect, useState } from "react";
import { CreateInvoiceInput, Invoice, UpdateInvoiceInput } from "../types/invoice.types";
import { createInvoice, getInvoice, getInvoices, updateInvoice } from "../services/invoiceService";

export function useInvoices() {
    const [invoices, setInvoices] = useState<Invoice[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const loadInvoices = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const data = await getInvoices()
            setInvoices(data)

        } catch (error) {
            console.error('Failed to load invoices', error)
            setError(error instanceof Error ? error.message : 'Failed to load invoices')

        } finally {
            setLoading(false)
        }

    }, [])

    useEffect(() => {
        loadInvoices()
    }, [loadInvoices])

    const addInvoice = useCallback(async (data: CreateInvoiceInput) => {
        try {
            setError(null)

            const invoiceId = await createInvoice(data)
            await loadInvoices()
            return invoiceId

        } catch (error) {
            console.error('Failed to create invoice', error)
            setError(error instanceof Error ? error.message : 'Failed to create invoice')
            throw error
        }
    }, [loadInvoices])

    const getInvoiceById = useCallback(async (invoiceId: string) => {
        try {
            setError(null)

            return await getInvoice(invoiceId)

        } catch (error) {
            console.error('Failed to get invoice', error)
            setError(error instanceof Error ? error.message : 'Failed to get invoice')
            throw error
        }
    }, [])

    const editInvoice = useCallback(async (invoiceId: string, data: UpdateInvoiceInput) => {
        try {
            setError(null)

            await updateInvoice(invoiceId, data)
            await loadInvoices()

        } catch (error) {
            console.error('Failed to update invoice', error)
            setError(error instanceof Error ? error.message : 'Failed to update invoice')
            throw error
        }
    }, [loadInvoices])

    return {
        invoices,
        loading,
        error,
        loadInvoices,
        addInvoice,
        getInvoiceById,
        editInvoice
    }

}