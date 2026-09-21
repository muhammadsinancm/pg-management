import { ExpenseCategory, ExpenseStatus } from "../types/expense.types";

interface ExpenseCategoryBadgeProps {
    category: ExpenseCategory;
    size?: "sm" | "md";
}

const categoryConfig: Record<
    string,
    { label: string; badge: string; dot: string }
> = {
    electricity: {
        label: "Electricity",
        badge: "bg-amber-50 text-amber-800 border-amber-200/80",
        dot: "bg-amber-500",
    },
    water: {
        label: "Water",
        badge: "bg-cyan-50 text-cyan-800 border-cyan-200/80",
        dot: "bg-cyan-500",
    },
    internet: {
        label: "Internet",
        badge: "bg-indigo-50 text-indigo-800 border-indigo-200/80",
        dot: "bg-indigo-500",
    },
    maintenance: {
        label: "Maintenance",
        badge: "bg-orange-50 text-orange-800 border-orange-200/80",
        dot: "bg-orange-500",
    },
    food: {
        label: "Food",
        badge: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
        dot: "bg-emerald-500",
    },
    cleaning: {
        label: "Cleaning",
        badge: "bg-teal-50 text-teal-800 border-teal-200/80",
        dot: "bg-teal-500",
    },
    salary: {
        label: "Salary",
        badge: "bg-purple-50 text-purple-800 border-purple-200/80",
        dot: "bg-purple-500",
    },
    rent: {
        label: "Rent",
        badge: "bg-blue-50 text-blue-800 border-blue-200/80",
        dot: "bg-blue-500",
    },
    supplies: {
        label: "Supplies",
        badge: "bg-rose-50 text-rose-800 border-rose-200/80",
        dot: "bg-rose-500",
    },
    other: {
        label: "Other",
        badge: "bg-neutral-100 text-neutral-700 border-neutral-200",
        dot: "bg-neutral-400",
    },
};

export function ExpenseCategoryBadge({
    category,
    size = "md",
}: ExpenseCategoryBadgeProps) {
    const key = (category || "other").toLowerCase();
    const current = categoryConfig[key] || {
        label: typeof category === "string"
            ? category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
            : "Other",
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

interface ExpenseStatusBadgeProps {
    status: ExpenseStatus | string;
    size?: "sm" | "md";
}

const statusConfig: Record<
    string,
    { label: string; badge: string; dot: string }
> = {
    paid: {
        label: "Paid",
        badge: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
        dot: "bg-emerald-500",
    },
    pending: {
        label: "Pending",
        badge: "bg-amber-50 text-amber-800 border-amber-200/80",
        dot: "bg-amber-500",
    },
    cancelled: {
        label: "Cancelled",
        badge: "bg-red-50 text-red-800 border-red-200/80",
        dot: "bg-red-500",
    },
};

export function ExpenseStatusBadge({
    status,
    size = "md",
}: ExpenseStatusBadgeProps) {
    const key = (status || "").toLowerCase();
    const current = statusConfig[key] || {
        label: typeof status === "string"
            ? status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
            : "Unknown",
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