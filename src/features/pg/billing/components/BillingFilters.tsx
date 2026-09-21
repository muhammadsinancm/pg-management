import { LayoutGrid, RotateCcw, Search, Table as TableIcon, X } from "lucide-react";
import { BillingCycle, BillingStatus } from "../types/billing.types";
import { InvoiceStatus } from "../types/invoice.types";

interface BillingFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    status: InvoiceStatus | BillingStatus | "all";
    onStatusChange: (value: any) => void;
    billingCycle?: BillingCycle | "all";
    onBillingCycleChange?: (value: BillingCycle | "all") => void;
    viewMode?: "table" | "card";
    onViewModeChange?: (mode: "table" | "card") => void;
    onReset: () => void;
}

export function BillingFilters({
    billingCycle,
    status,
    search,
    onBillingCycleChange,
    onStatusChange,
    onReset,
    onSearchChange,
    viewMode,
    onViewModeChange,
}: BillingFiltersProps) {
    return (
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                <input
                    id="billing-search"
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search by invoice #, customer ID, or notes..."
                    className="w-full rounded-xl border border-neutral-200 bg-white pl-9 pr-8 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                />
                {search && (
                    <button
                        type="button"
                        onClick={() => onSearchChange("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer p-0.5"
                    >
                        <X className="h-3 w-3" />
                    </button>
                )}
            </div>

            {/* Filter Controls & Switcher */}
            <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto flex-wrap">
                {/* Billing Cycle Filter (if provided) */}
                {billingCycle !== undefined && onBillingCycleChange && (
                    <select
                        id="billing-cycle"
                        value={billingCycle}
                        onChange={(e) => onBillingCycleChange(e.target.value as BillingCycle | "all")}
                        className="flex-1 sm:flex-initial rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-800 shadow-2xs outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 cursor-pointer"
                    >
                        <option value="all">All Cycles</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="custom">Custom</option>
                    </select>
                )}

                {/* Status Filter */}
                <select
                    id="billing-status"
                    value={status}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className="flex-1 sm:flex-initial rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-800 shadow-2xs outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 cursor-pointer"
                >
                    <option value="all">All Statuses</option>
                    <option value="paid">Paid</option>
                    <option value="partial">Partial</option>
                    <option value="issued">Issued</option>
                    <option value="draft">Draft</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                </select>

                {/* Reset Button */}
                <button
                    type="button"
                    onClick={onReset}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 shadow-2xs hover:bg-neutral-50 hover:text-neutral-900 transition-colors cursor-pointer"
                    title="Reset Filters"
                >
                    <RotateCcw className="h-3 w-3 text-neutral-400" />
                    <span className="hidden sm:inline">Reset</span>
                </button>

                {/* View Switcher (if provided) */}
                {viewMode && onViewModeChange && (
                    <div className="inline-flex items-center rounded-xl border border-neutral-200 bg-white p-0.5 shadow-2xs">
                        <button
                            type="button"
                            onClick={() => onViewModeChange("table")}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                                viewMode === "table"
                                    ? "bg-neutral-900 text-white shadow-2xs"
                                    : "text-neutral-500 hover:text-neutral-900"
                            }`}
                            title="Table View"
                        >
                            <TableIcon className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Table</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => onViewModeChange("card")}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                                viewMode === "card"
                                    ? "bg-neutral-900 text-white shadow-2xs"
                                    : "text-neutral-500 hover:text-neutral-900"
                            }`}
                            title="Card View"
                        >
                            <LayoutGrid className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Cards</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}