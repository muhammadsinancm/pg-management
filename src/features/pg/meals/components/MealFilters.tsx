import { Calendar, Filter, RotateCcw } from "lucide-react";
import { MealStatus, MealType } from "../types/meal.types";

interface MealFiltersProps {
    mealType: MealType | "all";
    status: MealStatus | "all";
    date: string;
    onMealTypeChange: (value: MealType | "all") => void;
    onStatusChange: (value: MealStatus | "all") => void;
    onDateChange: (value: string) => void;
    onClear: () => void;
}

export function MealFilters({
    mealType,
    status,
    date,
    onMealTypeChange,
    onStatusChange,
    onDateChange,
    onClear,
}: MealFiltersProps) {
    const hasFilters = mealType !== "all" || status !== "all" || date !== "";

    return (
        <div className="rounded-2xl border border-neutral-100 bg-white p-3.5 sm:p-4 shadow-2xs">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 items-end">
                {/* Meal Type */}
                <div>
                    <label
                        htmlFor="mealType"
                        className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500"
                    >
                        <Filter className="h-3 w-3 text-neutral-400" />
                        <span>Meal Type</span>
                    </label>

                    <select
                        id="mealType"
                        value={mealType}
                        onChange={(e) =>
                            onMealTypeChange(e.target.value as MealType | "all")
                        }
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs sm:text-sm font-medium text-neutral-800 shadow-2xs outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 cursor-pointer"
                    >
                        <option value="all">All Types</option>
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snacks">Snacks</option>
                    </select>
                </div>

                {/* Status */}
                <div>
                    <label
                        htmlFor="status"
                        className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500"
                    >
                        <Filter className="h-3 w-3 text-neutral-400" />
                        <span>Status</span>
                    </label>

                    <select
                        id="status"
                        value={status}
                        onChange={(e) =>
                            onStatusChange(e.target.value as MealStatus | "all")
                        }
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs sm:text-sm font-medium text-neutral-800 shadow-2xs outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 cursor-pointer"
                    >
                        <option value="all">All Statuses</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="served">Served</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                {/* Date */}
                <div>
                    <label
                        htmlFor="mealDate"
                        className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500"
                    >
                        <Calendar className="h-3 w-3 text-neutral-400" />
                        <span>Date</span>
                    </label>

                    <input
                        id="mealDate"
                        type="date"
                        value={date}
                        onChange={(e) => onDateChange(e.target.value)}
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs sm:text-sm font-medium text-neutral-800 shadow-2xs outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 cursor-pointer"
                    />
                </div>

                {/* Clear */}
                <div>
                    <button
                        type="button"
                        onClick={onClear}
                        disabled={!hasFilters}
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 shadow-2xs hover:bg-neutral-50 hover:text-neutral-900 transition-colors disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                    >
                        <RotateCcw className="h-3 w-3" />
                        <span>Clear Filters</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MealFilters;