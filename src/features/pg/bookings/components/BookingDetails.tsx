import { Booking } from "../types/booking.types";
import { BookingStatusBadge } from "./BookingStatusBadge";

interface BookingDetailsProps {
    booking: Booking
}

export function BookingDetails({ booking }: BookingDetailsProps) {
    return (
        <div className="space-y-4 sm:space-y-5">
            {/* Header */}
            <div className="flex flex-col justify-between gap-3 rounded-2xl border border-neutral-100 bg-white p-4 sm:p-5 shadow-2xs md:flex-row md:items-center">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                        Booking Number
                    </p>
                    <h2 className="mt-0.5 text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 font-mono">
                        {booking.bookingNumber}
                    </h2>
                </div>

                <div>
                    <BookingStatusBadge status={booking.status} />
                </div>
            </div>

            {/* Customer */}
            <section className="rounded-2xl border border-neutral-100 bg-white p-4 sm:p-5 shadow-2xs">
                <h3 className="text-sm sm:text-base font-bold text-neutral-900">
                    Customer Information
                </h3>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <DetailItem
                        label="Customer ID"
                        value={booking.customerId}
                    />

                    <DetailItem
                        label="Booking ID"
                        value={booking.id}
                    />
                </div>
            </section>

            {/* Room */}
            <section className="rounded-2xl border border-neutral-100 bg-white p-4 sm:p-5 shadow-2xs">
                <h3 className="text-sm sm:text-base font-bold text-neutral-900">
                    Room Information
                </h3>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <DetailItem
                        label="Room"
                        value={booking.roomNumber}
                    />

                    <DetailItem
                        label="Room ID"
                        value={booking.roomId}
                    />

                    <DetailItem
                        label="Bed"
                        value={booking.bedNumber || "-"}
                    />
                </div>
            </section>

            {/* Dates */}
            <section className="rounded-2xl border border-neutral-100 bg-white p-4 sm:p-5 shadow-2xs">
                <h3 className="text-sm sm:text-base font-bold text-neutral-900">
                    Booking Dates
                </h3>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <DetailItem
                        label="Check In"
                        value={new Date(booking.checkInDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        })}
                    />

                    <DetailItem
                        label="Check Out"
                        value={
                            booking.checkOutDate
                                ? new Date(booking.checkOutDate).toLocaleDateString("en-IN", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                  })
                                : "—"
                        }
                    />
                </div>
            </section>

            {/* Financial */}
            <section className="rounded-2xl border border-neutral-100 bg-white p-4 sm:p-5 shadow-2xs">
                <h3 className="text-sm sm:text-base font-bold text-neutral-900">
                    Financial Information
                </h3>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <DetailItem
                        label="Rent"
                        value={`₹${booking.rentAmount.toLocaleString("en-IN")}`}
                    />

                    <DetailItem
                        label="Advance"
                        value={`₹${booking.advanceAmount.toLocaleString("en-IN")}`}
                    />

                    <DetailItem
                        label="Security Deposit"
                        value={`₹${booking.securityDeposit.toLocaleString("en-IN")}`}
                    />
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100">
                    <DetailItem
                        label="Payment Status"
                        value={booking.paymentStatus}
                    />
                </div>
            </section>

            {/* Notes */}
            {booking.notes && (
                <section className="rounded-2xl border border-neutral-100 bg-white p-4 sm:p-5 shadow-2xs">
                    <h3 className="text-sm sm:text-base font-bold text-neutral-900">
                        Notes
                    </h3>

                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-neutral-600">
                        {booking.notes}
                    </p>
                </section>
            )}
        </div>
    );
}

interface DetailItemProps {
    label: string;
    value: string;
}

function DetailItem({ label, value }: DetailItemProps) {
    return (
        <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                {label}
            </p>

            <p className="mt-1 break-all text-xs sm:text-sm font-semibold text-neutral-800">
                {value}
            </p>
        </div>
    );
}