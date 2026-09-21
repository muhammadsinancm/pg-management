import { CreditCard, Eye, Pencil } from "lucide-react";
import { Payment } from "../types/payment.types";
import { PaymentStatusBadge } from "./PaymentStatusBadge";

interface PaymentTableProps {
    payments: Payment[];
    onView?: (payment: Payment) => void;
    onEdit?: (payment: Payment) => void;
    onAdd?: () => void;
}

function formatCurrency(amount?: number): string {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number(amount || 0));
}

function formatDate(dateString?: string): string {
    if (!dateString) return "—";
    try {
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return dateString;
        return d.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    } catch {
        return dateString;
    }
}

export function PaymentTable({ payments, onView, onEdit, onAdd }: PaymentTableProps) {
    if (payments.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-8 xl:p-12 text-center shadow-2xs">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
                    <CreditCard className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-neutral-900">No Payments Found</h3>
                <p className="mt-1 text-xs text-neutral-400 max-w-sm mx-auto">
                    No payment records match your current criteria.
                </p>
                {onAdd && (
                    <button
                        type="button"
                        onClick={onAdd}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-neutral-800 transition-all cursor-pointer"
                    >
                        + Record Payment
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-2xs">
            <div className="overflow-x-auto w-full min-w-0">
                <table className="w-full min-w-[800px] text-left text-xs sm:text-sm">
                    <thead className="border-b border-neutral-100 bg-neutral-50/70">
                        <tr>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Payment ID
                            </th>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Customer
                            </th>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Date
                            </th>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Amount
                            </th>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Method
                            </th>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Reference
                            </th>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                                Status
                            </th>
                            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-neutral-100">
                        {payments.map((payment) => (
                            <tr
                                key={payment.id}
                                className="transition-colors hover:bg-neutral-50/80 cursor-pointer"
                                onClick={() => onView?.(payment)}
                            >
                                {/* Payment Number */}
                                <td className="px-4 py-3.5 font-mono font-bold text-neutral-900">
                                    {payment.paymentNumber}
                                </td>

                                {/* Customer */}
                                <td className="px-4 py-3.5">
                                    <div className="font-semibold text-neutral-800">
                                        {payment.customerId}
                                    </div>
                                    {payment.invoiceId && (
                                        <div className="text-[10px] text-neutral-400 font-mono">
                                            {payment.invoiceId}
                                        </div>
                                    )}
                                </td>

                                {/* Date */}
                                <td className="px-4 py-3.5 text-neutral-600 whitespace-nowrap">
                                    {formatDate(payment.paymentDate)}
                                </td>

                                {/* Amount */}
                                <td className="px-4 py-3.5 font-bold text-neutral-900 whitespace-nowrap">
                                    {formatCurrency(payment.amount)}
                                </td>

                                {/* Method */}
                                <td className="px-4 py-3.5 capitalize text-neutral-700 whitespace-nowrap">
                                    {payment.paymentMethod.replace(/_/g, " ")}
                                </td>

                                {/* Reference */}
                                <td className="px-4 py-3.5 text-neutral-500 font-mono text-xs whitespace-nowrap">
                                    {payment.referenceNumber || "—"}
                                </td>

                                {/* Status */}
                                <td className="px-4 py-3.5 whitespace-nowrap">
                                    <PaymentStatusBadge status={payment.status} />
                                </td>

                                {/* Actions */}
                                <td
                                    className="px-4 py-3.5 text-right whitespace-nowrap"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="flex items-center justify-end gap-1.5">
                                        {onView && (
                                            <button
                                                type="button"
                                                onClick={() => onView(payment)}
                                                className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-semibold text-neutral-700 shadow-2xs hover:bg-neutral-50 hover:text-neutral-900 transition-colors cursor-pointer"
                                                title="View Payment"
                                            >
                                                <Eye className="h-3 w-3" />
                                                <span>View</span>
                                            </button>
                                        )}

                                        {onEdit && (
                                            <button
                                                type="button"
                                                onClick={() => onEdit(payment)}
                                                className="rounded-lg border border-neutral-200 bg-white p-1 text-neutral-500 shadow-2xs hover:bg-neutral-50 hover:text-neutral-900 transition-colors cursor-pointer"
                                                title="Edit Payment"
                                            >
                                                <Pencil className="h-3 w-3" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function PaymentTableSkeleton() {
    return (
        <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-2xs animate-pulse">
            <div className="overflow-x-auto w-full min-w-0">
                <table className="w-full min-w-[800px] text-left text-xs sm:text-sm">
                    <thead className="border-b border-neutral-100 bg-neutral-50/70">
                        <tr>
                            {Array.from({ length: 8 }).map((_, i) => (
                                <th key={i} className="px-4 py-3">
                                    <div className="h-3 w-16 rounded bg-neutral-200" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <tr key={i}>
                                <td className="px-4 py-3.5">
                                    <div className="h-3.5 w-20 rounded bg-neutral-200" />
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="h-3.5 w-24 rounded bg-neutral-100" />
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="h-3.5 w-16 rounded bg-neutral-100" />
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="h-3.5 w-16 rounded bg-neutral-200" />
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="h-3.5 w-14 rounded bg-neutral-100" />
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="h-3.5 w-16 rounded bg-neutral-100" />
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="h-5 w-14 rounded-full bg-neutral-100" />
                                </td>
                                <td className="px-4 py-3.5 text-right">
                                    <div className="ml-auto h-6 w-14 rounded-lg bg-neutral-100" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}