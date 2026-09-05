import { Expense } from "../types/expense.types";

interface ExpenseTableProps {
    expenses: Expense[]
    loading?: boolean
    onEdit?: (expense: Expense) => void
    onDelete?: (expense: string) => void
}

function formatCategory(category: Expense['category']) {
    return category.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

function formatPaymentMethod(method: Expense['paymentMethod']) {
    return method.replace('_', '').replace(/\b\w/g, (char) => char.toUpperCase())
}

function formatStatus(status: Expense['status']) {
    return status.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

function formatAmount(amount: number) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2
    }).format(amount)
}

function formatDate(date: string) {
    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getDate())) {
        return '-'
    }

    return parsedDate.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}

export function ExpenseTable({expenses, loading = false, onEdit, onDelete}: ExpenseTableProps) {
    if (loading) {
         return (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
                Loading expenses...
            </div>
        )
    }

    if (expenses.length === 0) {
         return (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
                <p className="text-sm font-medium text-gray-700">
                    No expenses found
                </p>

                <p className="mt-1 text-sm text-gray-500">
                    Add an expense to see it here.
                </p>
            </div>
        )
    }

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">

                    <thead className="border-b border-gray-200 bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 font-medium text-gray-600">
                                Category
                            </th>

                            <th className="px-4 py-3 font-medium text-gray-600">
                                Amount
                            </th>

                            <th className="px-4 py-3 font-medium text-gray-600">
                                Date
                            </th>

                            <th className="px-4 py-3 font-medium text-gray-600">
                                Payment Method
                            </th>

                            <th className="px-4 py-3 font-medium text-gray-600">
                                Description
                            </th>

                            <th className="px-4 py-3 font-medium text-gray-600">
                                Status
                            </th>

                            <th className="px-4 py-3 text-right font-medium text-gray-600">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">

                        {expenses.map((expense) => (
                            <tr
                                key={expense.id}
                                className="hover:bg-gray-50"
                            >

                                {/* Category */}

                                <td className="px-4 py-4">
                                    <span className="font-medium text-gray-900">
                                        {formatCategory(
                                            expense.category
                                        )}
                                    </span>
                                </td>

                                {/* Amount */}

                                <td className="px-4 py-4 font-medium text-gray-900">
                                    {formatAmount(
                                        expense.amount
                                    )}
                                </td>

                                {/* Date */}

                                <td className="px-4 py-4 text-gray-600">
                                    {formatDate(
                                        expense.expenseDate
                                    )}
                                </td>

                                {/* Payment Method */}

                                <td className="px-4 py-4 text-gray-600">
                                    {formatPaymentMethod(
                                        expense.paymentMethod
                                    )}
                                </td>

                                {/* Description */}

                                <td className="max-w-[220px] px-4 py-4 text-gray-600">
                                    <span
                                        className="block truncate"
                                        title={
                                            expense.description ??
                                            ""
                                        }
                                    >
                                        {expense.description ||
                                            "-"}
                                    </span>
                                </td>

                                {/* Status */}

                                <td className="px-4 py-4">
                                    <span
                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                            expense.status === "paid"
                                                ? "bg-green-100 text-green-700"
                                                : expense.status ===
                                                  "pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {formatStatus(
                                            expense.status
                                        )}
                                    </span>
                                </td>

                                {/* Actions */}

                                <td className="px-4 py-4">
                                    <div className="flex justify-end gap-2">

                                        {onEdit && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onEdit(
                                                        expense
                                                    )
                                                }
                                                className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                                            >
                                                Edit
                                            </button>
                                        )}

                                        {onDelete && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onDelete(
                                                        expense.id
                                                    )
                                                }
                                                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                                            >
                                                Delete
                                            </button>
                                        )}

                                    </div>
                                </td>

                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
        </div>
    )
}