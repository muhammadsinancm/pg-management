import { Eye, Mail, MapPin, Pencil, Phone, ShieldCheck, Trash2, User, Users } from "lucide-react";
import { Guest } from "../types/guests.types";
import { GuestStatusBadge } from "./GuestStatusBadge";

interface GuestTableProps {
    guests: Guest[];
    onView: (guest: Guest) => void;
    onEdit: (guest: Guest) => void;
    onDelete?: (guest: Guest) => void;
    onAdd?: () => void;
}

function formatIdType(idType?: Guest["idType"]): string {
    if (!idType) return "ID";
    const labels: Record<string, string> = {
        aadhar: "Aadhaar",
        passport: "Passport",
        driving_license: "Driving License",
        voter_id: "Voter ID",
        other: "Other",
    };
    return labels[idType] || idType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export function GuestTable({
    guests,
    onView,
    onEdit,
    onDelete,
    onAdd,
}: GuestTableProps) {
    if (guests.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-8 lg:p-12 text-center shadow-2xs">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
                    <Users className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-neutral-900">
                    No guests found
                </h3>
                <p className="mt-1 text-xs text-neutral-400 max-w-sm mx-auto">
                    No guests match your current search and filter criteria.
                </p>
                {onAdd && (
                    <button
                        type="button"
                        onClick={onAdd}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-neutral-800 transition-all cursor-pointer"
                    >
                        + Add Guest
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-2xs">
            {/* Scrollable table container */}
            <div className="overflow-x-auto w-full min-w-0">
                <table className="w-full lg:min-w-[840px] text-left text-xs lg:text-sm">
                    <thead className="hidden lg:table-header-group border-b border-neutral-100 bg-neutral-50/70">
                        <tr>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Guest
                            </th>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Phone
                            </th>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Email
                            </th>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Identification
                            </th>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Location
                            </th>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Status
                            </th>
                            <th className="pl-2 pr-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="flex flex-col lg:table-row-group gap-4 lg:gap-0 p-4 lg:p-0 bg-neutral-50/30 lg:bg-transparent lg:divide-y lg:divide-neutral-100">
                        {guests.map((guest) => {
                            const location = [guest.city, guest.state].filter(Boolean).join(", ") || "—";

                            return (
                                <tr
                                    key={guest.id}
                                    className="flex flex-col lg:table-row transition-colors hover:bg-neutral-50/80 bg-white lg:bg-transparent rounded-xl lg:rounded-none border border-neutral-100 lg:border-none shadow-xs lg:shadow-none overflow-hidden"
                                >
                                    {/* Guest Name & Gender */}
                                    <td className="px-4 py-3 lg:py-3.5 flex justify-between items-center lg:table-cell border-b border-neutral-50 lg:border-none bg-neutral-50/50 lg:bg-transparent">
                                        <span className="lg:hidden text-[10px] font-bold uppercase text-neutral-400">
                                            Guest
                                        </span>
                                        <div className="flex items-center gap-2.5">
                                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                                                <User className="h-3.5 w-3.5" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-neutral-900 text-xs truncate">
                                                    {guest.fullName}
                                                </p>
                                                {guest.gender && (
                                                    <p className="text-[10px] font-medium text-neutral-400 capitalize">
                                                        {guest.gender}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Phone */}
                                    <td className="px-4 py-2.5 lg:py-3.5 flex justify-between items-center lg:table-cell border-b border-neutral-50 lg:border-none">
                                        <span className="lg:hidden text-[10px] font-bold uppercase text-neutral-400">
                                            Phone
                                        </span>
                                        <div className="flex items-center gap-1.5 text-neutral-700 font-medium text-xs">
                                            <Phone className="h-3 w-3 text-neutral-400 shrink-0" />
                                            <span className="font-mono">{guest.phone}</span>
                                        </div>
                                    </td>

                                    {/* Email */}
                                    <td className="px-4 py-2.5 lg:py-3.5 flex justify-between items-center lg:table-cell border-b border-neutral-50 lg:border-none">
                                        <span className="lg:hidden text-[10px] font-bold uppercase text-neutral-400">
                                            Email
                                        </span>
                                        {guest.email ? (
                                            <div className="flex items-center gap-1.5 text-neutral-600 text-xs truncate max-w-[200px]" title={guest.email}>
                                                <Mail className="h-3 w-3 text-neutral-400 shrink-0" />
                                                <span className="truncate">{guest.email}</span>
                                            </div>
                                        ) : (
                                            <span className="text-neutral-400 text-xs">—</span>
                                        )}
                                    </td>

                                    {/* Identification */}
                                    <td className="px-4 py-2.5 lg:py-3.5 flex justify-between items-center lg:table-cell border-b border-neutral-50 lg:border-none">
                                        <span className="lg:hidden text-[10px] font-bold uppercase text-neutral-400">
                                            ID
                                        </span>
                                        {guest.idNumber ? (
                                            <div className="flex items-center gap-1.5">
                                                <ShieldCheck className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                                                <div className="min-w-0">
                                                    <span className="font-mono text-xs font-semibold text-neutral-800">
                                                        {guest.idNumber}
                                                    </span>
                                                    {guest.idType && (
                                                        <span className="ml-1 text-[10px] text-neutral-400">
                                                            ({formatIdType(guest.idType)})
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-neutral-400 text-xs">—</span>
                                        )}
                                    </td>

                                    {/* Location */}
                                    <td className="px-4 py-2.5 lg:py-3.5 flex justify-between items-center lg:table-cell text-neutral-600 text-xs border-b border-neutral-50 lg:border-none">
                                        <span className="lg:hidden text-[10px] font-bold uppercase text-neutral-400">
                                            Location
                                        </span>
                                        <div className="flex items-center gap-1.5 truncate max-w-[160px]">
                                            <MapPin className="h-3 w-3 text-neutral-400 shrink-0" />
                                            <span className="truncate">{location}</span>
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="px-4 py-2.5 lg:py-3.5 flex justify-between items-center lg:table-cell border-b border-neutral-50 lg:border-none">
                                        <span className="lg:hidden text-[10px] font-bold uppercase text-neutral-400">
                                            Status
                                        </span>
                                        <GuestStatusBadge status={guest.status} size="sm" />
                                    </td>

                                    {/* Actions */}
                                    <td className="pl-2 pr-4 py-3 lg:py-3.5 flex justify-between items-center lg:table-cell bg-neutral-50/50 lg:bg-transparent">
                                        <span className="lg:hidden text-[10px] font-bold uppercase text-neutral-400">
                                            Actions
                                        </span>
                                        <div className="inline-flex items-center gap-2 justify-end lg:justify-start w-full lg:w-auto">
                                            <button
                                                type="button"
                                                onClick={() => onView(guest)}
                                                title="View Guest Details"
                                                aria-label={`View guest ${guest.fullName}`}
                                                className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-neutral-700 shadow-2xs transition-colors hover:bg-neutral-50 hover:text-neutral-900 cursor-pointer"
                                            >
                                                <Eye className="h-3 w-3" />
                                                <span>View</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => onEdit(guest)}
                                                title="Edit Guest"
                                                aria-label={`Edit guest ${guest.fullName}`}
                                                className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-neutral-700 shadow-2xs transition-colors hover:bg-neutral-50 hover:text-neutral-900 cursor-pointer"
                                            >
                                                <Pencil className="h-3 w-3" />
                                                <span>Edit</span>
                                            </button>

                                            {onDelete && (
                                                <button
                                                    type="button"
                                                    onClick={() => onDelete(guest)}
                                                    title="Delete Guest"
                                                    aria-label={`Delete guest ${guest.fullName}`}
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

export function GuestTableSkeleton() {
    return (
        <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-2xs animate-pulse">
            <div className="overflow-x-auto w-full min-w-0">
                <div className="lg:min-w-[840px]">
                    <div className="hidden lg:flex border-b border-neutral-100 bg-neutral-50/70 p-3.5 justify-between items-center">
                        <div className="h-3 w-20 rounded bg-neutral-200" />
                        <div className="h-3 w-24 rounded bg-neutral-200" />
                        <div className="h-3 w-28 rounded bg-neutral-200" />
                        <div className="h-3 w-24 rounded bg-neutral-200" />
                        <div className="h-3 w-20 rounded bg-neutral-200" />
                        <div className="h-3 w-16 rounded bg-neutral-200" />
                        <div className="h-3 w-20 rounded bg-neutral-200" />
                    </div>
                    <div className="divide-y divide-neutral-100">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between px-4 py-3.5"
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className="h-7 w-7 rounded-lg bg-neutral-100" />
                                    <div className="space-y-1">
                                        <div className="h-3.5 w-24 rounded bg-neutral-200" />
                                        <div className="h-2.5 w-12 rounded bg-neutral-100" />
                                    </div>
                                </div>
                                <div className="h-4 w-24 rounded bg-neutral-200" />
                                <div className="h-4 w-32 rounded bg-neutral-100" />
                                <div className="h-4 w-28 rounded bg-neutral-100" />
                                <div className="h-4 w-20 rounded bg-neutral-100" />
                                <div className="h-5 w-16 rounded-full bg-neutral-100" />
                                <div className="flex gap-2">
                                    <div className="h-7 w-14 rounded-lg bg-neutral-100" />
                                    <div className="h-7 w-14 rounded-lg bg-neutral-100" />
                                    <div className="h-7 w-7 rounded-lg bg-neutral-100" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
