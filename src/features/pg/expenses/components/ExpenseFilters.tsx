import { RotateCcw, Search, X } from "lucide-react";
import { ExpenseCategory, ExpenseStatus } from "../types/expense.types";

interface ExpenseFiltersProps {
    search: string;
    category: ExpenseCategory | "all";
    status: ExpenseStatus | "all";
    onSearchChange: (value: string) => void;
    onCategoryChange: (value: ExpenseCategory | "all") => void;
    onStatusChange: (value: ExpenseStatus | "all") => void;
    onClear?: () => void;
}

const categories: ExpenseCategory[] = [
    "electricity",
    "water",
    "internet",
    "maintenance",
    "food",
    "cleaning",
    "salary",
    "rent",
    "supplies",
    "other",
];

const statuses: ExpenseStatus[] = ["pending", "paid", "cancelled"];

function formatLabel(value: string) {
    return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function ExpenseFilters({
    search,
    category,
    status,
    onSearchChange,
    onCategoryChange,
    onStatusChange,
    onClear,
}: ExpenseFiltersProps) {
    const hasFilters = search.trim() !== "" || category !== "all" || status !== "all";

    return (
        <div className="w-full min-w-0 rounded-2xl border border-neutral-200/80 bg-white p-3 sm:p-4 shadow-2xs">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:items-end">
                {/* Search */}
                <div className="lg:col-span-5">
                    <label
                        htmlFor="expense-search"
                        className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700"
                    >
                        Search Expenses
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                        <input
                            id="expense-search"
                            type="text"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Search number, vendor, description, category..."
                            className="w-full rounded-xl border border-neutral-200 bg-white pl-9 pr-9 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => onSearchChange("")}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                                aria-label="Clear search"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Category Select */}
                <div className="lg:col-span-3">
                    <label
                        htmlFor="expense-category"
                        className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700"
                    >
                        Category
                    </label>
                    <select
                        id="expense-category"
                        value={category}
                        onChange={(e) =>
                            onCategoryChange(e.target.value as ExpenseCategory | "all")
                        }
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs sm:text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs cursor-pointer"
                    >
                        <option value="all">All Categories</option>
                        {categories.map((item) => (
                            <option key={item} value={item}>
                                {formatLabel(item)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status Select */}
                <div className="lg:col-span-2">
                    <label
                        htmlFor="expense-status"
                        className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700"
                    >
                        Status
                    </label>
                    <select
                        id="expense-status"
                        value={status}
                        onChange={(e) =>
                            onStatusChange(e.target.value as ExpenseStatus | "all")
                        }
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs sm:text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs cursor-pointer"
                    >
                        <option value="all">All Statuses</option>
                        {statuses.map((item) => (
                            <option key={item} value={item}>
                                {formatLabel(item)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Reset Filters */}
                <div className="lg:col-span-2 flex items-end">
                    <button
                        type="button"
                        onClick={onClear}
                        disabled={!hasFilters}
                        className={`w-full inline-flex items-center justify-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold shadow-2xs transition-all ${
                            hasFilters
                                ? "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 cursor-pointer"
                                : "border-neutral-100 bg-neutral-50 text-neutral-300 cursor-not-allowed"
                        }`}
                    >
                        <RotateCcw className="h-3 w-3" />
                        <span>Reset Filters</span>
                    </button>
                </div>
            </div>
        </div>
    );
}