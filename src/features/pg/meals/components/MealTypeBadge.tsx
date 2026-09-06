import { MealType } from "../types/meal.types";

interface MealTypeBadgeProps {
    mealType: MealType
}

const mealTypeLabels: Record<MealType, string> = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snacks: 'Snacks'
}

export default function MealTypeBadge({ mealType }: MealTypeBadgeProps) {
    return (
        <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            {mealTypeLabels[mealType]}
        </span>
    )
}