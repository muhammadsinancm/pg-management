import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AlertCircle, ArrowLeft, Receipt } from "lucide-react";
import { useExpenses } from "../hooks/useExpenses";
import { Expense } from "../types/expense.types";
import { ExpenseDetails } from "../components/ExpenseDetailes";

export default function ExpenseDetailsPage() {
    const { expenseId } = useParams();
    const navigate = useNavigate();
    const { getExpenseById, removeExpense, loading, error } = useExpenses();

    const [expense, setExpense] = useState<Expense | null>(null);

    useEffect(() => {
        if (!expenseId) return;

        const loadExpense = async () => {
            try {
                const data = await getExpenseById(expenseId);
                setExpense(data);
            } catch (err) {
                console.error("Failed to load expense", err);
            }
        };

        loadExpense();
    }, [expenseId, getExpenseById]);

    const handleBack = () => {
        navigate("/pg/expenses");
    };

    const handleEdit = (exp: Expense) => {
        navigate(`/pg/expenses/edit/${exp.id}`);
    };

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this expense record?");
        if (!confirmed) return;

        try {
            await removeExpense(id);
            navigate("/pg/expenses");
        } catch (err) {
            console.error("Failed to delete expense", err);
            alert("Failed to delete expense.");
        }
    };

    if (loading) {
        return (
            <div className="w-full min-w-0 space-y-4 animate-pulse">
                <div className="flex justify-between items-center">
                    <div className="h-4 w-28 rounded bg-neutral-200" />
                    <div className="h-8 w-24 rounded-xl bg-neutral-200" />
                </div>
                <div className="h-96 rounded-2xl border border-neutral-100 bg-white shadow-2xs p-6" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full min-w-0 space-y-4">
                <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Expenses</span>
                </button>

                <div className="flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50/80 p-4 shadow-2xs">
                    <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                    <p className="text-xs font-semibold text-red-800">{error}</p>
                </div>
            </div>
        );
    }

    if (!expense) {
        return (
            <div className="w-full min-w-0 space-y-4">
                <button
                    type="button"
                    onClick={handleBack}
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
                        The expense record you are looking for does not exist or may have been deleted.
                    </p>
                    <button
                        type="button"
                        onClick={handleBack}
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
            <ExpenseDetails
                expense={expense}
                onBack={handleBack}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
}