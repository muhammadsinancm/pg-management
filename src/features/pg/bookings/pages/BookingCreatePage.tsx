import { useNavigate } from "react-router";
import { useBookings } from "../hooks/useBookings";
import { BookingForm } from "../components/BookingForm";

export function BookingCreatePage() {
    const navigate = useNavigate()

    const { addBooking } = useBookings()

    const organizationId = 'org001'
    const createdBy = 'current-user'

    const handleSubmit = async (data: Parameters<typeof addBooking>[0]) => {
        try {
            await addBooking(data)
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