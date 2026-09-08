import { useNavigate, useParams } from "react-router";
import { useCustomerMeals } from "../hooks/useCustomerMeals";
import { useEffect, useState } from "react";
import { Booking } from "../../bookings/types/booking.types";
import { getBooking } from "../../bookings/services/bookingService";
import { CustomerMealTable } from "../components/CustomerMealTable";
import { CustomerMealSummary } from "../components/CustomerMealSummary";
import { Guest } from "../../guests/types/guests.types";
import { getGuest } from "../../guests/services/guestService";

export default function CustomerMealsPage() {

    const {bookingId} = useParams<{bookingId: string}>()

    const navigate = useNavigate()

    const { customerMeals, loading, error, cancelMeal, removeCustomerMeal} = useCustomerMeals()

    const [booking, setBooking] = useState<Booking | null>(null)
    const [guest, setGuest] = useState<Guest | null>(null)
    const [pageLoading, setPageLoading] = useState(true)
    const [pageError, setPageError] = useState<string | null>(null)

    useEffect(() => {

        if (!bookingId) {
            setPageError('Booking ID is required')
            setPageLoading(false)
            return
        }

        async function loadData(id: string) {

            try {
                setPageLoading(true)
                setPageError(null)

                const bookingData = await getBooking(id)

                if (!bookingData) {
                    setPageError('Booking not found')
                    return
                }
                if (bookingData.status !== 'checked_in') {
                    setPageError('Customer must be checkd in to record a meal')
                    return
                }

                const guestData = await getGuest(bookingData.customerId)
               
                setBooking(bookingData)
                setGuest(guestData)

            } catch (error) {
                console.error('Failed to load customer meals', error)
                setPageError(error instanceof Error ? error.message : 'Failed to load customer meals')

            } finally {
                setPageLoading(false)
            }

        }
        loadData(bookingId)
    }, [bookingId])

    const bookingMeals = bookingId ? customerMeals.filter((meal) => meal.bookingId === bookingId) : []

    if (pageLoading) {
         return (
            <div className="flex min-h-[300px] items-center justify-center p-6">
                <p className="text-sm text-gray-500">
                    Loading customer meals...
                </p>
            </div>
        );
    }

    if (pageError) {
        return (
            <div className="space-y-4 p-6">
                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/pg/bookings/${bookingId}`
                        )
                    }
                    className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                    ← Back to Booking
                </button>

                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {pageError}
                </div>
            </div>
        );
    }

    if (!booking) {
        return null
    }

    return (
        <div className="space-y-6 p-6">

            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/pg/bookings/${booking.id}`
                            )
                        }
                        className="mb-2 text-sm font-medium text-gray-500 hover:text-gray-900"
                    >
                        ← Back to Booking
                    </button>

                    <h1 className="text-2xl font-bold text-gray-900">
                        Customer Meals
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Record and manage meals for this checked-in customer.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/pg/bookings/${booking.id}/meals/create`
                        )
                    }
                    className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                    Record Meal
                </button>
            </div>

            {/* Customer / Booking */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                <div className="rounded-xl border border-gray-200 bg-white p-5">
                    <p className="text-sm text-gray-500">
                        Customer
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                        {guest?.fullName ?? booking.customerId}
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5">
                    <p className="text-sm text-gray-500">
                        Booking
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                        {booking.bookingNumber}
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5">
                    <p className="text-sm text-gray-500">
                        Room
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                        {booking.roomNumber}
                        {booking.bedNumber
                            ? ` / Bed ${booking.bedNumber}`
                            : ""}
                    </p>
                </div>

            </div>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Summary */}
            <CustomerMealSummary
                meals={bookingMeals}
            />

            {/* History */}
            <div className="space-y-4">

                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        Meal History
                    </h2>

                    <p className="text-sm text-gray-500">
                        All meals recorded for this booking.
                    </p>
                </div>

                <CustomerMealTable
                    meals={bookingMeals}
                    loading={loading}
                    onCancel={cancelMeal}
                    onDelete={removeCustomerMeal}
                />

            </div>
        </div>
    );
}