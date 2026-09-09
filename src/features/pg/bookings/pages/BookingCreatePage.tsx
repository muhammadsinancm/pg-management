import { useNavigate } from "react-router";
import { useBookings } from "../hooks/useBookings";
import { BookingForm } from "../components/BookingForm";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function BookingCreatePage() {
    const navigate = useNavigate()

    const { addBooking } = useBookings()

    const {user} = useAuth()

    if (!user) {
         return (
            <div className="p-6">
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    Please login to create a booking.
                </div>
            </div>
        );
    }

    const organizationId = user.organizationId
    const createdBy = user.id

    if (!organizationId) {
        return (
            <div className="p-6">
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    Your account is not assigned to an organization.
                </div>
            </div>
        );
    }

    const handleSubmit = async (data: Parameters<typeof addBooking>[0]) => {
        try {
            await addBooking({
                ...data,
                organizationId,
                createdBy
            })
            
            navigate('/pg/bookings')

        } catch (error) {
            console.error('Failed to create booking', error)
            throw error
        }

    }
    return (

        <div className="p-6">

            <BookingForm
                organizationId={organizationId}
                createdBy={createdBy}
                onSubmit={handleSubmit}
                onCancel={() =>
                    navigate("/pg/bookings")
                }
            />

        </div>
    )
}