import { Building2, CheckCircle2, Building, Wrench } from "lucide-react";
import { Branch, BranchStatus } from "../types/branch.types";

interface BranchStatsProps {
    branches: Branch[];
    selectedStatus?: BranchStatus | "all";
    onSelectStatus?: (status: BranchStatus | "all") => void;
}

export function BranchStats({
    branches,
    selectedStatus = "all",
    onSelectStatus,
}: BranchStatsProps) {
    const totalBranches = branches.length;
    const activeBranches = branches.filter((b) => b.status === "active").length;
    const inactiveBranches = branches.filter((b) => b.status === "inactive").length;
    const maintenanceBranches = branches.filter((b) => b.status === "maintenance").length;

    const stats = [
        {
            key: "all" as const,
            title: "Total Branches",
            value: totalBranches,
            icon: Building2,
            iconColor: "text-neutral-700 bg-neutral-100",
            activeClass: "border-neutral-900 bg-neutral-50/80 shadow-xs ring-2 ring-neutral-900/10",
        },
        {
            key: "active" as const,
            title: "Active",
            value: activeBranches,
            icon: CheckCircle2,
            iconColor: "text-emerald-700 bg-emerald-50",
            activeClass: "border-emerald-600 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-600/10",
        },
        {
            key: "inactive" as const,
            title: "Inactive",
            value: inactiveBranches,
            icon: Building,
            iconColor: "text-neutral-600 bg-neutral-100",
            activeClass: "border-neutral-600 bg-neutral-50/70 shadow-xs ring-2 ring-neutral-600/10",
        },
        {
            key: "maintenance" as const,
            title: "Maintenance",
            value: maintenanceBranches,
            icon: Wrench,
            iconColor: "text-amber-700 bg-amber-50",
            activeClass: "border-amber-600 bg-amber-50/70 shadow-xs ring-2 ring-amber-600/10",
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-4 sm:gap-3">
            {stats.map((item) => {
                const Icon = item.icon;
                const isActive = selectedStatus === item.key;
                const isClickable = Boolean(onSelectStatus);

                const Content = (
                    <>
                        <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                            <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-500 uppercase tracking-wider truncate">
                                {item.title}
                            </span>
                            <div
                                className={`flex h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 shrink-0 items-center justify-center rounded-lg sm:rounded-xl transition-colors ${item.iconColor}`}
                            >
                                <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
                            </div>
                        </div>

                        <div className="mt-2 sm:mt-2.5 flex items-baseline gap-1">
                            <span className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-neutral-900">
                                {item.value}
                            </span>
                            <span className="hidden sm:inline text-[10px] font-medium text-neutral-400">
                                {item.key === "all" ? "total" : "branches"}
                            </span>
                        </div>
                    </>
                );

                if (isClickable) {
                    return (
                        <button
                            key={item.title}
                            type="button"
                            onClick={() => onSelectStatus?.(item.key)}
                            className={`group flex flex-col justify-between rounded-2xl border p-3 sm:p-3.5 lg:p-4 text-left transition-all cursor-pointer shadow-2xs min-w-0 ${
                                isActive
                                    ? item.activeClass
                                    : "border-neutral-100 bg-white hover:border-neutral-200 hover:shadow-xs"
                            }`}
                        >
                            {Content}
                        </button>
                    );
                }

                return (
                    <div
                        key={item.title}
                        className="flex flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-3 sm:p-3.5 lg:p-4 shadow-2xs min-w-0"
                    >
                        {Content}
                    </div>
                );
            })}
        </div>
    );
}

export function BranchStatsSkeleton() {
    return (
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-4 sm:gap-3 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
                <div
                    key={i}
                    className="flex min-h-[72px] sm:min-h-[82px] flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-3 sm:p-3.5 lg:p-4 shadow-2xs min-w-0"
                >
                    <div className="flex items-center justify-between">
                        <div className="h-2.5 sm:h-3 w-14 sm:w-20 rounded bg-neutral-100" />
                        <div className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 rounded-lg sm:rounded-xl bg-neutral-100" />
                    </div>
                    <div className="mt-2 sm:mt-2.5">
                        <div className="h-5 sm:h-6 w-10 sm:w-12 rounded-md bg-neutral-200" />
                    </div>
                </div>
            ))}
        </div>
    );
}