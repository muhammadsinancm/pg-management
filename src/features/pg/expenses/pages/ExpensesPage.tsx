import { useNavigate } from "react-router";
import { useExpenses } from "../hooks/useExpenses";
import { useMemo, useState } from "react";
import { Expense, ExpenseCategory, ExpenseStatus } from "../types/expense.types";
import { ExpenseTable } from "../components/ExpenseTable";
import { ExpenseFilters } from "../components/ExpenseFilters";
import { ExpenseSummary } from "../components/ExpenseSummary";

export default function ExpensesPage() {
    const navigate = useNavigate()

    const { expenses, loading, error, removeExpense } = useExpenses()

    const [search, setSearch] = useState('')
    const [category, setCategory] = useState<ExpenseCategory | 'all'>('all')
    const [status, setStatus] = useState<ExpenseStatus | 'all'>('all')

    const filteredExpenses = useMemo(() => {
        return expenses.filter((expense) => {
            const searchValue = search.trim().toLowerCase()

            const matchesSearch = !searchValue || expense.description?.toLowerCase().includes(searchValue) ||
                expense.referenceNumber?.toLowerCase().includes(searchValue) ||
                expense.category.toLowerCase().includes(searchValue)

            const matchesCategory = category === 'all' || expense.category === category
            const matchesStatus = status === 'all' || expense.status === status

            return (matchesSearch && matchesCategory && matchesStatus)
        })
    }, [expenses, search, category, status])

    const handleEdit = (expense: Expense) => {
        navigate(`/pg/expenses/edit/${expense.id}`)
    }

    const handleDelete = async (expenseId: string) => {
        const confirmed = window.confirm('Are you sure you want to delete this expense?')

        if (!confirmed) {
            return
        }

        try {
            await removeExpense(expenseId)

        } catch (error) {
            console.error('Failed to delete expense', error)
        }

    }

    const handleClearFilters = () => {
        setSearch('')
        setCategory('all')
        setStatus('all')
    }

    return (
        <div className="space-y-6 p-6">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Expenses
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage and track your PG expenses.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/pg/expenses/create")
                    }
                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                    + Add Expense
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Summary */}
            <ExpenseSummary expenses={expenses} />

            {/* Filters */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <ExpenseFilters
                    search={search}
                    category={category}
                    status={status}
                    onSearchChange={setSearch}
                    onCategoryChange={setCategory}
                    onStatusChange={setStatus}
                    onClear={handleClearFilters}
                />
            </div>

            {/* Result count */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                    Expense Records
                </h2>

                <span className="text-sm text-gray-500">
                    {filteredExpenses.length}{" "}
                    {filteredExpenses.length === 1
                        ? "expense"
                        : "expenses"}
                </span>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <ExpenseTable
                    expenses={filteredExpenses}
                    loading={loading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    )
}