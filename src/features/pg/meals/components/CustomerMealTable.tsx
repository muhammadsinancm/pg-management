import { Ban, Calendar, IndianRupee, Trash2, Utensils } from "lucide-react";
import { CustomerMeal } from "../types/meal.types";
import { MealTypeBadge } from "./MealTypeBadge";

interface CustomerMealTableProps {
    meals: CustomerMeal[];
    loading?: boolean;
    onCancel?: (mealId: string) => void;
    onDelete?: (mealId: string) => void;
}

function formatDate(date: string) {
    if (!date) return "—";
    try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return date;
        return d.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    } catch {
        return date;
    }
}

function formatAmount(amount: number) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(amount);
}

export function CustomerMealTable({
    meals,
    onCancel,
    onDelete,
    loading = false,
}: CustomerMealTableProps) {
    if (loading) {
        return <CustomerMealTableSkeleton />;
    }

    if (meals.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-8 xl:p-12 text-center shadow-2xs">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
                    <Utensils className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-neutral-900">
                    No customer meals found
                </h3>
                <p className="mt-1 text-xs text-neutral-400 max-w-sm mx-auto">
                    No meal records have been added for this customer yet.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-2xs">
            <div className="overflow-x-auto w-full min-w-0">
                <table className="w-full xl:min-w-[700px] text-left text-xs xl:text-sm">
                    <thead className="hidden xl:table-header-group border-b border-neutral-100 bg-neutral-50/70">
                        <tr>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Date
                            </th>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Meal Type
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
                        {meals.map((meal) => (
                            <tr
                                key={meal.id}
                                className="flex flex-col xl:table-row transition-colors hover:bg-neutral-50/80 bg-white xl:bg-transparent rounded-xl xl:rounded-none border border-neutral-100 xl:border-none shadow-xs xl:shadow-none overflow-hidden"
                            >
                                {/* Date */}
                                <td className="px-4 py-3 xl:py-3.5 flex justify-between items-center xl:table-cell border-b border-neutral-50 xl:border-none bg-neutral-50/50 xl:bg-transparent">
                                    <span className="xl:hidden text-[10px] font-bold uppercase text-neutral-400">
                                        Date
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                                            <Calendar className="h-3.5 w-3.5" />
                                        </div>
                                        <span className="font-semibold text-neutral-900 whitespace-nowrap">
                                            {formatDate(meal.mealDate)}
                                        </span>
                                    </div>
                                </td>

                                {/* Meal Type */}
                                <td className="px-4 py-2.5 xl:py-3.5 flex justify-between items-center xl:table-cell border-b border-neutral-50 xl:border-none">
                                    <span className="xl:hidden text-[10px] font-bold uppercase text-neutral-400">
                                        Meal Type
                                    </span>
                                    <div>
                                        <MealTypeBadge mealType={meal.mealType} size="sm" />
                                    </div>
                                </td>

                                {/* Amount */}
                                <td className="px-4 py-2.5 xl:py-3.5 flex justify-between items-center xl:table-cell border-b border-neutral-50 xl:border-none">
                                    <span className="xl:hidden text-[10px] font-bold uppercase text-neutral-400">
                                        Amount
                                    </span>
                                    <div className="inline-flex items-center gap-1 font-semibold text-neutral-900">
                                        <IndianRupee className="h-3 w-3 text-neutral-400 shrink-0" />
                                        <span>{formatAmount(meal.amount).replace("₹", "")}</span>
                                    </div>
                                </td>

                                {/* Status */}
                                <td className="px-4 py-2.5 xl:py-3.5 flex justify-between items-center xl:table-cell border-b border-neutral-50 xl:border-none">
                                    <span className="xl:hidden text-[10px] font-bold uppercase text-neutral-400">
                                        Status
                                    </span>
                                    <div>
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full border font-semibold tracking-tight shadow-2xs whitespace-nowrap px-2 py-0.5 text-[10px] ${
                                                meal.status === "served"
                                                    ? "bg-emerald-50 text-emerald-800 border-emerald-200/80"
                                                    : "bg-red-50 text-red-800 border-red-200/80"
                                            }`}
                                        >
                                            <span
                                                className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                                                    meal.status === "served"
                                                        ? "bg-emerald-500"
                                                        : "bg-red-500"
                                                }`}
                                            />
                                            {meal.status === "served" ? "Served" : "Cancelled"}
                                        </span>
                                    </div>
                                </td>

                                {/* Actions */}
                                <td className="pl-2 pr-4 py-3 xl:py-3.5 flex justify-between items-center xl:table-cell bg-neutral-50/50 xl:bg-transparent text-right">
                                    <span className="xl:hidden text-[10px] font-bold uppercase text-neutral-400">
                                        Actions
                                    </span>
                                    <div className="inline-flex items-center gap-2 justify-end w-full">
                                        {meal.status === "served" && onCancel && (
                                            <button
                                                type="button"
                                                onClick={() => onCancel(meal.id)}
                                                className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50/60 px-2.5 py-1.5 text-xs font-semibold text-amber-800 shadow-2xs transition-colors hover:bg-amber-100 hover:text-amber-900 cursor-pointer"
                                            >
                                                <Ban className="h-3 w-3" />
                                                <span>Cancel</span>
                                            </button>
                                        )}

                                        {onDelete && (
                                            <button
                                                type="button"
                                                onClick={() => onDelete(meal.id)}
                                                title="Delete Meal"
                                                aria-label="Delete meal"
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

export function CustomerMealTableSkeleton() {
    return (
        <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-2xs animate-pulse">
            <div className="overflow-x-auto w-full min-w-0">
                <div className="xl:min-w-[700px]">
                    <div className="hidden xl:flex border-b border-neutral-100 bg-neutral-50/70 p-3.5 justify-between items-center">
                        <div className="h-3 w-20 rounded bg-neutral-200" />
                        <div className="h-3 w-20 rounded bg-neutral-200" />
                        <div className="h-3 w-16 rounded bg-neutral-200" />
                        <div className="h-3 w-16 rounded bg-neutral-200" />
                        <div className="h-3 w-16 rounded bg-neutral-200" />
                    </div>
                    <div className="divide-y divide-neutral-100">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex flex-col xl:flex-row justify-between xl:items-center p-4 gap-3 xl:gap-0"
                            >
                                <div className="h-4 w-28 rounded bg-neutral-100" />
                                <div className="h-4 w-20 rounded bg-neutral-100" />
                                <div className="h-4 w-16 rounded bg-neutral-100" />
                                <div className="h-4 w-16 rounded bg-neutral-100" />
                                <div className="h-7 w-20 rounded bg-neutral-100" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomerMealTable;