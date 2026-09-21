import {
    ArrowLeft,
    Building2,
    Calendar,
    CreditCard,
    FileText,
    Pencil,
    Receipt,
    Shield,
    Trash2,
} from "lucide-react";
import { Expense } from "../types/expense.types";
import { ExpenseCategoryBadge, ExpenseStatusBadge } from "./ExpenseCategoryBadge";

interface ExpenseDetailsProps {
    expense: Expense;
    onBack?: () => void;
    onEdit?: (expense: Expense) => void;
    onDelete?: (expenseId: string) => void;
}

function formatPaymentMethod(method?: string) {
    if (!method) return "—";
    const labels: Record<string, string> = {
        cash: "Cash",
        upi: "UPI",
        bank_transfer: "Bank Transfer",
        card: "Credit / Debit Card",
    };
    return labels[method] || method.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatAmount(amount: number) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(amount);
}

function formatDate(dateString?: string) {
    if (!dateString) return "—";
    const parsedDate = new Date(dateString);
    if (Number.isNaN(parsedDate.getTime())) return "—";
    return parsedDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function formatDateTime(dateString?: string) {
    if (!dateString) return "—";
    const parsedDate = new Date(dateString);
    if (Number.isNaN(parsedDate.getTime())) return "—";
    return parsedDate.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function ExpenseDetails({
    expense,
    onBack,
    onEdit,
    onDelete,
}: ExpenseDetailsProps) {
    return (
        <div className="space-y-3 sm:space-y-4">
            {/* Top Action Bar */}
            {(onBack || onEdit || onDelete) && (
                <div className="flex flex-wrap items-center justify-between gap-3">
                    {onBack ? (
                        <button
                            type="button"
                            onClick={onBack}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            <span>Back to Expenses</span>
                        </button>
                    ) : (
                        <div />
                    )}

                    <div className="flex items-center gap-2">
                        {onEdit && (
                            <button
                                type="button"
                                onClick={() => onEdit(expense)}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-neutral-800 transition-all cursor-pointer"
                            >
                                <Pencil className="h-3.5 w-3.5" />
                                <span>Edit Expense</span>
                            </button>
                        )}

                        {onDelete && (
                            <button
                                type="button"
                                onClick={() => onDelete(expense.id)}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 shadow-2xs hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all cursor-pointer"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Delete</span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Single Unified Container */}
            <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-2xs">
                {/* Header Strip inside the container */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 bg-neutral-50/50 px-4 py-3.5 sm:px-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-2xs">
                            <Receipt className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-base sm:text-lg font-bold text-neutral-900 leading-tight">
                                    {expense.expenseNumber}
                                </h2>
                                <ExpenseCategoryBadge category={expense.category} size="sm" />
                                <ExpenseStatusBadge status={expense.status} size="sm" />
                            </div>
                            <p className="mt-0.5 text-xs text-neutral-500">
                                {expense.vendorName ? `Vendor: ${expense.vendorName}` : "Operational Expense"}
                                {expense.referenceNumber ? ` • Ref: ${expense.referenceNumber}` : ""}
                            </p>
                        </div>
                    </div>

                    <div className="text-right">
                        <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                            Total Amount
                        </span>
                        <span className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                            {formatAmount(expense.amount)}
                        </span>
                    </div>
                </div>

                {/* Compact Details Table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[620px] text-left text-xs sm:text-sm border-collapse">
                        <tbody>
                            {/* Section 1: Overview & Financial Information */}
                            <tr className="border-b border-neutral-100 bg-neutral-50/70">
                                <th
                                    colSpan={4}
                                    className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500"
                                >
                                    <div className="flex items-center gap-1.5">
                                        <CreditCard className="h-3.5 w-3.5 text-neutral-400" />
                                        <span>Payment & Financial Overview</span>
                                    </div>
                                </th>
                            </tr>
                            <tr className="border-b border-neutral-100 divide-x divide-neutral-100">
                                <td className="w-1/6 bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Amount
                                </td>
                                <td className="w-2/6 px-4 py-2.5 font-bold text-neutral-900">
                                    {formatAmount(expense.amount)}
                                </td>
                                <td className="w-1/6 bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Expense Date
                                </td>
                                <td className="w-2/6 px-4 py-2.5 font-semibold text-neutral-800">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                                        <span>{formatDate(expense.expenseDate)}</span>
                                    </div>
                                </td>
                            </tr>
                            <tr className="border-b border-neutral-100 divide-x divide-neutral-100">
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Category
                                </td>
                                <td className="px-4 py-2.5 font-semibold text-neutral-800">
                                    <ExpenseCategoryBadge category={expense.category} size="sm" />
                                </td>
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Payment Method
                                </td>
                                <td className="px-4 py-2.5 font-semibold text-neutral-800">
                                    {formatPaymentMethod(expense.paymentMethod)}
                                </td>
                            </tr>
                            <tr className="border-b border-neutral-100 divide-x divide-neutral-100">
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Status
                                </td>
                                <td className="px-4 py-2.5 font-semibold text-neutral-800">
                                    <ExpenseStatusBadge status={expense.status} size="sm" />
                                </td>
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Reference No.
                                </td>
                                <td className="px-4 py-2.5 font-mono text-neutral-700">
                                    {expense.referenceNumber || "—"}
                                </td>
                            </tr>

                            {/* Section 2: Vendor & Additional Details */}
                            <tr className="border-b border-neutral-100 bg-neutral-50/70">
                                <th
                                    colSpan={4}
                                    className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500"
                                >
                                    <div className="flex items-center gap-1.5">
                                        <Building2 className="h-3.5 w-3.5 text-neutral-400" />
                                        <span>Vendor & Description</span>
                                    </div>
                                </th>
                            </tr>
                            <tr className="border-b border-neutral-100 divide-x divide-neutral-100">
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Vendor / Supplier
                                </td>
                                <td colSpan={3} className="px-4 py-2.5 font-semibold text-neutral-800">
                                    {expense.vendorName || "—"}
                                </td>
                            </tr>
                            <tr className="border-b border-neutral-100 divide-x divide-neutral-100">
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 align-top">
                                    Description
                                </td>
                                <td colSpan={3} className="px-4 py-2.5 text-neutral-700 whitespace-pre-wrap leading-relaxed">
                                    {expense.description || "No description provided."}
                                </td>
                            </tr>

                            {/* Section 3: Audit & Metadata */}
                            <tr className="border-b border-neutral-100 bg-neutral-50/70">
                                <th
                                    colSpan={4}
                                    className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500"
                                >
                                    <div className="flex items-center gap-1.5">
                                        <Shield className="h-3.5 w-3.5 text-neutral-400" />
                                        <span>System Record Information</span>
                                    </div>
                                </th>
                            </tr>
                            <tr className="border-b border-neutral-100 divide-x divide-neutral-100">
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Expense ID
                                </td>
                                <td className="px-4 py-2.5 font-mono text-neutral-600 break-all">
                                    {expense.id}
                                </td>
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Branch ID
                                </td>
                                <td className="px-4 py-2.5 font-mono text-neutral-600 break-all">
                                    {expense.branchId || "—"}
                                </td>
                            </tr>
                            {(expense.createdAt || expense.updatedAt) && (
                                <tr className="divide-x divide-neutral-100">
                                    <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                        Created At
                                    </td>
                                    <td className="px-4 py-2.5 text-neutral-600">
                                        {formatDateTime(expense.createdAt)}
                                    </td>
                                    <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                        Updated At
                                    </td>
                                    <td className="px-4 py-2.5 text-neutral-600">
                                        {formatDateTime(expense.updatedAt)}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}