import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Staff } from "../types/staff.types";
import { getStaffMember } from "../services/staffService";
import { useStaff } from "../hooks/useStaff";
import { StaffForm } from "../components/StaffForm";

export function EditStaffPage() {
    const { staffId } = useParams()
    const navigate = useNavigate()
    const { editStaff } = useStaff()

    const [staff, setStaff] = useState<Staff | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadStaff() {
            if (!staffId) {
                setError('Staff ID is missing')
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                setError(null)

                const data = await getStaffMember(staffId)
                if (!data) {
                    setError('Staff member not found')
                    return
                }
                setStaff(data)

            } catch (error) {
                console.error('Failed to load staff member', error)
                setError(error instanceof Error ? error.message : 'Failed to load staff member')

            } finally {
                setLoading(false)
            }
        }
        loadStaff()
    }, [staffId])

    async function handleSubmit(data: Parameters<typeof editStaff>[1]) {
        if (!staffId) {
            throw new Error('Staff ID is missing')
        }

        try {
            await editStaff(staffId, data)
            navigate(`/pg/staff/${staffId}`)

        } catch (error) {
            console.error('Failed to update staff')
            throw error
        }
    }

    function handleCancel() {
        if (!staffId) {
            navigate(`/pg/staff/${staffId}`)

        } else {
            navigate('/pg/staff')
        }
    }

    if (loading) {
        return (
            <div className="p-6">
                <p>Loading staff...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                    {error}
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/pg/staff")}
                    className="mt-4 rounded-lg border px-4 py-2"
                >
                    Back to Staff
                </button>
            </div>
        )
    }

    if (!staff) {
        return (
            <div className="p-6">
                <p>Staff member not found.</p>

                <button
                    type="button"
                    onClick={() => navigate("/pg/staff")}
                    className="mt-4 rounded-lg border px-4 py-2"
                >
                    Back to Staff
                </button>
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">
                    Edit Staff
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Update staff member information
                </p>
            </div>

            <div className="rounded-lg border bg-white p-6">
                <StaffForm
                    staff={staff}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    )
}