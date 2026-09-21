import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useStaff } from "../hooks/useStaff";
import { CreateStaffInput } from "../types/staff.types";
import { StaffForm } from "../components/StaffForm";

export function CreateStaffPage() {
    const navigate = useNavigate();
    const { addStaff } = useStaff();

    async function handleSubmit(data: CreateStaffInput) {
        try {
            await addStaff(data);
            navigate("/pg/staff");
        } catch (error) {
            console.error("Failed to create staff", error);
            throw error;
        }
    }

    function handleCancel() {
        navigate("/pg/staff");
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
                    <span>Back to Staff</span>
                </button>
            </div>

            {/* Page Title Card */}
            <div className="flex flex-col gap-1">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                    Add New Staff Member
                </h1>
                <p className="text-xs text-neutral-500">
                    Register a new employee and configure roles, branch assignment, and compensation
                </p>
            </div>

            {/* Form Card Container */}
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 sm:p-6 shadow-2xs">
                <StaffForm
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
}