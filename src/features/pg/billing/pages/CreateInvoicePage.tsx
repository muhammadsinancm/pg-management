import { useNavigate, useSearchParams } from "react-router";
import { useInvoices } from "../hooks/useInvoices";
import { InvoiceForm } from "../components/InvoiceForm";
import { useEffect, useState } from "react";
import { Booking } from "../../bookings/types/booking.types";
import { getBooking } from "../../bookings/services/bookingService";
import { CustomerMeal } from "../../meals/types/meal.types";
import { getCustomerMealsByBooking } from "../../meals/services/customerMealServie";

export default function CreateInvoicePage() {
    const navigate = useNavigate()

    const [searchParams] = useSearchParams()

    const { addInvoice } = useInvoices()

    const bookingId = searchParams.get('bookingId')

    const [booking, setBooking] = useState<Booking | null>(null)
    const [mealAmount, setMealAmount] = useState(0)
    const [customerMeals, setCustomerMeals] = useState<CustomerMeal[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadBooking() {
            if (!bookingId) {
                setError('Booking ID is missing')
                setLoading(false)
                return
            }

            try {
                const data = await getBooking(bookingId)

                if (!data) {
                    setError('Booking not found')
                    return
                }

                if (data.status !== 'checked_in') {
                    setError('Invoice can only be created for a checked-in booking')
                    return
                }

                setBooking(data)

                 const meals = await getCustomerMealsByBooking(data.id)
                 const servedMeals = meals.filter((meal) => meal.status === 'served')
                 const totalMealAmount = servedMeals.reduce((total, meal) => total + meal.amount, 0)

                 setCustomerMeals(servedMeals)
                 setMealAmount(totalMealAmount)

            } catch (error) {
                console.error('Failed to load booking', error)
                setError(error instanceof Error ? error.message : 'Failed to load booking')

            } finally {
                setLoading(false)
            }
        }
        loadBooking()

        
    }, [bookingId])

    const handleSubmit = async (data: Parameters<typeof addInvoice>[0]) => {
        await addInvoice(data)
        navigate('/pg/billing')
    }

    if (loading) {
        return (
            <div className="p-6 text-center text-gray-500">
                Loading invoice information...
            </div>
        );

    }

    if (error || !booking) {
        return (
            <div className="space-y-4 p-6">
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                    {error || "Booking not found."}
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/pg/billing")}
                    className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
                >
                    Back to Billing
                </button>
            </div>
        );
    }

   return (
        <div className="p-6">

            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold">
                    Create Invoice
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Create a new invoice for a customer booking.
                </p>
            </div>


            {/* Booking Information */}
            <div className="mb-6 rounded-xl border bg-gray-50 p-5">
                <h2 className="mb-3 text-lg font-semibold text-gray-900">
                    Booking Information
                </h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

                    <div>
                        <p className="text-xs text-gray-500">
                            Booking Number
                        </p>

                        <p className="font-medium">
                            {booking.bookingNumber}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">
                            Customer ID
                        </p>

                        <p className="font-medium">
                            {booking.customerId}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">
                            Room
                        </p>

                        <p className="font-medium">
                            {booking.roomNumber}
                            {booking.bedNumber
                                ? ` / Bed ${booking.bedNumber}`
                                : ""}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">
                            Rent
                        </p>

                        <p className="font-medium">
                            ₹{booking.rentAmount.toLocaleString("en-IN")}
                        </p>
                    </div>

                </div>
            </div>


            {/* Meal Information */}
            <div className="mb-6 rounded-xl border bg-white p-5">

                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Meal Details
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Served meals for this booking.
                        </p>
                    </div>

                    <p className="text-lg font-semibold text-gray-900">
                        ₹{mealAmount.toLocaleString("en-IN")}
                    </p>
                </div>

                {customerMeals.length === 0 ? (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
                        No served meals recorded for this booking.
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-lg border border-gray-200">

                        <div className="grid grid-cols-3 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600">
                            <span>Date</span>
                            <span>Meal</span>
                            <span className="text-right">
                                Amount
                            </span>
                        </div>

                        {customerMeals.map((meal) => (
                            <div
                                key={meal.id}
                                className="grid grid-cols-3 border-t border-gray-200 px-4 py-3 text-sm"
                            >
                                <span>
                                    {meal.mealDate}
                                </span>

                                <span className="capitalize">
                                    {meal.mealType}
                                </span>

                                <span className="text-right font-medium">
                                    ₹{meal.amount.toLocaleString("en-IN")}
                                </span>
                            </div>
                        ))}

                        <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-4 py-3">
                            <span className="font-semibold">
                                Total Meals: ₹
                                {mealAmount.toLocaleString("en-IN")}
                            </span>
                        </div>

                    </div>
                )}

            </div>


            {/* Invoice Form */}
            <InvoiceForm
                organizationId={booking.organizationId}
                branchId={booking.branchId}
                customerId={booking.customerId}
                bookingId={booking.id}
                rentAmount={booking.rentAmount}
                mealAmount={mealAmount}
                customerMeals={customerMeals}
                onSubmit={handleSubmit}
                onCancel={() => navigate("/pg/billing")}
            />

        </div>
    );
}