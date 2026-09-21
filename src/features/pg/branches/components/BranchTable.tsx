import { Building2, Eye, Mail, MapPin, Pencil, Phone, Trash2, User } from "lucide-react";
import { Branch } from "../types/branch.types";
import { BranchStatusBadge } from "./BranchStatusBadge";

interface BranchTableProps {
    branches: Branch[];
    onView: (branch: Branch) => void;
    onEdit?: (branch: Branch) => void;
    onDelete?: (branch: Branch) => void;
    onAdd?: () => void;
}

export function BranchTable({
    branches,
    onView,
    onEdit,
    onDelete,
    onAdd,
}: BranchTableProps) {
    if (branches.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-8 xl:p-12 text-center shadow-2xs">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
                    <Building2 className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-neutral-900">
                    No branches found
                </h3>
                <p className="mt-1 text-xs text-neutral-400 max-w-sm mx-auto">
                    No branches match your current search and filter criteria.
                </p>
                {onAdd && (
                    <button
                        type="button"
                        onClick={onAdd}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-neutral-800 transition-all cursor-pointer"
                    >
                        + Add Branch
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-2xs">
            <div className="overflow-x-auto w-full min-w-0">
                <table className="w-full xl:min-w-[840px] text-left text-xs xl:text-sm">
                    <thead className="hidden xl:table-header-group border-b border-neutral-100 bg-neutral-50/70">
                        <tr>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Branch
                            </th>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Location
                            </th>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Contact
                            </th>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Manager
                            </th>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Status
                            </th>
                            <th className="pl-2 pr-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap text-right w-[1%]">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="flex flex-col xl:table-row-group gap-4 xl:gap-0 p-4 xl:p-0 bg-neutral-50/30 xl:bg-transparent xl:divide-y xl:divide-neutral-100">
                        {branches.map((branch) => {
                            const location = [branch.city, branch.state].filter(Boolean).join(", ") || branch.address || "—";

                            return (
                                <tr
                                    key={branch.id}
                                    className="flex flex-col xl:table-row transition-colors hover:bg-neutral-50/80 bg-white xl:bg-transparent rounded-xl xl:rounded-none border border-neutral-100 xl:border-none shadow-xs xl:shadow-none overflow-hidden"
                                >
                                    {/* Branch Name & Code */}
                                    <td className="px-4 py-3 xl:py-3.5 flex justify-between items-center xl:table-cell border-b border-neutral-50 xl:border-none bg-neutral-50/50 xl:bg-transparent">
                                        <span className="xl:hidden text-[10px] font-bold uppercase text-neutral-400">
                                            Branch
                                        </span>
                                        <div className="flex items-center gap-2.5">
                                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                                                <Building2 className="h-3.5 w-3.5" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-neutral-900 truncate max-w-[200px] sm:max-w-[250px]">
                                                    {branch.name}
                                                </p>
                                                <p className="font-mono text-[10px] font-medium text-neutral-400">
                                                    {branch.code}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Location */}
                                    <td className="px-4 py-2.5 xl:py-3.5 flex justify-between items-center xl:table-cell text-neutral-600 border-b border-neutral-50 xl:border-none">
                                        <span className="xl:hidden text-[10px] font-bold uppercase text-neutral-400">
                                            Location
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                                            <span className="truncate max-w-[180px] sm:max-w-[240px] font-medium">
                                                {location}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Contact: Phone & Email */}
                                    <td className="px-4 py-2.5 xl:py-3.5 flex justify-between items-center xl:table-cell border-b border-neutral-50 xl:border-none">
                                        <span className="xl:hidden text-[10px] font-bold uppercase text-neutral-400">
                                            Contact
                                        </span>
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-1.5 text-neutral-700 font-medium">
                                                <Phone className="h-3 w-3 text-neutral-400 shrink-0" />
                                                <span className="font-mono">{branch.phone || "—"}</span>
                                            </div>
                                            {branch.email && (
                                                <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                                                    <Mail className="h-3 w-3 text-neutral-400 shrink-0" />
                                                    <span className="truncate max-w-[180px]">{branch.email}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    {/* Manager */}
                                    <td className="px-4 py-2.5 xl:py-3.5 flex justify-between items-center xl:table-cell border-b border-neutral-50 xl:border-none">
                                        <span className="xl:hidden text-[10px] font-bold uppercase text-neutral-400">
                                            Manager
                                        </span>
                                        <div className="flex items-center gap-1.5 text-neutral-700 font-medium">
                                            <User className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                                            <span>{branch.managerName || "Unassigned"}</span>
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="px-4 py-2.5 xl:py-3.5 flex justify-between items-center xl:table-cell border-b border-neutral-50 xl:border-none">
                                        <span className="xl:hidden text-[10px] font-bold uppercase text-neutral-400">
                                            Status
                                        </span>
                                        <BranchStatusBadge status={branch.status} size="sm" />
                                    </td>

                                    {/* Actions */}
                                    <td className="pl-2 pr-4 py-3 xl:py-3.5 flex justify-between items-center xl:table-cell bg-neutral-50/50 xl:bg-transparent text-right">
                                        <span className="xl:hidden text-[10px] font-bold uppercase text-neutral-400">
                                            Actions
                                        </span>
                                        <div className="inline-flex items-center gap-2 justify-end w-full">
                                            <button
                                                type="button"
                                                onClick={() => onView(branch)}
                                                title="View Branch"
                                                aria-label={`View ${branch.name}`}
                                                className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-neutral-700 shadow-2xs transition-colors hover:bg-neutral-50 hover:text-neutral-900 cursor-pointer"
                                            >
                                                <Eye className="h-3 w-3" />
                                                <span>View</span>
                                            </button>

                                            {onEdit && (
                                                <button
                                                    type="button"
                                                    onClick={() => onEdit(branch)}
                                                    title="Edit Branch"
                                                    aria-label={`Edit ${branch.name}`}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-neutral-700 shadow-2xs transition-colors hover:bg-neutral-50 hover:text-neutral-900 cursor-pointer"
                                                >
                                                    <Pencil className="h-3 w-3" />
                                                    <span>Edit</span>
                                                </button>
                                            )}

                                            {onDelete && (
                                                <button
                                                    type="button"
                                                    onClick={() => onDelete(branch)}
                                                    title="Delete Branch"
                                                    aria-label={`Delete ${branch.name}`}
                                                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-400 shadow-2xs transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function BranchTableSkeleton() {
    return (
        <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-2xs animate-pulse">
            <div className="border-b border-neutral-100 bg-neutral-50/70 p-4">
                <div className="h-3 w-48 rounded bg-neutral-200" />
            </div>
            <div className="divide-y divide-neutral-100">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 gap-4">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="h-8 w-8 rounded-lg bg-neutral-100" />
                            <div className="space-y-1.5 flex-1">
                                <div className="h-4 w-32 rounded bg-neutral-200" />
                                <div className="h-3 w-20 rounded bg-neutral-100" />
                            </div>
                        </div>
                        <div className="hidden sm:block h-4 w-28 rounded bg-neutral-100" />
                        <div className="hidden md:block h-4 w-24 rounded bg-neutral-100" />
                        <div className="h-5 w-16 rounded-full bg-neutral-100" />
                        <div className="h-7 w-20 rounded-lg bg-neutral-100" />
                    </div>
                ))}
            </div>
        </div>
    );
}