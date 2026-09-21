import { FormEvent, useEffect, useState } from "react";
import { AlertCircle, Building2, CreditCard, Receipt } from "lucide-react";
import {
    CreateExpenseInput,
    Expense,
    ExpenseCategory,
    ExpensePaymentMethod,
    ExpenseStatus,
    UpdateExpenseInput,
} from "../types/expense.types";

interface ExpenseFormProps {
    expense?: Expense;
    organizationId: string;
    branchId: string;
    onSubmit: (data: CreateExpenseInput | UpdateExpenseInput) => Promise<void>;
    onCancel?: () => void;
    loading?: boolean;
}

const categories: ExpenseCategory[] = [
    "electricity",
    "water",
    "internet",
    "maintenance",
    "food",
    "cleaning",
    "salary",
    "rent",
    "supplies",
    "other",
];

const paymentMethods: { value: ExpensePaymentMethod; label: string }[] = [
    { value: "cash", label: "Cash" },
    { value: "upi", label: "UPI" },
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "card", label: "Debit / Credit Card" },
];

const statuses: { value: ExpenseStatus; label: string }[] = [
    { value: "paid", label: "Paid" },
    { value: "pending", label: "Pending" },
    { value: "cancelled", label: "Cancelled" },
];

function getToday(): string {
    return new Date().toISOString().split("T")[0];
}

