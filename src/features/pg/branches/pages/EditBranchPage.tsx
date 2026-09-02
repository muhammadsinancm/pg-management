import { useNavigate, useParams } from "react-router";
import { useBranches } from "../hooks/useBranches";
import { useEffect, useState } from "react";
import { Branch, CreateBranchInput } from "../types/branch.types";
import { getBranch } from "../services/branchService";
import { BranchForm } from "../components/BranchForm";

export function EditBranchPage() {
    const { branchId } = useParams()

    const navigate = useNavigate()

    const { editBranch } = useBranches()

    const [branch, setBranch] = useState<Branch | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadBranch() {
            if (!branchId) {
                setError('Branch ID is missing')
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                setError(null)

                const data = await getBranch(branchId)
                if (!data) {
                    setError('Branch not found')
                    return
                }

                setBranch(data)

            } catch (error) {
                console.error(error)
                setError('Failed to load branch')

            } finally {
                setLoading(false)
            }
        }
        loadBranch()
    }, [branchId])

    async function handleSubmit(data: CreateBranchInput) {
        if (!branchId) {
            alert('Branch ID is missing')
            return
        }

        try {
            await editBranch(branchId, data)
            navigate(`/pg/branches/${branchId}`)

        } catch (error) {
            console.error(error)
            alert('Failed to update branch')
        }

    }

    function handleCancel() {
        if (branchId) {
            navigate(`/pg/branches/${branchId}`)

        } else {
            navigate('/pg/branches')
        }
    }

    if (loading) {
        return (

            <div className="p-6">

                Loading branch...

            </div>
        )
    }

    if (error || !branch) {
        return (

            <div className="space-y-4 p-6">

                <p className="text-red-600">
                    {error ?? "Branch not found"}
                </p>


                <button
                    type="button"
                    onClick={() =>
                        navigate("/pg/branches")
                    }
                    className="
                        rounded-md
                        border
                        px-4
                        py-2
                        text-sm
                    "
                >
                    Back to Branches
                </button>

            </div>

        );
    }

    return (

        <div className="space-y-6 p-6">


            {/* Header */}

            <div>

                <button
                    type="button"
                    onClick={handleCancel}
                    className="
                        mb-3
                        text-sm
                        text-muted-foreground
                        hover:underline
                    "
                >
                    ← Back to Branch
                </button>


                <h1 className="text-2xl font-semibold">
                    Edit Branch
                </h1>


                <p className="text-sm text-muted-foreground">
                    Update {branch.name} details
                </p>

            </div>



            {/* Form */}

            <div className="rounded-xl border p-6">

                <BranchForm
                    branch={branch}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />

            </div>


        </div>

    );

}