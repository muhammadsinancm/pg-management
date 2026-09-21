import { ShieldCheck, UserCheck, Users, UserX } from "lucide-react";
import { Staff, StaffStatus as StaffStatusType } from "../types/staff.types";

export interface StaffStatusProps {
    staff: Staff[];
    selectedStatus?: StaffStatusType | "all";
    onSelectStatus?: (status: StaffStatusType | "all") => void;
}

export function StaffStatus({
    staff,
    selectedStatus = "all",
    onSelectStatus,
}: StaffStatusProps) {
    const totalStaff = staff.length;
    const activeStaff = staff.filter((member) => member.status === "active").length;
    const inactiveStaff = staff.filter((member) => member.status === "inactive").length;
    const managerCount = staff.filter((member) => member.role === "manager").length;

    const stats = [
        {
            key: "all" as const,
            label: "Total Staff",
            value: totalStaff,
            sublabel: "team members",
            icon: Users,
            iconColor: "text-neutral-700 bg-neutral-100",
            activeClass: "border-neutral-900 bg-neutral-50/80 shadow-xs ring-2 ring-neutral-900/10",
        },
        {
            key: "active" as const,
            label: "Active Staff",
            value: activeStaff,
            sublabel: "on duty",
            icon: UserCheck,
            iconColor: "text-emerald-700 bg-emerald-50",
            activeClass: "border-emerald-600 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-600/10",
        },
        {
            key: "inactive" as const,
            label: "Inactive Staff",
            value: inactiveStaff,
            sublabel: "on leave / relieved",
            icon: UserX,
            iconColor: "text-amber-700 bg-amber-50",
            activeClass: "border-amber-600 bg-amber-50/70 shadow-xs ring-2 ring-amber-600/10",
        },
        {
            key: "manager",
            label: "Managers",
            value: managerCount,
            sublabel: "supervisors",
            icon: ShieldCheck,
            iconColor: "text-indigo-700 bg-indigo-50",
            activeClass: "border-indigo-600 bg-indigo-50/70 shadow-xs ring-2 ring-indigo-600/10",
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-4 sm:gap-3">
            {stats.map((stat) => {
                const Icon = stat.icon;
                const isSelected = selectedStatus === stat.key;
                const isClickable = Boolean(onSelectStatus) && stat.key !== "manager";

                return (
                    <div
                        key={stat.label}
                        onClick={() => {
                            if (isClickable && (stat.key === "all" || stat.key === "active" || stat.key === "inactive")) {
                                onSelectStatus?.(stat.key);
                            }
                        }}
                        role={isClickable ? "button" : undefined}
                        tabIndex={isClickable ? 0 : undefined}
                        onKeyDown={(e) => {
                            if (isClickable && (e.key === "Enter" || e.key === " ")) {
                                e.preventDefault();
                                if (stat.key === "all" || stat.key === "active" || stat.key === "inactive") {
                                    onSelectStatus?.(stat.key);
                                }
                            }
                        }}
                        className={`flex min-h-[78px] sm:min-h-[88px] flex-col justify-between rounded-2xl border p-3 sm:p-3.5 lg:p-4 shadow-2xs transition-all text-left ${
                            isClickable ? "cursor-pointer select-none" : ""
                        } ${
                            isSelected
                                ? stat.activeClass
                                : "border-neutral-200/80 bg-white hover:border-neutral-300 hover:shadow-xs"
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 truncate">
                                {stat.label}
                            </span>
                            <div
                                className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl shrink-0 ${stat.iconColor}`}
                            >
                                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </div>
                        </div>

                        <div className="mt-1.5 sm:mt-2">
                            <div className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-neutral-900 leading-tight">
                                {stat.value}
                            </div>
                            <div className="mt-0.5 flex items-center justify-between text-[11px] text-neutral-400">
                                <span>{stat.sublabel}</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}