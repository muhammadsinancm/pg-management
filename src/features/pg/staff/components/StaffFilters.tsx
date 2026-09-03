import { SalaryType, StaffRole, StaffStatus } from "../types/staff.types"

interface StaffFiltersProps {
    search: string
    role: StaffRole | 'all'
    status: StaffStatus | 'all'
    salaryType: SalaryType | 'all'
    onSearchChange: (value: string) => void
    onRoleChange: (value: StaffRole | 'all') => void
    onStatusChange: (value: StaffStatus | 'all') => void
    onSalaryTypeChange: (value: SalaryType | 'all') => void
    onClear: () => void
}

export function StaffFilters({search, role, status, salaryType, onSearchChange, onRoleChange, onStatusChange, onSalaryTypeChange, onClear}: StaffFiltersProps) {
    const hasFilters = search !== '' || role !== 'all' || status !== 'all' || salaryType !== 'all'

    return (
        <div className="rounded-lg border bg-white p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

                {/* Search */}
                <div>
                    <label
                        htmlFor="staff-search"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Search
                    </label>

                    <input
                        id="staff-search"
                        type="text"
                        value={search}
                        onChange={event =>
                            onSearchChange(event.target.value)
                        }
                        placeholder="Name, phone, employee ID..."
                        className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
                    />
                </div>

                {/* Role */}
                <div>
                    <label
                        htmlFor="staff-role"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Role
                    </label>

                    <select
                        id="staff-role"
                        value={role}
                        onChange={event =>
                            onRoleChange(
                                event.target.value as StaffRole | "all"
                            )
                        }
                        className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
                    >
                        <option value="all">
                            All Roles
                        </option>

                        <option value="manager">
                            Manager
                        </option>

                        <option value="reception">
                            Reception
                        </option>

                        <option value="cook">
                            Cook
                        </option>

                        <option value="cleaner">
                            Cleaner
                        </option>

                        <option value="security">
                            Security
                        </option>

                        <option value="maintenance">
                            Maintenance
                        </option>
                    </select>
                </div>

                {/* Status */}
                <div>
                    <label
                        htmlFor="staff-status"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Status
                    </label>

                    <select
                        id="staff-status"
                        value={status}
                        onChange={event =>
                            onStatusChange(
                                event.target.value as StaffStatus | "all"
                            )
                        }
                        className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
                    >
                        <option value="all">
                            All Status
                        </option>

                        <option value="active">
                            Active
                        </option>

                        <option value="inactive">
                            Inactive
                        </option>
                    </select>
                </div>

                {/* Salary Type */}
                <div>
                    <label
                        htmlFor="staff-salary-type"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Salary Type
                    </label>

                    <select
                        id="staff-salary-type"
                        value={salaryType}
                        onChange={event =>
                            onSalaryTypeChange(
                                event.target.value as SalaryType | "all"
                            )
                        }
                        className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
                    >
                        <option value="all">
                            All Salary Types
                        </option>

                        <option value="monthly">
                            Monthly
                        </option>

                        <option value="weekly">
                            Weekly
                        </option>

                        <option value="daily">
                            Daily
                        </option>
                    </select>
                </div>
            </div>

            {/* Clear */}
            {hasFilters && (
                <div className="mt-4">
                    <button
                        type="button"
                        onClick={onClear}
                        className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    )
}