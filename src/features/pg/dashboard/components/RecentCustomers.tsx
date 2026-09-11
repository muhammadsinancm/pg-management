import { Calendar, DoorOpen, UserCheck, Users } from "lucide-react";
import { RecentCustomer } from "../types/dahsboard.types";

interface RecentCustomersProps {
    customers: RecentCustomer[];
}

function getInitials(name: string) {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const AVATAR_PALETTES = [
    "bg-teal-100 text-teal-800 ring-teal-200/60",
    "bg-indigo-100 text-indigo-800 ring-indigo-200/60",
    "bg-emerald-100 text-emerald-800 ring-emerald-200/60",
    "bg-sky-100 text-sky-800 ring-sky-200/60",
    "bg-violet-100 text-violet-800 ring-violet-200/60",
    "bg-amber-100 text-amber-800 ring-amber-200/60",
    "bg-rose-100 text-rose-800 ring-rose-200/60",
];

function getAvatarColor(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % AVATAR_PALETTES.length;
    return AVATAR_PALETTES[index];
}

function CustomerStatusBadge({ status }: { status: string }) {
    const s = (status || "").toLowerCase().trim();

    if (s === "checked_in" || s === "active") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Checked In
            </span>
        );
    }

    if (s === "confirmed") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-blue-600/20">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                Confirmed
            </span>
        );
    }

    if (s === "pending") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-600/20">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Pending
            </span>
        );
    }

    if (s === "checked_out" || s === "inactive") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                Checked Out
            </span>
        );
    }

    if (s === "cancelled") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700 ring-1 ring-rose-600/20">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                Cancelled
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium capitalize text-gray-700 ring-1 ring-gray-200">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
            {status}
        </span>
    );
}

export default function RecentCustomers({ customers }: RecentCustomersProps) {
    return (
        <div className="rounded-2xl border border-gray-200/90 bg-white shadow-xs transition-shadow duration-200 hover:shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-4 sm:p-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 ring-1 ring-teal-600/10">
                        <Users className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                            Recent Customers
                        </h2>
                        <p className="text-xs text-gray-500 sm:text-sm">
                            Recently onboarded tenants
                        </p>
                    </div>
                </div>

                {customers.length > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 ring-1 ring-teal-600/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
                        {customers.length} Tenants
                    </span>
                )}
            </div>

            {/* Content */}
            {customers.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center sm:p-12">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 ring-1 ring-gray-200/70">
                        <UserCheck className="h-6 w-6" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-gray-900">
                        No customers found
                    </h3>
                    <p className="mt-1 text-xs text-gray-500 max-w-xs">
                        New tenants will automatically appear here once bookings are confirmed.
                    </p>
                </div>
            ) : (
                <>
                    {/* Mobile View: High-density, touch-friendly cards (Hidden on sm+) */}
                    <div className="divide-y divide-gray-100 sm:hidden">
                        {customers.map((customer) => (
                            <div
                                key={customer.id}
                                className="flex items-center justify-between gap-3 p-4 transition-colors hover:bg-gray-50/80 active:bg-gray-100/70"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ring-1 ${getAvatarColor(
                                            customer.name
                                        )}`}
                                    >
                                        {getInitials(customer.name)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-gray-900">
                                            {customer.name}
                                        </p>
                                        <div className="mt-1 flex flex-wrap items-center gap-2">
                                            <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-1.5 py-0.5 text-[11px] font-medium text-gray-700">
                                                <DoorOpen className="h-3 w-3 text-gray-500" />
                                                Room {customer.roomNumber}
                                            </span>
                                            <span className="flex items-center gap-1 text-[11px] text-gray-500">
                                                <Calendar className="h-3 w-3 text-gray-400" />
                                                {customer.joinedDate || "Recent"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="shrink-0">
                                    <CustomerStatusBadge status={customer.status} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop View: Polished Table (Hidden on mobile) */}
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/60 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    <th className="px-5 py-3.5">Customer</th>
                                    <th className="px-5 py-3.5">Room</th>
                                    <th className="px-5 py-3.5">Status</th>
                                    <th className="px-5 py-3.5">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {customers.map((customer) => (
                                    <tr
                                        key={customer.id}
                                        className="transition-colors hover:bg-gray-50/70"
                                    >
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ring-1 ${getAvatarColor(
                                                        customer.name
                                                    )}`}
                                                >
                                                    {getInitials(customer.name)}
                                                </div>
                                                <span className="font-medium text-gray-900">
                                                    {customer.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                                                <DoorOpen className="h-3.5 w-3.5 text-gray-400" />
                                                Room {customer.roomNumber}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <CustomerStatusBadge status={customer.status} />
                                        </td>
                                        <td className="px-5 py-3.5 text-xs text-gray-500">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                                <span>{customer.joinedDate || "—"}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}