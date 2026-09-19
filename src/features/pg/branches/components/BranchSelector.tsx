import { Building2, Check, MapPin } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { Branch } from "../types/branch.types";

interface BranchSelectorProps {
    branches: Branch[];
    onChange: (branchId: string) => void;
    disabled?: boolean;
    value: string;
}

export function BranchSelector({
    branches,
    onChange,
    disabled = false,
    value,
}: BranchSelectorProps) {
    if (branches.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-6 text-center shadow-2xs">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
                    <Building2 className="h-5 w-5" />
                </div>
                <h3 className="mt-2 text-sm font-bold text-neutral-900">
                    No Branches Found
                </h3>
                <p className="mt-0.5 text-xs text-neutral-400">
                    Create a branch to start managing floors and rooms.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between px-0.5 gap-2">
                <div className="min-w-0 flex-1">
                    <h2 className="text-xs sm:text-sm font-bold tracking-tight text-neutral-900 truncate">
                        Select Branch
                    </h2>
                    <p className="text-[10px] sm:text-[11px] text-neutral-400 truncate">
                        Choose a branch to view and manage its floors & rooms
                    </p>
                </div>
                <span className="text-[10px] font-semibold text-neutral-400 shrink-0">
                    {branches.length} {branches.length === 1 ? "Branch" : "Branches"} Available
                </span>
            </div>

            {/* Interactive Branch Cards Grid */}
            <div className="grid grid-cols-1 gap-2 sm:gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {branches.map((branch) => {
                    const isSelected = branch.id === value;

                    return (
                        <button
                            key={branch.id}
                            type="button"
                            disabled={disabled}
                            onClick={() => onChange(branch.id)}
                            className={cn(
                                "group relative flex flex-col justify-between rounded-2xl border p-3.5 sm:p-4 text-left transition-all cursor-pointer shadow-2xs min-w-0",
                                isSelected
                                    ? "border-neutral-900 bg-neutral-50/70 shadow-xs ring-2 ring-neutral-900/10"
                                    : "border-neutral-100 bg-white hover:border-neutral-200 hover:shadow-xs",
                                disabled && "cursor-not-allowed opacity-60"
                            )}
                        >
                            {/* Top row: Icon & Badges */}
                            <div className="flex items-start justify-between gap-2 min-w-0">
                                <div
                                    className={cn(
                                        "flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl transition-colors",
                                        isSelected
                                            ? "bg-neutral-900 text-white"
                                            : "bg-neutral-100/90 text-neutral-700 group-hover:bg-neutral-200/80"
                                    )}
                                >
                                    <Building2 className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                    {branch.code && (
                                        <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                                            {branch.code}
                                        </span>
                                    )}
                                    {isSelected && (
                                        <span className="inline-flex items-center gap-1 rounded-md bg-neutral-900 px-2 py-0.5 text-[10px] font-bold text-white shadow-2xs">
                                            <Check className="h-2.5 w-2.5" />
                                            Active
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Middle & Bottom row: Branch Details */}
                            <div className="mt-3 min-w-0">
                                <h3 className="truncate text-sm font-bold text-neutral-900 tracking-tight">
                                    {branch.name}
                                </h3>

                                <div className="mt-1 flex items-center gap-1 text-[11px] text-neutral-400">
                                    <MapPin className="h-3 w-3 shrink-0 text-neutral-400" />
                                    <span className="truncate">
                                        {branch.city || branch.address || "All Floors"}
                                    </span>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export function BranchSelectorSkeleton() {
    return (
        <div className="space-y-2 animate-pulse">
            <div className="flex items-center justify-between px-0.5 gap-2">
                <div className="space-y-1 min-w-0 flex-1">
                    <div className="h-4 w-24 rounded bg-neutral-200" />
                    <div className="h-3 w-48 max-w-full rounded bg-neutral-100" />
                </div>
                <div className="h-3 w-28 rounded bg-neutral-100 shrink-0" />
            </div>

            <div className="grid grid-cols-1 gap-2 sm:gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-3.5 sm:p-4 shadow-2xs space-y-3 min-w-0"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-neutral-100 shrink-0" />
                            <div className="h-4 w-12 rounded bg-neutral-100 shrink-0" />
                        </div>
                        <div className="mt-3 space-y-1.5 min-w-0">
                            <div className="h-4 w-28 max-w-[80%] rounded bg-neutral-200" />
                            <div className="h-3 w-36 max-w-[90%] rounded bg-neutral-100" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}