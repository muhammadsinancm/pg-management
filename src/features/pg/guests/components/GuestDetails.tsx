import {
    ArrowLeft,
    FileText,
    HeartHandshake,
    MapPin,
    Pencil,
    Shield,
    Trash2,
    User,
} from "lucide-react";
import { Guest } from "../types/guests.types";
import { GuestStatusBadge } from "./GuestStatusBadge";

interface GuestDetailsProps {
    guest: Guest;
    onBack: () => void;
    onEdit: (guest: Guest) => void;
    onDelete?: (guest: Guest) => void;
}

function formatIdType(idType?: Guest["idType"]): string {
    if (!idType) return "Not Provided";
    const labels: Record<string, string> = {
        aadhar: "Aadhaar Card",
        passport: "Passport",
        driving_license: "Driving License",
        voter_id: "Voter ID",
        other: "Other Govt ID",
    };
    return labels[idType] || idType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
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

export function GuestDetails({ guest, onBack, onEdit, onDelete }: GuestDetailsProps) {
    return (
        <div className="space-y-3 sm:space-y-4">
            {/* Top Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Guests</span>
                </button>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onEdit(guest)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-neutral-800 transition-all cursor-pointer"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                        <span>Edit</span>
                    </button>
                    {onDelete && (
                        <button
                            type="button"
                            onClick={() => onDelete(guest)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 shadow-2xs hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all cursor-pointer"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Single Unified Container: All User Data in One Div / Table */}
            <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-2xs">
                {/* Header Strip inside the container */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 bg-neutral-50/50 px-4 py-3.5 sm:px-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-sm font-bold text-white shadow-2xs">
                            {guest.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="flex items-center gap-2.5">
                                <h2 className="text-base sm:text-lg font-bold text-neutral-900 leading-tight">
                                    {guest.fullName}
                                </h2>
                                <GuestStatusBadge status={guest.status} size="sm" />
                            </div>
                            <p className="mt-0.5 text-xs text-neutral-500">
                                {guest.phone} {guest.email ? `• ${guest.email}` : ""}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Compact Details Table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[620px] text-left text-xs sm:text-sm border-collapse">
                        <tbody>
                            {/* Section 1: Personal Information */}
                            <tr className="border-b border-neutral-100 bg-neutral-50/70">
                                <th
                                    colSpan={4}
                                    className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500"
                                >
                                    <div className="flex items-center gap-1.5">
                                        <User className="h-3.5 w-3.5 text-neutral-400" />
                                        <span>Personal Information</span>
                                    </div>
                                </th>
                            </tr>
                            <tr className="border-b border-neutral-100 divide-x divide-neutral-100">
                                <td className="w-1/6 bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Full Name
                                </td>
                                <td className="w-2/6 px-4 py-2.5 font-semibold text-neutral-800">
                                    {guest.fullName}
                                </td>
                                <td className="w-1/6 bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Phone Number
                                </td>
                                <td className="w-2/6 px-4 py-2.5 font-semibold text-neutral-800">
                                    {guest.phone}
                                </td>
                            </tr>
                            <tr className="border-b border-neutral-100 divide-x divide-neutral-100">
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Email Address
                                </td>
                                <td className="px-4 py-2.5 font-semibold text-neutral-800 break-all">
                                    {guest.email || "—"}
                                </td>
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Gender
                                </td>
                                <td className="px-4 py-2.5 font-semibold text-neutral-800">
                                    {guest.gender
                                        ? guest.gender.charAt(0).toUpperCase() + guest.gender.slice(1)
                                        : "—"}
                                </td>
                            </tr>
                            <tr className="border-b border-neutral-100 divide-x divide-neutral-100">
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Date of Birth
                                </td>
                                <td className="px-4 py-2.5 font-semibold text-neutral-800">
                                    {formatDate(guest.dateOfBirth)}
                                </td>
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Status
                                </td>
                                <td className="px-4 py-2.5 font-semibold text-neutral-800">
                                    <GuestStatusBadge status={guest.status} size="sm" />
                                </td>
                            </tr>

                            {/* Section 2: Identification */}
                            <tr className="border-b border-neutral-100 bg-neutral-50/70">
                                <th
                                    colSpan={4}
                                    className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500"
                                >
                                    <div className="flex items-center gap-1.5">
                                        <Shield className="h-3.5 w-3.5 text-neutral-400" />
                                        <span>Government Identification</span>
                                    </div>
                                </th>
                            </tr>
                            <tr className="border-b border-neutral-100 divide-x divide-neutral-100">
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    ID Type
                                </td>
                                <td className="px-4 py-2.5 font-semibold text-neutral-800">
                                    {formatIdType(guest.idType)}
                                </td>
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    ID Number
                                </td>
                                <td className="px-4 py-2.5 font-semibold text-neutral-800">
                                    {guest.idNumber || "—"}
                                </td>
                            </tr>

                            {/* Section 3: Address & Location */}
                            <tr className="border-b border-neutral-100 bg-neutral-50/70">
                                <th
                                    colSpan={4}
                                    className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500"
                                >
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                                        <span>Address & Location</span>
                                    </div>
                                </th>
                            </tr>
                            <tr className="border-b border-neutral-100 divide-x divide-neutral-100">
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Permanent Address
                                </td>
                                <td colSpan={3} className="px-4 py-2.5 font-semibold text-neutral-800">
                                    {guest.address || "—"}
                                </td>
                            </tr>
                            <tr className="border-b border-neutral-100 divide-x divide-neutral-100">
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    City / State
                                </td>
                                <td className="px-4 py-2.5 font-semibold text-neutral-800">
                                    {[guest.city, guest.state].filter(Boolean).join(", ") || "—"}
                                </td>
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Pincode
                                </td>
                                <td className="px-4 py-2.5 font-semibold text-neutral-800">
                                    {guest.pincode || "—"}
                                </td>
                            </tr>

                            {/* Section 4: Emergency Contact */}
                            <tr className="border-b border-neutral-100 bg-neutral-50/70">
                                <th
                                    colSpan={4}
                                    className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500"
                                >
                                    <div className="flex items-center gap-1.5">
                                        <HeartHandshake className="h-3.5 w-3.5 text-neutral-400" />
                                        <span>Emergency Contact</span>
                                    </div>
                                </th>
                            </tr>
                            <tr className="border-b border-neutral-100 divide-x divide-neutral-100">
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Contact Name
                                </td>
                                <td className="px-4 py-2.5 font-semibold text-neutral-800">
                                    {guest.emergencyContact?.name || "—"}
                                </td>
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Phone & Relation
                                </td>
                                <td className="px-4 py-2.5 font-semibold text-neutral-800">
                                    {guest.emergencyContact ? (
                                        <span>
                                            {guest.emergencyContact.phone}{" "}
                                            <span className="text-neutral-400 font-normal">
                                                ({guest.emergencyContact.relation || "Contact"})
                                            </span>
                                        </span>
                                    ) : (
                                        "—"
                                    )}
                                </td>
                            </tr>

                            {/* Section 5: Notes & Remarks (if present) */}
                            {guest.notes && (
                                <>
                                    <tr className="border-b border-neutral-100 bg-neutral-50/70">
                                        <th
                                            colSpan={4}
                                            className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500"
                                        >
                                            <div className="flex items-center gap-1.5">
                                                <FileText className="h-3.5 w-3.5 text-neutral-400" />
                                                <span>Notes & Remarks</span>
                                            </div>
                                        </th>
                                    </tr>
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-4 py-3 text-xs sm:text-sm text-neutral-600 leading-relaxed bg-white"
                                        >
                                            {guest.notes}
                                        </td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}