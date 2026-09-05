import { Expense } from "../types/expense.types";

interface ExpenseSummaryProps {
    expenses: Expense[]
}

function formatAmount(amount: number) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2
    }).format(amount)
}

export function ExpenseSummary({ expenses }: ExpenseSummaryProps) {
    const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0)
    const paidExpenses = expenses.filter((expense) => expense.status === 'paid').reduce((total, expense) => total + expense.amount, 0)
    const pendingExpenses = expenses.filter((expense) => expense.status === 'pending').reduce((total, expense) => total + expense.amount, 0)
    const cancelledExpenses = expenses.filter((expense) => expense.status === 'cancelled').reduce((total, expense) => total + expense.amount, 0)

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {/* Total Expenses */}

            <div className="rounded-lg border border-gray-200 bg-white p-5">
                <p className="text-sm font-medium text-gray-500">
                    Total Expenses
                </p>

                <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {formatAmount(totalExpenses)}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                    {expenses.length} expense
                    {expenses.length !== 1 ? "s" : ""}
                </p>
            </div>

            {/* Paid */}

            <div className="rounded-lg border border-gray-200 bg-white p-5">
                <p className="text-sm font-medium text-gray-500">
                    Paid
                </p>

                <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {formatAmount(paidExpenses)}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                    Completed expenses
                </p>
            </div>

            {/* Pending */}

            <div className="rounded-lg border border-gray-200 bg-white p-5">
                <p className="text-sm font-medium text-gray-500">
                    Pending
                </p>

                <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {formatAmount(pendingExpenses)}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                    Expenses awaiting payment
                </p>
            </div>

            {/* Cancelled */}

            <div className="rounded-lg border border-gray-200 bg-white p-5">
                <p className="text-sm font-medium text-gray-500">
                    Cancelled
                </p>

                <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {formatAmount(cancelledExpenses)}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                    Cancelled expenses
                </p>
            </div>

        </div>
    )
}