import { useNavigate } from "react-router";
import { ArrowRight, BedDouble, Calendar, Trash2, User } from "lucide-react";
import { Booking } from "../types/booking.types";
import { BookingStatusBadge } from "./BookingStatusBadge";

interface BookingCardProps {
    booking: Booking;
    onDelete?: (id: string) => Promise<void> | void;
}

function formatDate(date?: Date | string | null): string {
    if (!date) return "—";
    try {
        const d = date instanceof Date ? date : new Date(date);
        if (isNaN(d.getTime())) return "—";
        return d.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    } catch {
        return "—";
    }
}

export function BookingCard({ booking, onDelete }: BookingCardProps) {
    const navigate = useNavigate();

    const formattedCheckIn = formatDate(booking.checkInDate);
    const formattedCheckOut = formatDate(booking.checkOutDate);

    return (
        <div className="flex flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-3.5 sm:p-4 shadow-2xs transition-all hover:border-neutral-200 hover:shadow-xs min-w-0">
            {/* Header: Booking Number & Status Badge */}
            <div className="flex items-center justify-between gap-2 border-b border-neutral-100 pb-3 min-w-0">
                <div className="min-w-0 flex-1">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        Booking ID
                    </span>
                    <h3 className="font-mono text-sm sm:text-base font-bold text-neutral-900 truncate">
                        {booking.bookingNumber}
                    </h3>
                </div>
                <BookingStatusBadge status={booking.status} size="sm" />
            </div>

            {/* Customer & Room Info row */}
            <div className="py-3 space-y-2.5 min-w-0 border-b border-neutral-100">
                {/* Customer & Room */}
                <div className="flex items-center justify-between gap-2 min-w-0">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                            <User className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
                                Customer
                            </p>
                            <p
                                className="truncate text-xs font-bold text-neutral-800"
                                title={booking.customerId}
                            >
                                {booking.customerId}
                            </p>
                        </div>
                    </div>

                    {/* Room & Bed */}
                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-100 bg-neutral-50 px-2.5 py-1 text-xs font-semibold text-neutral-700 shrink-0">
                        <BedDouble className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                        <span>Room {booking.roomNumber}</span>
                        {booking.bedNumber && (
                            <span className="text-neutral-400">
                                • Bed {booking.bedNumber}
                            </span>
                        )}
                    </div>
                </div>

                {/* Dates & Financials Grid: Designed for mobile readability */}
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-neutral-50/70 p-2.5 text-xs">
                    {/* Check In */}
                    <div className="min-w-0">
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                            <Calendar className="h-3 w-3 shrink-0 text-neutral-400" />
                            <span>Check-In</span>
                        </span>
                        <span className="mt-0.5 block text-xs font-bold text-neutral-800 truncate">
                            {formattedCheckIn}
                        </span>
                    </div>

                    {/* Check Out */}
                    <div className="min-w-0">
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                            <Calendar className="h-3 w-3 shrink-0 text-neutral-400" />
                            <span>Check-Out</span>
                        </span>
                        <span className="mt-0.5 block text-xs font-bold text-neutral-800 truncate">
                            {formattedCheckOut !== "—" ? formattedCheckOut : "Active"}
                        </span>
                    </div>

                    {/* Rent Amount */}
                    <div className="min-w-0 pt-1.5 border-t border-neutral-100/80">
                        <span className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                            Rent Amount
                        </span>
                        <span className="mt-0.5 block text-xs sm:text-sm font-bold text-neutral-900 truncate">
                            ₹{booking.rentAmount.toLocaleString("en-IN")}
                        </span>
                    </div>

                    {/* Advance / Deposit */}
                    <div className="min-w-0 pt-1.5 border-t border-neutral-100/80">
                        <span className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                            Advance Paid
                        </span>
                        <span className="mt-0.5 block text-xs font-semibold text-neutral-700 truncate">
                            {booking.advanceAmount > 0
                                ? `₹${booking.advanceAmount.toLocaleString("en-IN")}`
                                : "—"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center gap-4 pt-3 min-w-0">
                <button
                    type="button"
                    onClick={() => navigate(`/pg/bookings/${booking.id}`)}
                    className="flex-1 min-w-0 inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 py-2 px-3 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-neutral-800 cursor-pointer"
                >
                    <span className="truncate">View Details</span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                </button>

                {onDelete && (
                    <button
                        type="button"
                        onClick={() => onDelete(booking.id)}
                        title="Delete Booking"
                        aria-label={`Delete booking ${booking.bookingNumber}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-400 shadow-2xs transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 cursor-pointer shrink-0"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>
        </div>
    );
}

export function BookingCardSkeleton() {
    return (
        <div className="flex flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-3.5 sm:p-4 shadow-2xs animate-pulse min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 min-w-0">
                <div className="space-y-1 min-w-0 flex-1">
                    <div className="h-2 w-12 rounded bg-neutral-200/80" />
                    <div className="h-4 w-24 rounded-md bg-neutral-200" />
                </div>
                <div className="h-5 w-16 rounded-full bg-neutral-100 shrink-0" />
            </div>

            {/* Middle */}
            <div className="py-3 space-y-2.5 min-w-0 border-b border-neutral-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-neutral-100" />
                        <div className="space-y-1">
                            <div className="h-2 w-10 rounded bg-neutral-100" />
                            <div className="h-3.5 w-20 rounded bg-neutral-200" />
                        </div>
                    </div>
                    <div className="h-6 w-20 rounded-lg bg-neutral-100" />
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-xl bg-neutral-50/70 p-2.5">
                    <div className="space-y-1">
                        <div className="h-2 w-12 rounded bg-neutral-200/70" />
                        <div className="h-3.5 w-16 rounded bg-neutral-200" />
                    </div>
                    <div className="space-y-1">
                        <div className="h-2 w-12 rounded bg-neutral-200/70" />
                        <div className="h-3.5 w-16 rounded bg-neutral-200" />
                    </div>
                    <div className="space-y-1 pt-1.5 border-t border-neutral-100/80">
                        <div className="h-2 w-10 rounded bg-neutral-200/70" />
                        <div className="h-3.5 w-14 rounded bg-neutral-200" />
                    </div>
                    <div className="space-y-1 pt-1.5 border-t border-neutral-100/80">
                        <div className="h-2 w-10 rounded bg-neutral-200/70" />
                        <div className="h-3.5 w-12 rounded bg-neutral-200" />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-3 min-w-0">
                <div className="h-8 flex-1 min-w-0 rounded-xl bg-neutral-900/10" />
                <div className="h-8 w-8 shrink-0 rounded-xl border border-neutral-100 bg-neutral-100/70" />
            </div>
        </div>
    );
}