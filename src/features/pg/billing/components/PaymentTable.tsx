import { Payment } from "../types/payment.types";
import { PaymentStatusBadge } from "./PaymentStatusBadge";

interface PaymentTableProps {
    payments: Payment[]
    onView?: (payment: Payment) => void
    onEdit?: (payment: Payment) => void
}

export function PaymentTable({ payments, onView, onEdit }: PaymentTableProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(Number(amount || 0))
    }

    const formatDate = (date: string) => {
        if (!date) return '-'

        return new Date(date).toLocaleDateString('en-IN')
    }

    if (payments.length === 0) {
        return (
            <div className="rounded-lg border bg-white p-8 text-center">
                <p className="text-sm text-gray-500">
                    No payments found.
                </p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto rounded-lg border bg-white">
            <table className="w-full min-w-[900px] text-left text-sm">

                <thead className="border-b bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 font-semibold">
                            Payment
                        </th>

                        <th className="px-4 py-3 font-semibold">
                            Date
                        </th>

                        <th className="px-4 py-3 font-semibold">
                            Amount
                        </th>

                        <th className="px-4 py-3 font-semibold">
                            Method
                        </th>

                        <th className="px-4 py-3 font-semibold">
                            Reference
                        </th>

                        <th className="px-4 py-3 font-semibold">
                            Status
                        </th>

                        <th className="px-4 py-3 text-right font-semibold">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y">
                    {payments.map((payment) => (
                        <tr
                            key={payment.id}
                            className="hover:bg-gray-50"
                        >
                            {/* Payment */}
                            <td className="px-4 py-3">
                                <div className="font-medium">
                                    {payment.paymentNumber}
                                </div>

                                <div className="text-xs text-gray-500">
                                    {payment.customerId}
                                </div>
                            </td>

                            {/* Date */}
                            <td className="px-4 py-3">
                                {formatDate(
                                    payment.paymentDate
                                )}
                            </td>

                            {/* Amount */}
                            <td className="px-4 py-3 font-medium">
                                {formatCurrency(
                                    payment.amount
                                )}
                            </td>

                            {/* Method */}
                            <td className="px-4 py-3 capitalize">
                                {payment.paymentMethod.replace(
                                    "_",
                                    " "
                                )}
                            </td>

                            {/* Reference */}
                            <td className="px-4 py-3">
                                {payment.referenceNumber ||
                                    "-"}
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3">
                                <PaymentStatusBadge
                                    status={payment.status}
                                />
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3">
                                <div className="flex justify-end gap-2">
                                    {onView && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onView(payment)
                                            }
                                            className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
                                        >
                                            View
                                        </button>
                                    )}

                                    {onEdit && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onEdit(payment)
                                            }
                                            className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
                                        >
                                            Edit
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    )
}