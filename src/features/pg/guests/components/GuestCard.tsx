import { ArrowRight, Mail, MapPin, Pencil, Phone, ShieldCheck, Trash2, User } from "lucide-react";
import { Guest } from "../types/guests.types";
import { GuestStatusBadge } from "./GuestStatusBadge";

interface GuestCardProps {
    guest: Guest;
    onView: (guest: Guest) => void;
    onEdit: (guest: Guest) => void;
    onDelete?: (guest: Guest) => void;
}

function formatIdType(idType?: Guest["idType"]): string {
    if (!idType) return "ID";
    const labels: Record<string, string> = {
        aadhar: "Aadhaar",
        passport: "Passport",
        driving_license: "DL",
        voter_id: "Voter ID",
        other: "Other",
    };
    return labels[idType] || idType;
}

export function GuestCard({ guest, onView, onEdit, onDelete }: GuestCardProps) {
    const location = [guest.city, guest.state].filter(Boolean).join(", ") || "—";

    return (
        <div className="flex flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-3.5 sm:p-4 shadow-2xs transition-all hover:border-neutral-200 hover:shadow-xs min-w-0">
            <div>
                {/* Header: Avatar, Name & Status */}
                <div className="flex items-start justify-between gap-2 border-b border-neutral-100 pb-3 min-w-0">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
                            <User className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="truncate font-bold text-sm sm:text-base text-neutral-900" title={guest.fullName}>
                                {guest.fullName}
                            </h3>
                            <div className="flex items-center gap-1 text-[11px] font-medium text-neutral-500">
                                <Phone className="h-3 w-3 text-neutral-400 shrink-0" />
                                <span className="font-mono">{guest.phone}</span>
                            </div>
                        </div>
                    </div>
                    <GuestStatusBadge status={guest.status} size="sm" />
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-neutral-50/70 p-2.5 text-xs mt-3">
                    {/* Email */}
                    <div className="min-w-0">
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                            <Mail className="h-3 w-3 shrink-0 text-neutral-400" />
                            <span>Email</span>
                        </span>
                        <p className="mt-0.5 truncate font-semibold text-neutral-800 text-xs" title={guest.email || "Not provided"}>
                            {guest.email || "—"}
                        </p>
                    </div>

                    {/* ID */}
                    <div className="min-w-0">
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                            <ShieldCheck className="h-3 w-3 shrink-0 text-neutral-400" />
                            <span>{formatIdType(guest.idType)}</span>
                        </span>
                        <p className="mt-0.5 truncate font-mono font-semibold text-neutral-800 text-xs" title={guest.idNumber || "—"}>
                            {guest.idNumber || "—"}
                        </p>
                    </div>

                    {/* Gender */}
                    <div className="min-w-0 pt-1.5 border-t border-neutral-100/80">
                        <span className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                            Gender
                        </span>
                        <p className="mt-0.5 truncate font-semibold text-neutral-800 text-xs capitalize">
                            {guest.gender || "—"}
                        </p>
                    </div>

                    {/* Location */}
                    <div className="min-w-0 pt-1.5 border-t border-neutral-100/80">
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                            <MapPin className="h-3 w-3 shrink-0 text-neutral-400" />
                            <span>Location</span>
                        </span>
                        <p className="mt-0.5 truncate font-semibold text-neutral-800 text-xs" title={location}>
                            {location}
                        </p>
                    </div>
                </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center gap-2 pt-3 min-w-0 border-t border-neutral-100 mt-3">
                <button
                    type="button"
                    onClick={() => onView(guest)}
                    className="flex-1 min-w-0 inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 py-2 px-3 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-neutral-800 cursor-pointer"
                >
                    <span className="truncate">View Details</span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                </button>

                <button
                    type="button"
                    onClick={() => onEdit(guest)}
                    title="Edit Guest"
                    aria-label={`Edit ${guest.fullName}`}
                    className="inline-flex items-center justify-center gap-1 rounded-xl border border-neutral-200 bg-white py-2 px-2.5 text-xs font-semibold text-neutral-700 shadow-2xs transition-colors hover:bg-neutral-50 hover:text-neutral-900 cursor-pointer"
                >
                    <Pencil className="h-3.5 w-3.5" />
                    <span className="hidden xs:inline">Edit</span>
                </button>

                {onDelete && (
                    <button
                        type="button"
                        onClick={() => onDelete(guest)}
                        title="Delete Guest"
                        aria-label={`Delete ${guest.fullName}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-400 shadow-2xs transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 cursor-pointer shrink-0"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>
        </div>
    );
}

export function GuestCardSkeleton() {
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