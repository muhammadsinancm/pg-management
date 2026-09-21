import { CheckCircle2, IndianRupee, Utensils, XCircle } from "lucide-react";
import { CustomerMeal } from "../types/meal.types";

interface CustomerMealSummaryProps {
    meals: CustomerMeal[];
}

export function CustomerMealSummary({ meals }: CustomerMealSummaryProps) {
    const totalMeals = meals.length;
    const servedMeals = meals.filter((meal) => meal.status === "served").length;
    const cancelledMeals = meals.filter((meal) => meal.status === "cancelled").length;

    const totalAmount = meals
        .filter((meal) => meal.status === "served")
        .reduce((total, meal) => total + Number(meal.amount || 0), 0);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const cards = [
        {
            title: "Total Meals",
            value: totalMeals,
            unit: "meals",
            icon: Utensils,
            iconClass: "text-neutral-700 bg-neutral-100",
        },
        {
            title: "Served",
            value: servedMeals,
            unit: "meals",
            icon: CheckCircle2,
            iconClass: "text-emerald-700 bg-emerald-50",
        },
        {
            title: "Cancelled",
            value: cancelledMeals,
            unit: "meals",
            icon: XCircle,
            iconClass: "text-red-700 bg-red-50",
        },
        {
            title: "Total Amount",
            value: formatCurrency(totalAmount),
            unit: undefined,
            icon: IndianRupee,
            iconClass: "text-blue-700 bg-blue-50",
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-4 sm:gap-3">
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                    <div
                        key={card.title}
                        className="flex flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-3 sm:p-3.5 lg:p-4 text-left transition-all shadow-2xs min-w-0"
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
                    </div>
                );
            })}
        </div>
    );
}

export default CustomerMealSummary;