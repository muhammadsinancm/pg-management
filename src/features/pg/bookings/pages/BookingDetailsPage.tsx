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
            <div className="flex min-h-[300px] items-center justify-center p-8 text-neutral-400">
                <div className="text-center space-y-2">
                    <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
                    <p className="text-xs font-medium">Loading booking details...</p>
                </div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="space-y-4">
                <div className="rounded-2xl border border-red-200 bg-red-50/80 p-4 sm:p-5 text-red-700 shadow-2xs">
                    <p className="text-xs sm:text-sm font-semibold">{error || "Booking not found."}</p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/pg/bookings")}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-neutral-800 transition-all cursor-pointer"
                >
                    ← Back to Bookings
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <div>
                <button
                    type="button"
                    onClick={() => navigate("/pg/bookings")}
                    className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                    ← Back to Bookings
                </button>

                <h1 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                    Booking Details
                </h1>
            </div>

            <BookingDetails booking={booking} />

            {booking.status === "pending" && (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5 pt-2">
                    <button
                        type="button"
                        onClick={async () => {
                            try {
                                await changeBookingStatus(
                                    booking.id,
                                    "confirmed"
                                );

                                setBooking({
                                    ...booking,
                                    status: "confirmed",
                                });
                            } catch (error) {
                                console.error("Failed to confirm booking", error);
                            }
                        }}
                        className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-neutral-800 cursor-pointer"
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
                                );

                                setBooking({
                                    ...booking,
                                    status: "cancelled",
                                });
                            } catch (error) {
                                console.error("Failed to cancel booking", error);
                            }
                        }}
                        className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-xs font-semibold text-red-600 shadow-2xs transition-colors hover:border-red-200 hover:bg-red-50 cursor-pointer"
                    >
                        Cancel Booking
                    </button>
                </div>
            )}

            {booking.status === "confirmed" && (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5 pt-2">
                    <button
                        type="button"
                        onClick={async () => {
                            try {
                                if (!customerName) {
                                    throw new Error(
                                        "Customer name could not be found."
                                    );
                                }

                                await checkInBooking(
                                    booking.id,
                                    customerName
                                );

                                setBooking({
                                    ...booking,
                                    status: "checked_in",
                                });
                            } catch (error) {
                                console.error(
                                    "Failed to check in",
                                    error
                                );

                                setError(
                                    error instanceof Error
                                        ? error.message
                                        : "Failed to check in."
                                );
                            }
                        }}
                        className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-neutral-800 cursor-pointer"
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
                                );

                                setBooking({
                                    ...booking,
                                    status: "cancelled",
                                });
                            } catch (error) {
                                console.error(
                                    "Failed to cancel booking",
                                    error
                                );
                            }
                        }}
                        className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-xs font-semibold text-red-600 shadow-2xs transition-colors hover:border-red-200 hover:bg-red-50 cursor-pointer"
                    >
                        Cancel Booking
                    </button>
                </div>
            )}

            {booking.status === "checked_in" && (
                <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-2.5 pt-2">
                    {/* Record Meal */}
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/pg/bookings/${booking.id}/meals`
                            )
                        }
                        className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-neutral-800 cursor-pointer"
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
                        className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-xs font-semibold text-neutral-700 shadow-2xs transition-colors hover:bg-neutral-50 cursor-pointer"
                    >
                        Create Invoice
                    </button>

                    {/* Check Out */}
                    <button
                        type="button"
                        onClick={handleCheckOut}
                        disabled={loading}
                        className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-xs font-semibold text-neutral-700 shadow-2xs transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? "Checking Out..." : "Check Out"}
                    </button>
                </div>
            )}
        </div>
    );
}