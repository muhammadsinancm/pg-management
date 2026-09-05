import { useNavigate } from "react-router";
import { useExpenses } from "../hooks/useExpenses";
import { CreateExpenseInput, UpdateExpenseInput } from "../types/expense.types";
import { ExpenseForm } from "../components/ExpenseForm";

export default function CreateExpensePage() {
    const navigate = useNavigate()

    const { addExpense, loading, error } = useExpenses()

    const organizationId = 'organization-id'
    const branchId = 'branch-id'

    const handleSubmit = async (data: CreateExpenseInput | UpdateExpenseInput) => {
        const expenseData = data as CreateExpenseInput

        await addExpense({
            ...expenseData,
            organizationId,
            branchId
        })

        navigate('/pg/expenses')

    }

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Add Expense
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Create a new expense record.
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
                    organizationId={organizationId}
                    branchId={branchId}
                    onSubmit={handleSubmit}
                    onCancel={() =>
                        navigate("/pg/expenses")
                    }
                    loading={loading}
                />
            </div>
        </div>
    )

}