import { useNavigate, useParams } from "react-router";
import { useExpenses } from "../hooks/useExpenses";
import { useEffect, useState } from "react";
import { Expense } from "../types/expense.types";
import { ExpenseDetails } from "../components/ExpenseDetailes";

export default function ExpenseDetailsPage() {
    const { expenseId } = useParams()

    const navigate = useNavigate()

    const { getExpenseById, loading, error } = useExpenses()

    const [expense, setExpense] = useState<Expense | null>(null)

    useEffect(() => {
        if (!expenseId) {
            return
        }

        const loadExpense = async () => {
            try {
                const data = await getExpenseById(expenseId)
                setExpense(data)

            } catch (error) {
                console.error('Failed to load expense', error)
            }
        }
        loadExpense()
    }, [expenseId, getExpenseById])

    if (loading) {
        return (
            <div className="flex min-h-[300px] items-center justify-center">
                <p className="text-sm text-gray-500">
                    Loading expense...
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="space-y-4 p-6">
                <button
                    type="button"
                    onClick={() => navigate("/pg/expenses")}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                    ← Back to Expenses
                </button>

                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            </div>
        )
    }

    if (!expense) {
        return (
            <div className="space-y-4 p-6">
                <button
                    type="button"
                    onClick={() => navigate("/pg/expenses")}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                    ← Back to Expenses
                </button>

                <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Expense Not Found
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        The expense you are looking for does not exist.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 p-6">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <button
                        type="button"
                        onClick={() =>
                            navigate("/pg/expenses")
                        }
                        className="mb-3 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                        ← Back to Expenses
                    </button>

                    <h1 className="text-2xl font-bold text-gray-900">
                        Expense Details
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        View complete information about this expense.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/pg/expenses/edit/${expense.id}`
                        )
                    }
                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                    Edit Expense
                </button>
            </div>

            {/* Details */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <ExpenseDetails expense={expense} />
            </div>
        </div>
    )
}