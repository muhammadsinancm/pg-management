import { RecentPayment } from "../types/dahsboard.types";

interface RecebtPaymentsProps {
    payments: RecentPayment[]
}

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount)
}

export default function RecentPayments({payments}: RecebtPaymentsProps) {
return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 p-5">
                <h2 className="text-lg font-semibold text-gray-900">
                    Recent Payments
                </h2>

                <p className="text-sm text-gray-500">
                    Latest payment activity
                </p>
            </div>

            {payments.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-500">
                    No payments found.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                        <thead>
                            <tr className="border-b border-gray-200 text-left">
                                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                                    Customer
                                </th>

                                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                                    Amount
                                </th>

                                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                                    Status
                                </th>

                                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                                    Date
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {payments.map((payment) => (
                                <tr
                                    key={payment.id}
                                    className="border-b border-gray-100 last:border-0"
                                >
                                    <td className="px-5 py-4 text-sm font-medium text-gray-900">
                                        {payment.customerName}
                                    </td>

                                    <td className="px-5 py-4 text-sm text-gray-700">
                                        {formatCurrency(
                                            payment.amount
                                        )}
                                    </td>

                                    <td className="px-5 py-4">
                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-700">
                                            {payment.status}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4 text-sm text-gray-500">
                                        {payment.paymentDate}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}