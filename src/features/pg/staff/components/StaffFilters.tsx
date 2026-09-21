import { RotateCcw, Search, X } from "lucide-react";
import { SalaryType, StaffRole, StaffStatus } from "../types/staff.types";

export interface StaffFiltersProps {
    search: string;
    role: StaffRole | "all";
    status: StaffStatus | "all";
    salaryType: SalaryType | "all";
    onSearchChange: (value: string) => void;
    onRoleChange: (value: StaffRole | "all") => void;
    onStatusChange: (value: StaffStatus | "all") => void;
    onSalaryTypeChange: (value: SalaryType | "all") => void;
    onClear: () => void;
}

const roles: StaffRole[] = [
    "manager",
    "reception",
    "cook",
    "cleaner",
    "security",
    "maintenance",
];

const statuses: StaffStatus[] = ["active", "inactive"];

const salaryTypes: SalaryType[] = ["monthly", "weekly", "daily"];

function formatRoleLabel(role: string) {
    return role.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function StaffFilters({
    search,
    role,
    status,
    salaryType,
    onSearchChange,
    onRoleChange,
    onStatusChange,
    onSalaryTypeChange,
    onClear,
}: StaffFiltersProps) {
    const hasFilters =
        search.trim() !== "" || role !== "all" || status !== "all" || salaryType !== "all";

    return (
        <div className="w-full min-w-0 rounded-2xl border border-neutral-200/80 bg-white p-3 sm:p-4 shadow-2xs">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:items-end">
                {/* Search */}
                <div className="lg:col-span-4">
                    <label
                        htmlFor="staff-search"
                        className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700"
                    >
                        Search Staff
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                        <input
                            id="staff-search"
                            type="text"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Name, phone, employee ID, email..."
                            className="w-full rounded-xl border border-neutral-200 bg-white pl-9 pr-9 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => onSearchChange("")}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer p-0.5"
                                aria-label="Clear search"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Role Select */}
                <div className="lg:col-span-3">
                    <label
                        htmlFor="staff-role"
                        className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700"
                    >
                        Role
                    </label>
                    <select
                        id="staff-role"
                        value={role}
                        onChange={(e) =>
                            onRoleChange(e.target.value as StaffRole | "all")
                        }
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs sm:text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs cursor-pointer"
                    >
                        <option value="all">All Roles</option>
                        {roles.map((r) => (
                            <option key={r} value={r}>
                                {formatRoleLabel(r)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status Select */}
                <div className="lg:col-span-2">
                    <label
                        htmlFor="staff-status"
                        className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700"
                    >
                        Status
                    </label>
                    <select
                        id="staff-status"
                        value={status}
                        onChange={(e) =>
                            onStatusChange(e.target.value as StaffStatus | "all")
                        }
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs sm:text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs cursor-pointer"
                    >
                        <option value="all">All Statuses</option>
                        {statuses.map((s) => (
                            <option key={s} value={s}>
                                {s === "active" ? "Active" : "Inactive"}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Salary Type Select */}
                <div className="lg:col-span-2">
                    <label
                        htmlFor="staff-salary-type"
                        className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700"
                    >
                        Salary Type
                    </label>
                    <select
                        id="staff-salary-type"
                        value={salaryType}
                        onChange={(e) =>
                            onSalaryTypeChange(e.target.value as SalaryType | "all")
                        }
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs sm:text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs cursor-pointer"
                    >
                        <option value="all">All Types</option>
                        {salaryTypes.map((st) => (
                            <option key={st} value={st}>
                                {formatRoleLabel(st)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Reset Filters */}
                <div className="lg:col-span-1 flex items-end">
                    <button
                        type="button"
                        onClick={onClear}
                        disabled={!hasFilters}
                        title="Reset Filters"
                        className={`w-full inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold shadow-2xs transition-all ${
                            hasFilters
                                ? "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 cursor-pointer"
                                : "border-neutral-100 bg-neutral-50 text-neutral-300 cursor-not-allowed"
                        }`}
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span className="lg:hidden">Reset</span>
                    </button>
                </div>
            </div>
        </div>
    );
}