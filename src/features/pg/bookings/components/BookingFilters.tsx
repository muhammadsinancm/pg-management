import { Search, X, LayoutGrid, Table as TableIcon } from "lucide-react";
import { BookingStatus } from "../types/booking.types";

interface BookingFiltersProps {
    search: string;
    status: BookingStatus | "all";
    viewMode: "table" | "card";
    onSearchChange: (value: string) => void;
    onStatusChange: (value: BookingStatus | "all") => void;
    onViewModeChange: (mode: "table" | "card") => void;
}

export function BookingFilters({
    search,
    status,
    viewMode,
    onSearchChange,
    onStatusChange,
    onViewModeChange,
}: BookingFiltersProps) {
    return (
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            {/* Left: Search input */}
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search by booking #, customer, room..."
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

            {/* Right: Status filter & View mode toggle */}
            <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                {/* Status Dropdown */}
                <select
                    value={status}
                    onChange={(e) =>
                        onStatusChange(e.target.value as BookingStatus | "all")
                    }
                    className="flex-1 sm:flex-initial rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-800 shadow-2xs outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 cursor-pointer"
                >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="checked_in">Checked In</option>
                    <option value="checked_out">Checked Out</option>
                    <option value="cancelled">Cancelled</option>
                </select>

                {/* View Mode Toggle */}
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
            </div>
        </div>
    );
}