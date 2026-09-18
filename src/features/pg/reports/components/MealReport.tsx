import { Utensils } from "lucide-react";
import type { MealReportData } from "../types/report.types";

interface MealReportProps {
    meals: MealReportData;
}

export function MealReport({ meals }: MealReportProps) {
    return (
        <section className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-2xs">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-3.5 py-2.5 sm:px-4 sm:py-3">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100/90 text-neutral-700">
                        <Utensils className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-neutral-700" />
                    </div>
                    <div>
                        <h2 className="text-xs sm:text-sm font-bold text-neutral-900">
                            Meal Report
                        </h2>
                        <p className="text-[10px] sm:text-[11px] text-neutral-400">
                            Meal consumption & dining revenue
                        </p>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-base sm:text-lg font-bold leading-none tracking-tight text-neutral-900">
                        ₹{meals.totalAmount.toLocaleString("en-IN")}
                    </p>
                    <p className="mt-0.5 text-[10px] font-medium text-neutral-400">
                        Total Meal Amount
                    </p>
                </div>
            </div>

            <div className="p-3.5 sm:p-4 space-y-3">
                {/* Stat Tiles Grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
                    <Stat
                        label="Total Meals"
                        value={meals.totalMeals}
                    />
                    <Stat
                        label="Breakfast"
                        value={meals.breakfast}
                    />
                    <Stat
                        label="Lunch"
                        value={meals.lunch}
                    />
                    <Stat
                        label="Dinner"
                        value={meals.dinner}
                    />
                    <Stat
                        label="Snacks"
                        value={meals.snacks}
                    />
                </div>

                {/* Total Meal Amount Highlight Card */}
                <div className="flex items-center justify-between rounded-xl bg-neutral-50/80 border border-neutral-100/80 p-3 sm:p-3.5">
                    <div>
                        <p className="text-[11px] font-medium text-neutral-500">
                            Total Meal Amount
                        </p>
                        <p className="text-[10px] text-neutral-400">
                            Combined meal fee revenue
                        </p>
                    </div>

                    <p className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900">
                        ₹{meals.totalAmount.toLocaleString("en-IN")}
                    </p>
                </div>
            </div>
        </section>
    );
}

interface StatProps {
    label: string;
    value: number;
}

function Stat({ label, value }: StatProps) {
    return (
        <div className="rounded-xl bg-neutral-50/80 border border-neutral-100/80 p-3 transition-all hover:bg-neutral-50">
            <p className="text-[11px] font-medium text-neutral-500 truncate">
                {label}
            </p>

            <p className="mt-1 text-base sm:text-lg font-bold tracking-tight text-neutral-900 truncate">
                {value}
            </p>
        </div>
    );
}