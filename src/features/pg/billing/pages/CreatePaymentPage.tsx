import { useNavigate, useSearchParams } from "react-router";
import { usePayments } from "../hooks/usePayments";
import { CreatePaymentInput } from "../types/payment.types";
import { PaymentForm } from "../components/PaymentForm";
import { useInvoices } from "../hooks/useInvoices";
import { useEffect, useState } from "react";
import { Invoice } from "../types/invoice.types";

export default function CreatePaymentPage() {
    const navigate = useNavigate()

    const [searchParams] = useSearchParams()

    const { addPayment } = usePayments()
    const { getInvoiceById } = useInvoices()

    const invoiceId = searchParams.get('invoiceId')

    const [invoice, setInvoice] = useState<Invoice | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadInvoice = async () => {
            if (!invoiceId) {
                setError('Invoice ID is missing')
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                setError(null)

                const data = await getInvoiceById(invoiceId)

                if (!data) {
                    setError('Invoice not found')
                    return
                }

                setInvoice(data)

            } catch (error) {
                console.error('Failed to load invoice', error)
                setError(error instanceof Error ? error.message : 'Failed to load invoice')

            } finally {
                setLoading(false)
            }
        }
        loadInvoice()
    }, [invoiceId, getInvoiceById])

    const handleSubmit = async (data: CreatePaymentInput) => {

        try {

            if (!invoice) {
                return
            }

            const paymentData: CreatePaymentInput = {
                ...data,
                organizationId: invoice.organizationId,
                branchId: invoice.branchId,
                customerId: invoice.customerId,
                bookingId: invoice.bookingId,
                invoiceId: invoice.id
            }

            await addPayment(paymentData)

            navigate('/pg/billing')

        } catch (error) {
            console.error('Failed to create payment', error)
        }
    }

    if (loading) {
        return (
            <div className="p-6">
                <p>Loading invoice...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="rounded-md border border-red-200 bg-red-50 p-4">
                    <p className="text-red-700">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/pg/billing")
                        }
                        className="mt-4 rounded-md bg-black px-4 py-2 text-white"
                    >
                        Back to Billing
                    </button>
                </div>
            </div>
        )
    }

    if (!invoice) {
        return null
    }

    return (
        <div className="p-6">

            <div className="mb-6">
                <h1 className="text-2xl font-semibold">
                    Record Payment
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Record a payment for invoice{" "}
                    <span className="font-medium">
                        {invoice.invoiceNumber}
                    </span>
                </p>
            </div>

            <PaymentForm
                organizationId={
                    invoice.organizationId
                }
                branchId={
                    invoice.branchId
                }
                customerId={
                    invoice.customerId
                }
                bookingId={
                    invoice.bookingId
                }
                invoiceId={
                    invoice.id
                }
                onSubmit={handleSubmit}
                onCancel={() =>
                    navigate(
                        `/pg/billing/invoices/${invoice.id}`
                    )
                }
            />

        </div>
    )
}