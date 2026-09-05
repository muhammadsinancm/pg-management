import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Invoice } from "../types/invoice.types";
import { useInvoices } from "../hooks/useInvoices";
import { InvoiceDetails } from "../components/InvoiceDetails";
import { InvoiceStatusBadge } from "../components/InvoiceStatusBadge";

export default function InvoiceDetailsPage() {
    const { invoiceId } = useParams<{ invoiceId: string }>()

    const navigate = useNavigate()

    const { getInvoiceById } = useInvoices()

    const [invoice, setInvoice] = useState<Invoice | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!invoiceId) {
            setError('Invoice Id is missing')
            setLoading(false)
            return
        }

        const loadInvoice = async () => {
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

    if (loading) {
        return (
            <div className="p-6">
                <p className="text-gray-500">
                    Loading invoice...
                </p>
            </div>
        )
    }

    if (error || !invoice) {
        return (
            <div className="p-6">
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-red-600">
                        {error ?? "Invoice not found"}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/pg/billing")}
                    className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-white"
                >
                    Back to Billing
                </button>
            </div>
        )
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Invoice Details
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        View invoice information and payment summary.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <InvoiceStatusBadge status={invoice.status} />

                    <button
                        type="button"
                        onClick={() =>
                            navigate(`/pg/billing/invoices/${invoice.id}/edit`)
                        }
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
                    >
                        Edit Invoice
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/pg/billing")}
                        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                    >
                        Back
                    </button>
                </div>
            </div>

            {/* Invoice */}
            <InvoiceDetails invoice={invoice} />

            {/* Payment */}
            <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold">
                            Payment
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Record a payment against this invoice.
                        </p>
                    </div>

                    {invoice.dueAmount > 0 && (
                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/pg/billing/payments/create?invoiceId=${invoice.id}`
                                )
                            }
                            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                        >
                            Record Payment
                        </button>
                    )}

                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-sm text-gray-500">
                            Total Amount
                        </p>

                        <p className="mt-1 text-xl font-semibold">
                            ₹{invoice.totalAmount.toLocaleString("en-IN")}
                        </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-sm text-gray-500">
                            Paid Amount
                        </p>

                        <p className="mt-1 text-xl font-semibold">
                            ₹{invoice.paidAmount.toLocaleString("en-IN")}
                        </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-sm text-gray-500">
                            Due Amount
                        </p>

                        <p className="mt-1 text-xl font-semibold">
                            ₹{invoice.dueAmount.toLocaleString("en-IN")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}