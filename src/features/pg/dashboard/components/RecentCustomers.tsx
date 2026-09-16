import { Calendar, DoorOpen, UserCheck, Users } from "lucide-react";
import type { RecentCustomer } from "./dashboard.types";

interface RecentCustomersProps {
    customers: RecentCustomer[];
}

function getInitials(name: string) {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function CustomerStatusBadge({ status }: { status: string }) {
    const s = (status || "").toLowerCase().trim();

    if (s === "checked_in" || s === "active") {
        return (
            <span className="inline-flex h-5 sm:h-6 items-center justify-center whitespace-nowrap rounded-full bg-black px-1.5 sm:px-2.5 text-[10px] sm:text-[11px] font-semibold leading-none text-white">
                Checked In
            </span>
        );
    }

    if (s === "confirmed") {
        return (
            <span className="inline-flex h-5 sm:h-6 items-center justify-center whitespace-nowrap rounded-full bg-neutral-100 px-1.5 sm:px-2.5 text-[10px] sm:text-[11px] font-semibold leading-none text-neutral-700">
                Confirmed
            </span>
        );
    }

    if (s === "pending") {
        return (
            <span className="inline-flex h-5 sm:h-6 items-center justify-center whitespace-nowrap rounded-full bg-neutral-100 px-1.5 sm:px-2.5 text-[10px] sm:text-[11px] font-semibold leading-none text-neutral-700">
                Pending
            </span>
        );
    }

    if (s === "checked_out" || s === "inactive") {
        return (
            <span className="inline-flex h-5 sm:h-6 items-center justify-center whitespace-nowrap rounded-full bg-neutral-100 px-1.5 sm:px-2.5 text-[10px] sm:text-[11px] font-semibold leading-none text-neutral-700">
                Checked Out
            </span>
        );
    }

    if (s === "cancelled") {
        return (
            <span className="inline-flex h-5 sm:h-6 items-center justify-center whitespace-nowrap rounded-full bg-neutral-100 px-1.5 sm:px-2.5 text-[10px] sm:text-[11px] font-semibold leading-none text-neutral-700">
                Cancelled
            </span>
        );
    }

    return (
        <span className="inline-flex h-5 sm:h-6 items-center justify-center whitespace-nowrap rounded-full bg-neutral-100 px-1.5 sm:px-2.5 text-[10px] sm:text-[11px] font-semibold capitalize leading-none text-neutral-700">
            {status.replace(/_/g, " ")}
        </span>
    );
}

export default function RecentCustomers({
    customers,
}: RecentCustomersProps) {
    return (
        <div className="w-full overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-2xs">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-3.5 py-3 sm:px-4 sm:py-3.5">
                <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800 sm:h-9 sm:w-9">
                        <Users className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                        <h2 className="truncate text-xs sm:text-sm font-bold text-neutral-900">
                            Recent Customers
                        </h2>

                        <p className="truncate text-[10px] sm:text-[11px] text-neutral-400">
                            Recently onboarded tenants
                        </p>
                    </div>
                </div>

                {customers.length > 0 && (
                    <span className="shrink-0 rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-700">
                        {customers.length} Tenants
                    </span>
                )}
            </div>

            {/* Table or Empty State */}
            {customers.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
                    <div className="rounded-xl bg-neutral-100 p-2.5 text-neutral-400">
                        <UserCheck className="h-5 w-5" />
                    </div>

                    <h3 className="mt-2.5 text-xs sm:text-sm font-semibold text-neutral-800">
                        No customers found
                    </h3>

                    <p className="mt-1 max-w-xs text-[10px] sm:text-[11px] text-neutral-400">
                        New tenants will automatically appear here once
                        bookings are confirmed.
                    </p>
                </div>
            ) : (
                <div className="w-full overflow-hidden">
                    <table className="w-full table-fixed text-left text-xs sm:text-sm">
                        <thead>
                            <tr className="border-b border-neutral-100 bg-neutral-50/50 text-[10px] sm:text-[11px] font-semibold text-neutral-500">
                                <th className="w-[34%] sm:w-[32%] py-2 pl-3.5 pr-1 font-semibold sm:pl-4 sm:pr-2">
                                    Customer
                                </th>

                                <th className="w-[20%] sm:w-[22%] py-2 px-1 font-semibold sm:px-2">
                                    Room
                                </th>

                                <th className="w-[24%] sm:w-[22%] py-2 px-1 font-semibold sm:px-2">
                                    Status
                                </th>

                                <th className="w-[22%] sm:w-[24%] py-2 pl-1 pr-3.5 font-semibold sm:pl-2 sm:pr-4">
                                    Joined
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-neutral-100">
                            {customers.map((customer) => (
                                <tr
                                    key={customer.id}
                                    className="transition-colors hover:bg-neutral-50/50"
                                >
                                    {/* Customer */}
                                    <td className="py-2 pl-3.5 pr-1 sm:pl-4 sm:pr-2 sm:py-2.5">
                                        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
                                            <div className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-[9px] sm:text-[10px] font-bold text-neutral-800">
                                                {getInitials(customer.name)}
                                            </div>

                                            <span className="truncate text-[11px] sm:text-xs md:text-sm font-semibold text-neutral-900 leading-tight">
                                                {customer.name}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Room */}
                                    <td className="py-2 px-1 sm:px-2 sm:py-2.5">
                                        <div className="flex items-center gap-1 text-[11px] sm:text-xs font-medium text-neutral-700 truncate">
                                            <DoorOpen className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 text-neutral-400" />
                                            <span className="truncate">
                                                Room {customer.roomNumber}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="py-2 px-1 sm:px-2 sm:py-2.5">
                                        <CustomerStatusBadge
                                            status={customer.status}
                                        />
                                    </td>

                                    {/* Joined */}
                                    <td className="py-2 pl-1 pr-3.5 sm:pl-2 sm:pr-4 sm:py-2.5">
                                        <div className="flex items-center gap-1 text-[10px] sm:text-[11px] md:text-xs text-neutral-400 truncate">
                                            <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 text-neutral-400" />
                                            <span className="truncate">
                                                {customer.joinedDate || "—"}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}