import { useNavigate } from "react-router";
import { useBookings } from "../hooks/useBookings";
import { useMemo, useState } from "react";
import { BookingStatus } from "../types/booking.types";
import { BookingTable } from "./BookingTable";
import { BookingFilters } from "./BookingFilters";
import { BookingSummary } from "./BookingSummary";

export function BookingsPage() {
    const navigate = useNavigate()

    const { bookings, loading, error, removeBooking } = useBookings()

    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all')

    const filteredBookings = useMemo(() => {
        const searchValue = search.trim().toLowerCase()

        return bookings.filter((booking) => {
            const matchesSearch = !searchValue || booking.bookingNumber.toLowerCase().includes(searchValue) ||
                booking.customerId.toLowerCase().includes(searchValue) ||
                booking.roomNumber.toLowerCase().includes(searchValue)

            const matchesStatus = statusFilter === 'all' || booking.status === statusFilter

            return (
                matchesSearch && matchesStatus
            )

        })
    }, [bookings, search, statusFilter])

    const confirmedBookings = bookings.filter((item) => item.status === 'confirmed').length
    const checkedInBookings = bookings.filter((item) => item.status === 'checked_in').length
    const pendingBookings = bookings.filter((item) => item.status === 'pending').length

    const handleDelete = async (id: string) => {

        const confirmed = window.confirm('Are you sure you want to delete this booking?')
        if (!confirmed) {
            return
        }
        await removeBooking(id)
    }

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal-700">
                        PG Management
                    </p>

                    <h1 className="mt-2 text-3xl font-semibold text-gray-900">
                        Bookings
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage customer bookings,
                        rooms and check-in details.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/pg/bookings/create"
                        )
                    }
                    className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
                >
                    + New Booking
                </button>
            </div>

            {/* Summary */}
            <BookingSummary
                totalBookings={
                    bookings.length
                }
                confirmedBookings={
                    confirmedBookings
                }
                checkedInBookings={
                    checkedInBookings
                }
                pendingBookings={
                    pendingBookings
                }
            />

            {/* Filters */}
            <BookingFilters
                search={search}
                status={statusFilter}
                onSearchChange={setSearch}
                onStatusChange={
                    setStatusFilter
                }
            />

            {/* Error */}
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-gray-500">
                    Loading bookings...
                </div>
            ) : (
                <BookingTable
                    bookings={
                        filteredBookings
                    }
                    onDelete={
                        handleDelete
                    }
                />
            )}

        </div>
    )

}