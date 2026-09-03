import { Staff } from "../types/staff.types";

interface StaffCardProps {
    staff: Staff
    onView: (staff: Staff) => void
    onEdit: (staff: Staff) => void
    onDelete: (staff: Staff) => void
}

export function StaffCard({ staff, onView, onEdit, onDelete }: StaffCardProps) {
    function formatRole(role: Staff['role']) {
        return role.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase())
    }

    function formatSalary(salary: number, salaryType: Staff['salaryType']) {
        return `₹${salary.toLocaleString('en-IN')} / ${salaryType}`
    }

    return (
        <div className="rounded-lg border bg-white p-5 shadow-sm">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {staff.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                        {staff.employeeId || "No Employee ID"}
                    </p>
                </div>

                <span
                    className={
                        staff.status === "active"
                            ? "rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
                            : "rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                    }
                >
                    {staff.status === "active"
                        ? "Active"
                        : "Inactive"}
                </span>
            </div>

            {/* Staff information */}
            <div className="mt-5 space-y-3">
                <div className="flex justify-between gap-4">
                    <span className="text-sm text-gray-500">
                        Role
                    </span>

                    <span className="text-sm font-medium text-gray-900">
                        {formatRole(staff.role)}
                    </span>
                </div>

                <div className="flex justify-between gap-4">
                    <span className="text-sm text-gray-500">
                        Phone
                    </span>

                    <span className="text-sm text-gray-900">
                        {staff.phone}
                    </span>
                </div>

                {staff.email && (
                    <div className="flex justify-between gap-4">
                        <span className="text-sm text-gray-500">
                            Email
                        </span>

                        <span className="max-w-[200px] truncate text-sm text-gray-900">
                            {staff.email}
                        </span>
                    </div>
                )}

                <div className="flex justify-between gap-4">
                    <span className="text-sm text-gray-500">
                        Salary
                    </span>

                    <span className="text-sm font-medium text-gray-900">
                        {formatSalary(
                            staff.salary,
                            staff.salaryType
                        )}
                    </span>
                </div>

                <div className="flex justify-between gap-4">
                    <span className="text-sm text-gray-500">
                        Joined
                    </span>

                    <span className="text-sm text-gray-900">
                        {staff.joinedDate}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex gap-2 border-t pt-4">
                <button
                    type="button"
                    onClick={() => onView(staff)}
                    className="flex-1 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
                >
                    View
                </button>

                <button
                    type="button"
                    onClick={() => onEdit(staff)}
                    className="flex-1 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
                >
                    Edit
                </button>

                <button
                    type="button"
                    onClick={() => onDelete(staff)}
                    className="flex-1 rounded-lg border px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                    Delete
                </button>
            </div>
        </div>
    )
}