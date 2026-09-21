import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
    AlertCircle,
    ArrowLeft,
    Bed,
    DoorClosed,
    Plus,
    User,
} from "lucide-react";
import { useCustomerMeals } from "../hooks/useCustomerMeals";
import { Booking } from "../../bookings/types/booking.types";
import { getBooking } from "../../bookings/services/bookingService";
import { CustomerMealTable } from "../components/CustomerMealTable";
import { CustomerMealSummary } from "../components/CustomerMealSummary";
import { Guest } from "../../guests/types/guests.types";
import { getGuest } from "../../guests/services/guestService";

export function CustomerMealsPage() {
    const { bookingId } = useParams<{ bookingId: string }>();
    const navigate = useNavigate();

    const { customerMeals, loading, error, cancelMeal, removeCustomerMeal } = useCustomerMeals();

    const [booking, setBooking] = useState<Booking | null>(null);
    const [guest, setGuest] = useState<Guest | null>(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [pageError, setPageError] = useState<string | null>(null);

    useEffect(() => {
        if (!bookingId) {
            setPageError("Booking ID is required");
            setPageLoading(false);
            return;
        }

        async function loadData(id: string) {
            try {
                setPageLoading(true);
                setPageError(null);

                const bookingData = await getBooking(id);
                if (!bookingData) {
                    setPageError("Booking not found");
                    return;
                }
                if (bookingData.status !== "checked_in") {
                    setPageError("Customer must be checked in to view or record meals");
                    return;
                }

                const guestData = await getGuest(bookingData.customerId);
                setBooking(bookingData);
                setGuest(guestData);
            } catch (err) {
                console.error("Failed to load customer meals", err);
                setPageError(err instanceof Error ? err.message : "Failed to load customer meals");
            } finally {
                setPageLoading(false);
            }
        }
        loadData(bookingId);
    }, [bookingId]);

    const bookingMeals = bookingId ? customerMeals.filter((meal) => meal.bookingId === bookingId) : [];

    if (pageLoading) {
        return (
            <div className="w-full space-y-4 animate-pulse">
                <div className="h-4 w-28 rounded bg-neutral-200" />
                <div className="flex justify-between items-center">
                    <div className="h-8 w-48 rounded bg-neutral-200" />
                    <div className="h-9 w-32 rounded-xl bg-neutral-200" />
                </div>
                <div className="h-24 rounded-2xl bg-neutral-100" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-20 rounded-2xl bg-neutral-100" />
                    ))}
                </div>
            </div>
        );
    }

    if (pageError || !booking) {
        return (
            <div className="space-y-4">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Go Back</span>
                </button>

                <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50/80 p-4 text-xs font-semibold text-red-700 shadow-2xs">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                    <span>{pageError || "Booking record not found"}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-w-0 space-y-4">
            {/* Top Action / Back Link */}
            <div>
                <button
                    type="button"
                    onClick={() => navigate(`/pg/bookings/${booking.id}`)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Booking #{booking.bookingNumber}</span>
                </button>
            </div>

            {/* Header */}
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                        Customer Meals
                    </h1>
                    <p className="mt-0.5 text-xs text-neutral-400">
                        Record and manage dining charges for this resident
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate(`/pg/bookings/${booking.id}/meals/create`)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-neutral-800 cursor-pointer shrink-0"
                >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Record Meal</span>
                </button>
            </div>

            {/* Resident & Booking Info Strip */}
            <div className="rounded-2xl border border-neutral-100 bg-white p-4 sm:p-5 shadow-2xs">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
                            <User className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                                Resident
                            </p>
                            <p className="font-semibold text-neutral-900 truncate">
                                {guest?.fullName ?? booking.customerId}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
                            <DoorClosed className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                                Booking Reference
                            </p>
                            <p className="font-semibold text-neutral-900 font-mono text-xs">
                                {booking.bookingNumber}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
                            <Bed className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                                Allocated Room
                            </p>
                            <p className="font-semibold text-neutral-900 text-xs">
                                Room {booking.roomNumber}
                                {booking.bedNumber ? ` • Bed ${booking.bedNumber}` : ""}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Error Banner */}
            {error && (
                <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50/80 p-3.5 text-xs font-semibold text-red-700 shadow-2xs">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                    <span>{error}</span>
                </div>
            )}

            {/* Metric Cards */}
            <CustomerMealSummary meals={bookingMeals} />

            {/* History Section Header */}
            <div className="flex items-center justify-between px-0.5 pt-2">
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-500">
                    Meal History
                </h2>

                <span className="inline-flex items-center rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-semibold text-neutral-600 shadow-2xs">
                    {bookingMeals.length} {bookingMeals.length === 1 ? "record" : "records"}
                </span>
            </div>

            {/* History Table */}
            <CustomerMealTable
                meals={bookingMeals}
                loading={loading}
                onCancel={cancelMeal}
                onDelete={removeCustomerMeal}
            />
        </div>
    );
}

export default CustomerMealsPage;