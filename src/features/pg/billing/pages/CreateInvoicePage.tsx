import { useNavigate, useSearchParams } from "react-router";
import { useInvoices } from "../hooks/useInvoices";
import { InvoiceForm } from "../components/InvoiceForm";
import { useEffect, useState } from "react";
import { Booking } from "../../bookings/types/booking.types";
import { getBooking } from "../../bookings/services/bookingService";
import { CustomerMeal } from "../../meals/types/meal.types";
import { getCustomerMealsByBooking } from "../../meals/services/customerMealServie";
import { AlertCircle, ArrowLeft, BedDouble, Loader2 } from "lucide-react";

export default function CreateInvoicePage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { addInvoice } = useInvoices();

    const bookingId = searchParams.get("bookingId");

    const [booking, setBooking] = useState<Booking | null>(null);
    const [mealAmount, setMealAmount] = useState(0);
    const [customerMeals, setCustomerMeals] = useState<CustomerMeal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadBooking() {
            if (!bookingId) {
                setError("Booking ID is missing from URL query parameters.");
                setLoading(false);
                return;
            }

            try {
                const data = await getBooking(bookingId);

                if (!data) {
                    setError("Booking not found.");
                    return;
                }

                if (data.status !== "checked_in") {
                    setError("Invoice can only be created for a checked-in booking.");
                    return;
                }

                setBooking(data);

                const meals = await getCustomerMealsByBooking(data.id);
                const servedMeals = meals.filter((meal) => meal.status === "served");
                const totalMealAmount = servedMeals.reduce((total, meal) => total + meal.amount, 0);

                setCustomerMeals(servedMeals);
                setMealAmount(totalMealAmount);
            } catch (err) {
                console.error("Failed to load booking", err);
                setError(err instanceof Error ? err.message : "Failed to load booking information.");
            } finally {
                setLoading(false);
            }
        }
        loadBooking();
    }, [bookingId]);

    const handleSubmit = async (data: Parameters<typeof addInvoice>[0]) => {
        await addInvoice(data);
        navigate("/pg/billing");
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-neutral-100 bg-white shadow-2xs m-4 sm:m-6">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
                    <span className="text-xs font-medium text-neutral-500">Loading booking information...</span>
                </div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="m-4 sm:m-6 space-y-4">
                <div className="rounded-2xl border border-red-100 bg-red-50/50 p-6 text-center shadow-2xs">
                    <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
                    <h3 className="mt-2 text-sm font-bold text-red-900">Unable to create invoice</h3>
                    <p className="mt-1 text-xs text-red-600">{error || "Booking not found."}</p>
                    <button
                        type="button"
                        onClick={() => navigate("/pg/billing")}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-neutral-800 transition-all cursor-pointer"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Back to Billing</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5 p-4 sm:space-y-6 sm:p-6">
            {/* Top Navigation & Header */}
            <div>
                <button
                    type="button"
                    onClick={() => navigate("/pg/billing")}
                    className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Invoices</span>
                </button>

                <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
                    Create Invoice
                </h1>
                <p className="mt-0.5 text-xs text-neutral-500">
                    Generate an invoice for booking #{booking.bookingNumber} ({booking.customerId}).
                </p>
            </div>

            {/* Booking Information Banner */}
            <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white p-4 sm:p-5 shadow-2xs">
                <div className="mb-3 flex items-center gap-2 border-b border-neutral-100 pb-2">
                    <BedDouble className="h-4 w-4 text-neutral-500" />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                        Booking Context
                    </h2>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                            Booking Number
                        </span>
                        <span className="mt-0.5 block font-mono text-xs sm:text-sm font-bold text-neutral-900">
                            {booking.bookingNumber}
                        </span>
                    </div>

                    <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                            Customer ID
                        </span>
                        <span className="mt-0.5 block font-mono text-xs sm:text-sm font-semibold text-neutral-800">
                            {booking.customerId}
                        </span>
                    </div>

                    <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                            Room & Bed
                        </span>
                        <span className="mt-0.5 block text-xs sm:text-sm font-semibold text-neutral-800">
                            Room {booking.roomNumber}
                            {booking.bedNumber ? ` • Bed ${booking.bedNumber}` : ""}
                        </span>
                    </div>

                    <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                            Monthly Rent
                        </span>
                        <span className="mt-0.5 block font-mono text-xs sm:text-sm font-bold text-neutral-900">
                            ₹{booking.rentAmount.toLocaleString("en-IN")}
                        </span>
                    </div>
                </div>
            </div>

            {/* Invoice Form (includes charges, customer meals breakdown, and payment summary) */}
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