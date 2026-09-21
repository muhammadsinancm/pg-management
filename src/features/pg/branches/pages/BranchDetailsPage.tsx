import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
    AlertCircle,
    ArrowLeft,
    Building2,
    Calendar,
    Clock,
    Mail,
    MapPin,
    Pencil,
    Phone,
    Shield,
    Trash2,
    User,
} from "lucide-react";
import { Branch } from "../types/branch.types";
import { deleteBranch, getBranch } from "../services/branchService";
import { BranchStatusBadge } from "../components/BranchStatusBadge";
import { useAuth } from "@/features/auth/hooks/useAuth";

function formatDate(dateString?: string): string {
    if (!dateString) return "—";
    try {
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return dateString;
        return d.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return dateString;
    }
}

export function BranchDetailsPage() {
    const { branchId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [branch, setBranch] = useState<Branch | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isSuperAdmin = user?.role === "super_admin";

    useEffect(() => {
        async function loadBranch() {
            if (!branchId) {
                setError("Branch ID is missing");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const data = await getBranch(branchId);
                if (!data) {
                    setError("Branch not found");
                    return;
                }

                setBranch(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load branch details");
            } finally {
                setLoading(false);
            }
        }
        loadBranch();
    }, [branchId]);

    async function handleDelete() {
        if (!branch || !isSuperAdmin) return;
        const confirmed = window.confirm(`Are you sure you want to delete "${branch.name}"?`);
        if (!confirmed) return;

        try {
            await deleteBranch(branch.id);
            navigate("/pg/branches");
        } catch (err) {
            console.error(err);
            alert("Failed to delete branch");
        }
    }

    if (loading) {
        return (
            <div className="space-y-4 p-4 sm:p-6 animate-pulse">
                <div className="flex items-center justify-between">
                    <div className="h-4 w-28 rounded bg-neutral-200" />
                    <div className="h-8 w-20 rounded-xl bg-neutral-100" />
                </div>
                <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-2xs space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-neutral-200" />
                        <div className="space-y-2 flex-1">
                            <div className="h-5 w-48 rounded bg-neutral-200" />
                            <div className="h-3 w-32 rounded bg-neutral-100" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="h-20 rounded-xl bg-neutral-50" />
                        <div className="h-20 rounded-xl bg-neutral-50" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !branch) {
        return (
            <div className="p-4 sm:p-6 space-y-4">
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 shadow-2xs flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                    <span>{error ?? "Branch not found"}</span>
                </div>
                <button
                    type="button"
                    onClick={() => navigate("/pg/branches")}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 shadow-2xs hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Branches
                </button>
            </div>
        );
    }

    const location = [branch.address, branch.city, branch.state, branch.pincode]
        .filter(Boolean)
        .join(", ");

    return (
        <div className="w-full min-w-0 space-y-4 p-4 sm:p-6">
            {/* Top Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                    type="button"
                    onClick={() => navigate("/pg/branches")}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Branches</span>
                </button>

                <div className="flex items-center gap-2">
                    {isSuperAdmin && (
                        <button
                            type="button"
                            onClick={() => navigate(`/pg/branches/${branch.id}/edit`)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-neutral-800 transition-all cursor-pointer"
                        >
                            <Pencil className="h-3.5 w-3.5" />
                            <span>Edit Branch</span>
                        </button>
                    )}

                    {isSuperAdmin && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 shadow-2xs hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all cursor-pointer"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Single Unified Container */}
            <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-2xs">
                {/* Header Strip inside the container */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 bg-neutral-50/50 px-4 py-3.5 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-2xs">
                            <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <h2 className="text-base sm:text-lg font-bold text-neutral-900 leading-tight">
                                    {branch.name}
                                </h2>
                                <span className="rounded-md bg-neutral-100 px-2 py-0.5 font-mono text-[11px] font-bold text-neutral-600">
                                    {branch.code}
                                </span>
                                <BranchStatusBadge status={branch.status} size="sm" />
                            </div>
                            <p className="mt-1 text-xs text-neutral-500">
                                {[branch.city, branch.state].filter(Boolean).join(", ")}
                                {branch.phone ? ` • ${branch.phone}` : ""}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Details Table / Data Sections */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[620px] text-left text-xs sm:text-sm border-collapse">
                        <tbody>
                            {/* Section 1: Identification & Management */}
                            <tr className="border-b border-neutral-100 bg-neutral-50/70">
                                <th
                                    colSpan={4}
                                    className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500"
                                >
                                    <div className="flex items-center gap-1.5">
                                        <Building2 className="h-3.5 w-3.5 text-neutral-400" />
                                        <span>Branch & Management</span>
                                    </div>
                                </th>
                            </tr>
                            <tr className="border-b border-neutral-100">
                                <td className="w-1/4 px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-50/20">
                                    Branch Name
                                </td>
                                <td className="w-1/4 px-4 py-3 font-semibold text-neutral-900">
                                    {branch.name}
                                </td>
                                <td className="w-1/4 px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-50/20">
                                    Branch Code
                                </td>
                                <td className="w-1/4 px-4 py-3 font-mono font-semibold text-neutral-900">
                                    {branch.code}
                                </td>
                            </tr>
                            <tr className="border-b border-neutral-100">
                                <td className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-50/20">
                                    Status
                                </td>
                                <td className="px-4 py-3">
                                    <BranchStatusBadge status={branch.status} size="sm" />
                                </td>
                                <td className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-50/20">
                                    Branch Manager
                                </td>
                                <td className="px-4 py-3 font-semibold text-neutral-900">
                                    <div className="flex items-center gap-1.5">
                                        <User className="h-3.5 w-3.5 text-neutral-400" />
                                        <span>{branch.managerName || "Unassigned"}</span>
                                    </div>
                                </td>
                            </tr>

                            {/* Section 2: Location & Address */}
                            <tr className="border-b border-neutral-100 bg-neutral-50/70">
                                <th
                                    colSpan={4}
                                    className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500"
                                >
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                                        <span>Location Details</span>
                                    </div>
                                </th>
                            </tr>
                            <tr className="border-b border-neutral-100">
                                <td className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-50/20">
                                    Full Address
                                </td>
                                <td colSpan={3} className="px-4 py-3 font-semibold text-neutral-900">
                                    {branch.address}
                                </td>
                            </tr>
                            <tr className="border-b border-neutral-100">
                                <td className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-50/20">
                                    City
                                </td>
                                <td className="px-4 py-3 font-semibold text-neutral-900">
                                    {branch.city}
                                </td>
                                <td className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-50/20">
                                    State / Province
                                </td>
                                <td className="px-4 py-3 font-semibold text-neutral-900">
                                    {branch.state}
                                </td>
                            </tr>
                            <tr className="border-b border-neutral-100">
                                <td className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-50/20">
                                    Pincode
                                </td>
                                <td className="px-4 py-3 font-mono font-semibold text-neutral-900">
                                    {branch.pincode}
                                </td>
                                <td className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-50/20">
                                    Combined Location
                                </td>
                                <td className="px-4 py-3 text-neutral-600 font-medium">
                                    {location}
                                </td>
                            </tr>

                            {/* Section 3: Contact Details */}
                            <tr className="border-b border-neutral-100 bg-neutral-50/70">
                                <th
                                    colSpan={4}
                                    className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500"
                                >
                                    <div className="flex items-center gap-1.5">
                                        <Phone className="h-3.5 w-3.5 text-neutral-400" />
                                        <span>Contact Information</span>
                                    </div>
                                </th>
                            </tr>
                            <tr className="border-b border-neutral-100">
                                <td className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-50/20">
                                    Phone Number
                                </td>
                                <td className="px-4 py-3 font-mono font-semibold text-neutral-900">
                                    {branch.phone || "—"}
                                </td>
                                <td className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-50/20">
                                    Email Address
                                </td>
                                <td className="px-4 py-3 font-semibold text-neutral-900">
                                    {branch.email ? (
                                        <div className="flex items-center gap-1.5">
                                            <Mail className="h-3.5 w-3.5 text-neutral-400" />
                                            <span>{branch.email}</span>
                                        </div>
                                    ) : (
                                        "—"
                                    )}
                                </td>
                            </tr>

                            {/* Section 4: System / Record Information */}
                            <tr className="border-b border-neutral-100 bg-neutral-50/70">
                                <th
                                    colSpan={4}
                                    className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500"
                                >
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5 text-neutral-400" />
                                        <span>System Record Information</span>
                                    </div>
                                </th>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-50/20">
                                    Created At
                                </td>
                                <td className="px-4 py-3 text-neutral-600 font-medium">
                                    {formatDate(branch.createdAt)}
                                </td>
                                <td className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-50/20">
                                    Last Updated
                                </td>
                                <td className="px-4 py-3 text-neutral-600 font-medium">
                                    {formatDate(branch.updatedAt)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}