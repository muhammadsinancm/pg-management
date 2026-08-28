import { useNavigate } from "react-router";
import { Payment } from "../types/payment.types";
import { PaymentMethodBadge } from "./PaymentMethodBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";

interface PaymentCardProps {
    payment: Payment
}

export function PaymentCard({ payment }: PaymentCardProps) {
    const navigate = useNavigate()

    const formattedDate = payment.paymentDate instanceof Date ? payment.paymentDate.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }) : '-'

    return (
        <article className="payment-card">

            {/* Header */}
            <div className="payment-card-header">

                <div>
                    <span className="payment-card-label">
                        Payment
                    </span>

                    <h3>
                        {payment.paymentNumber}
                    </h3>
                </div>

                <PaymentStatusBadge
                    status={payment.status}
                />

            </div>


            {/* Amount */}
            <div className="payment-card-amount">

                <span>Amount</span>

                <strong>
                    ₹
                    {payment.amount.toLocaleString(
                        "en-IN"
                    )}
                </strong>

            </div>


            {/* Details */}
            <div className="payment-card-details">

                <div>
                    <span>Customer</span>

                    <strong>
                        {payment.customerId}
                    </strong>
                </div>

                <div>
                    <span>Payment Type</span>

                    <strong>
                        {formatPaymentType(
                            payment.paymentType
                        )}
                    </strong>
                </div>

                <div>
                    <span>Payment Method</span>

                    <PaymentMethodBadge
                        method={payment.paymentMethod}
                    />
                </div>

                <div>
                    <span>Payment Date</span>

                    <strong>
                        {formattedDate}
                    </strong>
                </div>

            </div>


            {/* Footer */}
            <div className="payment-card-footer">

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/pg/payments/${payment.id}`
                        )
                    }
                >
                    View Details
                </button>

            </div>

        </article>
    )
}

function formatPaymentType(type: Payment['paymentType']): string {
    switch (type) {
        case 'rent':
            return 'Rent'
        case 'advance':
            return 'Advance'
        case 'deposit':
            return 'Deposit'
        case 'other':
            return 'Other'
        default: return type
    }
}