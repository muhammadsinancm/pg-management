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

export function BookingTable({ bookings, onDelete }: BookingTableProps) {
    const navigate = useNavigate();

    if (bookings.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-8 lg:p-12 text-center shadow-2xs">
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
        <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-2xs">
            {/* Scrollable table container */}
            <div className="overflow-x-auto w-full min-w-0">
                <table className="w-full lg:min-w-[840px] text-left text-xs lg:text-sm">
                    <thead className="hidden lg:table-header-group border-b border-neutral-100 bg-neutral-50/70">
                        <tr>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Booking #
                            </th>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Customer
                            </th>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Room & Bed
                            </th>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Check In
                            </th>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Check Out
                            </th>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Amount
                            </th>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Status
                            </th>
                            <th className="pl-2 pr-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="flex flex-col lg:table-row-group gap-4 lg:gap-0 p-4 lg:p-0 bg-neutral-50/30 lg:bg-transparent lg:divide-y lg:divide-neutral-100">
                        {bookings.map((booking) => {
                            const formattedCheckIn = formatDate(booking.checkInDate);
                            const formattedCheckOut = formatDate(booking.checkOutDate);

                            return (
                                <tr
                                    key={booking.id}
                                    className="flex flex-col lg:table-row transition-colors hover:bg-neutral-50/80 bg-white lg:bg-transparent rounded-xl lg:rounded-none border border-neutral-100 lg:border-none shadow-xs lg:shadow-none overflow-hidden"
                                >
                                    {/* Booking Number */}
                                    <td className="px-4 py-3 lg:py-3.5 flex justify-between items-center lg:table-cell border-b border-neutral-50 lg:border-none bg-neutral-50/50 lg:bg-transparent">
                                        <span className="lg:hidden text-[10px] font-bold uppercase text-neutral-400">Booking #</span>
                                        <span className="font-mono text-xs font-bold text-neutral-900">
                                            {booking.bookingNumber}
                                        </span>
                                    </td>

                                    {/* Customer */}
                                    <td className="px-4 py-2.5 lg:py-3.5 flex justify-between items-center lg:table-cell border-b border-neutral-50 lg:border-none">
                                        <span className="lg:hidden text-[10px] font-bold uppercase text-neutral-400">Customer</span>
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                                                <User className="h-3 w-3" />
                                            </div>
                                            <span className="font-semibold text-neutral-800 text-xs">
                                                {booking.customerId}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Room & Bed */}
                                    <td className="px-4 py-2.5 lg:py-3.5 flex justify-between items-center lg:table-cell border-b border-neutral-50 lg:border-none">
                                        <span className="lg:hidden text-[10px] font-bold uppercase text-neutral-400">Room & Bed</span>
                                        <div className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-100 bg-neutral-50/80 px-2.5 py-1 text-xs font-semibold text-neutral-700 shadow-2xs">
                                            <BedDouble className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                                            <span>Room {booking.roomNumber}</span>
                                            {booking.bedNumber && (
                                                <span className="text-neutral-400">
                                                    • Bed {booking.bedNumber}
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Check In */}
                                    <td className="px-4 py-2.5 lg:py-3.5 flex justify-between items-center lg:table-cell text-neutral-600 font-medium text-xs border-b border-neutral-50 lg:border-none">
                                        <span className="lg:hidden text-[10px] font-bold uppercase text-neutral-400">Check In</span>
                                        <span>{formattedCheckIn}</span>
                                    </td>

                                    {/* Check Out */}
                                    <td className="px-4 py-2.5 lg:py-3.5 flex justify-between items-center lg:table-cell text-neutral-500 text-xs border-b border-neutral-50 lg:border-none">
                                        <span className="lg:hidden text-[10px] font-bold uppercase text-neutral-400">Check Out</span>
                                        <span>{formattedCheckOut}</span>
                                    </td>

                                    {/* Amount & Payment Status */}
                                    <td className="px-4 py-2.5 lg:py-3.5 flex justify-between items-center lg:table-cell border-b border-neutral-50 lg:border-none">
                                        <span className="lg:hidden text-[10px] font-bold uppercase text-neutral-400">Amount</span>
                                        <div className="text-right lg:text-left">
                                            <div className="font-bold text-neutral-900 text-xs">
                                                ₹{booking.rentAmount.toLocaleString("en-IN")}
                                            </div>
                                            {booking.advanceAmount > 0 && (
                                                <div className="text-[10px] text-neutral-400 font-medium">
                                                    Adv: ₹{booking.advanceAmount.toLocaleString("en-IN")}
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="px-4 py-2.5 lg:py-3.5 flex justify-between items-center lg:table-cell border-b border-neutral-50 lg:border-none">
                                        <span className="lg:hidden text-[10px] font-bold uppercase text-neutral-400">Status</span>
                                        <BookingStatusBadge
                                            status={booking.status}
                                            size="sm"
                                        />
                                    </td>

                                    {/* Actions */}
                                    <td className="pl-2 pr-4 py-3 lg:py-3.5 flex justify-between items-center lg:table-cell bg-neutral-50/50 lg:bg-transparent">
                                        <span className="lg:hidden text-[10px] font-bold uppercase text-neutral-400">Actions</span>
                                        <div className="inline-flex items-center gap-2 justify-end lg:justify-start w-full lg:w-auto">
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
    );
}

export function BookingTableSkeleton() {
    return (
        <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-2xs animate-pulse">
            <div className="overflow-x-auto w-full min-w-0">
                <div className="lg:min-w-[840px]">
                    <div className="hidden lg:flex border-b border-neutral-100 bg-neutral-50/70 p-3.5 justify-between items-center">
                        <div className="h-3 w-20 rounded bg-neutral-200" />
                        <div className="h-3 w-24 rounded bg-neutral-200" />
                        <div className="h-3 w-20 rounded bg-neutral-200" />
                        <div className="h-3 w-16 rounded bg-neutral-200" />
                        <div className="h-3 w-16 rounded bg-neutral-200" />
                        <div className="h-3 w-20 rounded bg-neutral-200" />
                        <div className="h-3 w-16 rounded bg-neutral-200" />
                        <div className="h-3 w-16 rounded bg-neutral-200" />
                    </div>
                    <div className="divide-y divide-neutral-100">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between px-4 py-3.5"
                            >
                                <div className="h-4 w-20 rounded bg-neutral-200" />
                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-lg bg-neutral-100" />
                                    <div className="h-4 w-24 rounded bg-neutral-200" />
                                </div>
                                <div className="h-6 w-28 rounded-lg bg-neutral-100" />
                                <div className="h-4 w-20 rounded bg-neutral-100" />
                                <div className="h-4 w-16 rounded bg-neutral-200" />
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
    );
}