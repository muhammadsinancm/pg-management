import { MealType } from "../types/meal.types";

interface MealTypeBadgeProps {
    mealType: MealType | string;
    size?: "sm" | "md";
}

const mealTypeConfig: Record<
    MealType,
    { label: string; badge: string; dot: string }
> = {
    breakfast: {
        label: "Breakfast",
        badge: "bg-amber-50 text-amber-800 border-amber-200/80",
        dot: "bg-amber-500",
    },
    lunch: {
        label: "Lunch",
        badge: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
        dot: "bg-emerald-500",
    },
    dinner: {
        label: "Dinner",
        badge: "bg-indigo-50 text-indigo-800 border-indigo-200/80",
        dot: "bg-indigo-500",
    },
    snacks: {
        label: "Snacks",
        badge: "bg-purple-50 text-purple-800 border-purple-200/80",
        dot: "bg-purple-500",
    },
};

export function MealTypeBadge({ mealType, size = "md" }: MealTypeBadgeProps) {
    const current = mealTypeConfig[mealType as MealType] || {
        label: typeof mealType === "string" ? mealType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) : "Unknown",
        badge: "bg-neutral-100 text-neutral-700 border-neutral-200",
        dot: "bg-neutral-400",
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border font-semibold tracking-tight shadow-2xs whitespace-nowrap shrink-0 ${
                size === "sm"
                    ? "px-2 py-0.5 text-[10px]"
                    : "px-2.5 py-1 text-xs"
            } ${current.badge}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${current.dot}`} />
            {current.label}
        </span>
    );
}

export default MealTypeBadge;