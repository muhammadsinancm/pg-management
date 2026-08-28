import { useNavigate } from "react-router";
import { useBookings } from "../hooks/useBookings";
import { BookingForm } from "../components/BookingForm";

export function BookingCreatePage() {
    const navigate = useNavigate()

    const { addBooking } = useBookings()

    const organizationId = 'org001'
    const branchId = 'branch001'
    const createdBy = 'current-user'

    const handleSubmit = async (data: any) => {
        await addBooking(data)
        navigate('/pg/bookings')
    }
    return (
        <div className="mx-auto max-w-5xl">

            <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal-700">
                    PG Management / Bookings
                </p>
            </div>

            <BookingForm
                organizationId={
                    organizationId
                }
                branchId={branchId}
                createdBy={createdBy}
                onSubmit={
                    handleSubmit
                }
                onCancel={() =>
                    navigate(
                        "/pg/bookings"
                    )
                }
            />

        </div>
    )
}