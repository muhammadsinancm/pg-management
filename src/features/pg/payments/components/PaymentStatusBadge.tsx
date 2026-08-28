import { PaymentStatus } from "../types/payment.types";

interface PaymentStatusBadgeProps {
    status: PaymentStatus
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
    const statusConfig: Record<PaymentStatus, {
        label: string,
        className: string
    }> = {
        paid: {
            label: 'paid',
            className: 'payment-status-badge payment-status-paid'
        },
        pending: {
            label: 'Pending',
            className: 'payment-status-badge payment-status-refunded'
        },
        failed: {
            label: 'Failed',
            className: 'payment-status-badge payment-status-failed'
        },
        refunded: {
            label: 'Refunded',
            className: 'payment-status-badge payment-status-refunded'
        }
    }

    const config = statusConfig[status]

    return (
        <span className={config.className}>
            {config.label}
        </span>
    )
}