import { Staff } from "../types/staff.types";

interface StaffStatusProps {
    staff: Staff[]
}

export function StaffStatus({ staff }: StaffStatusProps) {
    const totalStaff = staff.length

    const activeStaff = staff.filter(member => member.status === 'active').length
    const inactiveStaff = staff.filter(member => member.status === 'inactive').length
    const managerCount = staff.filter(member => member.role === 'manager').length

    const stats = [
        {
            label: 'Total Staff',
            value: totalStaff
        },
        {
            label: 'Active Staff',
            value: activeStaff
        },
        {
            label: 'Inactive Staff',
            value: inactiveStaff
        },
        {
            label: 'Managers',
            value: managerCount
        }
    ]

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(stat => (
                <div
                    key={stat.label}
                    className="rounded-lg border bg-white p-5 shadow-sm"
                >
                    <p className="text-sm text-gray-500">
                        {stat.label}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900">
                        {stat.value}
                    </p>
                </div>
            ))}
        </div>
    )
}