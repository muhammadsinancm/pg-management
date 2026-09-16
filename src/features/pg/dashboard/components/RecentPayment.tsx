import { Calendar, CreditCard, Receipt } from "lucide-react";
import type { RecentPayment } from "./dashboard.types";

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

function PaymentStatusBadge({ status }: { status: string }) {
    const s = (status || "").toLowerCase().trim();

    if (s === "completed" || s === "paid" || s === "success") {
        return (
            <span className="inline-flex h-6 items-center justify-center whitespace-nowrap rounded-full bg-black px-2.5 text-[11px] font-semibold leading-tight text-white">
                Paid
            </span>
        );
    }

    if (s === "pending") {
        return (
            <span className="inline-flex h-6 items-center justify-center whitespace-nowrap rounded-full bg-neutral-100 px-2.5 text-[11px] font-semibold leading-tight text-neutral-700">
                Pending
            </span>
        );
    }

    if (s === "partial" || s === "partially_paid") {
        return (
            <span className="inline-flex h-6 items-center justify-center whitespace-nowrap rounded-full bg-neutral-100 px-2.5 text-[11px] font-semibold leading-tight text-neutral-700">
                Partial
            </span>
        );
    }

    if (s === "failed" || s === "cancelled") {
        return (
            <span className="inline-flex h-6 items-center justify-center whitespace-nowrap rounded-full bg-neutral-100 px-2.5 text-[11px] font-semibold leading-tight text-neutral-700">
                Failed
            </span>
        );
    }

    return (
        <span className="inline-flex h-6 items-center justify-center whitespace-nowrap rounded-full bg-neutral-100 px-2.5 text-[11px] font-semibold capitalize leading-tight text-neutral-700">
            {status}
        </span>
    );
}

export default function RecentPayment({ payments }: RecentPaymentsProps) {
    return (
        <div className="w-full overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-2xs">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-3.5 py-3 sm:px-4 sm:py-3.5">
                <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800 sm:h-9 sm:w-9">
                        <CreditCard className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                        <h2 className="truncate text-xs sm:text-sm font-bold text-neutral-900">
                            Last Transactions
                        </h2>
                        <p className="truncate text-[10px] sm:text-[11px] text-neutral-400">
                            Latest collection activity
                        </p>
                    </div>
                </div>

                {payments.length > 0 && (
                    <button
                        type="button"
                        className="shrink-0 text-xs font-semibold text-neutral-800 hover:text-black hover:underline"
                    >
                        See All
                    </button>
                )}
            </div>

            {/* Table or Empty State */}
            {payments.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
                    <div className="rounded-xl bg-neutral-100 p-2.5 text-neutral-400">
                        <Receipt className="h-5 w-5" />
                    </div>
                    <h3 className="mt-2.5 text-xs sm:text-sm font-semibold text-neutral-800">
                        No recent payments
                    </h3>
                    <p className="mt-1 max-w-xs text-[10px] sm:text-[11px] text-neutral-400">
                        Transactions will appear here once payments are recorded.
                    </p>
                </div>
            ) : (
                <div className="w-full overflow-hidden">
                    <table className="w-full text-left text-xs sm:text-sm">
                        <thead>
                            <tr className="border-b border-neutral-100 bg-neutral-50/50 text-[11px] font-semibold text-neutral-500">
                                <th className="py-2.5 pl-3.5 pr-2 font-semibold sm:pl-4 sm:pr-3 sm:py-2">Customer</th>
                                <th className="px-2 py-2.5 font-semibold sm:px-2.5 sm:py-2">Amount</th>
                                <th className="px-2 py-2.5 font-semibold sm:px-2.5 sm:py-2 text-right sm:text-left">Status</th>
                                <th className="hidden py-2 pl-2 pr-3.5 font-semibold sm:table-cell sm:pl-3 sm:pr-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {payments.map((payment) => (
                                <tr
                                    key={payment.id}
                                    className="transition-colors hover:bg-neutral-50/50"
                                >
                                    <td className="py-2.5 pl-3.5 pr-2 sm:pl-4 sm:pr-3 sm:py-2.5">
                                        <div className="flex min-w-0 items-center gap-2">
                                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-[10px] font-bold text-neutral-800">
                                                {getInitials(payment.customerName)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-xs sm:text-sm font-semibold text-neutral-900 leading-tight">
                                                    {payment.customerName}
                                                </p>
                                                {payment.paymentDate && (
                                                    <p className="mt-0.5 truncate text-[10px] text-neutral-400 sm:hidden">
                                                        {payment.paymentDate}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-2 py-2.5 sm:px-2.5 sm:py-2.5 text-xs sm:text-sm font-bold text-neutral-900 whitespace-nowrap">
                                        {formatCurrency(payment.amount)}
                                    </td>
                                    <td className="px-2 py-2.5 sm:px-2.5 sm:py-2.5 text-right sm:text-left">
                                        <PaymentStatusBadge status={payment.status} />
                                    </td>
                                    <td className="hidden py-2 pl-2 pr-3.5 sm:table-cell sm:pl-3 sm:pr-4 sm:py-2.5">
                                        <div className="flex items-center gap-1.5 whitespace-nowrap text-[11px] sm:text-xs text-neutral-400">
                                            <Calendar className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
                                            <span>{payment.paymentDate || "—"}</span>
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