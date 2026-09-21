import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AlertCircle, ArrowLeft, Receipt } from "lucide-react";
import { useExpenses } from "../hooks/useExpenses";
import { CreateExpenseInput, Expense, UpdateExpenseInput } from "../types/expense.types";
import { ExpenseForm } from "../components/ExpenseForm";

export default function EditExpensePage() {
    const { expenseId } = useParams();
    const navigate = useNavigate();
    const { getExpenseById, editExpense, error } = useExpenses();

    const [expense, setExpense] = useState<Expense | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!expenseId) {
            setLoading(false);
            return;
        }

        const loadExpense = async () => {
            try {
                setLoading(true);
                const data = await getExpenseById(expenseId);
                setExpense(data);
            } catch (err) {
                console.error("Failed to load expense", err);
            } finally {
                setLoading(false);
            }
        };

        loadExpense();
    }, [expenseId, getExpenseById]);

    const handleSubmit = async (data: CreateExpenseInput | UpdateExpenseInput) => {
        if (!expenseId) return;

        try {
            setSaving(true);
            await editExpense(expenseId, data as UpdateExpenseInput);
            navigate(`/pg/expenses/${expenseId}`);
        } catch (err) {
            console.error("Failed to update expense", err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full min-w-0 space-y-4 animate-pulse">
                <div className="h-6 w-32 rounded bg-neutral-200" />
                <div className="h-8 w-48 rounded bg-neutral-200" />
                <div className="h-64 rounded-2xl border border-neutral-100 bg-white shadow-2xs p-6" />
            </div>
        );
    }

    if (!expenseId || !expense) {
        return (
            <div className="w-full min-w-0 space-y-4">
                <button
                    type="button"
                    onClick={() => navigate("/pg/expenses")}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Expenses</span>
                </button>

                <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-8 xl:p-12 text-center shadow-2xs">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
                        <Receipt className="h-5 w-5" />
                    </div>
                    <h2 className="mt-3 text-sm font-bold text-neutral-900">
                        Expense Not Found
                    </h2>
                    <p className="mt-1 text-xs text-neutral-400 max-w-sm mx-auto">
                        The expense you are trying to edit does not exist or has been removed.
                    </p>
                    <button
                        type="button"
                        onClick={() => navigate("/pg/expenses")}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-neutral-800 transition-all cursor-pointer"
                    >
                        Back to Expenses
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-w-0 space-y-4">
            {/* Header with Back Navigation */}
            <div className="flex flex-col gap-2">
                <button
                    type="button"
                    onClick={() => navigate(`/pg/expenses/${expense.id}`)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer w-fit"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Expense {expense.expenseNumber}</span>
                </button>

                <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                        Edit Expense {expense.expenseNumber}
                    </h1>
                    <p className="mt-0.5 text-xs text-neutral-400">
                        Update details, financial records, or vendor description for this expense
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

            {/* Form */}
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-2xs">
                <ExpenseForm
                    expense={expense}
                    organizationId={expense.organizationId}
                    branchId={expense.branchId}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate(`/pg/expenses/${expense.id}`)}
                    loading={saving}
                />
            </div>
        </div>
    );
}