export function ExpenseForm({
    expense,
    organizationId,
    branchId,
    onSubmit,
    onCancel,
    loading = false,
}: ExpenseFormProps) {
    const isEditMode = Boolean(expense);

    const [category, setCategory] = useState<ExpenseCategory>(expense?.category ?? "electricity");
    const [customCategory, setCustomCategory] = useState<string>("");
    const [amount, setAmount] = useState<string>(expense?.amount?.toString() ?? "");
    const [expenseDate, setExpenseDate] = useState<string>(
        expense?.expenseDate ? expense.expenseDate.split("T")[0] : getToday()
    );
    const [paymentMethod, setPaymentMethod] = useState<ExpensePaymentMethod>(
        expense?.paymentMethod ?? "cash"
    );
    const [status, setStatus] = useState<ExpenseStatus>(expense?.status ?? "paid");
    const [vendorName, setVendorName] = useState<string>(expense?.vendorName ?? "");
    const [description, setDescription] = useState<string>(expense?.description ?? "");
    const [referenceNumber, setReferenceNumber] = useState<string>(expense?.referenceNumber ?? "");
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        if (!expense) return;

        setCategory(expense.category);
        setAmount(expense.amount ? expense.amount.toString() : "");
        setExpenseDate(expense.expenseDate ? expense.expenseDate.split("T")[0] : getToday());
        setPaymentMethod(expense.paymentMethod);
        setStatus(expense.status);
        setVendorName(expense.vendorName ?? "");
        setDescription(expense.description ?? "");
        setReferenceNumber(expense.referenceNumber ?? "");
    }, [expense]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setFormError(null);

        if (category === "other" && !customCategory.trim()) {
            setFormError("Please enter a custom category name.");
            return;
        }

        const finalCategory: ExpenseCategory =
            category === "other" ? customCategory.trim() : category;

        const numericAmount = Number(amount);
        if (!amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
            setFormError("Amount must be a valid number greater than 0.");
            return;
        }

        if (!expenseDate) {
            setFormError("Expense date is required.");
            return;
        }

        try {
            if (isEditMode && expense) {
                const updateData: UpdateExpenseInput = {
                    category: finalCategory,
                    amount: numericAmount,
                    expenseDate,
                    paymentMethod,
                    status,
                    vendorName: vendorName.trim() || undefined,
                    description: description.trim() || undefined,
                    referenceNumber: referenceNumber.trim() || undefined,
                };
                await onSubmit(updateData);
            } else {
                const createData: CreateExpenseInput = {
                    organizationId,
                    branchId,
                    category: finalCategory,
                    amount: numericAmount,
                    expenseDate,
                    paymentMethod,
                    status,
                    vendorName: vendorName.trim() || undefined,
                    description: description.trim() || undefined,
                    referenceNumber: referenceNumber.trim() || undefined,
                };
                await onSubmit(createData);
            }
        } catch (error) {
            setFormError(error instanceof Error ? error.message : "Failed to save expense.");
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {formError && (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700 shadow-2xs">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                    <span>{formError}</span>
                </div>
            )}

            {/* 1. Basic Expense Information */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                    <Receipt className="h-4 w-4 text-neutral-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                        Expense Information
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {/* Category */}
                    <div>
                        <label
                            htmlFor="category"
                            className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700"
                        >
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => {
                                setCategory(e.target.value as ExpenseCategory);
                                if (e.target.value !== "other") {
                                    setCustomCategory("");
                                }
                            }}
                            disabled={loading}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs cursor-pointer"
                        >
                            {categories.map((item) => (
                                <option key={item} value={item}>
                                    {item.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                                </option>
                            ))}
                        </select>

                        {category === "other" && (
                            <input
                                type="text"
                                value={customCategory}
                                onChange={(e) => setCustomCategory(e.target.value)}
                                placeholder="Enter custom category name"
                                disabled={loading}
                                className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                            />
                        )}
                    </div>

                    {/* Amount */}
                    <div>
                        <label
                            htmlFor="amount"
                            className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700"
                        >
                            Amount (₹) <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="amount"
                            type="number"
                            min="0"
                            step="any"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            required
                            disabled={loading}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs font-semibold"
                        />
                    </div>

                    {/* Expense Date */}
                    <div>
                        <label
                            htmlFor="expenseDate"
                            className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700"
                        >
                            Expense Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="expenseDate"
                            type="date"
                            value={expenseDate}
                            onChange={(e) => setExpenseDate(e.target.value)}
                            required
                            disabled={loading}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* 2. Payment & Accounting */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                    <CreditCard className="h-4 w-4 text-neutral-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                        Payment & Accounting
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {/* Payment Method */}
                    <div>
                        <label
                            htmlFor="paymentMethod"
                            className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700"
                        >
                            Payment Method <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="paymentMethod"
                            value={paymentMethod}
                            onChange={(e) =>
                                setPaymentMethod(e.target.value as ExpensePaymentMethod)
                            }
                            disabled={loading}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs cursor-pointer"
                        >
                            {paymentMethods.map((m) => (
                                <option key={m.value} value={m.value}>
                                    {m.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status */}
                    <div>
                        <label
                            htmlFor="status"
                            className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700"
                        >
                            Payment Status <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as ExpenseStatus)}
                            disabled={loading}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs cursor-pointer"
                        >
                            {statuses.map((s) => (
                                <option key={s.value} value={s.value}>
                                    {s.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Reference Number */}
                    <div>
                        <label
                            htmlFor="referenceNumber"
                            className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700"
                        >
                            Reference / Transaction No.
                        </label>
                        <input
                            id="referenceNumber"
                            type="text"
                            value={referenceNumber}
                            onChange={(e) => setReferenceNumber(e.target.value)}
                            placeholder="e.g. TXN987654 or Bill #12"
                            disabled={loading}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                        />
                    </div>
                </div>
            </div>

            {/* 3. Vendor & Description */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                    <Building2 className="h-4 w-4 text-neutral-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                        Vendor & Description
                    </h3>
                </div>

                <div className="space-y-4">
                    <div>
                        <label
                            htmlFor="vendorName"
                            className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700"
                        >
                            Vendor / Supplier Name
                        </label>
                        <input
                            id="vendorName"
                            type="text"
                            value={vendorName}
                            onChange={(e) => setVendorName(e.target.value)}
                            placeholder="e.g. BESCOM / Supermarket / Electrician"
                            disabled={loading}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700"
                        >
                            Description / Notes
                        </label>
                        <textarea
                            id="description"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Provide any additional notes or details about this expense..."
                            disabled={loading}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                        />
                    </div>
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-100">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 shadow-2xs hover:bg-neutral-50 transition-all cursor-pointer disabled:opacity-50"
                    >
                        Cancel
                    </button>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-neutral-800 transition-all disabled:opacity-50 cursor-pointer"
                >
                    {loading ? (
                        <span>Saving...</span>
                    ) : (
                        <span>{isEditMode ? "Update Expense" : "Create Expense"}</span>
                    )}
                </button>
            </div>
        </form>
    );
}