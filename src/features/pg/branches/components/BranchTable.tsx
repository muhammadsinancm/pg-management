import { Branch } from "../types/branch.types";
import { BranchStatusBadge } from "./BranchStatusBadge";

interface BranchTableProps {
    branches: Branch[]
    onView: (branch: Branch) => void
    onEdit: (branch: Branch) => void
    onDelete: (branch: Branch) => Promise<void>
}

export function BranchTable({branches, onView, onEdit, onDelete}: BranchTableProps) {
    return (

        <div className="overflow-hidden rounded-xl border">


            <table className="w-full">


                <thead>

                    <tr className="border-b bg-muted/30">


                        <th className="px-4 py-3 text-left text-sm font-medium">
                            Branch
                        </th>


                        <th className="px-4 py-3 text-left text-sm font-medium">
                            Code
                        </th>


                        <th className="px-4 py-3 text-left text-sm font-medium">
                            Location
                        </th>


                        <th className="px-4 py-3 text-left text-sm font-medium">
                            Manager
                        </th>


                        <th className="px-4 py-3 text-left text-sm font-medium">
                            Phone
                        </th>


                        <th className="px-4 py-3 text-left text-sm font-medium">
                            Status
                        </th>


                        <th className="px-4 py-3 text-left text-sm font-medium">
                            Actions
                        </th>


                    </tr>

                </thead>

                <tbody>


                    {branches.map(branch => (


                        <tr
                            key={branch.id}
                            className="border-b last:border-b-0"
                        >


                            <td className="px-4 py-3">


                                <div>

                                    <p className="font-medium">
                                        {branch.name}
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                        {branch.email ?? "-"}
                                    </p>

                                </div>

                            </td>

                            <td className="px-4 py-3">

                                {branch.code}

                            </td>

                            <td className="px-4 py-3">


                                <div>

                                    <p>
                                        {branch.city}
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                        {branch.state}
                                    </p>

                                </div>

                            </td>

                            <td className="px-4 py-3">

                                {branch.managerName ?? "-"}

                            </td>

                            <td className="px-4 py-3">

                                {branch.phone ?? "-"}

                            </td>

                            <td className="px-4 py-3">

                                <BranchStatusBadge
                                    status={branch.status}
                                />

                            </td>

                            <td className="px-4 py-3">

                                <div className="flex gap-2">

                                    <button
                                        onClick={() =>
                                            onView(branch)
                                        }
                                        className="rounded-md border px-3 py-1 text-sm"
                                    >
                                        View
                                    </button>

                                    <button
                                        onClick={() =>
                                            onEdit(branch)
                                        }
                                        className="rounded-md border px-3 py-1 text-sm"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            onDelete(branch)
                                        }
                                        className="rounded-md border border-red-500 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </td>

                        </tr>
                    ))}

                </tbody>

            </table>

        </div>

    )
}