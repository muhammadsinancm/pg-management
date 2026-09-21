import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    LayoutGrid,
    LogOut,
    Plus,
    Search,
    Table as TableIcon,
    UserCheck,
    Users,
    X,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useGuests } from "../hooks/useGuests";
import { CreateGuestInput, Guest, GuestStatus } from "../types/guests.types";
import { GuestTable, GuestTableSkeleton } from "./GuestTable";
import { GuestCard, GuestCardSkeleton } from "./GuestCard";
import { GuestForm } from "./GuestForm";

export function GuestsPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { guests, loading, error, addGuest, editGuest, removeGuest } = useGuests();

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<GuestStatus | "all">("all");
    const [viewMode, setViewMode] = useState<"table" | "card">("table");
    const [showForm, setShowForm] = useState(false);
    const [editingGuest, setEditingGuest] = useState<Guest | undefined>();

    // Filter guests based on search and status filter
    const filteredGuests = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return guests.filter((guest) => {
            const name = (guest.fullName || "").toLowerCase();
            const phone = (guest.phone || "").toLowerCase();
            const email = (guest.email || "").toLowerCase();
            const idNum = (guest.idNumber || "").toLowerCase();
            const city = (guest.city || "").toLowerCase();

            const matchesSearch =
                !searchValue ||
                name.includes(searchValue) ||
                phone.includes(searchValue) ||
                email.includes(searchValue) ||
                idNum.includes(searchValue) ||
                city.includes(searchValue);

            const matchesStatus =
                statusFilter === "all" || guest.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [guests, search, statusFilter]);

    // Summary counts
    const activeCount = useMemo(
        () => guests.filter((g) => g.status === "active").length,
        [guests]
    );
    const checkedOutCount = useMemo(
        () => guests.filter((g) => g.status === "checked_out").length,
        [guests]
    );
    const cancelledCount = useMemo(
        () => guests.filter((g) => g.status === "cancelled").length,
        [guests]
    );

    const handleStatusSelect = (status: GuestStatus | "all") => {
        setStatusFilter((prev) => (prev === status ? "all" : status));
    };

    async function handleSubmit(data: CreateGuestInput) {
        try {
            if (!user) {
                alert("User is not logged in");
                return;
            }
            if (!user.organizationId) {
                alert("Organization ID is missing");
                return;
            }

            if (editingGuest) {
                await editGuest(editingGuest.id, data);
            } else {
                await addGuest(data, user.organizationId);
            }

            setEditingGuest(undefined);
            setShowForm(false);
        } catch (err) {
            console.error(err);
            alert(editingGuest ? "Failed to update guest" : "Failed to add guest");
        }
    }

    function handleEdit(guest: Guest) {
        setEditingGuest(guest);
        setShowForm(true);
    }

    function handleView(guest: Guest) {
        navigate(`/pg/customers/${guest.id}`);
    }

    function handleAddGuest() {
        setEditingGuest(undefined);
        setShowForm(true);
    }

    function handleCancelForm() {
        setShowForm(false);
        setEditingGuest(undefined);
    }

    async function handleDelete(guest: Guest) {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${guest.fullName}?`
        );
        if (!confirmed) return;

        try {
            await removeGuest(guest.id);
        } catch (err) {
            console.error(err);
            alert("Failed to delete guest.");
        }
    }

    const summaryCards = [
        {
            key: "all" as const,
            label: "Total Guests",
            value: guests.length,
            icon: Users,
            iconColor: "text-neutral-700 bg-neutral-100",
            activeClass: "border-neutral-900 bg-neutral-50/80 shadow-xs ring-2 ring-neutral-900/10",
        },
        {
            key: "active" as const,
            label: "Active",
            value: activeCount,
            icon: UserCheck,
            iconColor: "text-emerald-700 bg-emerald-50",
            activeClass: "border-emerald-600 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-600/10",
        },
        {
            key: "checked_out" as const,
            label: "Checked Out",
            value: checkedOutCount,
            icon: LogOut,
            iconColor: "text-blue-700 bg-blue-50",
            activeClass: "border-blue-600 bg-blue-50/70 shadow-xs ring-2 ring-blue-600/10",
        },
        {
            key: "cancelled" as const,
            label: "Cancelled",
            value: cancelledCount,
            icon: Clock,
            iconColor: "text-red-700 bg-red-50",
            activeClass: "border-red-600 bg-red-50/70 shadow-xs ring-2 ring-red-600/10",
        },
    ];

    return (
        <div className="w-full min-w-0 space-y-4">
            {/* Header */}
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                        Guests
                    </h1>
                    <p className="mt-0.5 text-xs text-neutral-400">
                        Manage guest directory, identification records, and contact information
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleAddGuest}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-neutral-800 cursor-pointer shrink-0"
                >
                    <Plus className="h-3.5 w-3.5" />
                    New Guest
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

            {/* Loading State: Only show skeleton on initial load when there is no data */}
            {loading && guests.length === 0 ? (
                <div className="space-y-4">
                    {/* Summary Skeleton */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-4 sm:gap-3 animate-pulse">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex min-h-[72px] sm:min-h-[82px] flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-3 sm:p-3.5 lg:p-4 shadow-2xs min-w-0"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="h-2.5 sm:h-3 w-14 sm:w-20 rounded bg-neutral-100" />
                                    <div className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 rounded-lg sm:rounded-xl bg-neutral-100" />
                                </div>
                                <div className="mt-2 sm:mt-2.5">
                                    <div className="h-5 sm:h-6 w-10 sm:w-12 rounded-md bg-neutral-200" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Filter Skeleton */}
                    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between animate-pulse">
                        <div className="h-9 w-full sm:max-w-md rounded-xl bg-neutral-100" />
                        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                            <div className="h-9 flex-1 sm:w-28 rounded-xl bg-neutral-100" />
                            <div className="h-9 w-32 rounded-xl bg-neutral-100 shrink-0" />
                        </div>
                    </div>

                    {viewMode === "table" ? (
                        <GuestTableSkeleton />
                    ) : (
                        <div className="grid grid-cols-1 gap-2.5 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <GuestCardSkeleton key={i} />
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {/* Summary Metric Cards */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-4 sm:gap-3">
                        {summaryCards.map((stat) => {
                            const Icon = stat.icon;
                            const isActive = statusFilter === stat.key;

                            return (
                                <button
                                    key={stat.label}
                                    type="button"
                                    onClick={() => handleStatusSelect(stat.key)}
                                    className={`group flex flex-col justify-between rounded-2xl border p-3 sm:p-3.5 lg:p-4 text-left transition-all cursor-pointer shadow-2xs min-w-0 ${
                                        isActive
                                            ? stat.activeClass
                                            : "border-neutral-100 bg-white hover:border-neutral-200 hover:shadow-xs"
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                                        <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-500 uppercase tracking-wider truncate">
                                            {stat.label}
                                        </span>
                                        <div
                                            className={`flex h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 shrink-0 items-center justify-center rounded-lg sm:rounded-xl transition-colors ${stat.iconColor}`}
                                        >
                                            <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
                                        </div>
                                    </div>

                                    <div className="mt-2 sm:mt-2.5 flex items-baseline gap-1">
                                        <span className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-neutral-900">
                                            {stat.value}
                                        </span>
                                        <span className="hidden sm:inline text-[10px] font-medium text-neutral-400">
                                            {stat.key === "all" ? "total" : "guests"}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Search, Filter & View Controls */}
                    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name, phone, email, ID..."
                                className="w-full rounded-xl border border-neutral-200 bg-white pl-9 pr-8 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer p-0.5"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            )}
                        </div>

                        {/* Status Filter & View Switcher */}
                        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value as GuestStatus | "all")
                                }
                                className="flex-1 sm:flex-initial rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-800 shadow-2xs outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 cursor-pointer"
                            >
                                <option value="all">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="checked_out">Checked Out</option>
                                <option value="cancelled">Cancelled</option>
                            </select>

                            <div className="inline-flex items-center rounded-xl border border-neutral-200 bg-white p-0.5 shadow-2xs">
                                <button
                                    type="button"
                                    onClick={() => setViewMode("table")}
                                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                                        viewMode === "table"
                                            ? "bg-neutral-900 text-white shadow-2xs"
                                            : "text-neutral-500 hover:text-neutral-900"
                                    }`}
                                    title="Table View"
                                >
                                    <TableIcon className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline">Table</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setViewMode("card")}
                                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                                        viewMode === "card"
                                            ? "bg-neutral-900 text-white shadow-2xs"
                                            : "text-neutral-500 hover:text-neutral-900"
                                    }`}
                                    title="Card View"
                                >
                                    <LayoutGrid className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline">Cards</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content Display: Table or Cards */}
                    {viewMode === "table" ? (
                        <GuestTable
                            guests={filteredGuests}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onAdd={handleAddGuest}
                        />
                    ) : filteredGuests.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-10 sm:p-12 text-center shadow-2xs">
                            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
                                <Users className="h-5 w-5" />
                            </div>
                            <h3 className="mt-3 text-sm font-bold text-neutral-900">
                                No guests found
                            </h3>
                            <p className="mt-1 text-xs text-neutral-400 max-w-sm mx-auto">
                                {search || statusFilter !== "all"
                                    ? "No guests match your current search and filter criteria."
                                    : "Add your first guest to get started."}
                            </p>
                            <button
                                type="button"
                                onClick={handleAddGuest}
                                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-neutral-800 transition-all cursor-pointer"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                New Guest
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-2.5 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredGuests.map((guest) => (
                                <GuestCard
                                    key={guest.id}
                                    guest={guest}
                                    onView={handleView}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Add / Edit Guest Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl border border-neutral-100">
                        <div className="mb-5 flex items-center justify-between border-b border-neutral-100 pb-3">
                            <div>
                                <h2 className="text-base sm:text-lg font-bold text-neutral-900">
                                    {editingGuest ? "Edit Guest Profile" : "Add New Guest"}
                                </h2>
                                <p className="text-xs text-neutral-400">
                                    {editingGuest
                                        ? "Update guest personal details and documents"
                                        : "Register a new guest in the directory"}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleCancelForm}
                                className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors cursor-pointer"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <GuestForm
                            guest={editingGuest}
                            onSubmit={handleSubmit}
                            onCancel={handleCancelForm}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}