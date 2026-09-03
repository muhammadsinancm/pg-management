import { useNavigate } from "react-router";
import { useStaff } from "../hooks/useStaff";
import { CreateStaffInput } from "../types/staff.types";
import { StaffForm } from "../components/StaffForm";

export function CreateStaffPage() {
    const navigate = useNavigate()

    const { addStaff } = useStaff()

    async function handleSubmit(data: CreateStaffInput) {
        try {
            await addStaff(data)
            navigate('/pg/staff')

        } catch (error) {
            console.error('Failed to create staff', error)
            throw error
        }
    }

    function handleCancel() {
        navigate('/pg/staff')
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    Add Staff
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Add a new staff member to your PG
                </p>
            </div>

            {/* Form */}
            <div className="rounded-lg border bg-white p-6">
                <StaffForm
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    )
}