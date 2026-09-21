import {
    ArrowLeft,
    Calendar,
    Clock,
    FileText,
    IndianRupee,
    Pencil,
    Shield,
    Trash2,
    Utensils,
} from "lucide-react";
import { Meal } from "../types/meal.types";
import { MealTypeBadge } from "./MealTypeBadge";
import { MealStatusBadge } from "./MealStatusBadge";

interface MealDetailsProps {
    meal: Meal;
    onBack?: () => void;
    onEdit?: (meal: Meal) => void;
    onDelete?: (mealId: string) => void;
}

function formatDate(dateString?: string): string {
    if (!dateString) return "—";
    try {
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return dateString;
        return d.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    } catch {
        return dateString;
    }
}

function formatDateTime(dateString?: string): string {
    if (!dateString) return "—";
    try {
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return dateString;
        return d.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return dateString;
    }
}

function formatAmount(amount: number): string {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(amount);
}

export function MealDetails({ meal, onBack, onEdit, onDelete }: MealDetailsProps) {
    return (
        <div className="space-y-3 sm:space-y-4">
            {/* Top Action Bar (if actions provided) */}
            {(onBack || onEdit || onDelete) && (
                <div className="flex flex-wrap items-center justify-between gap-3">
                    {onBack ? (
                        <button
                            type="button"
                            onClick={onBack}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            <span>Back to Meals</span>
                        </button>
                    ) : (
                        <div />
                    )}

                    <div className="flex items-center gap-2">
                        {onEdit && (
                            <button
                                type="button"
                                onClick={() => onEdit(meal)}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-neutral-800 transition-all cursor-pointer"
                            >
                                <Pencil className="h-3.5 w-3.5" />
                                <span>Edit</span>
                            </button>
                        )}
                        {onDelete && (
                            <button
                                type="button"
                                onClick={() => onDelete(meal.id)}
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
                            <Utensils className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2.5">
                                <h2 className="text-base sm:text-lg font-bold text-neutral-900 leading-tight">
                                    {meal.menu || `${meal.mealType.toUpperCase()} MEAL`}
                                </h2>
                                <MealTypeBadge mealType={meal.mealType} size="sm" />
                                <MealStatusBadge status={meal.status} size="sm" />
                            </div>
                            <p className="mt-0.5 text-xs text-neutral-500">
                                Date: {formatDate(meal.mealDate)} • Amount: {formatAmount(meal.amount)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Structured Key-Value Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                        <tbody className="divide-y divide-neutral-100">
                            {/* Section 1: Overview */}
                            <tr className="border-b border-neutral-100 bg-neutral-50/70">
                                <th
                                    colSpan={4}
                                    className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500"
                                >
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                                        <span>Meal Overview</span>
                                    </div>
                                </th>
                            </tr>
                            <tr className="border-b border-neutral-100 divide-x divide-neutral-100">
                                <td className="w-[18%] bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Meal Date
                                </td>
                                <td className="w-[32%] px-4 py-2.5 font-semibold text-neutral-800">
                                    {formatDate(meal.mealDate)}
                                </td>
                                <td className="w-[18%] bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Meal Type
                                </td>
                                <td className="w-[32%] px-4 py-2.5 font-semibold text-neutral-800">
                                    <MealTypeBadge mealType={meal.mealType} size="sm" />
                                </td>
                            </tr>
                            <tr className="border-b border-neutral-100 divide-x divide-neutral-100">
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Amount
                                </td>
                                <td className="px-4 py-2.5 font-bold text-neutral-900">
                                    <span className="inline-flex items-center gap-1 font-mono">
                                        <IndianRupee className="h-3.5 w-3.5 text-neutral-400" />
                                        {formatAmount(meal.amount).replace("₹", "")}
                                    </span>
                                </td>
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Status
                                </td>
                                <td className="px-4 py-2.5 font-semibold text-neutral-800">
                                    <MealStatusBadge status={meal.status} size="sm" />
                                </td>
                            </tr>

                            {/* Section 2: Menu & Description */}
                            <tr className="border-b border-neutral-100 bg-neutral-50/70">
                                <th
                                    colSpan={4}
                                    className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500"
                                >
                                    <div className="flex items-center gap-1.5">
                                        <FileText className="h-3.5 w-3.5 text-neutral-400" />
                                        <span>Menu & Description</span>
                                    </div>
                                </th>
                            </tr>
                            <tr className="border-b border-neutral-100 divide-x divide-neutral-100">
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Menu Items
                                </td>
                                <td colSpan={3} className="px-4 py-2.5 font-medium text-neutral-900">
                                    {meal.menu || "—"}
                                </td>
                            </tr>
                            {meal.description && (
                                <tr className="border-b border-neutral-100 divide-x divide-neutral-100">
                                    <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                        Description
                                    </td>
                                    <td colSpan={3} className="px-4 py-2.5 text-xs sm:text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap">
                                        {meal.description}
                                    </td>
                                </tr>
                            )}

                            {/* Section 3: Organization & Scope */}
                            <tr className="border-b border-neutral-100 bg-neutral-50/70">
                                <th
                                    colSpan={4}
                                    className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500"
                                >
                                    <div className="flex items-center gap-1.5">
                                        <Shield className="h-3.5 w-3.5 text-neutral-400" />
                                        <span>System IDs & Scope</span>
                                    </div>
                                </th>
                            </tr>
                            <tr className="border-b border-neutral-100 divide-x divide-neutral-100">
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Meal ID
                                </td>
                                <td className="px-4 py-2.5 font-mono text-xs text-neutral-700 break-all">
                                    {meal.id}
                                </td>
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Branch ID
                                </td>
                                <td className="px-4 py-2.5 font-mono text-xs text-neutral-700 break-all">
                                    {meal.branchId || "—"}
                                </td>
                            </tr>

                            {/* Section 4: Record Timestamps */}
                            <tr className="border-b border-neutral-100 bg-neutral-50/70">
                                <th
                                    colSpan={4}
                                    className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500"
                                >
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5 text-neutral-400" />
                                        <span>Record History</span>
                                    </div>
                                </th>
                            </tr>
                            <tr className="divide-x divide-neutral-100">
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Created At
                                </td>
                                <td className="px-4 py-2.5 text-neutral-700">
                                    {formatDateTime(meal.createdAt)}
                                </td>
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Last Updated
                                </td>
                                <td className="px-4 py-2.5 text-neutral-700">
                                    {formatDateTime(meal.updatedAt)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default MealDetails;