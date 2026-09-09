import { useNavigate } from "react-router";
import { useExpenses } from "../hooks/useExpenses";
import { CreateExpenseInput, UpdateExpenseInput } from "../types/expense.types";
import { ExpenseForm } from "../components/ExpenseForm";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useBranches } from "../../branches/hooks/useBranches";
import { useState } from "react";

export default function CreateExpensePage() {
    const navigate = useNavigate()

    const { addExpense, loading, error } = useExpenses()

    const { user } = useAuth()

    const { branches, loading: branchesLoading, error: branchesError } = useBranches()

    const [selectedBranchId, setSelectedBranchId] = useState('')

    if (!user) {
        return (
            <div className="p-6">
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    Please login to create an expense.
                </div>
            </div>
        );
    }

    const organizationId = user.organizationId
    const branchId = user.role === 'super_admin' ? selectedBranchId : user.branchId ?? ''

    if (!organizationId) {
        return (
            <div className="p-6">
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    Your account is not assigned to an organization.
                </div>
            </div>
        );
    }

    const handleSubmit = async (data: CreateExpenseInput | UpdateExpenseInput) => {
        try {
            if (!branchId) {
                return
            }

            const expenseData = data as CreateExpenseInput

            await addExpense({
                ...expenseData,
                organizationId,
                branchId
            })

            navigate('/pg/expenses')

        } catch (error) {
            console.error('Failed to create expense', error)
        }

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

            {/* Branch Selection */}
            {user.role === "super_admin" && (
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                    <h2 className="text-lg font-semibold text-gray-900">
                        Select Branch
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Select the branch where this expense belongs.
                    </p>

                    {branchesError && (
                        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {branchesError}
                        </div>
                    )}

                    <select
                        value={selectedBranchId}
                        onChange={(event) =>
                            setSelectedBranchId(event.target.value)
                        }
                        disabled={branchesLoading}
                        className="
                            mt-4
                            w-full
                            rounded-md
                            border
                            bg-background
                            px-3
                            py-2.5
                            text-sm
                            outline-none
                            focus:ring-2
                            focus:ring-primary
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        <option value="">
                            {branchesLoading
                                ? "Loading branches..."
                                : "Select a branch"}
                        </option>

                        {branches.map((branch) => (
                            <option
                                key={branch.id}
                                value={branch.id}
                            >
                                {branch.name} ({branch.code})
                            </option>
                        ))}
                    </select>

                </div>
            )}

            {/* Assigned Branch Information */}
            {user.role !== "super_admin" && branchId && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-medium text-gray-500">
                        Assigned Branch
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-900">
                        {branches.find(
                            (branch) => branch.id === branchId
                        )?.name ?? branchId}
                    </p>
                </div>
            )}

            {/* No branch selected */}
            {!branchId && (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
                    Please select a branch before creating the expense.
                </div>
            )}

            {/* Expense Form */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                <ExpenseForm
                    organizationId={organizationId}
                    branchId={branchId}
                    onSubmit={handleSubmit}
                    onCancel={() =>
                        navigate("/pg/expenses")
                    }
                    loading={loading || !branchId}
                />

            </div>

        </div>
    );

}