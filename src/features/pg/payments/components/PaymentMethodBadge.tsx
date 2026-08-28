import { PaymentMethod } from "../types/payment.types";

interface PaymentMethodBadgeProps {
    method: PaymentMethod
}

export function PaymentMethodBadge({ method }: PaymentMethodBadgeProps) {
    const methodConfig: Record<PaymentMethod,
        {
            label: string,
            className: string
        }> = {
        cash: {
            label: 'Cash',
            className: 'payment-method-badge payment-method-cash'
        },
        upi: {
            label: 'UPI',
            className: 'payment-method-badge payment-method-upi'
        },
        card: {
            label: 'Card',
            className: 'payment-method-badge payment-method-card'
        },
        back_transfer: {
            label: 'Bank Transfer',
            className: 'payment-method-badge payment-method-bank-transfer'
        }
    }
    const config = methodConfig[method]

    return (
        <span className={config.className}>
            {config.label}
        </span>
    )
}