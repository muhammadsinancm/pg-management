import { FormEvent, useEffect, useState } from "react";
import {
    AlertCircle,
    Briefcase,
    Building2,
    Calendar,
    IndianRupee,
    MapPin,
    Phone,
    User,
} from "lucide-react";
import {
    CreateStaffInput,
    Gender,
    SalaryType,
    Staff,
    StaffRole,
    StaffStatus,
} from "../types/staff.types";
import { Branch } from "../../branches/types/branch.types";
import { getBranches } from "../../branches/services/branchService";

export interface StaffFormProps {
    staff?: Staff;
    onSubmit: (data: CreateStaffInput) => Promise<void>;
    onCancel: () => void;
}

export function StaffForm({ staff, onSubmit, onCancel }: StaffFormProps) {
    const [branchId, setBranchId] = useState(staff?.branchId ?? "");
    const [employeeId, setEmployeeId] = useState(staff?.employeeId ?? "");
    const [name, setName] = useState(staff?.name ?? "");
    const [phone, setPhone] = useState(staff?.phone ?? "");
    const [email, setEmail] = useState(staff?.email ?? "");
    const [dateOfBirth, setDateOfBirth] = useState(staff?.dateOfBirth ?? "");
    const [gender, setGender] = useState<Gender>(staff?.gender ?? "male");
    const [address, setAddress] = useState(staff?.address ?? "");
    const [role, setRole] = useState<StaffRole>(staff?.role ?? "reception");
    const [joinedDate, setJoinedDate] = useState<string>(
        staff?.joinedDate ?? new Date().toISOString().split("T")[0]
    );
    const [status, setStatus] = useState<StaffStatus>(staff?.status ?? "active");
    const [salary, setSalary] = useState(staff?.salary?.toString() ?? "");
    const [salaryType, setSalaryType] = useState<SalaryType>(staff?.salaryType ?? "monthly");
    const [paymentDay, setPaymentDay] = useState(staff?.paymentDay?.toString() ?? "");

    const [branches, setBranches] = useState<Branch[]>([]);
    const [loadingBranches, setLoadingBranches] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadBranches() {
            try {
                setLoadingBranches(true);
                const data = await getBranches();
                setBranches(data);
                if (!branchId && data.length > 0 && !staff) {
                    setBranchId(data[0].id);
                }
            } catch (err) {
                console.error("Failed to load branches", err);
            } finally {
                setLoadingBranches(false);
            }
        }
        loadBranches();
    }, [staff]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        if (!branchId) {
            setError("Branch selection is required.");
            return;
        }
        if (!name.trim()) {
            setError("Staff member name is required.");
            return;
        }
        if (!phone.trim()) {
            setError("Phone number is required.");
            return;
        }
        if (!role) {
            setError("Staff role is required.");
            return;
        }
        if (!joinedDate) {
            setError("Joined date is required.");
            return;
        }
        if (!salary || Number(salary) < 0 || isNaN(Number(salary))) {
            setError("A valid salary amount is required.");
            return;
        }

        const data: CreateStaffInput = {
            branchId,
            ...(employeeId.trim() && { employeeId: employeeId.trim() }),
            name: name.trim(),
            phone: phone.trim(),
            ...(email.trim() && { email: email.trim() }),
            ...(dateOfBirth && { dateOfBirth }),
            gender,
            ...(address.trim() && { address: address.trim() }),
            role,
            joinedDate,
            status,
            salary: Number(salary),
            salaryType,
            ...(salaryType === "monthly" && paymentDay && {
                paymentDay: Number(paymentDay),
            }),
        };

        try {
            setLoading(true);
            await onSubmit(data);
        } catch (err) {
            console.error("Failed to save staff", err);
            setError(staff ? "Failed to update staff member details." : "Failed to register staff member.");
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

            {/* 1. Basic & Personal Information */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                    <User className="h-4 w-4 text-neutral-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                        Personal Information
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Full Name */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            required
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                        />
                    </div>

                    {/* Employee ID */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Employee ID
                        </label>
                        <input
                            type="text"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            placeholder="EMP-001"
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                        />
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="9876543210"
                            required
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="staff@example.com"
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                        />
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                        />
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Gender
                        </label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value as Gender)}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs cursor-pointer"
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* 2. Employment & Role */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                    <Briefcase className="h-4 w-4 text-neutral-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                        Employment & Role
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Branch */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Branch <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={branchId}
                            onChange={(e) => setBranchId(e.target.value)}
                            disabled={loadingBranches || loading}
                            required
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs cursor-pointer disabled:bg-neutral-50"
                        >
                            <option value="">
                                {loadingBranches ? "Loading branches..." : "Select Branch"}
                            </option>
                            {branches.map((b) => (
                                <option key={b.id} value={b.id}>
                                    {b.name} ({b.code})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Role */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Role / Designation <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as StaffRole)}
                            required
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs cursor-pointer"
                        >
                            <option value="manager">Manager</option>
                            <option value="reception">Reception</option>
                            <option value="cook">Cook</option>
                            <option value="cleaner">Cleaner</option>
                            <option value="security">Security</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                    </div>

                    {/* Employment Status */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Employment Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as StaffStatus)}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs cursor-pointer"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Joined Date */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Joined Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={joinedDate}
                            onChange={(e) => setJoinedDate(e.target.value)}
                            required
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                        />
                    </div>
                </div>
            </div>

            {/* 3. Compensation & Payroll */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                    <IndianRupee className="h-4 w-4 text-neutral-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                        Compensation & Payroll
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {/* Salary Amount */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Salary (₹) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="100"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                            placeholder="18000"
                            required
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                        />
                    </div>

                    {/* Salary Type */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Salary Type
                        </label>
                        <select
                            value={salaryType}
                            onChange={(e) => setSalaryType(e.target.value as SalaryType)}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs cursor-pointer"
                        >
                            <option value="monthly">Monthly</option>
                            <option value="weekly">Weekly</option>
                            <option value="daily">Daily</option>
                        </select>
                    </div>

                    {/* Payment Day */}
                    {salaryType === "monthly" && (
                        <div>
                            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                                Payment Day (Day of Month)
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="31"
                                value={paymentDay}
                                onChange={(e) => setPaymentDay(e.target.value)}
                                placeholder="5"
                                className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* 4. Address Details */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                    <MapPin className="h-4 w-4 text-neutral-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                        Address Details
                    </h3>
                </div>

                <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                        Permanent Address
                    </label>
                    <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House / Street, Landmark, City, State..."
                        rows={3}
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs resize-none"
                    />
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-xs font-bold text-neutral-700 shadow-2xs hover:bg-neutral-50 cursor-pointer disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 px-5 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-neutral-800 cursor-pointer disabled:opacity-50 transition-all"
                >
                    {loading ? (
                        <>
                            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            <span>Saving...</span>
                        </>
                    ) : (
                        <span>{staff ? "Update Staff Member" : "Register Staff Member"}</span>
                    )}
                </button>
            </div>
        </form>
    );
}