import { useState } from "react";
import { useNavigate } from "react-router";
import { Staff } from "../types/staff.types";
import { useStaff } from "../hooks/useStaff";
import { StaffForm } from "../components/StaffForm";
import { StaffTable } from "../components/StaffTable";

export function StaffPage() {
    const navigate = useNavigate()

    const { staff, loading, error, addStaff, editStaff, removeStaff } = useStaff()

    const [showForm, setShowForm] = useState(false)
    const [editingStaff, setEditingStaff] = useState<Staff | undefined>()

    async function handleSubmit(data: Parameters<typeof addStaff>[0]) {
        if (editingStaff) {
            await editStaff(editingStaff.id, data)

        } else {
            await addStaff(data)
        }

        setEditingStaff(undefined)
        setShowForm(false)
    }

    function handleEdit(member: Staff) {        
        setEditingStaff(member)
        setShowForm(true)
    }

    function handleView(member: Staff) {
        navigate(`/pg/staff/${member.id}`)
    }

    async function handleDelete(member: Staff) {
        const confirmed = window.confirm(`Are you sure you want to delete ${member.name}?`)
        if (!confirmed) {
            return
        }

        try {
            await removeStaff(member.id)

        } catch (error) {
            console.error(error)
            alert('Failed to delete staff')
        }
    }

    if (loading) {
        return (
            <div className="p-6">
                Loading staff...
            </div>
        )
    }

    return (

        <div className="space-y-6 p-6">

            {/* Header */}

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-2xl font-semibold">
                        Staff
                    </h1>

                    <p className="text-sm text-gray-500">
                        Manage PG staff members
                    </p>

                </div>


                <button
                    type="button"
                    onClick={() => {
                        setEditingStaff(undefined)
                        setShowForm(true)
                    }}
                    className="rounded bg-black px-4 py-2 text-white"
                >
                    + Add Staff
                </button>

            </div>


            {/* Error */}

            {error && (

                <div className="rounded border border-red-200 bg-red-50 p-4 text-red-700">
                    {error}
                </div>

            )}


            {/* Stats */}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                <div className="rounded-lg border p-4">

                    <p className="text-sm text-gray-500">
                        Total Staff
                    </p>

                    <p className="mt-1 text-2xl font-semibold">
                        {staff.length}
                    </p>

                </div>


                <div className="rounded-lg border p-4">

                    <p className="text-sm text-gray-500">
                        Active Staff
                    </p>

                    <p className="mt-1 text-2xl font-semibold">
                        {
                            staff.filter(
                                member =>
                                    member.status === "active"
                            ).length
                        }
                    </p>

                </div>


                <div className="rounded-lg border p-4">

                    <p className="text-sm text-gray-500">
                        Inactive Staff
                    </p>

                    <p className="mt-1 text-2xl font-semibold">
                        {
                            staff.filter(
                                member =>
                                    member.status === "inactive"
                            ).length
                        }
                    </p>

                </div>

            </div>


            {/* Empty state */}

            {!staff.length ? (

                <div className="rounded-lg border p-10 text-center">

                    <h2 className="text-lg font-medium">
                        No staff found
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Add your first staff member.
                    </p>

                    <button
                        type="button"
                        onClick={() => {
                            setEditingStaff(undefined)
                            setShowForm(true)
                        }}
                        className="mt-4 rounded bg-black px-4 py-2 text-white"
                    >
                        + Add Staff
                    </button>

                </div>

            ) : (

                <StaffTable
                    staff={staff}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

            )}


            {/* Staff Form */}

            {showForm && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">

                        <div className="mb-6 flex items-center justify-between">

                            <h2 className="text-xl font-semibold">

                                {editingStaff
                                    ? "Edit Staff"
                                    : "Add Staff"}

                            </h2>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false)
                                    setEditingStaff(undefined)
                                }}
                                className="text-xl text-gray-500"
                            >
                                ×
                            </button>

                        </div>


                        <StaffForm
                            staff={editingStaff}
                            onSubmit={handleSubmit}
                            onCancel={() => {
                                setShowForm(false)
                                setEditingStaff(undefined)
                            }}
                        />

                    </div>

                </div>

            )}

        </div>
    )

}