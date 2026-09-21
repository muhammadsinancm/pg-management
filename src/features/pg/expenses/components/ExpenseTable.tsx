import { Calendar, CreditCard, Eye, Pencil, Receipt, Trash2 } from "lucide-react";
import { Expense } from "../types/expense.types";
import { ExpenseCategoryBadge, ExpenseStatusBadge } from "./ExpenseCategoryBadge";

interface ExpenseTableProps {
    expenses: Expense[];
    loading?: boolean;
    onView?: (expense: Expense) => void;
    onEdit?: (expense: Expense) => void;
    onDelete?: (expenseId: string) => void;
    onAdd?: () => void;
}

function formatPaymentMethod(method?: string) {
    if (!method) return "—";
    const labels: Record<string, string> = {
        cash: "Cash",
        upi: "UPI",
        bank_transfer: "Bank Transfer",
        card: "Card",
    };
    return labels[method] || method.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatAmount(amount: number) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);
}

function formatDate(dateString?: string) {
    if (!dateString) return "—";
    const parsedDate = new Date(dateString);
    if (Number.isNaN(parsedDate.getTime())) return "—";
    return parsedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export function ExpenseTable({
    expenses,
    loading = false,
    onView,
    onEdit,
    onDelete,
    onAdd,
}: ExpenseTableProps) {
    if (loading) {
        return <ExpenseTableSkeleton />;
    }

    if (expenses.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-8 xl:p-12 text-center shadow-2xs">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
                    <Receipt className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-neutral-900">
                    No expenses found
                </h3>
                <p className="mt-1 text-xs text-neutral-400 max-w-sm mx-auto">
                    No expenses match your current search and filter criteria.
                </p>
                {onAdd && (
                    <button
                        type="button"
                        onClick={onAdd}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-neutral-800 transition-all cursor-pointer"
                    >
                        + Add Expense
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-2xs">
            <div className="overflow-x-auto w-full min-w-0">
                <table className="w-full xl:min-w-[960px] text-left text-xs xl:text-sm">
                    <thead className="hidden xl:table-header-group border-b border-neutral-100 bg-neutral-50/70">
                        <tr>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Expense
                            </th>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Category
                            </th>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Date
                            </th>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Payment Method
                            </th>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Amount
                            </th>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Status
                            </th>
                            <th className="pl-2 pr-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap text-right w-[1%]">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="flex flex-col xl:table-row-group gap-4 xl:gap-0 p-4 xl:p-0 bg-neutral-50/30 xl:bg-transparent xl:divide-y xl:divide-neutral-100">
                        {expenses.map((expense) => (
                            <tr
                                key={expense.id}
                                className="flex flex-col xl:table-row transition-colors hover:bg-neutral-50/80 bg-white xl:bg-transparent rounded-xl xl:rounded-none border border-neutral-100 xl:border-none shadow-xs xl:shadow-none overflow-hidden"
                            >
                                {/* Expense No & Vendor */}
                                <td className="px-4 py-3 xl:py-3.5 flex justify-between items-center xl:table-cell border-b border-neutral-50 xl:border-none bg-neutral-50/50 xl:bg-transparent">
                                    <span className="xl:hidden text-[10px] font-bold uppercase text-neutral-400">
                                        Expense
                                    </span>
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
                                            <Receipt className="h-3.5 w-3.5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-neutral-900 truncate max-w-[200px] sm:max-w-[240px]">
                                                {expense.expenseNumber}
                                            </p>
                                            <p className="text-[11px] text-neutral-400 truncate max-w-[200px] sm:max-w-[240px]">
                                                {expense.vendorName || "No Vendor"}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                {/* Category */}
                                <td className="px-4 py-2.5 xl:py-3.5 flex justify-between items-center xl:table-cell border-b border-neutral-50 xl:border-none">
                                    <span className="xl:hidden text-[10px] font-bold uppercase text-neutral-400">
                                        Category
                                    </span>
                                    <ExpenseCategoryBadge category={expense.category} size="sm" />
                                </td>

                                {/* Date */}
                                <td className="px-4 py-2.5 xl:py-3.5 flex justify-between items-center xl:table-cell border-b border-neutral-50 xl:border-none">
                                    <span className="xl:hidden text-[10px] font-bold uppercase text-neutral-400">
                                        Date
                                    </span>
                                    <div className="flex items-center gap-1.5 text-neutral-700 font-medium">
                                        <Calendar className="h-3 w-3 text-neutral-400 shrink-0" />
                                        <span className="whitespace-nowrap">{formatDate(expense.expenseDate)}</span>
                                    </div>
                                </td>

                                {/* Payment Method */}
                                <td className="px-4 py-2.5 xl:py-3.5 flex justify-between items-center xl:table-cell border-b border-neutral-50 xl:border-none">
                                    <span className="xl:hidden text-[10px] font-bold uppercase text-neutral-400">
                                        Payment Method
                                    </span>
                                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-100 bg-neutral-50/80 px-2.5 py-1 text-xs font-semibold text-neutral-700 shadow-2xs">
                                        <CreditCard className="h-3 w-3 text-neutral-400 shrink-0" />
                                        <span>{formatPaymentMethod(expense.paymentMethod)}</span>
                                    </div>
                                </td>

                                {/* Amount */}
                                <td className="px-4 py-2.5 xl:py-3.5 flex justify-between items-center xl:table-cell border-b border-neutral-50 xl:border-none">
                                    <span className="xl:hidden text-[10px] font-bold uppercase text-neutral-400">
                                        Amount
                                    </span>
                                    <span className="font-bold text-neutral-900 whitespace-nowrap">
                                        {formatAmount(expense.amount)}
                                    </span>
                                </td>

                                {/* Status */}
                                <td className="px-4 py-2.5 xl:py-3.5 flex justify-between items-center xl:table-cell border-b border-neutral-50 xl:border-none">
                                    <span className="xl:hidden text-[10px] font-bold uppercase text-neutral-400">
                                        Status
                                    </span>
                                    <ExpenseStatusBadge status={expense.status} size="sm" />
                                </td>

                                {/* Actions */}
                                <td className="pl-2 pr-4 py-3 xl:py-3.5 flex justify-between items-center xl:table-cell bg-neutral-50/50 xl:bg-transparent text-right">
                                    <span className="xl:hidden text-[10px] font-bold uppercase text-neutral-400">
                                        Actions
                                    </span>
                                    <div className="inline-flex items-center gap-2 justify-end w-full">
                                        {onView && (
                                            <button
                                                type="button"
                                                onClick={() => onView(expense)}
                                                title="View Expense Details"
                                                aria-label={`View expense ${expense.expenseNumber}`}
                                                className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-neutral-700 shadow-2xs transition-colors hover:bg-neutral-50 hover:text-neutral-900 cursor-pointer"
                                            >
                                                <Eye className="h-3 w-3" />
                                                <span>View</span>
                                            </button>
                                        )}

                                        {onEdit && (
                                            <button
                                                type="button"
                                                onClick={() => onEdit(expense)}
                                                title="Edit Expense"
                                                aria-label={`Edit expense ${expense.expenseNumber}`}
                                                className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-neutral-700 shadow-2xs transition-colors hover:bg-neutral-50 hover:text-neutral-900 cursor-pointer"
                                            >
                                                <Pencil className="h-3 w-3" />
                                                <span>Edit</span>
                                            </button>
                                        )}

                                        {onDelete && (
                                            <button
                                                type="button"
                                                onClick={() => onDelete(expense.id)}
                                                title="Delete Expense"
                                                aria-label={`Delete expense ${expense.expenseNumber}`}
                                                className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-400 shadow-2xs transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function ExpenseTableSkeleton() {
    return (
        <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-2xs animate-pulse">
            <div className="overflow-x-auto w-full min-w-0">
                <div className="xl:min-w-[960px]">
                    <div className="hidden xl:flex border-b border-neutral-100 bg-neutral-50/70 p-3.5 justify-between items-center">
                        <div className="h-3 w-24 rounded bg-neutral-200" />
                        <div className="h-3 w-20 rounded bg-neutral-200" />
                        <div className="h-3 w-20 rounded bg-neutral-200" />
                        <div className="h-3 w-24 rounded bg-neutral-200" />
                        <div className="h-3 w-16 rounded bg-neutral-200" />
                        <div className="h-3 w-16 rounded bg-neutral-200" />
                        <div className="h-3 w-20 rounded bg-neutral-200" />
                    </div>
                    <div className="divide-y divide-neutral-100">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between px-4 py-3.5"
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className="h-7 w-7 rounded-lg bg-neutral-100" />
                                    <div className="space-y-1">
                                        <div className="h-3.5 w-24 rounded bg-neutral-200" />
                                        <div className="h-2.5 w-16 rounded bg-neutral-100" />
                                    </div>
                                </div>
                                <div className="h-5 w-20 rounded-full bg-neutral-100" />
                                <div className="h-4 w-20 rounded bg-neutral-100" />
                                <div className="h-5 w-24 rounded-lg bg-neutral-100" />
                                <div className="h-4 w-16 rounded bg-neutral-200" />
                                <div className="h-5 w-16 rounded-full bg-neutral-100" />
                                <div className="flex gap-2">
                                    <div className="h-7 w-14 rounded-lg bg-neutral-100" />
                                    <div className="h-7 w-14 rounded-lg bg-neutral-100" />
                                    <div className="h-7 w-7 rounded-lg bg-neutral-100" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}