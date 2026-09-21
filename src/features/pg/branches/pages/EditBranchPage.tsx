import { useNavigate, useParams } from "react-router";
import { useBranches } from "../hooks/useBranches";
import { useEffect, useState } from "react";
import { AlertCircle, ArrowLeft, Building2 } from "lucide-react";
import { Branch, CreateBranchInput } from "../types/branch.types";
import { getBranch } from "../services/branchService";
import { BranchForm } from "../components/BranchForm";

export function EditBranchPage() {
    const { branchId } = useParams();
    const navigate = useNavigate();
    const { editBranch } = useBranches();

    const [branch, setBranch] = useState<Branch | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    async function handleSubmit(data: CreateBranchInput) {
        if (!branchId) {
            alert("Branch ID is missing");
            return;
        }

        await editBranch(branchId, data);
        navigate(`/pg/branches/${branchId}`);
    }

    function handleCancel() {
        if (branchId) {
            navigate(`/pg/branches/${branchId}`);
        } else {
            navigate("/pg/branches");
        }
    }

    if (loading) {
        return (
            <div className="w-full min-w-0 space-y-4 p-4 sm:p-6 max-w-4xl mx-auto animate-pulse">
                <div className="h-4 w-28 rounded bg-neutral-200" />
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-neutral-200" />
                    <div className="space-y-1.5 flex-1">
                        <div className="h-5 w-40 rounded bg-neutral-200" />
                        <div className="h-3 w-60 rounded bg-neutral-100" />
                    </div>
                </div>
                <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-2xs space-y-4">
                    <div className="h-10 rounded-xl bg-neutral-100" />
                    <div className="h-10 rounded-xl bg-neutral-100" />
                    <div className="h-20 rounded-xl bg-neutral-100" />
                </div>
            </div>
        );
    }

    if (error || !branch) {
        return (
            <div className="w-full min-w-0 space-y-4 p-4 sm:p-6 max-w-4xl mx-auto">
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
                    <span>Back to Branch Details</span>
                </button>
            </div>

            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-2xs">
                    <Building2 className="h-5 w-5" />
                </div>
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                        Edit Branch
                    </h1>
                    <p className="mt-0.5 text-xs text-neutral-400">
                        Update {branch.name} ({branch.code}) details and contact information
                    </p>
                </div>
            </div>

            {/* Form Container */}
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-7 shadow-2xs">
                <BranchForm branch={branch} onSubmit={handleSubmit} onCancel={handleCancel} />
            </div>
        </div>
    );
}