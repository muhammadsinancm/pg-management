import {
    Calendar,
    Eye,
    IndianRupee,
    Mail,
    Pencil,
    Phone,
    Trash2,
    User,
    Users,
} from "lucide-react";
import { Staff } from "../types/staff.types";
import { StaffStatsBadge } from "./StaffStatsBadge";
import { StaffRoleBadge } from "./StaffRoleBadge";

export interface StaffTableProps {
    staff: Staff[];
    loading?: boolean;
    onView: (staff: Staff) => void;
    onEdit: (staff: Staff) => void;
    onDelete?: (staff: Staff) => void;
    onAdd?: () => void;
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

export function StaffTable({
    staff,
    loading,
    onView,
    onEdit,
    onDelete,
    onAdd,
}: StaffTableProps) {
    if (loading) {
        return <StaffTableSkeleton />;
    }

    if (staff.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-8 xl:p-12 text-center shadow-2xs">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
                    <Users className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-neutral-900">
                    No staff found
                </h3>
                <p className="mt-1 text-xs text-neutral-400 max-w-sm mx-auto">
                    No staff members match your current search and filter criteria.
                </p>
                {onAdd && (
                    <button
                        type="button"
                        onClick={onAdd}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-neutral-800 transition-all cursor-pointer"
                    >
                        + Add Staff
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-2xs">
            {/* Scrollable table container */}
            <div className="overflow-x-auto w-full min-w-0">
                <table className="w-full xl:min-w-[840px] text-left text-xs xl:text-sm">
                    <thead className="hidden xl:table-header-group border-b border-neutral-100 bg-neutral-50/70">
                        <tr>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Staff Member
                            </th>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Role
                            </th>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Phone
                            </th>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Email
                            </th>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Salary
                            </th>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Status
                            </th>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Joined
                            </th>
                            <th className="pl-2 pr-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap text-right w-[1%]">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="flex flex-col xl:table-row-group gap-4 xl:gap-0 p-4 xl:p-0 bg-neutral-50/30 xl:bg-transparent xl:divide-y xl:divide-neutral-100">
                        {staff.map((member) => (
                            <tr
                                key={member.id}
                                className="flex flex-col xl:table-row transition-colors hover:bg-neutral-50/80 bg-white xl:bg-transparent rounded-xl xl:rounded-none border border-neutral-100 xl:border-none shadow-xs xl:shadow-none overflow-hidden"
                            >
                                {/* Name & Employee ID */}
                                <td className="px-4 py-3 xl:py-3.5 flex justify-between items-center xl:table-cell border-b border-neutral-50 xl:border-none bg-neutral-50/50 xl:bg-transparent">
                                    <span className="xl:hidden text-[10px] font-bold uppercase text-neutral-400">
                                        Staff Member
                                    </span>
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-xs font-bold text-neutral-700">
                                            {member.name ? member.name.charAt(0).toUpperCase() : <User className="h-3.5 w-3.5" />}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-neutral-900">
                                                {member.name}
                                            </div>
                                            <div className="text-[11px] font-mono text-neutral-400">
                                                {member.employeeId || "No ID"}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* Role */}
                                <td className="px-4 py-2 xl:py-3.5 flex justify-between items-center xl:table-cell border-b border-neutral-50 xl:border-none">
                                    <span className="xl:hidden text-[10px] font-bold uppercase text-neutral-400">
                                        Role
                                    </span>
                                    <StaffRoleBadge role={member.role} size="sm" />
                                </td>

                                {/* Phone */}
                                <td className="px-4 py-2 xl:py-3.5 flex justify-between items-center xl:table-cell border-b border-neutral-50 xl:border-none">
                                    <span className="xl:hidden text-[10px] font-bold uppercase text-neutral-400">
                                        Phone
                                    </span>
                                    <div className="flex items-center gap-1 font-mono font-medium text-neutral-700 text-xs">
                                        <Phone className="h-3 w-3 text-neutral-400 shrink-0" />
                                        <span>{member.phone}</span>
                                    </div>
                                </td>

                                {/* Email */}
                                <td className="px-4 py-2 xl:py-3.5 flex justify-between items-center xl:table-cell border-b border-neutral-50 xl:border-none">
                                    <span className="xl:hidden text-[10px] font-bold uppercase text-neutral-400">
                                        Email
                                    </span>
                                    <div className="flex items-center gap-1 text-neutral-600 text-xs truncate max-w-[180px]" title={member.email || ""}>
                                        {member.email ? (
                                            <>
                                                <Mail className="h-3 w-3 text-neutral-400 shrink-0" />
                                                <span className="truncate">{member.email}</span>
                                            </>
                                        ) : (
                                            <span className="text-neutral-400">—</span>
                                        )}
                                    </div>
                                </td>

                                {/* Salary */}
                                <td className="px-4 py-2 xl:py-3.5 flex justify-between items-center xl:table-cell border-b border-neutral-50 xl:border-none">
                                    <span className="xl:hidden text-[10px] font-bold uppercase text-neutral-400">
                                        Salary
                                    </span>
                                    <span className="font-semibold text-neutral-800 text-xs">
                                        {formatSalary(member.salary, member.salaryType)}
                                    </span>
                                </td>

                                {/* Status */}
                                <td className="px-4 py-2 xl:py-3.5 flex justify-between items-center xl:table-cell border-b border-neutral-50 xl:border-none">
                                    <span className="xl:hidden text-[10px] font-bold uppercase text-neutral-400">
                                        Status
                                    </span>
                                    <StaffStatsBadge status={member.status} size="sm" />
                                </td>

                                {/* Joined Date */}
                                <td className="px-4 py-2 xl:py-3.5 flex justify-between items-center xl:table-cell border-b border-neutral-50 xl:border-none">
                                    <span className="xl:hidden text-[10px] font-bold uppercase text-neutral-400">
                                        Joined
                                    </span>
                                    <span className="text-xs text-neutral-600">
                                        {formatDate(member.joinedDate)}
                                    </span>
                                </td>

                                {/* Actions */}
                                <td className="px-4 py-3 xl:py-3.5 flex justify-end items-center xl:table-cell text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            type="button"
                                            onClick={() => onView(member)}
                                            title="View Details"
                                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 shadow-2xs hover:bg-neutral-50 hover:text-neutral-900 cursor-pointer transition-colors"
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => onEdit(member)}
                                            title="Edit Staff"
                                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 shadow-2xs hover:bg-neutral-50 hover:text-neutral-900 cursor-pointer transition-colors"
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                        </button>

                                        {onDelete && (
                                            <button
                                                type="button"
                                                onClick={() => onDelete(member)}
                                                title="Delete Staff"
                                                className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-400 shadow-2xs hover:border-red-200 hover:bg-red-50 hover:text-red-600 cursor-pointer transition-colors"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function StaffTableSkeleton() {
    return (
        <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-2xs animate-pulse">
            <div className="hidden xl:block border-b border-neutral-100 bg-neutral-50/70 p-4">
                <div className="h-4 w-full rounded bg-neutral-100" />
            </div>
            <div className="divide-y divide-neutral-100 p-4 xl:p-0">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex flex-col xl:flex-row items-center justify-between p-4 gap-3">
                        <div className="flex items-center gap-3 w-full xl:w-1/4">
                            <div className="h-8 w-8 rounded-xl bg-neutral-200 shrink-0" />
                            <div className="space-y-1.5 flex-1">
                                <div className="h-3.5 w-24 rounded bg-neutral-200" />
                                <div className="h-2.5 w-16 rounded bg-neutral-100" />
                            </div>
                        </div>
                        <div className="h-5 w-16 rounded-full bg-neutral-100 hidden xl:block" />
                        <div className="h-3.5 w-24 rounded bg-neutral-100 hidden xl:block" />
                        <div className="h-3.5 w-32 rounded bg-neutral-100 hidden xl:block" />
                        <div className="h-3.5 w-20 rounded bg-neutral-100 hidden xl:block" />
                        <div className="h-5 w-14 rounded-full bg-neutral-100 hidden xl:block" />
                        <div className="h-3.5 w-20 rounded bg-neutral-100 hidden xl:block" />
                        <div className="flex gap-1">
                            <div className="h-7 w-7 rounded-lg bg-neutral-100" />
                            <div className="h-7 w-7 rounded-lg bg-neutral-100" />
                            <div className="h-7 w-7 rounded-lg bg-neutral-100" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}