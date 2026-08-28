import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Booking } from "../types/booking.types";
import { getBooking } from "../services/bookingService";
import { BookingDetails } from "../components/BookingDetails";

export function BookingDetailsPage() {
    const { bookingId } = useParams<{ bookingId: string }>()

    const navigate = useNavigate()

    const [booking, setBooking] = useState<Booking | null>(null)
    const [loading, setLoaidng] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadBooking() {
            if (!bookingId) {
                setError('Booking ID is missing.')
                setLoaidng(false)
                return
            }

            try {
                const data = await getBooking(bookingId)
                if (!data) {
                    setError('Booking not found.')
                    return
                }
                setBooking(data)

            } catch (error) {
                console.error('Failed to load booking', error)
                setError(error instanceof Error ? error.message : 'Failed to load booking.')

            } finally {
                setLoaidng(false)
            }
        }
        loadBooking()
    }, [bookingId])

    if (loading) {
        return (
            <div className="p-8 text-center text-gray-500">
                Loading booking...
            </div>
        )
    }

    if (error || !booking) {
        return (
            <div className="space-y-4">
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
                    {error ||
                        "Booking not found."}
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/pg/bookings"
                        )
                    }
                    className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
                >
                    Back to Bookings
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6">

            <div>
                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/pg/bookings"
                        )
                    }
                    className="text-sm font-medium text-teal-700 hover:text-teal-800"
                >
                    ← Back to Bookings
                </button>

                <h1 className="mt-4 text-3xl font-semibold text-gray-900">
                    Booking Details
                </h1>
            </div>

            <BookingDetails
                booking={booking}
            />

        </div>
    )
}