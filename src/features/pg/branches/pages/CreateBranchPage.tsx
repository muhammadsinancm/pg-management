import { useNavigate } from "react-router";
import { ArrowLeft, Building2 } from "lucide-react";
import { useBranches } from "../hooks/useBranches";
import { CreateBranchInput } from "../types/branch.types";
import { BranchForm } from "../components/BranchForm";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function CreateBranchPage() {
    const navigate = useNavigate();
    const { addBranch } = useBranches();
    const { user } = useAuth();

    async function handleSubmit(data: CreateBranchInput) {
        if (!user) {
            alert("You must be logged in to create a branch");
            return;
        }
        if (!user.organizationId) {
            alert("Organization ID is missing");
            return;
        }

        await addBranch({
            ...data,
            organizationId: user.organizationId,
        });

        navigate("/pg/branches");
    }

    function handleCancel() {
        navigate("/pg/branches");
    }

    return (
        <div className="w-full min-w-0 space-y-4 p-4 sm:p-6 max-w-4xl mx-auto">
            {/* Top Navigation */}
            <div>
                <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Branches</span>
                </button>
            </div>

            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-2xs">
                    <Building2 className="h-5 w-5" />
                </div>
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                        Create Branch
                    </h1>
                    <p className="mt-0.5 text-xs text-neutral-400">
                        Add a new PG branch location and assign facilities
                    </p>
                </div>
            </div>

            {/* Form Container */}
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-7 shadow-2xs">
                <BranchForm onSubmit={handleSubmit} onCancel={handleCancel} />
            </div>
        </div>
    );
}