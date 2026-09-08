import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Booking } from "../types/booking.types";
import { checkInBooking, checkOutBooking, getBooking } from "../services/bookingService";
import { BookingDetails } from "../components/BookingDetails";
import { useBookings } from "../hooks/useBookings";
import { getGuest } from "../../guests/services/guestService";

export function BookingDetailsPage() {
    const { bookingId } = useParams<{ bookingId: string }>()
    const { changeBookingStatus } = useBookings()

    const navigate = useNavigate()

    const [booking, setBooking] = useState<Booking | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [customerName, setCustomerName] = useState('')

    useEffect(() => {
        async function loadBooking() {
            if (!bookingId) {
                setError('Booking ID is missing.')
                setLoading(false)
                return
            }

            try {
                const data = await getBooking(bookingId)
                if (!data) {
                    setError('Booking not found.')
                    return
                }
                setBooking(data)

                const guest = await getGuest(data.customerId)

                if (guest) {
                    setCustomerName(guest.fullName)
                }

            } catch (error) {
                console.error('Failed to load booking', error)
                setError(error instanceof Error ? error.message : 'Failed to load booking.')

            } finally {
                setLoading(false)
            }
        }
        loadBooking()
    }, [bookingId])

    const handleCheckOut = async () => {
        if (!booking) return

        try {
            setLoading(true)

            await checkOutBooking(booking.id)

            setBooking({
                ...booking,
                status: 'checked_out',
                checkOutDate: new Date()
            })

        } catch (error) {
            console.error(error)

        } finally {
            setLoading(false)
        }

    }

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

            {booking.status === "pending" && (
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={async () => {
                            try {
                                await changeBookingStatus(
                                    booking.id,
                                    "confirmed"
                                )

                                setBooking({
                                    ...booking,
                                    status: "confirmed",
                                })
                            } catch (error) {
                                console.error("Failed to confirm booking", error)
                            }
                        }}
                        className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                    >
                        Confirm Booking
                    </button>

                    <button
                        type="button"
                        onClick={async () => {
                            try {
                                await changeBookingStatus(
                                    booking.id,
                                    "cancelled"
                                )

                                setBooking({
                                    ...booking,
                                    status: "cancelled",
                                })
                            } catch (error) {
                                console.error("Failed to cancel booking", error)
                            }
                        }}
                        className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                    >
                        Cancel Booking
                    </button>
                </div>
            )}

            {booking.status === "confirmed" && (
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={async () => {
                            try {
                                if (!customerName) {
                                    throw new Error(
                                        "Customer name could not be found."
                                    )
                                }

                                await checkInBooking(
                                    booking.id,
                                    customerName
                                )

                                setBooking({
                                    ...booking,
                                    status: "checked_in",
                                })
                            } catch (error) {
                                console.error(
                                    "Failed to check in",
                                    error
                                )

                                setError(
                                    error instanceof Error
                                        ? error.message
                                        : "Failed to check in."
                                )
                            }
                        }}
                        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Check In
                    </button>

                    <button
                        type="button"
                        onClick={async () => {
                            try {
                                await changeBookingStatus(
                                    booking.id,
                                    "cancelled"
                                )

                                setBooking({
                                    ...booking,
                                    status: "cancelled",
                                })
                            } catch (error) {
                                console.error(
                                    "Failed to cancel booking",
                                    error
                                )
                            }
                        }}
                        className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                    >
                        Cancel Booking
                    </button>
                </div>
            )}

            {booking.status === "checked_in" && (
                <div className="flex flex-wrap gap-3">

                    {/* Record Meal */}
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/pg/bookings/${booking.id}/meals`
                            )
                        }
                        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                    >
                        Record Meal
                    </button>

                    {/* Create Invoice */}
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/pg/billing/invoices/create?bookingId=${booking.id}`
                            )
                        }
                        className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
                    >
                        Create Invoice
                    </button>

                    {/* Check Out */}
                    <button
                        type="button"
                        onClick={handleCheckOut}
                        disabled={loading}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Checking Out..." : "Check Out"}
                    </button>

                </div>
            )}

        </div>
    )
}