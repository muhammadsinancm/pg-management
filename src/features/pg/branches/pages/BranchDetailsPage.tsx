import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Branch } from "../types/branch.types";
import { getBranch } from "../services/branchService";
import { BranchStatusBadge } from "../components/BranchStatusBadge";

export function BranchDetailsPage() {
    const { branchId } = useParams()

    const navigate = useNavigate()

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

    if (loading) {
        return (
            <div className="p-6">
                Loading branch...
            </div>
        );
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
                    className="rounded-md border px-4 py-2 text-sm"
                >
                    Back to Branches
                </button>

            </div>

        );
    }

    return (

        <div className="space-y-6 p-6">


            {/* Header */}

            <div className="flex items-center justify-between">

                <div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/pg/branches")
                        }
                        className="mb-3 text-sm text-muted-foreground hover:underline"
                    >
                        ← Back to Branches
                    </button>

                    <h1 className="text-2xl font-semibold">
                        {branch.name}
                    </h1>


                    <p className="text-sm text-muted-foreground">
                        Branch Code: {branch.code}
                    </p>

                </div>


                <div className="flex items-center gap-3">

                    <BranchStatusBadge
                        status={branch.status}
                    />


                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/pg/branches/${branch.id}/edit`
                            )
                        }
                        className="rounded-md border px-4 py-2 text-sm"
                    >
                        Edit
                    </button>

                </div>

            </div>



            {/* Branch Information */}

            <div className="grid gap-6 md:grid-cols-2">


                {/* Basic Information */}

                <div className="rounded-xl border p-6">

                    <h2 className="mb-4 text-lg font-semibold">
                        Branch Information
                    </h2>


                    <div className="space-y-4">


                        <DetailItem
                            label="Branch Name"
                            value={branch.name}
                        />


                        <DetailItem
                            label="Branch Code"
                            value={branch.code}
                        />


                        <DetailItem
                            label="Status"
                            value={
                                branch.status
                            }
                        />


                        <DetailItem
                            label="Manager"
                            value={
                                branch.managerName ?? "-"
                            }
                        />


                    </div>

                </div>



                {/* Contact Information */}

                <div className="rounded-xl border p-6">

                    <h2 className="mb-4 text-lg font-semibold">
                        Contact Information
                    </h2>


                    <div className="space-y-4">


                        <DetailItem
                            label="Phone"
                            value={
                                branch.phone ?? "-"
                            }
                        />


                        <DetailItem
                            label="Email"
                            value={
                                branch.email ?? "-"
                            }
                        />


                        <DetailItem
                            label="Address"
                            value={
                                branch.address
                            }
                        />


                        <DetailItem
                            label="City"
                            value={
                                branch.city
                            }
                        />


                        <DetailItem
                            label="State"
                            value={
                                branch.state
                            }
                        />


                        <DetailItem
                            label="Pincode"
                            value={
                                branch.pincode
                            }
                        />


                    </div>

                </div>

            </div>



            {/* Dates */}

            <div className="rounded-xl border p-6">

                <h2 className="mb-4 text-lg font-semibold">
                    Record Information
                </h2>


                <div className="grid gap-4 md:grid-cols-2">


                    <DetailItem
                        label="Created At"
                        value={
                            branch.createdAt
                                ? new Date(
                                    branch.createdAt
                                ).toLocaleString()
                                : "-"
                        }
                    />


                    <DetailItem
                        label="Last Updated"
                        value={
                            branch.updatedAt
                                ? new Date(
                                    branch.updatedAt
                                ).toLocaleString()
                                : "-"
                        }
                    />


                </div>

            </div>


        </div>

    );
}

interface DetailItemProps {
    label: string
    value: string
}

function DetailItem({ label, value }: DetailItemProps) {
    return (

        <div>

            <p className="text-sm text-muted-foreground">
                {label}
            </p>

            <p className="mt-1 font-medium">
                {value}
            </p>

        </div>

    );

} 