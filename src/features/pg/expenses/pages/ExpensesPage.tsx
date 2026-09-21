import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { AlertCircle, Plus } from "lucide-react";
import { useExpenses } from "../hooks/useExpenses";
import { Expense, ExpenseCategory, ExpenseStatus } from "../types/expense.types";
import { ExpenseTable } from "../components/ExpenseTable";
import { ExpenseFilters } from "../components/ExpenseFilters";
import { ExpenseSummary } from "../components/ExpenseSummary";

export default function ExpensesPage() {
    const navigate = useNavigate();
    const { expenses, loading, error, removeExpense } = useExpenses();

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState<ExpenseCategory | "all">("all");
    const [status, setStatus] = useState<ExpenseStatus | "all">("all");

    const filteredExpenses = useMemo(() => {
        return expenses.filter((expense) => {
            const searchValue = search.trim().toLowerCase();

            const matchesSearch =
                !searchValue ||
                (expense.expenseNumber || "").toLowerCase().includes(searchValue) ||
                (expense.vendorName || "").toLowerCase().includes(searchValue) ||
                (expense.description || "").toLowerCase().includes(searchValue) ||
                (expense.referenceNumber || "").toLowerCase().includes(searchValue) ||
                (expense.category || "").toLowerCase().includes(searchValue);

            const matchesCategory = category === "all" || expense.category === category;
            const matchesStatus = status === "all" || expense.status === status;

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [expenses, search, category, status]);

    const handleEdit = (expense: Expense) => {
        navigate(`/pg/expenses/edit/${expense.id}`);
    };

    const handleView = (expense: Expense) => {
        navigate(`/pg/expenses/${expense.id}`);
    };

    const handleDelete = async (expenseId: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this expense record?");
        if (!confirmed) return;

        try {
            await removeExpense(expenseId);
        } catch (err) {
            console.error("Failed to delete expense", err);
            alert("Failed to delete expense.");
        }
    };

    const handleStatusSelect = (selected: ExpenseStatus | "all") => {
        setStatus((prev) => (prev === selected ? "all" : selected));
    };

    const handleClearFilters = () => {
        setSearch("");
        setCategory("all");
        setStatus("all");
    };

    return (
        <div className="w-full min-w-0 space-y-4">
            {/* Header */}
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                        Expenses
                    </h1>
                    <p className="mt-0.5 text-xs text-neutral-400">
                        Manage, track, and categorize hostel operational and maintenance expenses
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/pg/expenses/create")}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-neutral-800 cursor-pointer shrink-0"
                >
                    <Plus className="h-3.5 w-3.5" />
                    <span>New Expense</span>
                </button>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50/80 p-3.5 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                        <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                        <p className="text-xs font-semibold text-red-800">{error}</p>
                    </div>
                </div>
            )}

            {/* Interactive Summary Metrics */}
            <ExpenseSummary
                expenses={expenses}
                selectedStatus={status}
                onSelectStatus={handleStatusSelect}
            />

            {/* Filters Toolbar */}
            <ExpenseFilters
                search={search}
                category={category}
                status={status}
                onSearchChange={setSearch}
                onCategoryChange={setCategory}
                onStatusChange={setStatus}
                onClear={handleClearFilters}
            />

            {/* Table */}
            <ExpenseTable
                expenses={filteredExpenses}
                loading={loading}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={() => navigate("/pg/expenses/create")}
            />
        </div>
    );
}