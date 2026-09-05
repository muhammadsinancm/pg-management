import { ExpenseCategory } from "../types/expense.types";

interface ExpenseCategoryBadgeProps {
    category: ExpenseCategory
}

const categoryLabels: Record<ExpenseCategory, string> = {
    electricity: 'Electricity',
    water: 'Water',
    internet: 'Internet',
    maintenance: 'Maintenance',
    food: 'Food',
    cleaning: 'Cleaning',
    salary: 'Salary',
    rent: 'Rent',
    supplies: 'Supplies',
    ohter: 'Other'
}

export function ExpenseCategoryBadge({ category }: ExpenseCategoryBadgeProps) {
    return (
        <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700">
            {categoryLabels[category]}
        </span>
    )
}