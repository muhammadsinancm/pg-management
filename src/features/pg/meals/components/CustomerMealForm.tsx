import { FormEvent, useState } from "react";
import { AlertCircle, Calendar, IndianRupee, Utensils } from "lucide-react";
import { CreateCustomerMealInput, MealType } from "../types/meal.types";
import { MealTypeBadge } from "./MealTypeBadge";

interface CustomerMealFormProps {
    organizationId: string;
    branchId: string;
    customerId: string;
    bookingId: string;
    mealId: string;
    mealType: MealType;
    defaultAmount: number;
    onSubmit: (data: CreateCustomerMealInput) => Promise<void>;
    onCancel?: () => void;
}

export function CustomerMealForm({
    organizationId,
    branchId,
    customerId,
    bookingId,
    mealId,
    mealType,
    defaultAmount,
    onSubmit,
    onCancel,
}: CustomerMealFormProps) {
    const [mealDate, setMealDate] = useState(new Date().toISOString().split("T")[0]);
    const [amount, setAmount] = useState(String(defaultAmount));
    const [status, setStatus] = useState<"served" | "cancelled">("served");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!mealDate) {
            setError("Meal date is required.");
            return;
        }
        if (Number(amount) < 0) {
            setError("Meal amount cannot be negative.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const data: CreateCustomerMealInput = {
                organizationId,
                branchId,
                customerId,
                bookingId,
                mealId,
                mealType,
                mealDate,
                amount: Number(amount),
                status,
            };

            await onSubmit(data);
        } catch (err) {
            console.error("Failed to create customer meal", err);
            setError(err instanceof Error ? err.message : "Failed to create customer meal");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700 shadow-2xs">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                    <span>{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Meal Type Display */}
                <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                        <Utensils className="h-3 w-3 text-neutral-400" />
                        <span>Meal Type</span>
                    </label>
                    <div className="flex h-10 items-center rounded-xl border border-neutral-200 bg-neutral-50/70 px-3.5 shadow-2xs">
                        <MealTypeBadge mealType={mealType} size="sm" />
                    </div>
                </div>

                {/* Meal Date */}
                <div>
                    <label
                        htmlFor="customerMealDate"
                        className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500"
                    >
                        <Calendar className="h-3 w-3 text-neutral-400" />
                        <span>Meal Date</span>
                    </label>
                    <input
                        id="customerMealDate"
                        type="date"
                        value={mealDate}
                        onChange={(e) => setMealDate(e.target.value)}
                        disabled={loading}
                        required
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-medium text-neutral-900 shadow-2xs outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 cursor-pointer"
                    />
                </div>

                {/* Amount */}
                <div>
                    <label
                        htmlFor="customerMealAmount"
                        className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500"
                    >
                        <IndianRupee className="h-3 w-3 text-neutral-400" />
                        <span>Amount (₹)</span>
                    </label>
                    <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                        <input
                            id="customerMealAmount"
                            type="number"
                            min="0"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            disabled={loading}
                            required
                            className="w-full rounded-xl border border-neutral-200 bg-white pl-8 pr-3.5 py-2 text-xs sm:text-sm font-mono text-neutral-900 shadow-2xs outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                        />
                    </div>
                </div>

                {/* Status */}
                <div>
                    <label
                        htmlFor="customerMealStatus"
                        className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500"
                    >
                        <span>Status</span>
                    </label>
                    <select
                        id="customerMealStatus"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as "served" | "cancelled")}
                        disabled={loading}
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs sm:text-sm font-medium text-neutral-900 shadow-2xs outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 cursor-pointer"
                    >
                        <option value="served">Served</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 border-t border-neutral-100 pt-4">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-neutral-700 shadow-2xs transition-all hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    >
                        Cancel
                    </button>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-neutral-900 px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-2xs transition-all hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                    {loading ? "Saving..." : "Record Meal"}
                </button>
            </div>
        </form>
    );
}

export default CustomerMealForm;