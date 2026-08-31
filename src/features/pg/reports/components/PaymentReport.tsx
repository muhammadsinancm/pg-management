import { PaymentReportData } from "../types/report.types";

interface PaymentReportProps {
    payments: PaymentReportData
}

export function PaymentReport({ payments }: PaymentReportProps) {
    return (
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-gray-900">
                Payment Report
            </h2>
            <div className="mt-5 grid grid-cols-2 gap-4">

                <Stat
                    label="Total Payments"
                    value={payments.totalPayments}
                />

                <Stat
                    label="Paid"
                    value={payments.paidPayments}
                />

                <Stat
                    label="Pending"
                    value={payments.pendingPayments}
                />

                <Stat
                    label="Failed"
                    value={payments.failedPayments}
                />

                <Stat
                    label="Refunded"
                    value={payments.refundedPayment}
                />

            </div>

            <div className="mt-5 rounded-lg bg-gray-50 p-4">

                <p className="text-sm text-gray-500">
                    Total Paid Amount
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                    ₹{payments.totalAmount.toLocaleString("en-IN")}
                </p>

            </div>

        </section>
    )
}

function Stat({ label, value }: {
    label: string
    value: number
}) {
    return (
        <div className="rounded-lg bg-gray-50 p-4">

            <p className="text-sm text-gray-500">
                {label}
            </p>

            <p className="mt-1 text-xl font-bold text-gray-900">
                {value}
            </p>

        </div>
    )
}