import { useNavigate, useParams } from "react-router";
import { usePayments } from "../hooks/usePayments";
import { useEffect, useState } from "react";
import { Payment } from "../types/payment.types";
import { PaymentStatusBadge } from "../components/PaymentStatusBadge";

export default function PaymentDetailsPage() {
    const { paymentId } = useParams<{ paymentId: string }>()

    const navigate = useNavigate()

    const { getPaymentById } = usePayments()

    const [payment, setPayment] = useState<Payment | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!paymentId) {
            setError('Payment ID is missing')
            setLoading(false)
            return
        }

        const loadPayment = async () => {
            try {
                setLoading(true)
                setError(null)

                const data = await getPaymentById(paymentId)
                if (!data) {
                    setError('Payment not found')
                    return
                }

                setPayment(data)

            } catch (error) {
                console.error('Failed to load payment', error)
                setError(error instanceof Error ? error.message : 'Failed to load payment')

            } finally {
                setLoading(false)
            }
        }

        loadPayment()
    }, [paymentId, getPaymentById])

    function formatPaymentMethod(method: Payment['paymentMethod']): string {
        return method.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    }

    function formatPaymentStatus(status: Payment['status']): string {
        return status.charAt(0).toUpperCase() + status.slice(1)
    }

    if (loading) {
        return (
            <div className="p-6">
                <p className="text-gray-500">
                    Loading payment...
                </p>
            </div>
        )
    }

    if (error || !payment) {
        return (
            <div className="p-6">
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-red-600">
                        {error ?? "Payment not found"}
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
                        Payment Details
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        View payment transaction details.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <PaymentStatusBadge status={payment.status} />

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/pg/billing/payments/${payment.id}/edit`
                            )
                        }
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
                    >
                        Edit Payment
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

            {/* Payment information */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-lg font-semibold">
                    Payment Information
                </h2>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <DetailItem
                        label="Payment Number"
                        value={payment.paymentNumber}
                    />

                    <DetailItem
                        label="Amount"
                        value={`₹${payment.amount.toLocaleString("en-IN")}`}
                    />

                    <DetailItem
                        label="Payment Date"
                        value={new Date(
                            payment.paymentDate
                        ).toLocaleDateString("en-IN")}
                    />

                    <DetailItem
                        label="Payment Method"
                        value={formatPaymentMethod(
                            payment.paymentMethod
                        )}
                    />

                    <DetailItem
                        label="Status"
                        value={formatPaymentStatus(payment.status)}
                    />

                    <DetailItem
                        label="Reference Number"
                        value={payment.referenceNumber || "—"}
                    />

                    <DetailItem
                        label="Customer ID"
                        value={payment.customerId}
                    />

                    <DetailItem
                        label="Booking ID"
                        value={payment.bookingId}
                    />

                    <DetailItem
                        label="Invoice ID"
                        value={payment.invoiceId || "—"}
                    />

                    <DetailItem
                        label="Organization ID"
                        value={payment.organizationId}
                    />

                    <DetailItem
                        label="Branch ID"
                        value={payment.branchId}
                    />
                </div>

                {payment.notes && (
                    <div className="mt-6 border-t pt-6">
                        <p className="text-sm font-medium text-gray-500">
                            Notes
                        </p>

                        <p className="mt-2 text-sm text-gray-700">
                            {payment.notes}
                        </p>
                    </div>
                )}
            </div>

            {/* Amount summary */}
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-xl border bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Payment Amount
                    </p>

                    <p className="mt-2 text-2xl font-semibold">
                        ₹{payment.amount.toLocaleString("en-IN")}
                    </p>
                </div>

                <div className="rounded-xl border bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Payment Method
                    </p>

                    <p className="mt-2 text-lg font-semibold">
                        {formatPaymentMethod(payment.paymentMethod)}
                    </p>
                </div>

                <div className="rounded-xl border bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Status
                    </p>

                    <div className="mt-2">
                        <PaymentStatusBadge status={payment.status} />
                    </div>
                </div>
            </div>
        </div>
    )
}

interface DetailItemProps {
    label: string
    value: string
}

function DetailItem({ label, value }: DetailItemProps) {
    return (
        <div>
            <p className="text-sm text-gray-500">
                {label}
            </p>

            <p className="mt-1 break-all font-medium text-gray-900">
                {value}
            </p>
        </div>
    )
}