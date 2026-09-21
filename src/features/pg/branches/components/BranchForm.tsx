import { FormEvent, useEffect, useState } from "react";
import { AlertCircle, Building2, Loader2, Mail, MapPin, Phone, User } from "lucide-react";
import { Branch, BranchStatus, CreateBranchInput } from "../types/branch.types";

interface BranchFormProps {
    branch?: Branch;
    onSubmit: (data: CreateBranchInput) => Promise<void>;
    onCancel: () => void;
}

const initialForm: CreateBranchInput = {
    organizationId: "",
    name: "",
    code: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    email: "",
    managerId: "",
    managerName: "",
    status: "active",
};

export function BranchForm({ branch, onSubmit, onCancel }: BranchFormProps) {
    const [formData, setFormData] = useState<CreateBranchInput>(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (branch) {
            setFormData({
                organizationId: branch.organizationId,
                name: branch.name,
                code: branch.code,
                address: branch.address,
                city: branch.city,
                state: branch.state,
                pincode: branch.pincode,
                phone: branch.phone ?? "",
                email: branch.email ?? "",
                managerId: branch.managerId ?? "",
                managerName: branch.managerName ?? "",
                status: branch.status,
            });
        } else {
            setFormData(initialForm);
        }
    }, [branch]);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);

        if (!formData.name.trim()) {
            setError("Branch name is required.");
            return;
        }

        if (!formData.code.trim()) {
            setError("Branch code is required.");
            return;
        }

        if (!formData.address.trim()) {
            setError("Street address is required.");
            return;
        }

        if (!formData.city.trim() || !formData.state.trim() || !formData.pincode.trim()) {
            setError("City, State, and Pincode are required.");
            return;
        }

        try {
            setLoading(true);
            await onSubmit({
                ...formData,
                name: formData.name.trim(),
                code: formData.code.trim().toUpperCase(),
                address: formData.address.trim(),
                city: formData.city.trim(),
                state: formData.state.trim(),
                pincode: formData.pincode.trim(),
                phone: formData.phone?.trim() || undefined,
                email: formData.email?.trim() || undefined,
                managerName: formData.managerName?.trim() || undefined,
            });
        } catch (err) {
            console.error(err);
            setError(branch ? "Failed to update branch." : "Failed to create branch.");
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

            {/* Section 1: Branch Details */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                    <Building2 className="h-4 w-4 text-neutral-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                        Branch Identification
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Branch Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Apex Living Residency"
                            required
                            disabled={loading}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Branch Code <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            placeholder="e.g. APEX-01"
                            required
                            disabled={loading}
                            className="w-full font-mono uppercase rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Operational Status <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            disabled={loading}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs cursor-pointer"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Section 2: Location & Address */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                    <MapPin className="h-4 w-4 text-neutral-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                        Location & Address
                    </h3>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Street Address <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Plot / Building no, Street name, Landmark..."
                            rows={2}
                            required
                            disabled={loading}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                                City <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="e.g. Bangalore"
                                required
                                disabled={loading}
                                className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                                State <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                placeholder="e.g. Karnataka"
                                required
                                disabled={loading}
                                className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                                Pincode <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                placeholder="e.g. 560034"
                                required
                                disabled={loading}
                                className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 3: Contact & Management */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                    <User className="h-4 w-4 text-neutral-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                        Management & Contact
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Branch Manager
                        </label>
                        <input
                            type="text"
                            name="managerName"
                            value={formData.managerName}
                            onChange={handleChange}
                            placeholder="e.g. Suresh Kumar"
                            disabled={loading}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="e.g. 9876543210"
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
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="e.g. branch@example.com"
                            disabled={loading}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
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
                    className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-neutral-700 shadow-2xs hover:bg-neutral-50 transition-colors cursor-pointer disabled:opacity-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-2xs hover:bg-neutral-800 disabled:opacity-50 transition-all cursor-pointer"
                >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    <span>
                        {loading
                            ? "Saving..."
                            : branch
                            ? "Update Branch"
                            : "Create Branch"}
                    </span>
                </button>
            </div>
        </form>
    );
}