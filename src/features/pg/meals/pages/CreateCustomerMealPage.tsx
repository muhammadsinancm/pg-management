import { useNavigate, useParams } from "react-router";
import { useMeals } from "../hooks/useMeals";
import { useCustomerMeals } from "../hooks/useCustomerMeals";
import { useEffect, useState } from "react";
import { Booking } from "../../bookings/types/booking.types";
import { Guest } from "../../guests/types/guests.types";
import { Meal } from "../types/meal.types";
import { getBooking } from "../../bookings/services/bookingService";
import { getGuest } from "../../guests/services/guestService";
import { CustomerMealForm } from "../components/CustomerMealForm";

export default function CreateCustomerMealPage() {
    const { bookingId } = useParams<{ bookingId: string }>()

    const navigate = useNavigate()

    const { meals, loading: mealsLoading } = useMeals()
    const { addCustomerMeal, error } = useCustomerMeals()

    const [booking, setBooking] = useState<Booking | null>(null)
    const [guest, setGuest] = useState<Guest | null>(null)
    const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)
    const [pageLoading, setPageLoading] = useState(true)

    useEffect(() => {
        if (!bookingId) {
            setPageLoading(false)
            return
        }

        const loadBooking = async () => {
            try {

                const bookingData = await getBooking(bookingId)

                if (!bookingData) {
                    return
                }
                if (bookingData.status !== 'checked_in') {
                    return
                }

                const guestData = await getGuest(bookingData.customerId)

                setBooking(bookingData)
                setGuest(guestData)

            } finally {
                setPageLoading(false)
            }
        }

        loadBooking()
    }, [bookingId])

    const handleSubmit = async (data: Parameters<typeof addCustomerMeal>[0]) => {
        await addCustomerMeal(data)

        navigate(`/pg/bookings/${bookingId}/meals`)
    }

    if (pageLoading || mealsLoading) {
        return (
            <div className="p-6">
                Loading...
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="p-6">
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
                    Booking not found or customer is not checked in.
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">

            {/* Header */}
            <div>
                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/pg/bookings/${booking.id}/meals`
                        )
                    }
                    className="mb-2 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                    ← Back to Customer Meals
                </button>

                <h1 className="text-2xl font-bold text-gray-900">
                    Record Customer Meal
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Record a meal for the checked-in customer.
                </p>
            </div>

            {/* Customer */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                    <div>
                        <p className="text-sm text-gray-500">
                            Customer
                        </p>

                        <p className="mt-1 font-semibold">
                            {guest?.fullName ??
                                booking.customerId}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Booking
                        </p>

                        <p className="mt-1 font-semibold">
                            {booking.bookingNumber}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Room
                        </p>

                        <p className="mt-1 font-semibold">
                            {booking.roomNumber}
                        </p>
                    </div>

                </div>
            </div>

            {/* Meal Selection */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">

                <h2 className="mb-4 text-lg font-semibold">
                    Select Meal
                </h2>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

                    {meals
                        .filter(
                            (meal) =>
                                meal.status !== "cancelled"
                        )
                        .map((meal) => (
                            <button
                                key={meal.id}
                                type="button"
                                onClick={() =>
                                    setSelectedMeal(meal)
                                }
                                className={`rounded-lg border p-4 text-left transition ${selectedMeal?.id === meal.id
                                        ? "border-gray-900 bg-gray-50"
                                        : "border-gray-200 hover:border-gray-400"
                                    }`}
                            >
                                <div className="flex justify-between">

                                    <div>
                                        <p className="font-semibold capitalize">
                                            {meal.mealType}
                                        </p>

                                        <p className="mt-1 text-sm text-gray-500">
                                            {meal.menu}
                                        </p>
                                    </div>

                                    <p className="font-semibold">
                                        ₹{meal.amount}
                                    </p>

                                </div>
                            </button>
                        ))}
                </div>
            </div>

            {/* Form */}
            {selectedMeal && (
                <div className="rounded-xl border border-gray-200 bg-white p-6">

                    <h2 className="mb-4 text-lg font-semibold">
                        Meal Details
                    </h2>

                    {error && (
                        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <CustomerMealForm
                        organizationId={booking.organizationId}
                        branchId={booking.branchId}
                        customerId={booking.customerId}
                        bookingId={booking.id}
                        mealId={selectedMeal.id}
                        mealType={selectedMeal.mealType}
                        defaultAmount={selectedMeal.amount}
                        onSubmit={handleSubmit}
                        onCancel={() =>
                            navigate(
                                `/pg/bookings/${booking.id}/meals`
                            )
                        }
                    />

                </div>
            )}
        </div>
    );
}