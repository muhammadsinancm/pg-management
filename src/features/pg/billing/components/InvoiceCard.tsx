import { Invoice } from "../types/invoice.types";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";

interface InvoiceCardProps {
    invoice: Invoice
    onView?: (invoice: Invoice) => void
}

export function InvliceCard({invoice, onView}: InvoiceCardProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(Number(amount || 0))
    }

    const formatDate = (date: string) => {
        if(!date) return '-'
        return new Date(date).toLocaleDateString('en-IN')
    }

     return (
        <div className="rounded-lg border bg-white p-4 shadow-sm">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm text-gray-500">
                        Invoice
                    </p>

                    <h3 className="text-lg font-semibold">
                        {invoice.invoiceNumber}
                    </h3>
                </div>

                <InvoiceStatusBadge
                    status={invoice.status}
                />
            </div>

            {/* Details */}
            <div className="mt-4 space-y-3">
                <div className="flex justify-between gap-4">
                    <span className="text-sm text-gray-500">
                        Issue Date
                    </span>

                    <span className="text-sm font-medium">
                        {formatDate(invoice.issueDate)}
                    </span>
                </div>

                <div className="flex justify-between gap-4">
                    <span className="text-sm text-gray-500">
                        Due Date
                    </span>

                    <span className="text-sm font-medium">
                        {formatDate(invoice.dueDate)}
                    </span>
                </div>

                <div className="flex justify-between gap-4">
                    <span className="text-sm text-gray-500">
                        Total Amount
                    </span>

                    <span className="text-sm font-semibold">
                        {formatCurrency(invoice.totalAmount)}
                    </span>
                </div>

                <div className="flex justify-between gap-4">
                    <span className="text-sm text-gray-500">
                        Paid
                    </span>

                    <span className="text-sm font-medium">
                        {formatCurrency(invoice.paidAmount)}
                    </span>
                </div>

                <div className="flex justify-between gap-4">
                    <span className="text-sm text-gray-500">
                        Due
                    </span>

                    <span className="text-sm font-semibold">
                        {formatCurrency(invoice.dueAmount)}
                    </span>
                </div>
            </div>

            {/* Footer */}
            {onView && (
                <div className="mt-4 border-t pt-4">
                    <button
                        type="button"
                        onClick={() => onView(invoice)}
                        className="w-full rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                    >
                        View Invoice
                    </button>
                </div>
            )}
        </div>
    )
}