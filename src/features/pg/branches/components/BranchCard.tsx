import { Branch } from "../types/branch.types";
import { BranchStatusBadge } from "./BranchStatusBadge";

interface BranchCardProps {
    branch: Branch
    onView: (branch: Branch) => void
    onEdit: (branch: Branch) => void
    onDelete: (brnach: Branch) => void
}

export function BranchCard({ branch, onView, onEdit, onDelete }: BranchCardProps) {
    return (
        <div className="rounded-xl border bg-card p-5 space-y-4">

            {/* Header */}
            <div className="flex items-start justify-between">

                <div>
                    <h2 className="text-lg font-semibold">
                        {branch.name}
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Code: {branch.code}
                    </p>
                </div>


                <BranchStatusBadge
                    status={branch.status}
                />

            </div>


            {/* Details */}
            <div className="space-y-2 text-sm">

                <div>
                    <span className="font-medium">
                        Address:
                    </span>

                    <p className="text-muted-foreground">
                        {branch.address}
                    </p>
                </div>


                {branch.phone && (
                    <div>
                        <span className="font-medium">
                            Phone:
                        </span>

                        <p className="text-muted-foreground">
                            {branch.phone}
                        </p>
                    </div>
                )}

            </div>



            {/* Actions */}
            <div className="flex gap-2 pt-3">


                <button
                    type="button"
                    onClick={() => onView(branch)}
                    className="rounded-md border px-3 py-1.5 text-sm"
                >
                    View
                </button>


                <button
                    type="button"
                    onClick={() => onEdit(branch)}
                    className="rounded-md border px-3 py-1.5 text-sm"
                >
                    Edit
                </button>


                <button
                    type="button"
                    onClick={() => onDelete(branch)}
                    className="
                        rounded-md
                        border
                        border-red-500
                        px-3
                        py-1.5
                        text-sm
                        text-red-600
                        hover:bg-red-50
                    "
                >
                    Delete
                </button>


            </div>

        </div>
    )

}