import { BranchStatus } from "../types/branch.types";

interface BranchStatusBadgeProps {
    status: BranchStatus
}

export function BranchStatusBadge({ status }: BranchStatusBadgeProps) {
    const styles = {
        active: "bg-green-100 text-green-700 border-green-300",
        inactive: "bg-gray-100 text-gray-700 border-gray-300",
        maintenance: "bg-yellow-100 text-yellow-700 border-yellow-300"
    }

    return (
        <span
            className={`
                inline-flex
                items-center
                rounded-full
                border
                px-3
                py-1
                text-xs
                font-medium
                ${styles[status]}
            `}
        >
            {status.replace("_", " ")}
        </span>
    )

}