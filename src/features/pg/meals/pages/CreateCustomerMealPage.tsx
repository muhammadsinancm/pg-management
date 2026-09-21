import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
    AlertCircle,
    ArrowLeft,
    Bed,
    DoorClosed,
    IndianRupee,
    User,
    Utensils,
} from "lucide-react";
import { useMeals } from "../hooks/useMeals";
import { useCustomerMeals } from "../hooks/useCustomerMeals";
import { Booking } from "../../bookings/types/booking.types";
import { Guest } from "../../guests/types/guests.types";
import { Meal } from "../types/meal.types";
import { getBooking } from "../../bookings/services/bookingService";
import { getGuest } from "../../guests/services/guestService";
import { CustomerMealForm } from "../components/CustomerMealForm";
import { MealTypeBadge } from "../components/MealTypeBadge";

export function CreateCustomerMealPage() {
    const { bookingId } = useParams<{ bookingId: string }>();
    const navigate = useNavigate();

    const { meals, loading: mealsLoading } = useMeals();
    const { addCustomerMeal, error } = useCustomerMeals();

    const [booking, setBooking] = useState<Booking | null>(null);
    const [guest, setGuest] = useState<Guest | null>(null);
    const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        if (!bookingId) {
            setPageLoading(false);
            return;
        }

        const loadBooking = async () => {
            try {
                const bookingData = await getBooking(bookingId);
                if (!bookingData) return;
                if (bookingData.status !== "checked_in") return;

                const guestData = await getGuest(bookingData.customerId);
                setBooking(bookingData);
                setGuest(guestData);
            } finally {
                setPageLoading(false);
            }
        };

        loadBooking();
    }, [bookingId]);

    const handleSubmit = async (data: Parameters<typeof addCustomerMeal>[0]) => {
        await addCustomerMeal(data);
        navigate(`/pg/bookings/${bookingId}/meals`);
    };

    if (pageLoading || mealsLoading) {
        return (
            <div className="w-full max-w-3xl space-y-4 animate-pulse">
                <div className="h-4 w-28 rounded bg-neutral-200" />
                <div className="h-8 w-48 rounded bg-neutral-200" />
                <div className="h-24 rounded-2xl bg-neutral-100" />
                <div className="h-40 rounded-2xl bg-neutral-100" />
            </div>
        );
    }

    if (!booking) {
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
                    <span>Booking not found or customer is not currently checked in.</span>
                </div>
            </div>
        );
    }

    const availableMeals = meals.filter((meal) => meal.status !== "cancelled");

    return (
        <div className="w-full min-w-0 space-y-4 max-w-3xl">
            {/* Top Action / Back Link */}
            <div>
                <button
                    type="button"
                    onClick={() => navigate(`/pg/bookings/${booking.id}/meals`)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Customer Meals</span>
                </button>
            </div>

            {/* Header */}
            <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                    Record Customer Meal
                </h1>
                <p className="mt-0.5 text-xs text-neutral-400">
                    Select a meal and record dining charge for this checked-in resident
                </p>
            </div>

            {/* Customer & Booking Strip */}
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

            {/* Meal Selection Cards */}
            <div className="rounded-2xl border border-neutral-100 bg-white p-4 sm:p-5 shadow-2xs space-y-3">
                <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                        Step 1: Choose Meal Schedule
                    </h2>
                    <p className="mt-0.5 text-xs text-neutral-400">
                        Select which active meal schedule to allocate to the customer
                    </p>
                </div>

                {availableMeals.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-neutral-200 p-6 text-center text-xs text-neutral-400">
                        No active meals scheduled. Please add meals to the system first.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        {availableMeals.map((meal) => {
                            const isSelected = selectedMeal?.id === meal.id;
                            return (
                                <button
                                    key={meal.id}
                                    type="button"
                                    onClick={() => setSelectedMeal(meal)}
                                    className={`group flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all shadow-2xs cursor-pointer ${
                                        isSelected
                                            ? "border-neutral-900 bg-neutral-50/80 shadow-xs ring-2 ring-neutral-900/10"
                                            : "border-neutral-200 bg-white hover:border-neutral-300"
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <MealTypeBadge mealType={meal.mealType} size="sm" />
                                        <span className="inline-flex items-center gap-0.5 font-bold font-mono text-neutral-900 text-sm">
                                            <IndianRupee className="h-3.5 w-3.5 text-neutral-400" />
                                            {meal.amount.toFixed(2)}
                                        </span>
                                    </div>

                                    <p className="mt-2 text-xs font-medium text-neutral-800 line-clamp-2">
                                        {meal.menu || "Standard Menu"}
                                    </p>

                                    <p className="mt-1 text-[11px] text-neutral-400">
                                        Date: {meal.mealDate}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Form Step */}
            {selectedMeal && (
                <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
                    <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                        <Utensils className="h-4 w-4 text-neutral-500" />
                        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                            Step 2: Confirm Details & Record Meal
                        </h2>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700 shadow-2xs">
                            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                            <span>{error}</span>
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
                        onCancel={() => navigate(`/pg/bookings/${booking.id}/meals`)}
                    />
                </div>
            )}
        </div>
    );
}

export default CreateCustomerMealPage;