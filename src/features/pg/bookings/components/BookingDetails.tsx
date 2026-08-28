import { Booking } from "../types/booking.types";
import { BookingStatusBadge } from "./BookingStatusBadge";

interface BookingDetailsProps {
    booking: Booking
}

export function BookingDetails({booking}: BookingDetailsProps) {
    return (
         <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-gray-200 bg-white p-6 md:flex-row md:items-center">
        <div>
          <p className="text-sm text-gray-500">
            Booking Number
          </p>

          <h2 className="mt-1 text-2xl font-semibold text-gray-900">
            {booking.bookingNumber}
          </h2>
        </div>

        <BookingStatusBadge
          status={booking.status}
        />
      </div>

      {/* Customer */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Customer Information
        </h3>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
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
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Room Information
        </h3>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
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
            value={
              booking.bedNumber ||
              "-"
            }
          />
        </div>
      </section>

      {/* Dates */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Booking Dates
        </h3>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <DetailItem
            label="Check In"
            value={booking.checkInDate.toLocaleDateString(
              "en-IN"
            )}
          />

          <DetailItem
            label="Check Out"
            value={
              booking.checkOutDate
                ? booking.checkOutDate.toLocaleDateString(
                    "en-IN"
                  )
                : "-"
            }
          />
        </div>
      </section>

      {/* Financial */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Financial Information
        </h3>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
          <DetailItem
            label="Rent"
            value={`₹${booking.rentAmount.toLocaleString(
              "en-IN"
            )}`}
          />

          <DetailItem
            label="Advance"
            value={`₹${booking.advanceAmount.toLocaleString(
              "en-IN"
            )}`}
          />

          <DetailItem
            label="Security Deposit"
            value={`₹${booking.securityDeposit.toLocaleString(
              "en-IN"
            )}`}
          />
        </div>

        <div className="mt-5">
          <DetailItem
            label="Payment Status"
            value={booking.paymentStatus}
          />
        </div>
      </section>

      {/* Notes */}
      {booking.notes && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Notes
          </h3>

          <p className="mt-4 text-sm leading-6 text-gray-600">
            {booking.notes}
          </p>
        </section>
      )}
    </div>
    )
}

interface DetailItemProps {
    label: string
    value: string
}

function DetailItem({label, value}: DetailItemProps) {
    return (
        <div>
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-1 break-all font-medium text-gray-900">
        {value}
      </p>
    </div>
    )
}