import { FormEvent, useState } from "react";
import { AlertCircle, FileText, MapPin, ShieldCheck, User, UserCheck } from "lucide-react";
import { CreateGuestInput, Gender, Guest, GuestStatus, IdType } from "../types/guests.types";

interface GuestFormProps {
    guest?: Guest;
    onSubmit: (data: CreateGuestInput) => Promise<void>;
    onCancel: () => void;
}

export function GuestForm({ guest, onSubmit, onCancel }: GuestFormProps) {
    const [fullName, setFullName] = useState(guest?.fullName ?? "");
    const [phone, setPhone] = useState(guest?.phone ?? "");
    const [dateOfBirth, setDateOfBirth] = useState(guest?.dateOfBirth ?? "");
    const [email, setEmail] = useState(guest?.email ?? "");
    const [gender, setGender] = useState<Gender>(guest?.gender ?? "male");
    const [idType, setIdType] = useState<IdType>(guest?.idType ?? "aadhar");
    const [idNumber, setIdNumber] = useState(guest?.idNumber ?? "");
    const [address, setAddress] = useState(guest?.address ?? "");
    const [city, setCity] = useState(guest?.city ?? "");
    const [state, setState] = useState(guest?.state ?? "");
    const [pincode, setPincode] = useState(guest?.pincode ?? "");
    const [emergencyName, setEmergencyName] = useState(guest?.emergencyContact?.name ?? "");
    const [emergencyPhone, setEmergencyPhone] = useState(guest?.emergencyContact?.phone ?? "");
    const [emergencyRelation, setEmergencyRelation] = useState(guest?.emergencyContact?.relation ?? "");
    const [status, setStatus] = useState<GuestStatus>(guest?.status ?? "active");
    const [notes, setNotes] = useState(guest?.notes ?? "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        if (!fullName.trim()) {
            setError("Full name is required.");
            return;
        }
        if (!phone.trim()) {
            setError("Phone number is required.");
            return;
        }

        const data: CreateGuestInput = {
            fullName: fullName.trim(),
            phone: phone.trim(),
            ...(email.trim() && { email: email.trim() }),
            ...(dateOfBirth.trim() && { dateOfBirth }),
            gender,
            idType,
            ...(idNumber.trim() && { idNumber: idNumber.trim() }),
            ...(address.trim() && { address: address.trim() }),
            ...(city.trim() && { city: city.trim() }),
            ...(state.trim() && { state: state.trim() }),
            ...(pincode.trim() && { pincode: pincode.trim() }),
            ...(emergencyName.trim() && {
                emergencyContact: {
                    name: emergencyName.trim(),
                    phone: emergencyPhone.trim(),
                    relation: emergencyRelation.trim(),
                },
            }),
            status,
            ...(notes.trim() && { notes: notes.trim() }),
        };

        try {
            setLoading(true);
            await onSubmit(data);
        } catch (err) {
            console.error(err);
            setError(guest ? "Failed to update guest details." : "Failed to create guest.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700 shadow-2xs">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                    <span>{error}</span>
                </div>
            )}

            {/* 1. Personal Information */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                    <User className="h-4 w-4 text-neutral-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                        Personal Information
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. Rahul Sharma"
                            required
                            disabled={loading}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="e.g. 9876543210"
                            required
                            disabled={loading}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g. rahul@example.com"
                            disabled={loading}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                                Gender
                            </label>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value as Gender)}
                                disabled={loading}
                                className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs sm:text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs cursor-pointer"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                                disabled={loading}
                                className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs sm:text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Identity Verification */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                    <ShieldCheck className="h-4 w-4 text-neutral-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                        Identification & KYC
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            ID Document Type
                        </label>
                        <select
                            value={idType}
                            onChange={(e) => setIdType(e.target.value as IdType)}
                            disabled={loading}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs cursor-pointer"
                        >
                            <option value="aadhar">Aadhaar Card</option>
                            <option value="passport">Passport</option>
                            <option value="driving_license">Driving License</option>
                            <option value="voter_id">Voter ID</option>
                            <option value="other">Other Government ID</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            ID Document Number
                        </label>
                        <input
                            type="text"
                            value={idNumber}
                            onChange={(e) => setIdNumber(e.target.value)}
                            placeholder="e.g. 1234 5678 9012"
                            disabled={loading}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-mono text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                        />
                    </div>
                </div>
            </div>

            {/* 3. Address */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                    <MapPin className="h-4 w-4 text-neutral-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                        Address Details
                    </h3>
                </div>

                <div className="space-y-3">
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Address Line
                        </label>
                        <textarea
                            rows={2}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="House / Flat No, Street, Landmark"
                            disabled={loading}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div>
                            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                                City
                            </label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="e.g. Bangalore"
                                disabled={loading}
                                className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                                State
                            </label>
                            <input
                                type="text"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                placeholder="e.g. Karnataka"
                                disabled={loading}
                                className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                                Pincode
                            </label>
                            <input
                                type="text"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                                placeholder="e.g. 560001"
                                inputMode="numeric"
                                disabled={loading}
                                className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Emergency Contact */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                    <UserCheck className="h-4 w-4 text-neutral-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                        Emergency Contact
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Contact Name
                        </label>
                        <input
                            type="text"
                            value={emergencyName}
                            onChange={(e) => setEmergencyName(e.target.value)}
                            placeholder="e.g. Suresh Sharma"
                            disabled={loading}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Contact Phone
                        </label>
                        <input
                            type="tel"
                            value={emergencyPhone}
                            onChange={(e) => setEmergencyPhone(e.target.value)}
                            placeholder="e.g. 9876500000"
                            disabled={loading}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Relationship
                        </label>
                        <input
                            type="text"
                            value={emergencyRelation}
                            onChange={(e) => setEmergencyRelation(e.target.value)}
                            placeholder="e.g. Father / Guardian"
                            disabled={loading}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                        />
                    </div>
                </div>
            </div>

            {/* 5. Status & Notes */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                    <FileText className="h-4 w-4 text-neutral-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                        Status & Remarks
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Guest Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as GuestStatus)}
                            disabled={loading}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs cursor-pointer"
                        >
                            <option value="active">Active</option>
                            <option value="checked_out">Checked Out</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Additional Notes
                        </label>
                        <textarea
                            rows={2}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Special requests, preferences, or remarks..."
                            disabled={loading}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs resize-none"
                        />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 shadow-2xs hover:bg-neutral-50 cursor-pointer disabled:opacity-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-neutral-900 px-5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-neutral-800 transition-all cursor-pointer disabled:opacity-50"
                >
                    {loading ? (
                        <div className="flex items-center gap-1.5">
                            <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
                            <span>Saving...</span>
                        </div>
                    ) : guest ? (
                        "Update Guest"
                    ) : (
                        "Create Guest"
                    )}
                </button>
            </div>
        </form>
    );
}