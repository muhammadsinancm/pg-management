import { useNavigate } from "react-router";
import { BedDouble, CalendarCheck, Eye, Trash2, User } from "lucide-react";
import { Booking } from "../types/booking.types";
import { BookingStatusBadge } from "./BookingStatusBadge";

interface BookingTableProps {
    bookings: Booking[];
    onDelete: (id: string) => Promise<void>;
}

function formatDate(date?: Date | string | null): string {
    if (!date) return "—";
    try {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    } catch {
        return "—";
    }
}

export function BookingTable({ bookings, onDelete }: BookingTableProps) {
    const navigate = useNavigate();

    if (bookings.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-8 sm:p-12 text-center shadow-2xs">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
                    <CalendarCheck className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-neutral-900">
                    No bookings found
                </h3>
                <p className="mt-1 text-xs text-neutral-400 max-w-sm mx-auto">
                    No bookings match your current search and filter criteria.
                </p>
                <button
                    type="button"
                    onClick={() => navigate("/pg/bookings/create")}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-neutral-800 transition-all cursor-pointer"
                >
                    + New Booking
                </button>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Mobile View: Responsive Card List (visible on small screens < md) */}
            <div className="space-y-3 md:hidden">
                {bookings.map((booking) => {
                    const formattedCheckIn = formatDate(booking.checkInDate);
                    const formattedCheckOut = formatDate(booking.checkOutDate);

                    return (
                        <div
                            key={booking.id}
                            className="rounded-2xl border border-neutral-100 bg-white p-3.5 shadow-2xs transition-all hover:border-neutral-200"
                        >
                            {/* Card Header: Booking Number & Status Badge */}
                            <div className="flex items-center justify-between gap-2 border-b border-neutral-100 pb-2.5">
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                                        Booking
                                    </span>
                                    <span className="font-mono text-xs font-bold text-neutral-900 truncate">
                                        {booking.bookingNumber}
                                    </span>
                                </div>
                                <BookingStatusBadge
                                    status={booking.status}
                                    size="sm"
                                />
                            </div>

                            {/* Customer & Room Info */}
                            <div className="mt-2.5 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                                        <User className="h-3.5 w-3.5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-medium text-neutral-400">
                                            Customer
                                        </p>
                                        <p className="truncate text-xs font-bold text-neutral-800">
                                            {booking.customerId}
                                        </p>
                                    </div>
                                </div>

                                <div className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-100 bg-neutral-50/80 px-2 py-1 text-xs font-semibold text-neutral-700 shrink-0">
                                    <BedDouble className="h-3.5 w-3.5 text-neutral-500" />
                                    <span>Room {booking.roomNumber}</span>
                                    {booking.bedNumber && (
                                        <span className="text-neutral-400">
                                            • Bed {booking.bedNumber}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Details Grid: Check In, Check Out, Amount */}
                            <div className="mt-2.5 grid grid-cols-3 gap-2 rounded-xl bg-neutral-50/70 p-2.5 text-xs">
                                <div>
                                    <span className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                                        Check In
                                    </span>
                                    <span className="mt-0.5 block text-[11px] font-semibold text-neutral-700 truncate">
                                        {formattedCheckIn}
                                    </span>
                                </div>

                                <div>
                                    <span className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                                        Check Out
                                    </span>
                                    <span className="mt-0.5 block text-[11px] font-semibold text-neutral-700 truncate">
                                        {formattedCheckOut}
                                    </span>
                                </div>

                                <div>
                                    <span className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                                        Rent
                                    </span>
                                    <span className="mt-0.5 block text-[11px] font-bold text-neutral-900 truncate">
                                        ₹{booking.rentAmount.toLocaleString("en-IN")}
                                    </span>
                                    {booking.advanceAmount > 0 && (
                                        <span className="block text-[9px] text-neutral-400 truncate">
                                            Adv: ₹{booking.advanceAmount.toLocaleString("en-IN")}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Actions Footer */}
                            <div className="mt-3 flex items-center gap-2 pt-1 border-t border-neutral-100">
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(`/pg/bookings/${booking.id}`)
                                    }
                                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 py-2 px-3 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-neutral-800 cursor-pointer"
                                >
                                    <Eye className="h-3.5 w-3.5" />
                                    <span>View Details</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => onDelete(booking.id)}
                                    title="Delete Booking"
                                    aria-label={`Delete booking ${booking.bookingNumber}`}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-400 shadow-2xs transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 cursor-pointer shrink-0"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Desktop View: Full Data Table (visible on md screens and up) */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-2xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                        <thead className="border-b border-neutral-100 bg-neutral-50/70">
                            <tr>
                                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                                    Booking
                                </th>
                                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                                    Customer
                                </th>
                                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                                    Room & Bed
                                </th>
                                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                                    Check In
                                </th>
                                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                                    Check Out
                                </th>
                                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                                    Amount
                                </th>
                                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-neutral-100">
                            {bookings.map((booking) => {
                                const formattedCheckIn = formatDate(booking.checkInDate);
                                const formattedCheckOut = formatDate(booking.checkOutDate);

                                return (
                                    <tr
                                        key={booking.id}
                                        className="transition-colors hover:bg-neutral-50/80"
                                    >
                                        {/* Booking Number */}
                                        <td className="px-4 py-3.5 font-bold text-neutral-900 tracking-tight">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs">
                                                    {booking.bookingNumber}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Customer */}
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                                                    <User className="h-3 w-3" />
                                                </div>
                                                <span className="font-semibold text-neutral-800">
                                                    {booking.customerId}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Room & Bed */}
                                        <td className="px-4 py-3.5">
                                            <div className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-100 bg-neutral-50/80 px-2.5 py-1 text-xs font-semibold text-neutral-700 shadow-2xs">
                                                <BedDouble className="h-3.5 w-3.5 text-neutral-500" />
                                                <span>Room {booking.roomNumber}</span>
                                                {booking.bedNumber && (
                                                    <span className="text-neutral-400">
                                                        • Bed {booking.bedNumber}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Check In */}
                                        <td className="px-4 py-3.5 text-neutral-600 font-medium">
                                            {formattedCheckIn}
                                        </td>

                                        {/* Check Out */}
                                        <td className="px-4 py-3.5 text-neutral-500">
                                            {formattedCheckOut}
                                        </td>

                                        {/* Amount & Payment Status */}
                                        <td className="px-4 py-3.5">
                                            <div className="font-bold text-neutral-900">
                                                ₹{booking.rentAmount.toLocaleString("en-IN")}
                                            </div>
                                            {booking.advanceAmount > 0 && (
                                                <div className="text-[10px] text-neutral-400">
                                                    Adv: ₹{booking.advanceAmount.toLocaleString("en-IN")}
                                                </div>
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3.5">
                                            <BookingStatusBadge
                                                status={booking.status}
                                                size="sm"
                                            />
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3.5 text-right">
                                            <div className="inline-flex items-center gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/pg/bookings/${booking.id}`
                                                        )
                                                    }
                                                    title="View Booking Details"
                                                    aria-label={`View booking ${booking.bookingNumber}`}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-neutral-700 shadow-2xs transition-colors hover:bg-neutral-50 hover:text-neutral-900 cursor-pointer"
                                                >
                                                    <Eye className="h-3 w-3" />
                                                    <span>View</span>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onDelete(booking.id)
                                                    }
                                                    title="Delete Booking"
                                                    aria-label={`Delete booking ${booking.bookingNumber}`}
                                                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-400 shadow-2xs transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export function BookingTableSkeleton() {
    return (
        <div className="w-full">
            {/* Mobile Skeleton: Card List (md:hidden) */}
            <div className="space-y-3 md:hidden animate-pulse">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="rounded-2xl border border-neutral-100 bg-white p-3.5 shadow-2xs space-y-3"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                            <div className="h-3.5 w-24 rounded bg-neutral-200" />
                            <div className="h-5 w-16 rounded-full bg-neutral-100" />
                        </div>

                        {/* Customer & Room */}
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

                        {/* Grid */}
                        <div className="grid grid-cols-3 gap-2 rounded-xl bg-neutral-50/70 p-2.5">
                            <div className="space-y-1">
                                <div className="h-2 w-12 rounded bg-neutral-200/70" />
                                <div className="h-3 w-16 rounded bg-neutral-200" />
                            </div>
                            <div className="space-y-1">
                                <div className="h-2 w-12 rounded bg-neutral-200/70" />
                                <div className="h-3 w-16 rounded bg-neutral-200" />
                            </div>
                            <div className="space-y-1">
                                <div className="h-2 w-10 rounded bg-neutral-200/70" />
                                <div className="h-3 w-14 rounded bg-neutral-200" />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-1 border-t border-neutral-100">
                            <div className="h-8 flex-1 rounded-xl bg-neutral-900/10" />
                            <div className="h-8 w-8 rounded-xl bg-neutral-100" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Skeleton: Table (hidden md:block) */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-2xs animate-pulse">
                <div className="overflow-x-auto">
                    <div className="w-full">
                        <div className="border-b border-neutral-100 bg-neutral-50/70 p-3.5">
                            <div className="flex justify-between">
                                <div className="h-3 w-20 rounded bg-neutral-200" />
                                <div className="h-3 w-20 rounded bg-neutral-200" />
                                <div className="h-3 w-20 rounded bg-neutral-200" />
                                <div className="h-3 w-16 rounded bg-neutral-200" />
                            </div>
                        </div>
                        <div className="divide-y divide-neutral-100">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between px-4 py-3.5"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-20 rounded bg-neutral-200" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded-lg bg-neutral-100" />
                                        <div className="h-4 w-24 rounded bg-neutral-200" />
                                    </div>
                                    <div className="h-6 w-28 rounded-lg bg-neutral-100" />
                                    <div className="h-4 w-20 rounded bg-neutral-100" />
                                    <div className="h-4 w-16 rounded bg-neutral-200" />
                                    <div className="h-5 w-20 rounded-full bg-neutral-100" />
                                    <div className="flex gap-1.5">
                                        <div className="h-7 w-14 rounded-lg bg-neutral-100" />
                                        <div className="h-7 w-7 rounded-lg bg-neutral-100" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}