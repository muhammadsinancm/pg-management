import {
    ArrowRight,
    Calendar,
    IndianRupee,
    Mail,
    Pencil,
    Phone,
    Trash2,
    User,
} from "lucide-react";
import { Staff } from "../types/staff.types";
import { StaffStatsBadge } from "./StaffStatsBadge";
import { StaffRoleBadge } from "./StaffRoleBadge";

export interface StaffCardProps {
    staff: Staff;
    onView: (staff: Staff) => void;
    onEdit: (staff: Staff) => void;
    onDelete?: (staff: Staff) => void;
}

function formatSalary(salary: number, salaryType: Staff["salaryType"]): string {
    const formattedAmount = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(salary);

    return `${formattedAmount} / ${salaryType}`;
}

function formatDate(dateString?: string): string {
    if (!dateString) return "—";
    try {
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return dateString;
        return d.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    } catch {
        return dateString;
    }
}

export function StaffCard({ staff, onView, onEdit, onDelete }: StaffCardProps) {
    return (
        <div className="flex flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-3.5 sm:p-4 shadow-2xs transition-all hover:border-neutral-200 hover:shadow-xs min-w-0">
            <div>
                {/* Header: Avatar, Name & Status */}
                <div className="flex items-start justify-between gap-2 border-b border-neutral-100 pb-3 min-w-0">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700 font-bold text-sm">
                            {staff.name ? staff.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="truncate font-bold text-sm sm:text-base text-neutral-900" title={staff.name}>
                                {staff.name}
                            </h3>
                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-500">
                                <span className="font-mono">{staff.employeeId || "No ID"}</span>
                                <span>•</span>
                                <StaffRoleBadge role={staff.role} size="sm" />
                            </div>
                        </div>
                    </div>
                    <StaffStatsBadge status={staff.status} size="sm" />
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-neutral-50/70 p-2.5 text-xs mt-3">
                    {/* Phone */}
                    <div className="min-w-0">
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                            <Phone className="h-3 w-3 shrink-0 text-neutral-400" />
                            <span>Phone</span>
                        </span>
                        <p className="mt-0.5 truncate font-semibold text-neutral-800 text-xs font-mono">
                            {staff.phone}
                        </p>
                    </div>

                    {/* Email */}
                    <div className="min-w-0">
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                            <Mail className="h-3 w-3 shrink-0 text-neutral-400" />
                            <span>Email</span>
                        </span>
                        <p className="mt-0.5 truncate font-semibold text-neutral-800 text-xs" title={staff.email || "Not provided"}>
                            {staff.email || "—"}
                        </p>
                    </div>

                    {/* Salary */}
                    <div className="min-w-0 pt-1.5 border-t border-neutral-100/80">
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                            <IndianRupee className="h-3 w-3 shrink-0 text-neutral-400" />
                            <span>Salary</span>
                        </span>
                        <p className="mt-0.5 truncate font-semibold text-neutral-800 text-xs">
                            {formatSalary(staff.salary, staff.salaryType)}
                        </p>
                    </div>

                    {/* Joined Date */}
                    <div className="min-w-0 pt-1.5 border-t border-neutral-100/80">
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                            <Calendar className="h-3 w-3 shrink-0 text-neutral-400" />
                            <span>Joined</span>
                        </span>
                        <p className="mt-0.5 truncate font-semibold text-neutral-800 text-xs">
                            {formatDate(staff.joinedDate)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center gap-2 pt-3 min-w-0 border-t border-neutral-100 mt-3">
                <button
                    type="button"
                    onClick={() => onView(staff)}
                    className="flex-1 min-w-0 inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 py-2 px-3 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-neutral-800 cursor-pointer"
                >
                    <span className="truncate">View Details</span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                </button>

                <button
                    type="button"
                    onClick={() => onEdit(staff)}
                    title="Edit Staff"
                    aria-label={`Edit ${staff.name}`}
                    className="inline-flex items-center justify-center gap-1 rounded-xl border border-neutral-200 bg-white py-2 px-2.5 text-xs font-semibold text-neutral-700 shadow-2xs transition-colors hover:bg-neutral-50 hover:text-neutral-900 cursor-pointer"
                >
                    <Pencil className="h-3.5 w-3.5" />
                    <span className="hidden xs:inline">Edit</span>
                </button>

                {onDelete && (
                    <button
                        type="button"
                        onClick={() => onDelete(staff)}
                        title="Delete Staff"
                        aria-label={`Delete ${staff.name}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-400 shadow-2xs transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 cursor-pointer shrink-0"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>
        </div>
    );
}

export function StaffCardSkeleton() {
    return (
        <div className="flex flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-3.5 sm:p-4 shadow-2xs animate-pulse min-w-0">
            <div>
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                    <div className="flex items-center gap-2.5 flex-1">
                        <div className="h-9 w-9 rounded-xl bg-neutral-100 shrink-0" />
                        <div className="space-y-1.5 flex-1">
                            <div className="h-4 w-28 rounded bg-neutral-200" />
                            <div className="h-3 w-20 rounded bg-neutral-100" />
                        </div>
                    </div>
                    <div className="h-5 w-16 rounded-full bg-neutral-100" />
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-xl bg-neutral-50/70 p-2.5 mt-3">
                    <div className="space-y-1">
                        <div className="h-2.5 w-10 rounded bg-neutral-200" />
                        <div className="h-3.5 w-20 rounded bg-neutral-100" />
                    </div>
                    <div className="space-y-1">
                        <div className="h-2.5 w-10 rounded bg-neutral-200" />
                        <div className="h-3.5 w-20 rounded bg-neutral-100" />
                    </div>
                    <div className="space-y-1 pt-1.5 border-t border-neutral-100">
                        <div className="h-2.5 w-10 rounded bg-neutral-200" />
                        <div className="h-3.5 w-14 rounded bg-neutral-100" />
                    </div>
                    <div className="space-y-1 pt-1.5 border-t border-neutral-100">
                        <div className="h-2.5 w-10 rounded bg-neutral-200" />
                        <div className="h-3.5 w-16 rounded bg-neutral-100" />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-neutral-100 mt-3">
                <div className="h-8 flex-1 rounded-xl bg-neutral-200" />
                <div className="h-8 w-14 rounded-xl bg-neutral-100" />
                <div className="h-8 w-8 rounded-xl bg-neutral-100" />
            </div>
        </div>
    );
}