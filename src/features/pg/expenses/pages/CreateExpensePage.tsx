import { useState } from "react";
import { useNavigate } from "react-router";
import { AlertCircle, ArrowLeft, Building } from "lucide-react";
import { useExpenses } from "../hooks/useExpenses";
import { CreateExpenseInput, UpdateExpenseInput } from "../types/expense.types";
import { ExpenseForm } from "../components/ExpenseForm";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useBranches } from "../../branches/hooks/useBranches";

export default function CreateExpensePage() {
    const navigate = useNavigate();
    const { addExpense, loading, error } = useExpenses();
    const { user } = useAuth();
    const { branches, loading: branchesLoading, error: branchesError } = useBranches();
    const [selectedBranchId, setSelectedBranchId] = useState("");

    if (!user) {
        return (
            <div className="w-full min-w-0 space-y-4">
                <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 shadow-2xs">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                    <span>Please log in to record an expense.</span>
                </div>
            </div>
        );
    }

    const organizationId = user.organizationId;
    const branchId = user.role === "super_admin" ? selectedBranchId : user.branchId ?? "";

    if (!organizationId) {
        return (
            <div className="w-full min-w-0 space-y-4">
                <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 shadow-2xs">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                    <span>Your account is not assigned to an organization.</span>
                </div>
            </div>
        );
    }

    const handleSubmit = async (data: CreateExpenseInput | UpdateExpenseInput) => {
        if (!branchId) return;

        const expenseData = data as CreateExpenseInput;
        await addExpense({
            ...expenseData,
            organizationId,
            branchId,
        });

        navigate("/pg/expenses");
    };

    return (
        <div className="w-full min-w-0 space-y-4">
            {/* Header with Back Navigation */}
            <div className="flex flex-col gap-2">
                <button
                    type="button"
                    onClick={() => navigate("/pg/expenses")}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer w-fit"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Expenses</span>
                </button>

                <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                        Record New Expense
                    </h1>
                    <p className="mt-0.5 text-xs text-neutral-400">
                        Create and categorize a new expense receipt or operational bill
                    </p>
                </div>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50/80 p-3.5 shadow-2xs">
                    <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                    <p className="text-xs font-semibold text-red-800">{error}</p>
                </div>
            )}

            {/* Branch Selection for Super Admin */}
            {user.role === "super_admin" && (
                <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 sm:p-5 shadow-2xs">
                    <div className="flex items-center gap-2 border-b border-neutral-100 pb-2 mb-3">
                        <Building className="h-4 w-4 text-neutral-500" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                            Select Branch <span className="text-red-500">*</span>
                        </h3>
                    </div>

                    <p className="text-xs text-neutral-400 mb-2">
                        Specify which branch this operational expense should be billed to:
                    </p>

                    {branchesError && (
                        <div className="mb-3 rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-600">
                            {branchesError}
                        </div>
                    )}

                    <select
                        value={selectedBranchId}
                        onChange={(event) => setSelectedBranchId(event.target.value)}
                        disabled={branchesLoading}
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs cursor-pointer disabled:opacity-50"
                    >
                        <option value="">
                            {branchesLoading ? "Loading branches..." : "-- Select a branch --"}
                        </option>
                        {branches.map((branch) => (
                            <option key={branch.id} value={branch.id}>
                                {branch.name} ({branch.code})
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Assigned Branch Info */}
            {user.role !== "super_admin" && branchId && (
                <div className="flex items-center gap-2 rounded-xl border border-neutral-200/80 bg-neutral-50/50 px-4 py-2.5 shadow-2xs">
                    <Building className="h-4 w-4 text-neutral-400 shrink-0" />
                    <span className="text-xs text-neutral-500 font-medium">Assigned Branch:</span>
                    <span className="text-xs font-bold text-neutral-800">
                        {branches.find((b) => b.id === branchId)?.name ?? branchId}
                    </span>
                </div>
            )}

            {/* Missing Branch Notice */}
            {!branchId && (
                <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs font-semibold text-amber-800 shadow-2xs">
                    <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                    <span>Please select a branch before saving the expense.</span>
                </div>
            )}

            {/* Expense Form */}
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-2xs">
                <ExpenseForm
                    organizationId={organizationId}
                    branchId={branchId}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate("/pg/expenses")}
                    loading={loading || !branchId}
                />
            </div>
        </div>
    );
}