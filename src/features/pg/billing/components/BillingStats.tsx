import { Billing } from "../types/billing.types";

interface BillingStatsProps {
    billings: Billing[]
}

export function BillingStats({ billings }: BillingStatsProps) {
    const totalBilling = billings.length

    const totalAmount = billings.reduce((total, billing) => total + Number(billing.totalAmount || 0), 0)
    const totalPaid = billings.reduce((total, billing) => total + Number(billing.paidAmount || 0), 0)
    const totalDue = billings.reduce((total, billing) => total + Number(billing.dueAmount || 0), 0)

    const paidCount = billings.filter(billing => billing.status === 'paid').length
    const overdueCount = billings.filter(billing => billing.status === 'overdue').length
    const partialCount = billings.filter(billing => billing.status === 'partial').length

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount)
    }

    const stats = [
        {
            label: 'Total Bills',
            value: totalBilling.toString()
        },
        {
            label: 'Total Amount',
            value: formatCurrency(totalAmount)
        },
        {
            label: 'Total paid',
            value: formatCurrency(totalPaid)
        },
        {
            label: 'Total Due',
            value: formatCurrency(totalDue)
        },
        {
            label: 'Paid Bills',
            value: paidCount.toString()
        },
        {
            label: 'Partial Bills',
            value: partialCount.toString()
        },
        {
            label: 'Overdue Bills',
            value: overdueCount.toString()
        }
    ]

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(stat => (
                <div
                    key={stat.label}
                    className="rounded-lg border bg-white p-4"
                >
                    <p className="text-sm text-gray-500">
                        {stat.label}
                    </p>

                    <p className="mt-2 text-2xl font-semibold">
                        {stat.value}
                    </p>
                </div>
            ))}
        </div>
    )

}