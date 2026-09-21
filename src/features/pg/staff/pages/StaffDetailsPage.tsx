import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
    AlertCircle,
    ArrowLeft,
    Briefcase,
    Calendar,
    Clock,
    FileText,
    IndianRupee,
    Mail,
    MapPin,
    Pencil,
    Phone,
    Trash2,
    User,
} from "lucide-react";
import { Staff } from "../types/staff.types";
import { deleteStaff, getStaffMember } from "../services/staffService";
import { Branch } from "../../branches/types/branch.types";
import { getBranches } from "../../branches/services/branchService";
import { StaffRoleBadge } from "../components/StaffRoleBadge";
import { StaffStatsBadge } from "../components/StaffStatsBadge";

function formatSalary(salary: number, salaryType: Staff["salaryType"]): string {
    const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(salary);

    return `${formatted} / ${salaryType}`;
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

export function StaffDetailsPage() {
    const { staffId } = useParams<{ staffId: string }>();
    const navigate = useNavigate();

    const [staff, setStaff] = useState<Staff | null>(null);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadStaffAndBranches() {
            if (!staffId) {
                setError("Staff ID is missing.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const [staffData, branchData] = await Promise.all([
                    getStaffMember(staffId),
                    getBranches().catch(() => [] as Branch[]),
                ]);

                if (!staffData) {
                    setError("Staff member not found.");
                    return;
                }

                setStaff(staffData);
                setBranches(branchData);
            } catch (err) {
                console.error("Failed to load staff details", err);
                setError("Failed to load staff details.");
            } finally {
                setLoading(false);
            }
        }

        loadStaffAndBranches();
    }, [staffId]);

    const branchName =
        branches.find((b) => b.id === staff?.branchId)?.name || staff?.branchId || "—";

    async function handleDelete() {
        if (!staff) return;

        const confirmed = window.confirm(`Are you sure you want to delete ${staff.name}?`);
        if (!confirmed) return;

        try {
            await deleteStaff(staff.id);
            navigate("/pg/staff");
        } catch (err) {
            console.error("Failed to delete staff member", err);
            alert("Failed to delete staff member.");
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-[360px] items-center justify-center p-8 text-neutral-400">
                <div className="text-center space-y-2">
                    <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
                    <p className="text-xs font-medium">Loading staff profile...</p>
                </div>
            </div>
        );
    }

    if (error || !staff) {
        return (
            <div className="space-y-4">
                <div className="rounded-2xl border border-red-200 bg-red-50/80 p-4 sm:p-5 text-red-700 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                        <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                        <p className="text-xs sm:text-sm font-semibold">
                            {error || "Staff record not found."}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/pg/staff")}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-neutral-800 transition-all cursor-pointer"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Staff</span>
                </button>
            </div>
        );
    }

    return (
        <div className="w-full min-w-0 space-y-4">
            {/* Top Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                    type="button"
                    onClick={() => navigate("/pg/staff")}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Staff</span>
                </button>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => navigate(`/pg/staff/${staff.id}/edit`)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-neutral-800 transition-all cursor-pointer"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                        <span>Edit Staff</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 shadow-2xs hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all cursor-pointer"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                    </button>
                </div>
            </div>

            {/* Single Unified Container: All Staff Data */}
            <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-2xs">
                {/* Header Strip inside the container */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 bg-neutral-50/50 px-4 py-3.5 sm:px-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-neutral-900 text-base font-bold text-white shadow-2xs">
                            {staff.name ? staff.name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2.5">
                                <h2 className="text-base sm:text-lg font-bold text-neutral-900 leading-tight">
                                    {staff.name}
                                </h2>
                                <StaffRoleBadge role={staff.role} size="sm" />
                                <StaffStatsBadge status={staff.status} size="sm" />
                            </div>
                            <p className="mt-0.5 text-xs text-neutral-500 flex items-center gap-1.5 flex-wrap">
                                <span className="font-mono">{staff.phone}</span>
                                {staff.email && <span>• {staff.email}</span>}
                                <span>• ID: <span className="font-mono font-medium">{staff.employeeId || "—"}</span></span>
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
                                    {staff.name}
                                </td>
                                <td className="w-1/6 bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Phone Number
                                </td>
                                <td className="w-2/6 px-4 py-2.5 font-semibold font-mono text-neutral-800">
                                    {staff.phone}
                                </td>
                            </tr>
                            <tr className="border-b border-neutral-100 divide-x divide-neutral-100">
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Email Address
                                </td>
                                <td className="px-4 py-2.5 font-semibold text-neutral-800 break-all">
                                    {staff.email || "—"}
                                </td>
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Gender
                                </td>
                                <td className="px-4 py-2.5 font-semibold text-neutral-800 capitalize">
                                    {staff.gender || "—"}
                                </td>
                            </tr>
                            <tr className="border-b border-neutral-100 divide-x divide-neutral-100">
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Date of Birth
                                </td>
                                <td className="px-4 py-2.5 font-semibold text-neutral-800">
                                    {formatDate(staff.dateOfBirth)}
                                </td>
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Status
                                </td>
                                <td className="px-4 py-2.5 font-semibold text-neutral-800">
                                    <StaffStatsBadge status={staff.status} size="sm" />
                                </td>
                            </tr>
                            <tr className="border-b border-neutral-100 divide-x divide-neutral-100">
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Permanent Address
                                </td>
                                <td colSpan={3} className="px-4 py-2.5 font-semibold text-neutral-800">
                                    {staff.address || "—"}
                                </td>
                            </tr>

                            {/* Section 2: Employment & Branch Details */}
                            <tr className="border-b border-neutral-100 bg-neutral-50/70">
                                <th
                                    colSpan={4}
                                    className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500"
                                >
                                    <div className="flex items-center gap-1.5">
                                        <Briefcase className="h-3.5 w-3.5 text-neutral-400" />
                                        <span>Employment & Branch Assignment</span>
                                    </div>
                                </th>
                            </tr>
                            <tr className="border-b border-neutral-100 divide-x divide-neutral-100">
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Employee ID
                                </td>
                                <td className="px-4 py-2.5 font-semibold font-mono text-neutral-800">
                                    {staff.employeeId || "—"}
                                </td>
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Assigned Branch
                                </td>
                                <td className="px-4 py-2.5 font-semibold text-neutral-800">
                                    {branchName}
                                </td>
                            </tr>
                            <tr className="border-b border-neutral-100 divide-x divide-neutral-100">
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Designation / Role
                                </td>
                                <td className="px-4 py-2.5 font-semibold text-neutral-800">
                                    <StaffRoleBadge role={staff.role} size="sm" />
                                </td>
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Joining Date
                                </td>
                                <td className="px-4 py-2.5 font-semibold text-neutral-800">
                                    {formatDate(staff.joinedDate)}
                                </td>
                            </tr>

                            {/* Section 3: Compensation & Payroll */}
                            <tr className="border-b border-neutral-100 bg-neutral-50/70">
                                <th
                                    colSpan={4}
                                    className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500"
                                >
                                    <div className="flex items-center gap-1.5">
                                        <IndianRupee className="h-3.5 w-3.5 text-neutral-400" />
                                        <span>Compensation & Payroll Information</span>
                                    </div>
                                </th>
                            </tr>
                            <tr className="border-b border-neutral-100 divide-x divide-neutral-100">
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Current Salary
                                </td>
                                <td className="px-4 py-2.5 font-bold text-neutral-900 text-sm">
                                    {formatSalary(staff.salary, staff.salaryType)}
                                </td>
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Salary Frequency
                                </td>
                                <td className="px-4 py-2.5 font-semibold text-neutral-800 capitalize">
                                    {staff.salaryType}
                                </td>
                            </tr>
                            {staff.salaryType === "monthly" && (
                                <tr className="border-b border-neutral-100 divide-x divide-neutral-100">
                                    <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                        Salary Payout Day
                                    </td>
                                    <td colSpan={3} className="px-4 py-2.5 font-semibold text-neutral-800">
                                        {staff.paymentDay ? `Day ${staff.paymentDay} of each month` : "Not specified"}
                                    </td>
                                </tr>
                            )}

                            {/* Section 4: System Record Metadata */}
                            <tr className="border-b border-neutral-100 bg-neutral-50/70">
                                <th
                                    colSpan={4}
                                    className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500"
                                >
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5 text-neutral-400" />
                                        <span>Audit & Record Information</span>
                                    </div>
                                </th>
                            </tr>
                            <tr className="divide-x divide-neutral-100">
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Record Created
                                </td>
                                <td className="px-4 py-2.5 text-xs text-neutral-600">
                                    {staff.createdAt ? new Date(staff.createdAt).toLocaleString() : "—"}
                                </td>
                                <td className="bg-neutral-50/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Last Updated
                                </td>
                                <td className="px-4 py-2.5 text-xs text-neutral-600">
                                    {staff.updatedAt ? new Date(staff.updatedAt).toLocaleString() : "—"}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}