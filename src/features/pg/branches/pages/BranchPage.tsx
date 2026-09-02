import { useNavigate } from "react-router";
import { useBranches } from "../hooks/useBranches";
import { useState } from "react";
import { Branch, CreateBranchInput } from "../types/branch.types";
import { BranchTable } from "../components/BranchTable";
import { BranchForm } from "../components/BranchForm";
import { BranchStats } from "../components/BranchStats";

export function BranchesPage() {
    const navigate = useNavigate()

    const { branches, loading, error, addBranch, editBranch, removeBranch } = useBranches()

    const [showForm, setShowForm] = useState(false)
    const [editingBranch, setEditingBranch] = useState<Branch | undefined>(undefined)

    async function handleSubmit(data: CreateBranchInput) {
        try {
            if (editingBranch) {
                await editBranch(editingBranch.id, data)

            } else {
                await addBranch(data)
            }

            setShowForm(false)
            setEditingBranch(undefined)

        } catch (error) {
            console.error(error)
            alert(editingBranch ? 'Failed to update branch' : 'Failed to create branch')
        }
    }

    function handleCreate() {
        setEditingBranch(undefined)
        setShowForm(true)
    }

    function handleEdit(branch: Branch) {
        setEditingBranch(branch)
        setShowForm(true)
    }

    function handleView(branch: Branch) {
        navigate(`/pg/branches/${branch.id}`)
    }

    async function handleDelete(branch: Branch) {

        const confirmed = window.confirm(`Are you sure you want to delete "${branch.name}"?`)
        if (!confirmed) {
            return
        }

        try {
            console.log(branch.id);
            
            await removeBranch(branch.id)

        } catch (error) {
            console.error(error)
            alert('Failed to delete branch')
        }

    }

    function handleCancel() {
        setShowForm(false)
        setEditingBranch(undefined)
    }

    if (loading) {
        return (
            <div className="p-6">
                Loading branches...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">

                <p className="text-red-600">
                    {error}
                </p>

            </div>
        );
    }

    return (

        <div className="space-y-6 p-6">

            {/* Header */}

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-2xl font-semibold">
                        Branches
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Manage your PG branches
                    </p>

                </div>


                <button
                    type="button"
                    onClick={handleCreate}
                    className="
                        rounded-md
                        bg-primary
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-primary-foreground
                    "
                >
                    Add Branch
                </button>

            </div>



            {/* Statistics */}

            <BranchStats
                branches={branches}
            />



            {/* Form */}

            {showForm && (

                <div className="rounded-xl border p-6">

                    <h2 className="mb-5 text-lg font-semibold">

                        {editingBranch
                            ? "Edit Branch"
                            : "Create Branch"
                        }

                    </h2>


                    <BranchForm
                        branch={editingBranch}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                    />

                </div>

            )}



            {/* Branch List */}

            {!showForm && (

                branches.length === 0 ? (

                    <div
                        className="
                            rounded-xl
                            border
                            p-10
                            text-center
                        "
                    >

                        <h2 className="text-lg font-medium">
                            No branches found
                        </h2>


                        <p className="mt-1 text-sm text-muted-foreground">
                            Create your first branch to get started.
                        </p>


                        <button
                            type="button"
                            onClick={handleCreate}
                            className="
                                mt-4
                                rounded-md
                                bg-primary
                                px-4
                                py-2
                                text-sm
                                text-primary-foreground
                            "
                        >
                            Add Branch
                        </button>

                    </div>

                ) : (

                    <BranchTable
                        branches={branches}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                )

            )}

        </div>
    );
}