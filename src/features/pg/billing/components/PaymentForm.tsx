import { FormEvent, useState } from "react";
import { CreatePaymentInput, Payment, PaymentMethod } from "../types/payment.types";

interface PaymentFormProps {
    payment?: Payment
    organizationId: string
    branchId: string
    customerId: string
    bookingId: string
    invoiceId?: string
    onSubmit: (data: CreatePaymentInput) => Promise<void>
    onCancel?: () => void
}

export function PaymentForm({ payment, organizationId, branchId, customerId, bookingId, invoiceId, onSubmit, onCancel }: PaymentFormProps) {
    const [paymentNumber, setPaymentNumber] = useState(payment?.paymentNumber ?? '')
    const [amount, setAmount] = useState(payment?.amount?.toString() ?? '')
    const [paymentDate, setPaymentDate] = useState(payment?.paymentDate ? payment.paymentDate.slice(0, 10) : new Date().toISOString().slice(0, 10))
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(payment?.paymentMethod ?? 'cash')
    const [referenceNumber, setReferenceNumber] = useState(payment?.referenceNumber ?? '')
    const [notes, setNotes] = useState(payment?.notes ?? '')
    const [status, setStatus] = useState<Payment['status']>(payment?.status ?? 'completed')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        try {
            setSubmitting(true)

            const data: CreatePaymentInput = {
                organizationId,
                branchId,
                customerId,
                bookingId,
                invoiceId,
                paymentNumber,
                amount: Number(amount || 0),
                paymentDate,
                paymentMethod,
                status,
                referenceNumber: referenceNumber || undefined,
                notes: notes || undefined
            }
console.log(data);

            await onSubmit(data)

        } finally {
            setSubmitting(false)
        }

    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-lg border bg-white p-6"
        >
            {/* Payment Information */}
            <div>
                <h2 className="mb-4 text-lg font-semibold">
                    Payment Information
                </h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    {/* Payment Number */}
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Payment Number
                        </label>

                        <input
                            type="text"
                            value={paymentNumber}
                            onChange={(e) =>
                                setPaymentNumber(
                                    e.target.value
                                )
                            }
                            placeholder="PAY-0001"
                            required
                            className="w-full rounded-md border px-3 py-2"
                        />
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Amount
                        </label>

                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={amount}
                            onChange={(e) =>
                                setAmount(e.target.value)
                            }
                            placeholder="0.00"
                            required
                            className="w-full rounded-md border px-3 py-2"
                        />
                    </div>

                    {/* Payment Date */}
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Payment Date
                        </label>

                        <input
                            type="date"
                            value={paymentDate}
                            onChange={(e) =>
                                setPaymentDate(
                                    e.target.value
                                )
                            }
                            required
                            className="w-full rounded-md border px-3 py-2"
                        />
                    </div>

                    {/* Payment Method */}
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Payment Method
                        </label>

                        <select
                            value={paymentMethod}
                            onChange={(e) =>
                                setPaymentMethod(
                                    e.target.value as PaymentMethod
                                )
                            }
                            className="w-full rounded-md border px-3 py-2"
                        >
                            <option value="cash">
                                Cash
                            </option>

                            <option value="upi">
                                UPI
                            </option>

                            <option value="card">
                                Card
                            </option>

                            <option value="bank_transfer">
                                Bank Transfer
                            </option>

                            <option value="other">
                                Other
                            </option>
                        </select>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Status
                        </label>

                        <select
                            value={status}
                            onChange={(e) =>
                                setStatus(
                                    e.target.value as Payment["status"]
                                )
                            }
                            className="w-full rounded-md border px-3 py-2"
                        >
                            <option value="pending">
                                Pending
                            </option>

                            <option value="completed">
                                Completed
                            </option>

                            <option value="failed">
                                Failed
                            </option>

                            <option value="refunded">
                                Refunded
                            </option>
                        </select>
                    </div>

                    {/* Reference Number */}
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Reference Number
                        </label>

                        <input
                            type="text"
                            value={referenceNumber}
                            onChange={(e) =>
                                setReferenceNumber(
                                    e.target.value
                                )
                            }
                            placeholder="UPI / transaction reference"
                            className="w-full rounded-md border px-3 py-2"
                        />
                    </div>
                </div>
            </div>

            {/* Notes */}
            <div>
                <label className="mb-1 block text-sm font-medium">
                    Notes
                </label>

                <textarea
                    value={notes}
                    onChange={(e) =>
                        setNotes(e.target.value)
                    }
                    rows={3}
                    placeholder="Payment notes..."
                    className="w-full rounded-md border px-3 py-2"
                />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={submitting}
                        className="rounded-md border px-4 py-2"
                    >
                        Cancel
                    </button>
                )}

                <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
                >
                    {submitting
                        ? "Saving..."
                        : payment
                            ? "Update Payment"
                            : "Record Payment"}
                </button>
            </div>
        </form>
    )
}