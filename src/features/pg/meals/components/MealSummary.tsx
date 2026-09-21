import { CheckCircle2, Clock, IndianRupee, Utensils, XCircle } from "lucide-react";
import { Meal, MealStatus } from "../types/meal.types";

interface MealSummaryProps {
    meals: Meal[];
    selectedStatus?: MealStatus | "all";
    onStatusSelect?: (status: MealStatus | "all") => void;
}

export function MealSummary({ meals, selectedStatus, onStatusSelect }: MealSummaryProps) {
    const totalMeals = meals.length;
    const scheduledMeals = meals.filter((m) => m.status === "scheduled").length;
    const servedMeals = meals.filter((m) => m.status === "served").length;
    const cancelledMeals = meals.filter((m) => m.status === "cancelled").length;

    const totalAmount = meals.reduce((sum, meal) => sum + Number(meal.amount || 0), 0);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const cards = [
        {
            key: "all" as const,
            title: "Total Meals",
            value: totalMeals,
            unit: "meals",
            icon: Utensils,
            iconClass: "text-neutral-700 bg-neutral-100",
            activeClass: "border-neutral-900 bg-neutral-50/80 shadow-xs ring-2 ring-neutral-900/10",
        },
        {
            key: "scheduled" as const,
            title: "Scheduled",
            value: scheduledMeals,
            unit: "meals",
            icon: Clock,
            iconClass: "text-amber-700 bg-amber-50",
            activeClass: "border-amber-600 bg-amber-50/70 shadow-xs ring-2 ring-amber-600/10",
        },
        {
            key: "served" as const,
            title: "Served",
            value: servedMeals,
            unit: "meals",
            icon: CheckCircle2,
            iconClass: "text-emerald-700 bg-emerald-50",
            activeClass: "border-emerald-600 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-600/10",
        },
        {
            key: "cancelled" as const,
            title: "Cancelled",
            value: cancelledMeals,
            unit: "meals",
            icon: XCircle,
            iconClass: "text-red-700 bg-red-50",
            activeClass: "border-red-600 bg-red-50/70 shadow-xs ring-2 ring-red-600/10",
        },
        {
            key: undefined,
            title: "Total Amount",
            value: formatCurrency(totalAmount),
            unit: undefined,
            icon: IndianRupee,
            iconClass: "text-blue-700 bg-blue-50",
            activeClass: "",
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-5 sm:gap-3">
            {cards.map((card) => {
                const Icon = card.icon;
                const isClickable = Boolean(onStatusSelect && card.key !== undefined);
                const isActive = selectedStatus !== undefined && card.key !== undefined && selectedStatus === card.key;

                const CardWrapper = isClickable ? "button" : "div";

                return (
                    <CardWrapper
                        key={card.title}
                        type={isClickable ? "button" : undefined}
                        onClick={isClickable && card.key ? () => onStatusSelect(card.key!) : undefined}
                        className={`group flex flex-col justify-between rounded-2xl border p-3 sm:p-3.5 lg:p-4 text-left transition-all shadow-2xs min-w-0 ${
                            isClickable ? "cursor-pointer" : ""
                        } ${
                            isActive
                                ? card.activeClass
                                : "border-neutral-100 bg-white hover:border-neutral-200 hover:shadow-xs"
                        }`}
                    >
                        <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                            <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-500 uppercase tracking-wider truncate">
                                {card.title}
                            </span>
                            <div
                                className={`flex h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 shrink-0 items-center justify-center rounded-lg sm:rounded-xl transition-colors ${card.iconClass}`}
                            >
                                <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
                            </div>
                        </div>

                        <div className="mt-2 sm:mt-2.5 flex items-baseline gap-1">
                            <span className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-neutral-900">
                                {card.value}
                            </span>
                            {card.unit && (
                                <span className="hidden sm:inline text-[10px] font-medium text-neutral-400">
                                    {card.unit}
                                </span>
                            )}
                        </div>
                    </CardWrapper>
                );
            })}
        </div>
    );
}

export { MealSummary as MealSummaray };
export default MealSummary;