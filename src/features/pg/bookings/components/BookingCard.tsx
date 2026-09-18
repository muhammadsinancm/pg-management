import { useNavigate } from "react-router";
import { ArrowRight, BedDouble, Calendar, Trash2, User } from "lucide-react";
import { Booking } from "../types/booking.types";
import { BookingStatusBadge } from "./BookingStatusBadge";

interface BookingCardProps {
    booking: Booking;
    onDelete?: (id: string) => Promise<void> | void;
}

export function BookingCard({ booking, onDelete }: BookingCardProps) {
    const navigate = useNavigate();

    const formattedCheckIn = booking.checkInDate
        ? new Date(booking.checkInDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
          })
        : "-";

    return (
        <div className="flex flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-3.5 sm:p-4 shadow-2xs transition-all hover:border-neutral-200 hover:shadow-xs space-y-3">
            {/* Top row: Booking Number & Status Badge */}
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        Booking
                    </p>
                    <h3 className="truncate text-base font-bold tracking-tight text-neutral-900">
                        {booking.bookingNumber}
                    </h3>
                </div>

                <BookingStatusBadge status={booking.status} />
            </div>

            {/* Middle Specs Grid */}
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-neutral-100/80 bg-neutral-50/70 p-2.5 text-xs">
                {/* Customer */}
                <div className="min-w-0">
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                        <User className="h-3 w-3" />
                        Customer
                    </span>
                    <span className="mt-0.5 block truncate font-bold text-neutral-800">
                        {booking.customerId}
                    </span>
                </div>

                {/* Room & Bed */}
                <div className="min-w-0">
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                        <BedDouble className="h-3 w-3" />
                        Room / Bed
                    </span>
                    <span className="mt-0.5 block truncate font-bold text-neutral-800">
                        Room {booking.roomNumber}
                        {booking.bedNumber && ` • Bed ${booking.bedNumber}`}
                    </span>
                </div>

                {/* Check In */}
                <div className="min-w-0">
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                        <Calendar className="h-3 w-3" />
                        Check-in
                    </span>
                    <span className="mt-0.5 block truncate font-bold text-neutral-800">
                        {formattedCheckIn}
                    </span>
                </div>

                {/* Rent */}
                <div className="min-w-0">
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                        Rent Amount
                    </span>
                    <span className="mt-0.5 block font-bold text-neutral-900">
                        ₹{booking.rentAmount.toLocaleString("en-IN")}
                    </span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 pt-0.5">
                <button
                    type="button"
                    onClick={() => navigate(`/pg/bookings/${booking.id}`)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 py-2 px-3 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-neutral-800 cursor-pointer"
                >
                    View Details
                    <ArrowRight className="h-3 w-3" />
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
        <div className="flex flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-3.5 sm:p-4 shadow-2xs space-y-3 animate-pulse">
            {/* Top row */}
            <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                    <div className="h-2.5 w-12 rounded bg-neutral-200/80" />
                    <div className="h-5 w-28 rounded-md bg-neutral-200" />
                </div>
                <div className="h-6 w-20 rounded-full bg-neutral-100" />
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-neutral-100/80 bg-neutral-50/70 p-2.5">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-1">
                        <div className="h-2.5 w-12 rounded bg-neutral-200/70" />
                        <div className="h-3.5 w-20 rounded bg-neutral-200" />
                    </div>
                ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 pt-0.5">
                <div className="h-8 flex-1 rounded-xl bg-neutral-900/10" />
                <div className="h-8 w-8 shrink-0 rounded-xl border border-neutral-100 bg-neutral-100/70" />
            </div>
        </div>
    );
}