import { Expense } from "../types/expense.types";

interface ExpenseDetailsProps {
    expense: Expense
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

export function ExpenseDetails({expense}: ExpenseDetailsProps) {
     return (
        <div className="space-y-6">

            {/* Summary */}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <div className="rounded-lg border border-gray-200 bg-white p-4">
                    <p className="text-sm text-gray-500">
                        Amount
                    </p>

                    <p className="mt-1 text-xl font-semibold text-gray-900">
                        {formatAmount(expense.amount)}
                    </p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4">
                    <p className="text-sm text-gray-500">
                        Category
                    </p>

                    <p className="mt-1 text-lg font-semibold text-gray-900">
                        {formatCategory(expense.category)}
                    </p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4">
                    <p className="text-sm text-gray-500">
                        Payment Method
                    </p>

                    <p className="mt-1 text-lg font-semibold text-gray-900">
                        {formatPaymentMethod(
                            expense.paymentMethod
                        )}
                    </p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4">
                    <p className="text-sm text-gray-500">
                        Status
                    </p>

                    <span
                        className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            expense.status === "paid"
                                ? "bg-green-100 text-green-700"
                                : expense.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                        }`}
                    >
                        {formatStatus(expense.status)}
                    </span>
                </div>

            </div>

            {/* Details */}

            <div className="rounded-lg border border-gray-200 bg-white">

                <div className="border-b border-gray-200 px-6 py-4">
                    <h2 className="text-base font-semibold text-gray-900">
                        Expense Details
                    </h2>
                </div>

                <div className="grid gap-6 p-6 sm:grid-cols-2">

                    <div>
                        <p className="text-sm text-gray-500">
                            Expense ID
                        </p>

                        <p className="mt-1 break-all text-sm font-medium text-gray-900">
                            {expense.id}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Expense Date
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-900">
                            {formatDate(
                                expense.expenseDate
                            )}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Organization ID
                        </p>

                        <p className="mt-1 break-all text-sm font-medium text-gray-900">
                            {expense.organizationId}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Branch ID
                        </p>

                        <p className="mt-1 break-all text-sm font-medium text-gray-900">
                            {expense.branchId}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Category
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-900">
                            {formatCategory(
                                expense.category
                            )}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Payment Method
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-900">
                            {formatPaymentMethod(
                                expense.paymentMethod
                            )}
                        </p>
                    </div>

                    {expense.referenceNumber && (
                        <div>
                            <p className="text-sm text-gray-500">
                                Reference Number
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-900">
                                {expense.referenceNumber}
                            </p>
                        </div>
                    )}

                    <div>
                        <p className="text-sm text-gray-500">
                            Status
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-900">
                            {formatStatus(
                                expense.status
                            )}
                        </p>
                    </div>

                    {expense.description && (
                        <div className="sm:col-span-2">
                            <p className="text-sm text-gray-500">
                                Description
                            </p>

                            <p className="mt-1 whitespace-pre-wrap text-sm text-gray-900">
                                {expense.description}
                            </p>
                        </div>
                    )}

                </div>
            </div>

            {/* Timestamps */}

            {(expense.createdAt ||
                expense.updatedAt) && (
                <div className="rounded-lg border border-gray-200 bg-white p-6">

                    <h2 className="text-base font-semibold text-gray-900">
                        Record Information
                    </h2>

                    <div className="mt-4 grid gap-6 sm:grid-cols-2">

                        {expense.createdAt && (
                            <div>
                                <p className="text-sm text-gray-500">
                                    Created At
                                </p>

                                <p className="mt-1 text-sm text-gray-900">
                                    {formatDate(
                                        expense.createdAt
                                    )}
                                </p>
                            </div>
                        )}

                        {expense.updatedAt && (
                            <div>
                                <p className="text-sm text-gray-500">
                                    Updated At
                                </p>

                                <p className="mt-1 text-sm text-gray-900">
                                    {formatDate(
                                        expense.updatedAt
                                    )}
                                </p>
                            </div>
                        )}

                    </div>
                </div>
            )}

        </div>
    )
}