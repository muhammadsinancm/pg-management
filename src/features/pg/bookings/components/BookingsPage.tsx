import { useNavigate } from "react-router";
import { useBookings } from "../hooks/useBookings";
import { useMemo, useState } from "react";
import { AlertCircle, CalendarCheck, Plus } from "lucide-react";
import { BookingStatus } from "../types/booking.types";
import { BookingTable, BookingTableSkeleton } from "./BookingTable";
import { BookingCard, BookingCardSkeleton } from "./BookingCard";
import { BookingFilters } from "./BookingFilters";
import { BookingSummary, BookingSummarySkeleton } from "./BookingSummary";

export function BookingsPage() {
    const navigate = useNavigate();

    const { bookings, loading, error, removeBooking } = useBookings();

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
    const [viewMode, setViewMode] = useState<"table" | "card">("table");

    const filteredBookings = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return bookings.filter((booking) => {
            const bookingNo = (booking.bookingNumber || "").toLowerCase();
            const customer = (booking.customerId || "").toLowerCase();
            const room = (booking.roomNumber || "").toLowerCase();

            const matchesSearch =
                !searchValue ||
                bookingNo.includes(searchValue) ||
                customer.includes(searchValue) ||
                room.includes(searchValue);

            const matchesStatus =
                statusFilter === "all" || booking.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [bookings, search, statusFilter]);

    const confirmedBookings = bookings.filter((item) => item.status === "confirmed").length;
    const checkedInBookings = bookings.filter((item) => item.status === "checked_in").length;
    const pendingBookings = bookings.filter((item) => item.status === "pending").length;

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this booking?");
        if (!confirmed) {
            return;
        }
        await removeBooking(id);
    };

    const handleStatusSelect = (status: BookingStatus | "all") => {
        setStatusFilter((prev) => (prev === status ? "all" : status));
    };

    return (
        <div className="w-full min-w-0 space-y-4">
            {/* Header */}
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                        Bookings
                    </h1>
                    <p className="mt-0.5 text-xs text-neutral-400">
                        Manage customer bookings, room allocations, and check-in details
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/pg/bookings/create")}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-neutral-800 cursor-pointer shrink-0"
                >
                    <Plus className="h-3.5 w-3.5" />
                    New Booking
                </button>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50/80 p-3.5 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                        <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                        <p className="text-xs font-semibold text-red-800">{error}</p>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="space-y-4">
                    <BookingSummarySkeleton />
                    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between animate-pulse">
                        <div className="h-9 w-full sm:max-w-md rounded-xl bg-neutral-100" />
                        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                            <div className="h-9 flex-1 sm:w-28 rounded-xl bg-neutral-100" />
                            <div className="h-9 w-32 rounded-xl bg-neutral-100 shrink-0" />
                        </div>
                    </div>
                    {viewMode === "table" ? (
                        <BookingTableSkeleton />
                    ) : (
                        <div className="grid grid-cols-1 gap-2.5 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <BookingCardSkeleton key={i} />
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {/* Summary Metric Cards */}
                    <BookingSummary
                        totalBookings={bookings.length}
                        confirmedBookings={confirmedBookings}
                        checkedInBookings={checkedInBookings}
                        pendingBookings={pendingBookings}
                        activeStatus={statusFilter}
                        onStatusSelect={handleStatusSelect}
                    />

                    {/* Search, Filter & View Controls */}
                    <BookingFilters
                        search={search}
                        status={statusFilter}
                        viewMode={viewMode}
                        onSearchChange={setSearch}
                        onStatusChange={setStatusFilter}
                        onViewModeChange={setViewMode}
                    />

                    {/* Data View: Table or Cards */}
                    {viewMode === "table" ? (
                        <BookingTable
                            bookings={filteredBookings}
                            onDelete={handleDelete}
                        />
                    ) : filteredBookings.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-10 sm:p-12 text-center shadow-2xs">
                            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
                                <CalendarCheck className="h-5 w-5" />
                            </div>
                            <h3 className="mt-3 text-sm font-bold text-neutral-900">
                                No bookings found
                            </h3>
                            <p className="mt-1 text-xs text-neutral-400 max-w-sm mx-auto">
                                {search || statusFilter !== "all"
                                    ? "No bookings match your current search and filter criteria."
                                    : "Add your first booking to get started."}
                            </p>
                            <button
                                type="button"
                                onClick={() => navigate("/pg/bookings/create")}
                                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-neutral-800 transition-all cursor-pointer"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                New Booking
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-2.5 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredBookings.map((booking) => (
                                <BookingCard
                                    key={booking.id}
                                    booking={booking}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}