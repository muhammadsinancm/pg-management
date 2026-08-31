import { BookingReportData } from "../types/report.types";

interface BookingReportProps {
    bookings: BookingReportData
}

export function BookingReport({ bookings }: BookingReportProps) {
    return (
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-gray-900">
                Booking Report
            </h2>

            <div className="mt-5 grid grid-cols-2 gap-4">

                <Stat
                    label="Total"
                    value={bookings.totalBookings}
                />

                <Stat
                    label="Confirmed"
                    value={bookings.confirmedBookings}
                />

                <Stat
                    label="Pending"
                    value={bookings.pendingBookings}
                />

                <Stat
                    label="Cancelled"
                    value={bookings.cancelledBookings}
                />

                <Stat
                    label="Completed"
                    value={bookings.completedBookings}
                />

            </div>

        </section>
    )
}

function Stat({ label, value }: {
    label: string
    value: number
}) {
    return (
        <div className="rounded-lg bg-gray-50 p-4">

            <p className="text-sm text-gray-500">
                {label}
            </p>

            <p className="mt-1 text-xl font-bold text-gray-900">
                {value}
            </p>

        </div>
    )
}