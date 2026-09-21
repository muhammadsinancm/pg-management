import { Calendar, Eye, FileText, Pencil, User } from "lucide-react";
import { Invoice } from "../types/invoice.types";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";

interface InvoiceCardProps {
    invoice: Invoice;
    onView?: (invoice: Invoice) => void;
    onEdit?: (invoice: Invoice) => void;
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

export function InvoiceCard({ invoice, onView, onEdit }: InvoiceCardProps) {
    const isDue = Number(invoice.dueAmount || 0) > 0;

    return (
        <div className="flex flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-3.5 sm:p-4 shadow-2xs transition-all hover:border-neutral-200 hover:shadow-xs min-w-0">
            {/* Header: Invoice Number & Status Badge */}
            <div className="flex items-center justify-between gap-2 border-b border-neutral-100 pb-3 min-w-0">
                <div className="min-w-0 flex-1">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        Invoice ID
                    </span>
                    <h3 className="font-mono text-sm sm:text-base font-bold text-neutral-900 truncate">
                        {invoice.invoiceNumber}
                    </h3>
                </div>
                <InvoiceStatusBadge status={invoice.status} size="sm" />
            </div>

            {/* Customer & Booking row */}
            <div className="py-3 space-y-2.5 min-w-0 border-b border-neutral-100">
                <div className="flex items-center justify-between gap-2 min-w-0">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                            <User className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
                                Customer
                            </p>
                            <p
                                className="truncate text-xs font-bold text-neutral-800"
                                title={invoice.customerId}
                            >
                                {invoice.customerId}
                            </p>
                        </div>
                    </div>

                    {invoice.bookingId && (
                        <div className="inline-flex items-center gap-1 rounded-lg border border-neutral-100 bg-neutral-50 px-2 py-0.5 text-[11px] font-semibold text-neutral-600 shrink-0 font-mono">
                            <FileText className="h-3 w-3 text-neutral-400" />
                            <span className="truncate max-w-[110px]">{invoice.bookingId}</span>
                        </div>
                    )}
                </div>

                {/* Dates & Financials Grid */}
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-neutral-50/70 p-2.5 text-xs">
                    {/* Issue Date */}
                    <div className="min-w-0">
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                            <Calendar className="h-3 w-3 shrink-0 text-neutral-400" />
                            <span>Issued</span>
                        </span>
                        <span className="mt-0.5 block text-xs font-bold text-neutral-800 truncate">
                            {formatDate(invoice.issueDate)}
                        </span>
                    </div>

                    {/* Due Date */}
                    <div className="min-w-0">
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                            <Calendar className="h-3 w-3 shrink-0 text-neutral-400" />
                            <span>Due Date</span>
                        </span>
                        <span className="mt-0.5 block text-xs font-bold text-neutral-800 truncate">
                            {formatDate(invoice.dueDate)}
                        </span>
                    </div>

                    {/* Total Amount */}
                    <div className="min-w-0">
                        <span className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                            Total
                        </span>
                        <span className="mt-0.5 block text-xs font-bold text-neutral-900 truncate">
                            {formatCurrency(invoice.totalAmount)}
                        </span>
                    </div>

                    {/* Due Amount */}
                    <div className="min-w-0">
                        <span className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                            Due
                        </span>
                        <span
                            className={`mt-0.5 block text-xs font-bold truncate ${
                                isDue ? "text-amber-600" : "text-emerald-600"
                            }`}
                        >
                            {formatCurrency(invoice.dueAmount)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center gap-2 pt-3">
                {onView && (
                    <button
                        type="button"
                        onClick={() => onView(invoice)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-neutral-800 transition-all cursor-pointer"
                    >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View Details</span>
                    </button>
                )}
                {onEdit && (
                    <button
                        type="button"
                        onClick={() => onEdit(invoice)}
                        className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white p-1.5 text-neutral-600 shadow-2xs hover:bg-neutral-50 hover:text-neutral-900 transition-all cursor-pointer"
                        title="Edit Invoice"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>
        </div>
    );
}

export function InvoiceCardSkeleton() {
    return (
        <div className="flex flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-3.5 sm:p-4 shadow-2xs animate-pulse min-w-0">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                <div className="space-y-1.5">
                    <div className="h-2.5 w-16 rounded bg-neutral-100" />
                    <div className="h-4 w-24 rounded bg-neutral-200" />
                </div>
                <div className="h-5 w-16 rounded-full bg-neutral-100" />
            </div>

            {/* Specs Skeleton */}
            <div className="py-3 space-y-2.5 border-b border-neutral-100">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                        <div className="h-7 w-7 rounded-lg bg-neutral-100" />
                        <div className="space-y-1 flex-1">
                            <div className="h-2.5 w-12 rounded bg-neutral-100" />
                            <div className="h-3 w-20 rounded bg-neutral-200" />
                        </div>
                    </div>
                    <div className="h-5 w-16 rounded bg-neutral-100" />
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-xl bg-neutral-50/70 p-2.5">
                    <div className="space-y-1">
                        <div className="h-2.5 w-12 rounded bg-neutral-100" />
                        <div className="h-3 w-16 rounded bg-neutral-200" />
                    </div>
                    <div className="space-y-1">
                        <div className="h-2.5 w-12 rounded bg-neutral-100" />
                        <div className="h-3 w-16 rounded bg-neutral-200" />
                    </div>
                    <div className="space-y-1">
                        <div className="h-2.5 w-12 rounded bg-neutral-100" />
                        <div className="h-3 w-16 rounded bg-neutral-200" />
                    </div>
                    <div className="space-y-1">
                        <div className="h-2.5 w-12 rounded bg-neutral-100" />
                        <div className="h-3 w-16 rounded bg-neutral-200" />
                    </div>
                </div>
            </div>

            {/* Footer Skeleton */}
            <div className="pt-3">
                <div className="h-8 w-full rounded-xl bg-neutral-100" />
            </div>
        </div>
    );
}