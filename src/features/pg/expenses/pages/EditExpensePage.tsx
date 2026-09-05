import { useNavigate, useParams } from "react-router";
import { useExpenses } from "../hooks/useExpenses";
import { useEffect, useState } from "react";
import { CreateExpenseInput, Expense, UpdateExpenseInput } from "../types/expense.types";
import { ExpenseForm } from "../components/ExpenseForm";

export default function EditExpensePage() {
    const { expenseId } = useParams()

    const navigate = useNavigate()

    const { getExpenseById, editExpense, error } = useExpenses()

    const [expense, setExpense] = useState<Expense | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!expenseId) {
            setLoading(false)
            return
        }

        const loadExpense = async () => {
            try {
                setLoading(true)

                const data = await getExpenseById(expenseId)
                setExpense(data)

            } catch (error) {
                console.error('Failed to load expense', error)

            } finally {
                setLoading(false)
            }
        }

        loadExpense()
    }, [expenseId, getExpenseById])

    const handleSubmit = async (data: CreateExpenseInput | UpdateExpenseInput) => {
        if (!expenseId) {
            return
        }

        try {
            setSaving(true)

            await editExpense(expenseId, data as UpdateExpenseInput)

            navigate(`/pg/expenses/${expenseId}`)

        } catch (error) {
            console.error('Failed to update expense', error)

        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-[300px] items-center justify-center">
                <p className="text-sm text-gray-500">
                    Loading expense...
                </p>
            </div>
        )
    }

    if (!expenseId || !expense) {
        return (
            <div className="space-y-4 p-6">
                <button
                    type="button"
                    onClick={() =>
                        navigate("/pg/expenses")
                    }
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                    ← Back to Expenses
                </button>

                <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Expense Not Found
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        The expense you are trying to edit
                        does not exist.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 p-6">

            {/* Header */}
            <div>
                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/pg/expenses/${expense.id}`
                        )
                    }
                    className="mb-3 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                    ← Back to Expense
                </button>

                <h1 className="text-2xl font-bold text-gray-900">
                    Edit Expense
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Update the expense information.
                </p>
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Form */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <ExpenseForm
                    expense={expense}
                    organizationId={expense.organizationId}
                    branchId={expense.branchId}
                    onSubmit={handleSubmit}
                    onCancel={() =>
                        navigate(
                            `/pg/expenses/${expense.id}`
                        )
                    }
                    loading={saving}
                />
            </div>
        </div>
    )
}