import { Branch } from "../types/branch.types";

interface BranchStatsProps {
    branches: Branch[]
}

export function BranchStats({branches}: BranchStatsProps) {
    const totalBranches = branches.length

    const activeBranches = branches.filter(branch => branch.status === 'active').length
    const inactiveBranches = branches.filter(branch => branch.status === 'inactive').length
    const maintenanceBranches = branches.filter(branch => branch.status === 'maintenance').length

    const stats = [
        {
            title: 'Total Branches',
            value: totalBranches
        },
        {
            title: 'Active',
            value: activeBranches
        },
        {
            title: 'Inactive',
            value: inactiveBranches
        },
        {
            title: 'Maintenance',
            value: maintenanceBranches
        }
    ]

    return (

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {stats.map((item) => (

                <div
                    key={item.title}
                    className="
                        rounded-xl
                        border
                        bg-card
                        p-5
                    "
                >

                    <p className="text-sm text-muted-foreground">
                        {item.title}
                    </p>


                    <h2 className="mt-2 text-3xl font-semibold">
                        {item.value}
                    </h2>


                </div>

            ))}

        </div>

    )
}