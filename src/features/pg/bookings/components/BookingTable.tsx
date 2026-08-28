import { useNavigate } from "react-router";
import { Booking } from "../types/booking.types";
import { BookingStatusBadge } from "./BookingStatusBadge";

interface BookingTableProps {
    bookings: Booking[]
    onDelete: (id: string) => Promise<void>
}

export function BookingTable({bookings, onDelete}: BookingTableProps) {
    const navigate = useNavigate()

    if (bookings.length === 0) {
        return (
             <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          No bookings found
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          Create your first booking to get started.
        </p>
      </div>
        )
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-5 py-4 font-semibold">
                Booking
              </th>

              <th className="px-5 py-4 font-semibold">
                Customer
              </th>

              <th className="px-5 py-4 font-semibold">
                Room
              </th>

              <th className="px-5 py-4 font-semibold">
                Check In
              </th>

              <th className="px-5 py-4 font-semibold">
                Check Out
              </th>

              <th className="px-5 py-4 font-semibold">
                Amount
              </th>

              <th className="px-5 py-4 font-semibold">
                Status
              </th>

              <th className="px-5 py-4 font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {bookings.map(
              (booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-5 py-4 font-medium">
                    {booking.bookingNumber}
                  </td>

                  <td className="px-5 py-4">
                    {booking.customerId}
                  </td>

                  <td className="px-5 py-4">
                    <div>
                      Room {booking.roomNumber}
                    </div>

                    {booking.bedNumber && (
                      <div className="text-xs text-gray-500">
                        Bed {booking.bedNumber}
                      </div>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    {booking.checkInDate.toLocaleDateString(
                      "en-IN"
                    )}
                  </td>

                  <td className="px-5 py-4">
                    {booking.checkOutDate
                      ? booking.checkOutDate.toLocaleDateString(
                          "en-IN"
                        )
                      : "-"}
                  </td>

                  <td className="px-5 py-4 font-medium">
                    ₹
                    {booking.rentAmount.toLocaleString(
                      "en-IN"
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <BookingStatusBadge
                      status={booking.status}
                    />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/pg/bookings/${booking.id}`
                          )
                        }
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium hover:bg-gray-100"
                      >
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onDelete(booking.id)
                        }
                        className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
    )
}