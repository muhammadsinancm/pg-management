import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Staff } from "../types/staff.types";
import { getStaffMember } from "../services/staffService";
import { useStaff } from "../hooks/useStaff";
import { StaffForm } from "../components/StaffForm";

export function EditStaffPage() {
    const { staffId } = useParams();
    const navigate = useNavigate();
    const { editStaff } = useStaff();

    const [staff, setStaff] = useState<Staff | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadStaff() {
            if (!staffId) {
                setError("Staff ID is missing.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const data = await getStaffMember(staffId);
                if (!data) {
                    setError("Staff member not found.");
                    return;
                }
                setStaff(data);
            } catch (err) {
                console.error("Failed to load staff member", err);
                setError(err instanceof Error ? err.message : "Failed to load staff member.");
            } finally {
                setLoading(false);
            }
        }
        loadStaff();
    }, [staffId]);

    async function handleSubmit(data: Parameters<typeof editStaff>[1]) {
        if (!staffId) {
            throw new Error("Staff ID is missing");
        }

        try {
            await editStaff(staffId, data);
            navigate(`/pg/staff/${staffId}`);
        } catch (err) {
            console.error("Failed to update staff", err);
            throw err;
        }
    }

    function handleCancel() {
        if (staffId) {
            navigate(`/pg/staff/${staffId}`);
        } else {
            navigate("/pg/staff");
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-[360px] items-center justify-center p-8 text-neutral-400">
                <div className="text-center space-y-2">
                    <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
                    <p className="text-xs font-medium">Loading staff member details...</p>
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
                            {error || "Staff member not found."}
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
            {/* Top Back Navigation */}
            <div>
                <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Staff Member</span>
                </button>
            </div>

            {/* Page Title Card */}
            <div className="flex flex-col gap-1">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                    Edit Staff Member
                </h1>
                <p className="text-xs text-neutral-500">
                    Update personal profile, employment assignment, or payroll information for{" "}
                    <span className="font-semibold text-neutral-800">{staff.name}</span>
                </p>
            </div>

            {/* Form Card Container */}
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 sm:p-6 shadow-2xs">
                <StaffForm
                    staff={staff}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
}