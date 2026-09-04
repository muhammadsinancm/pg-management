import { InvoiceStatus } from "../types/invoice.types";

interface InvoiceStatusBadgeProps {
    status: InvoiceStatus
}

const statusStyles: Record<InvoiceStatus, string> = {
    draft: "bg-gray-100 text-gray-700",
    issued: "bg-blue-100 text-blue-700",
    partial: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
    overdue: "bg-red-100 text-red-700",
    cancelled: "bg-gray-200 text-gray-600"
}

const statusLabels: Record<InvoiceStatus, string> = {
    draft: 'Draft',
    issued: 'Issued',
    partial: 'Partial',
    paid: 'Paid',
    overdue: 'Overdue',
    cancelled: 'Cancelled'
}

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyles[status]}`}
        >
            {statusLabels[status]}
        </span>
    )
}