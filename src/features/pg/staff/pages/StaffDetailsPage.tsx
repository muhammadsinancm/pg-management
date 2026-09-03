import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Staff } from "../types/staff.types";
import { getStaffMember } from "../services/staffService";

export function StaffDetailsPage() {
    const { staffId } = useParams()
    const navigate = useNavigate()

    const [staff, setStaff] = useState<Staff | null>(null)
    const [loading, setLoaidng] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {

        async function loadStaff() {
            if (!staffId) {
                setError('Staff ID is missing')
                setLoaidng(false)
                return
            }
            try {
                setLoaidng(true)
                setError(null)

                const data = await getStaffMember(staffId)

                if (!data) {
                    setError('Staff member not found')
                    return
                }

                setStaff(data)

            } catch (error) {
                console.error('Failed to load staff', error)
                setError(error instanceof Error ? error.message : 'Failed to load staff')

            } finally {
                setLoaidng(false)
            }
        }

        loadStaff()

    }, [staffId])

    function formatRole(role: Staff['role']) {
        return role.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase())
    }

    function formatSalary(salary: number, salaryType: Staff['salaryType']) {
        return `₹${salary.toLocaleString('en-IN')} / ${salaryType}`
    }

    if (loading) {
        return (
            <div className="p-6">
                Loading staff details...
            </div>
        )
    }

    if (error || !staff) {
        return (
            <div className="space-y-4 p-6">

                <button
                    type="button"
                    onClick={() =>
                        navigate("/pg/staff")
                    }
                    className="rounded border px-4 py-2"
                >
                    ← Back to Staff
                </button>

                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                    {error ?? "Staff member not found"}
                </div>

            </div>
        )
    }

    return (

        <div className="space-y-6 p-6">

            {/* Header */}

            <div className="flex items-center justify-between">

                <div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/pg/staff")
                        }
                        className="mb-3 text-sm text-gray-500 hover:text-black"
                    >
                        ← Back to Staff
                    </button>

                    <h1 className="text-2xl font-semibold">
                        {staff.name}
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        {staff.employeeId
                            ? staff.employeeId
                            : "Staff member"}
                    </p>

                </div>


                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/pg/staff/${staff.id}/edit`
                        )
                    }
                    className="rounded bg-black px-4 py-2 text-white"
                >
                    Edit Staff
                </button>

            </div>


            {/* Status */}

            <div>

                <span
                    className={
                        staff.status === "active"
                            ? "rounded-full bg-green-100 px-3 py-1 text-sm text-green-700"
                            : "rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
                    }
                >
                    {staff.status === "active"
                        ? "Active"
                        : "Inactive"}
                </span>

            </div>


            {/* Personal Information */}

            <section className="rounded-lg border">

                <div className="border-b p-4">

                    <h2 className="text-lg font-semibold">
                        Personal Information
                    </h2>

                </div>


                <div className="grid grid-cols-1 gap-5 p-4 md:grid-cols-2">

                    <div>
                        <p className="text-sm text-gray-500">
                            Name
                        </p>

                        <p className="mt-1 font-medium">
                            {staff.name}
                        </p>
                    </div>


                    <div>
                        <p className="text-sm text-gray-500">
                            Phone
                        </p>

                        <p className="mt-1">
                            {staff.phone}
                        </p>
                    </div>


                    <div>
                        <p className="text-sm text-gray-500">
                            Email
                        </p>

                        <p className="mt-1">
                            {staff.email || "-"}
                        </p>
                    </div>


                    <div>
                        <p className="text-sm text-gray-500">
                            Date of Birth
                        </p>

                        <p className="mt-1">
                            {staff.dateOfBirth || "-"}
                        </p>
                    </div>


                    <div>
                        <p className="text-sm text-gray-500">
                            Gender
                        </p>

                        <p className="mt-1 capitalize">
                            {staff.gender || "-"}
                        </p>
                    </div>


                    <div className="md:col-span-2">

                        <p className="text-sm text-gray-500">
                            Address
                        </p>

                        <p className="mt-1">
                            {staff.address || "-"}
                        </p>

                    </div>

                </div>

            </section>


            {/* Employment Information */}

            <section className="rounded-lg border">

                <div className="border-b p-4">

                    <h2 className="text-lg font-semibold">
                        Employment Information
                    </h2>

                </div>


                <div className="grid grid-cols-1 gap-5 p-4 md:grid-cols-2">

                    <div>
                        <p className="text-sm text-gray-500">
                            Employee ID
                        </p>

                        <p className="mt-1">
                            {staff.employeeId || "-"}
                        </p>
                    </div>


                    <div>
                        <p className="text-sm text-gray-500">
                            Branch ID
                        </p>

                        <p className="mt-1">
                            {staff.branchId}
                        </p>
                    </div>


                    <div>
                        <p className="text-sm text-gray-500">
                            Role
                        </p>

                        <p className="mt-1">
                            {formatRole(staff.role)}
                        </p>
                    </div>


                    <div>
                        <p className="text-sm text-gray-500">
                            Joined Date
                        </p>

                        <p className="mt-1">
                            {staff.joinedDate}
                        </p>
                    </div>


                    <div>
                        <p className="text-sm text-gray-500">
                            Employment Status
                        </p>

                        <p className="mt-1 capitalize">
                            {staff.status}
                        </p>
                    </div>

                </div>

            </section>


            {/* Salary Information */}

            <section className="rounded-lg border">

                <div className="border-b p-4">

                    <h2 className="text-lg font-semibold">
                        Salary Information
                    </h2>

                </div>


                <div className="grid grid-cols-1 gap-5 p-4 md:grid-cols-2">

                    <div>
                        <p className="text-sm text-gray-500">
                            Salary
                        </p>

                        <p className="mt-1 text-lg font-semibold">
                            {formatSalary(
                                staff.salary,
                                staff.salaryType
                            )}
                        </p>
                    </div>


                    <div>
                        <p className="text-sm text-gray-500">
                            Salary Type
                        </p>

                        <p className="mt-1 capitalize">
                            {staff.salaryType}
                        </p>
                    </div>


                    {staff.salaryType === "monthly" && (

                        <div>
                            <p className="text-sm text-gray-500">
                                Salary Payment Day
                            </p>

                            <p className="mt-1">
                                {staff.paymentDay
                                    ? `Day ${staff.paymentDay}`
                                    : "-"}
                            </p>
                        </div>

                    )}

                </div>

            </section>


            {/* Metadata */}

            <section className="rounded-lg border">

                <div className="border-b p-4">

                    <h2 className="text-lg font-semibold">
                        Record Information
                    </h2>

                </div>


                <div className="grid grid-cols-1 gap-5 p-4 md:grid-cols-2">

                    <div>

                        <p className="text-sm text-gray-500">
                            Created At
                        </p>

                        <p className="mt-1 text-sm">
                            {staff.createdAt
                                ? new Date(
                                    staff.createdAt
                                ).toLocaleString()
                                : "-"}

                        </p>

                    </div>


                    <div>

                        <p className="text-sm text-gray-500">
                            Updated At
                        </p>

                        <p className="mt-1 text-sm">
                            {staff.updatedAt
                                ? new Date(
                                    staff.updatedAt
                                ).toLocaleString()
                                : "-"}

                        </p>

                    </div>

                </div>

            </section>

        </div>
    )
}