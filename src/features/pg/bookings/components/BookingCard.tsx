import { useNavigate } from "react-router";
import { Booking } from "../types/booking.types";
import { BookingStatusBadge } from "./BookingStatusBadge";

interface BookingCardProps {
    booking: Booking
}

export function BookingCard({booking}: BookingCardProps) {
    const navigate = useNavigate()

    return (
         <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500">
            Booking Number
          </p>

          <h3 className="mt-1 font-semibold text-gray-900">
            {booking.bookingNumber}
          </h3>
        </div>

        <BookingStatusBadge
          status={booking.status}
        />
      </div>

      <div className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">
            Customer
          </span>

          <span className="font-medium">
            {booking.customerId}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">
            Room
          </span>

          <span className="font-medium">
            {booking.roomNumber}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">
            Rent
          </span>

          <span className="font-medium">
            ₹
            {booking.rentAmount.toLocaleString(
              "en-IN"
            )}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          navigate(
            `/pg/bookings/${booking.id}`
          )
        }
        className="mt-5 w-full rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
      >
        View Booking
      </button>
    </div>
    )

}