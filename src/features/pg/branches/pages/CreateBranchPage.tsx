import { useNavigate } from "react-router";
import { useBranches } from "../hooks/useBranches";
import { CreateBranchInput } from "../types/branch.types";
import { BranchForm } from "../components/BranchForm";

export function CreateBranchPage() {
    const navigate = useNavigate()

    const {addBranch} = useBranches()

    async function handleSubmit(data: CreateBranchInput) {
        try {
            await addBranch(data)
            navigate('/pg/branches')

        } catch (error) {
            console.error(error)
            alert('Failed to create branch')
        }
    }

    function handleCancel() {
        navigate('/pg/branches')
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
                    ← Back to Branches
                </button>


                <h1 className="text-2xl font-semibold">
                    Create Branch
                </h1>


                <p className="text-sm text-muted-foreground">
                    Add a new PG branch
                </p>

            </div>



            {/* Form */}

            <div className="rounded-xl border p-6">

                <BranchForm
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />

            </div>

        </div>

    );


}