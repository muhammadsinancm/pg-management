import { ArrowLeft, Calendar, FileText, Mail, MapPin, Pencil, Phone, ShieldCheck, Trash2, User, UserCheck } from "lucide-react";
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

interface DetailItemProps {
    label: string;
    value?: string | number | null;
    icon?: React.ComponentType<{ className?: string }>;
    href?: string;
}

function DetailItem({ label, value, icon: Icon, href }: DetailItemProps) {
    const content = (
        <div className="flex items-start gap-2">
            {Icon && <Icon className="h-3.5 w-3.5 text-neutral-400 mt-0.5 shrink-0" />}
            <p className={`text-xs sm:text-sm font-semibold text-neutral-800 break-words ${href ? "text-blue-600 hover:underline" : ""}`}>
                {value || "—"}
            </p>
        </div>
    );

    return (
        <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                {label}
            </p>
            {href && value ? (
                <a href={href} className="inline-block">
                    {content}
                </a>
            ) : (
                content
            )}
        </div>
    );
}

export function GuestDetails({ guest, onBack, onEdit, onDelete }: GuestDetailsProps) {
    return (
        <div className="space-y-4 sm:space-y-5">
            {/* Header Card */}
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-neutral-100 bg-white p-4 sm:p-5 shadow-2xs md:flex-row md:items-center">
                <div>
                    <button
                        type="button"
                        onClick={onBack}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer mb-2"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Back to Guests</span>
                    </button>
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
                            <User className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                                {guest.fullName}
                            </h2>
                            <p className="text-xs text-neutral-400">
                                Guest profile and identity records
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <GuestStatusBadge status={guest.status} size="md" />

                    <button
                        type="button"
                        onClick={() => onEdit(guest)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-neutral-800 transition-all cursor-pointer"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                        <span>Edit Guest</span>
                    </button>

                    {onDelete && (
                        <button
                            type="button"
                            onClick={() => onDelete(guest)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-400 shadow-2xs transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                            title="Delete Guest"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Personal Information */}
            <section className="rounded-2xl border border-neutral-100 bg-white p-4 sm:p-5 shadow-2xs">
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                        <User className="h-3.5 w-3.5" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-neutral-900">
                        Personal Information
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <DetailItem
                        label="Full Name"
                        value={guest.fullName}
                    />

                    <DetailItem
                        label="Phone Number"
                        value={guest.phone}
                        icon={Phone}
                        href={guest.phone ? `tel:${guest.phone}` : undefined}
                    />

                    <DetailItem
                        label="Email Address"
                        value={guest.email}
                        icon={Mail}
                        href={guest.email ? `mailto:${guest.email}` : undefined}
                    />

                    <DetailItem
                        label="Gender"
                        value={guest.gender ? guest.gender.charAt(0).toUpperCase() + guest.gender.slice(1) : null}
                    />

                    <DetailItem
                        label="Date of Birth"
                        value={formatDate(guest.dateOfBirth)}
                        icon={Calendar}
                    />
                </div>
            </section>

            {/* Identification */}
            <section className="rounded-2xl border border-neutral-100 bg-white p-4 sm:p-5 shadow-2xs">
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                        <ShieldCheck className="h-3.5 w-3.5" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-neutral-900">
                        Government Identification
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <DetailItem
                        label="ID Type"
                        value={formatIdType(guest.idType)}
                    />

                    <DetailItem
                        label="ID Number"
                        value={guest.idNumber}
                    />
                </div>
            </section>

            {/* Address */}
            <section className="rounded-2xl border border-neutral-100 bg-white p-4 sm:p-5 shadow-2xs">
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                        <MapPin className="h-3.5 w-3.5" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-neutral-900">
                        Address & Location
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="sm:col-span-2">
                        <DetailItem
                            label="Permanent Address"
                            value={guest.address}
                        />
                    </div>

                    <DetailItem
                        label="City"
                        value={guest.city}
                    />

                    <DetailItem
                        label="State"
                        value={guest.state}
                    />

                    <DetailItem
                        label="Pincode"
                        value={guest.pincode}
                    />
                </div>
            </section>

            {/* Emergency Contact */}
            <section className="rounded-2xl border border-neutral-100 bg-white p-4 sm:p-5 shadow-2xs">
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                        <UserCheck className="h-3.5 w-3.5" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-neutral-900">
                        Emergency Contact
                    </h3>
                </div>

                {guest.emergencyContact ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 rounded-xl bg-neutral-50/70 p-3.5">
                        <DetailItem
                            label="Contact Name"
                            value={guest.emergencyContact.name}
                        />

                        <DetailItem
                            label="Phone Number"
                            value={guest.emergencyContact.phone}
                            icon={Phone}
                            href={guest.emergencyContact.phone ? `tel:${guest.emergencyContact.phone}` : undefined}
                        />

                        <DetailItem
                            label="Relationship"
                            value={guest.emergencyContact.relation}
                        />
                    </div>
                ) : (
                    <p className="text-xs text-neutral-400">
                        No emergency contact recorded.
                    </p>
                )}
            </section>

            {/* Notes */}
            {guest.notes && (
                <section className="rounded-2xl border border-neutral-100 bg-white p-4 sm:p-5 shadow-2xs">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                            <FileText className="h-3.5 w-3.5" />
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-neutral-900">
                            Notes & Remarks
                        </h3>
                    </div>

                    <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 whitespace-pre-wrap">
                        {guest.notes}
                    </p>
                </section>
            )}
        </div>
    );
}