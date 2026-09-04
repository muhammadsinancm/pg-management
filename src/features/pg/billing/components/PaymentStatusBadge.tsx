import { PaymentStatus } from "../types/payment.types";

interface PaymentStatusBadgeProps {
    status: PaymentStatus
}

const statusStyles: Record<PaymentStatus, string> = {
    pending:  "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
    refunded: "bg-purple-100 text-purple-700"
}

const statusLabels: Record<PaymentStatus, string> = {
    pending: 'Pending',
    completed: 'Completed',
    failed: 'Failed',
    refunded: 'Refunded'
}

export function PaymentStatusBadge({status}: PaymentStatusBadgeProps) {
    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyles[status]}`}
        >
            {statusLabels[status]}
        </span>
    )
}