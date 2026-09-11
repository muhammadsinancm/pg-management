import { Calendar, CreditCard, Receipt } from "lucide-react";
import { RecentPayment } from "../types/dahsboard.types";

interface RecentPaymentsProps {
    payments: RecentPayment[];
}

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);
}

function getInitials(name: string) {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const AVATAR_PALETTES = [
    "bg-emerald-100 text-emerald-800 ring-emerald-200/60",
    "bg-teal-100 text-teal-800 ring-teal-200/60",
    "bg-blue-100 text-blue-800 ring-blue-200/60",
    "bg-indigo-100 text-indigo-800 ring-indigo-200/60",
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

function PaymentStatusBadge({ status }: { status: string }) {
    const s = (status || "").toLowerCase().trim();

    if (s === "completed" || s === "paid" || s === "success") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Paid
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

    if (s === "failed" || s === "cancelled") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700 ring-1 ring-rose-600/20">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                Failed
            </span>
        );
    }

    if (s === "partial" || s === "partially_paid") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700 ring-1 ring-sky-600/20">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                Partial
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

export default function RecentPayments({ payments }: RecentPaymentsProps) {
    return (
        <div className="rounded-2xl border border-gray-200/90 bg-white shadow-xs transition-shadow duration-200 hover:shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-4 sm:p-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10">
                        <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                            Recent Payments
                        </h2>
                        <p className="text-xs text-gray-500 sm:text-sm">
                            Latest collection activity
                        </p>
                    </div>
                </div>

                {payments.length > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {payments.length} Recent
                    </span>
                )}
            </div>

            {/* Content */}
            {payments.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center sm:p-12">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 ring-1 ring-gray-200/70">
                        <Receipt className="h-6 w-6" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-gray-900">
                        No recent payments
                    </h3>
                    <p className="mt-1 text-xs text-gray-500 max-w-xs">
                        Transactions will automatically appear here once payments are recorded.
                    </p>
                </div>
            ) : (
                <>
                    {/* Mobile View: High-density, elegant cards (Hidden on sm+) */}
                    <div className="divide-y divide-gray-100 sm:hidden">
                        {payments.map((payment) => (
                            <div
                                key={payment.id}
                                className="flex items-center justify-between gap-3 p-4 transition-colors hover:bg-gray-50/80 active:bg-gray-100/70"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ring-1 ${getAvatarColor(
                                            payment.customerName
                                        )}`}
                                    >
                                        {getInitials(payment.customerName)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-gray-900">
                                            {payment.customerName}
                                        </p>
                                        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500">
                                            <Calendar className="h-3 w-3 shrink-0 text-gray-400" />
                                            <span>{payment.paymentDate || "Recently"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-1 shrink-0">
                                    <span className="text-sm font-bold text-gray-900">
                                        {formatCurrency(payment.amount)}
                                    </span>
                                    <PaymentStatusBadge status={payment.status} />
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
                                    <th className="px-5 py-3.5">Amount</th>
                                    <th className="px-5 py-3.5">Status</th>
                                    <th className="px-5 py-3.5">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {payments.map((payment) => (
                                    <tr
                                        key={payment.id}
                                        className="transition-colors hover:bg-gray-50/70"
                                    >
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ring-1 ${getAvatarColor(
                                                        payment.customerName
                                                    )}`}
                                                >
                                                    {getInitials(payment.customerName)}
                                                </div>
                                                <span className="font-medium text-gray-900">
                                                    {payment.customerName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 font-semibold text-gray-900">
                                            {formatCurrency(payment.amount)}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <PaymentStatusBadge status={payment.status} />
                                        </td>
                                        <td className="px-5 py-3.5 text-xs text-gray-500">
                                            {payment.paymentDate || "—"}
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