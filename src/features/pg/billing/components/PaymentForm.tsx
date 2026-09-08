import { FormEvent, useState } from "react";
import { CreatePaymentInput, Payment, PaymentMethod } from "../types/payment.types";

interface PaymentFormProps {
    payment?: Payment
    organizationId: string
    branchId: string
    customerId: string
    bookingId: string
    invoiceId?: string
    totalAmount: number
    paidAmount: number
    dueAmount: number
    onSubmit: (data: CreatePaymentInput) => Promise<void>
    onCancel?: () => void
}

export function PaymentForm({ payment, organizationId, branchId, customerId, bookingId, invoiceId, totalAmount, paidAmount, dueAmount, onSubmit, onCancel }: PaymentFormProps) {
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

        const paymentAmount =Number(amount)

        if (paymentAmount <= 0) {
            alert('Payment amount must be greater than 0')
            return
        }

        if (paymentAmount > dueAmount) {
            alert(`Payment can not exceed due amount of ₹${dueAmount.toLocaleString('en-IN')}`)
            return
        }

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

            await onSubmit(data)

        } catch(error) {
            console.error('Payment submission failed', error)
            alert(error instanceof Error ? error.message : 'Failed to create payment')

        }  finally {
            setSubmitting(false)
        }

    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            {/* Invoice Summary */}
            <div className="rounded-lg border bg-gray-50 p-4">
                <h2 className="mb-4 text-lg font-semibold text-gray-800">
                    Invoice Summary
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {/* Total */}
                    <div>
                        <p className="text-sm text-gray-500">
                            Total Amount
                        </p>

                        <p className="text-lg font-semibold text-gray-900">
                            ₹
                            {totalAmount.toLocaleString(
                                "en-IN"
                            )}
                        </p>
                    </div>

                    {/* Paid */}
                    <div>
                        <p className="text-sm text-gray-500">
                            Paid Amount
                        </p>

                        <p className="text-lg font-semibold text-green-600">
                            ₹
                            {paidAmount.toLocaleString(
                                "en-IN"
                            )}
                        </p>
                    </div>

                    {/* Due */}
                    <div>
                        <p className="text-sm text-gray-500">
                            Due Amount
                        </p>

                        <p className="text-lg font-semibold text-red-600">
                            ₹
                            {dueAmount.toLocaleString(
                                "en-IN"
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Payment Information */}
            <div className="rounded-lg border bg-white p-6">
                <h2 className="mb-6 text-lg font-semibold text-gray-800">
                    Payment Information
                </h2>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {/* Payment Number */}
                    <div>
                        <label
                            htmlFor="paymentNumber"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Payment Number
                        </label>

                        <input
                            id="paymentNumber"
                            type="text"
                            value={paymentNumber}
                            onChange={(event) =>
                                setPaymentNumber(
                                    event.target.value
                                )
                            }
                            placeholder="PAY-001"
                            required
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Payment Amount */}
                    <div>
                        <label
                            htmlFor="amount"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Payment Amount
                        </label>

                        <input
                            id="amount"
                            type="number"
                            min="0.01"
                            max={dueAmount}
                            step="0.01"
                            value={amount}
                            onChange={(event) =>
                                setAmount(
                                    event.target.value
                                )
                            }
                            placeholder="Enter payment amount"
                            required
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                        />

                        <p className="mt-1 text-sm text-gray-500">
                            Maximum payment: ₹
                            {dueAmount.toLocaleString(
                                "en-IN"
                            )}
                        </p>
                    </div>

                    {/* Payment Date */}
                    <div>
                        <label
                            htmlFor="paymentDate"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Payment Date
                        </label>

                        <input
                            id="paymentDate"
                            type="date"
                            value={paymentDate}
                            onChange={(event) =>
                                setPaymentDate(
                                    event.target.value
                                )
                            }
                            required
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Payment Method */}
                    <div>
                        <label
                            htmlFor="paymentMethod"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Payment Method
                        </label>

                        <select
                            id="paymentMethod"
                            value={paymentMethod}
                            onChange={(event) =>
                                setPaymentMethod(
                                    event.target
                                        .value as PaymentMethod
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
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

                    {/* Reference Number */}
                    <div>
                        <label
                            htmlFor="referenceNumber"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Reference Number
                        </label>

                        <input
                            id="referenceNumber"
                            type="text"
                            value={referenceNumber}
                            onChange={(event) =>
                                setReferenceNumber(
                                    event.target.value
                                )
                            }
                            placeholder="UPI / transaction reference"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label
                            htmlFor="status"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Status
                        </label>

                        <select
                            id="status"
                            value={status}
                            onChange={(event) =>
                                setStatus(
                                    event.target
                                        .value as Payment["status"]
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                        >
                            <option value="completed">
                                Completed
                            </option>

                            <option value="pending">
                                Pending
                            </option>

                            <option value="failed">
                                Failed
                            </option>

                            <option value="refunded">
                                Refunded
                            </option>
                        </select>
                    </div>
                </div>

                {/* Notes */}
                <div className="mt-5">
                    <label
                        htmlFor="notes"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Notes
                    </label>

                    <textarea
                        id="notes"
                        value={notes}
                        onChange={(event) =>
                            setNotes(event.target.value)
                        }
                        rows={4}
                        placeholder="Add payment notes..."
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Payment Preview */}
            <div className="rounded-lg border bg-blue-50 p-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                        Payment Amount
                    </span>

                    <span className="text-lg font-semibold text-gray-900">
                        ₹
                        {(
                            Number(amount) || 0
                        ).toLocaleString("en-IN")}
                    </span>
                </div>

                <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                        Remaining Due
                    </span>

                    <span className="text-lg font-semibold text-red-600">
                        ₹
                        {Math.max(
                            dueAmount -
                                (Number(amount) || 0),
                            0
                        ).toLocaleString("en-IN")}
                    </span>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={submitting}
                        className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>
                )}

                <button
                    type="submit"
                    disabled={submitting || dueAmount <= 0}
                    className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {submitting
                        ? "Saving..."
                        : payment
                        ? "Update Payment"
                        : "Record Payment"}
                </button>
            </div>
        </form>
    );
}