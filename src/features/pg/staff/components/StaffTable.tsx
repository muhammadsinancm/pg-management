import { Staff } from "../types/staff.types";

interface StaffTableProps {
    staff: Staff[]
    onView: (staff: Staff) => void
    onEdit: (staff: Staff) => void
    onDelete: (staff: Staff) => void
}

export function StaffTable({ staff, onView, onEdit, onDelete }: StaffTableProps) {
    function formatRole(role: Staff['role']) {
        return role.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase())
    }

    function formatSalary(salary: number, salaryType: Staff['salaryType']) {
        return `₹${salary.toLocaleString('en-IN')} / ${salaryType}`
    }

    return (
        <div className="overflow-x-auto rounded-lg border">

            <table className="w-full text-sm">

                <thead className="bg-gray-100">

                    <tr>

                        <th className="px-4 py-3 text-left">
                            Employee ID
                        </th>

                        <th className="px-4 py-3 text-left">
                            Name
                        </th>

                        <th className="px-4 py-3 text-left">
                            Phone
                        </th>

                        <th className="px-4 py-3 text-left">
                            Role
                        </th>

                        <th className="px-4 py-3 text-left">
                            Salary
                        </th>

                        <th className="px-4 py-3 text-left">
                            Status
                        </th>

                        <th className="px-4 py-3 text-left">
                            Actions
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {staff.map(member => (

                        <tr
                            key={member.id}
                            className="border-t hover:bg-gray-50"
                        >

                            <td className="px-4 py-3">
                                {member.employeeId || "-"}
                            </td>

                            <td className="px-4 py-3 font-medium">
                                {member.name}
                            </td>

                            <td className="px-4 py-3">
                                {member.phone}
                            </td>

                            <td className="px-4 py-3">
                                {formatRole(member.role)}
                            </td>

                            <td className="px-4 py-3">
                                {formatSalary(
                                    member.salary,
                                    member.salaryType
                                )}
                            </td>

                            <td className="px-4 py-3">

                                <span
                                    className={
                                        member.status === "active"
                                            ? "rounded-full bg-green-100 px-2 py-1 text-xs text-green-700"
                                            : "rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                                    }
                                >
                                    {member.status === "active"
                                        ? "Active"
                                        : "Inactive"}
                                </span>

                            </td>

                            <td className="px-4 py-3">

                                <div className="flex gap-2">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            onView(member)
                                        }
                                        className="rounded border px-3 py-1"
                                    >
                                        View
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            onEdit(member)
                                        }
                                        className="rounded border px-3 py-1"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            onDelete(member)
                                        }
                                        className="rounded border px-3 py-1 text-red-600"
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