import { Invoice } from "../types/invoice.types";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";

interface InvoiceTableProps {
    invoices: Invoice[]
    onView: (invoice: Invoice) => void
    onEdit: (invoice: Invoice) => void
}

export function InvoiceTable({invoices, onView, onEdit}: InvoiceTableProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(Number(amount || 0))
    }

    const formatDate = (date: string) => {
        if(!date) return '-'
        return new Date(date).toLocaleDateString('en-IN')
    }

    if (invoices.length === 0) {
         return (
            <div className="rounded-lg border bg-white p-8 text-center">
                <p className="text-sm text-gray-500">
                    No invoices found.
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
                            Invoice
                        </th>

                        <th className="px-4 py-3 font-semibold">
                            Issue Date
                        </th>

                        <th className="px-4 py-3 font-semibold">
                            Due Date
                        </th>

                        <th className="px-4 py-3 font-semibold">
                            Total
                        </th>

                        <th className="px-4 py-3 font-semibold">
                            Paid
                        </th>

                        <th className="px-4 py-3 font-semibold">
                            Due
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
                    {invoices.map((invoice) => (
                        <tr
                            key={invoice.id}
                            className="hover:bg-gray-50"
                        >
                            <td className="px-4 py-3">
                                <div className="font-medium">
                                    {invoice.invoiceNumber}
                                </div>

                                <div className="text-xs text-gray-500">
                                    {invoice.customerId}
                                </div>
                            </td>

                            <td className="px-4 py-3">
                                {formatDate(
                                    invoice.issueDate
                                )}
                            </td>

                            <td className="px-4 py-3">
                                {formatDate(
                                    invoice.dueDate
                                )}
                            </td>

                            <td className="px-4 py-3 font-medium">
                                {formatCurrency(
                                    invoice.totalAmount
                                )}
                            </td>

                            <td className="px-4 py-3">
                                {formatCurrency(
                                    invoice.paidAmount
                                )}
                            </td>

                            <td className="px-4 py-3 font-medium">
                                {formatCurrency(
                                    invoice.dueAmount
                                )}
                            </td>

                            <td className="px-4 py-3">
                                <InvoiceStatusBadge
                                    status={invoice.status}
                                />
                            </td>

                            <td className="px-4 py-3">
                                <div className="flex justify-end gap-2">
                                    {onView && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onView(invoice)
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
                                                onEdit(invoice)
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