import { AlignLeft, ArrowLeft, Calendar, DollarSign, Pencil, Receipt } from "lucide-react";
import { Invoice } from "../types/invoice.types";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";

interface InvoiceDetailsProps {
    invoice: Invoice;
    onBack?: () => void;
    onEdit?: (invoice: Invoice) => void;
    onRecordPayment?: (invoice: Invoice) => void;
}

function formatCurrency(amount: number): string {
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

export function InvoiceDetails({
    invoice,
    onBack,
    onEdit,
    onRecordPayment,
}: InvoiceDetailsProps) {
    const isDue = Number(invoice.dueAmount || 0) > 0;

    return (
        <div className="space-y-3 sm:space-y-4">
            {/* Top Action Bar (if actions passed) */}
            {(onBack || onEdit || onRecordPayment) && (
                <div className="flex flex-wrap items-center justify-between gap-3">
                    {onBack ? (
                        <button
                            type="button"
                            onClick={onBack}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            <span>Back to Billing</span>
                        </button>
                    ) : (
                        <div />
                    )}

                    <div className="flex items-center gap-2">
                        {isDue && onRecordPayment && (
                            <button
                                type="button"
                                onClick={() => onRecordPayment(invoice)}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-neutral-800 transition-all cursor-pointer"
                            >
                                <DollarSign className="h-3.5 w-3.5" />
                                <span>Record Payment</span>
                            </button>
                        )}
                        {onEdit && (
                            <button
                                type="button"
                                onClick={() => onEdit(invoice)}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 shadow-2xs hover:bg-neutral-50 hover:text-neutral-900 transition-all cursor-pointer"
                            >
                                <Pencil className="h-3.5 w-3.5" />
                                <span>Edit</span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Single Unified Container */}
            <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-2xs">
                {/* Header Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 bg-neutral-50/50 px-4 py-3.5 sm:px-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-2xs">
                            <Receipt className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2.5">
                                <h2 className="text-base sm:text-lg font-mono font-bold text-neutral-900 leading-tight">
                                    {invoice.invoiceNumber}
                                </h2>
                                <InvoiceStatusBadge status={invoice.status} size="sm" />
                            </div>
                            <p className="mt-0.5 text-xs text-neutral-500 font-mono">
                                Customer: {invoice.customerId} {invoice.bookingId ? `• Booking: ${invoice.bookingId}` : ""}
                            </p>
                        </div>
                    </div>

                    {/* Financial Pill Summary */}
                    <div className="flex items-center gap-2 text-xs">
                        <div className="rounded-xl border border-neutral-100 bg-white px-3 py-1.5 shadow-2xs text-right">
                            <span className="block text-[10px] font-bold uppercase text-neutral-400">Total</span>
                            <span className="font-bold text-neutral-900">{formatCurrency(invoice.totalAmount)}</span>
                        </div>
                        <div className="rounded-xl border border-neutral-100 bg-white px-3 py-1.5 shadow-2xs text-right">
                            <span className="block text-[10px] font-bold uppercase text-neutral-400">Balance Due</span>
                            <span className={`font-bold ${isDue ? "text-amber-600" : "text-emerald-600"}`}>
                                {formatCurrency(invoice.dueAmount)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Compact Details Table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[620px] text-left text-xs sm:text-sm border-collapse">
                        <tbody>
                            {/* Section 1: Invoice Information */}
                            <tr className="border-b border-neutral-100 bg-neutral-50/70">
                                <th colSpan={4} className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                                        <span>Invoice Details</span>
                                    </div>
                                </th>
                            </tr>
                            <tr className="border-b border-neutral-100">
                                <td className="w-1/4 px-4 py-3 font-semibold text-neutral-500 bg-neutral-50/30">Issue Date</td>
                                <td className="w-1/4 px-4 py-3 font-medium text-neutral-800">{formatDate(invoice.issueDate)}</td>
                                <td className="w-1/4 px-4 py-3 font-semibold text-neutral-500 bg-neutral-50/30">Due Date</td>
                                <td className="w-1/4 px-4 py-3 font-medium text-neutral-800">{formatDate(invoice.dueDate)}</td>
                            </tr>
                            <tr className="border-b border-neutral-100">
                                <td className="w-1/4 px-4 py-3 font-semibold text-neutral-500 bg-neutral-50/30">Customer ID</td>
                                <td className="w-1/4 px-4 py-3 font-mono font-medium text-neutral-800">{invoice.customerId}</td>
                                <td className="w-1/4 px-4 py-3 font-semibold text-neutral-500 bg-neutral-50/30">Booking ID</td>
                                <td className="w-1/4 px-4 py-3 font-mono font-medium text-neutral-800">{invoice.bookingId || "—"}</td>
                            </tr>

                            {/* Section 2: Itemized Charges Breakdown */}
                            <tr className="border-b border-neutral-100 bg-neutral-50/70">
                                <th colSpan={4} className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                                    <div className="flex items-center gap-1.5">
                                        <DollarSign className="h-3.5 w-3.5 text-neutral-400" />
                                        <span>Charges & Balance Breakdown</span>
                                    </div>
                                </th>
                            </tr>
                            <tr className="border-b border-neutral-100">
                                <td className="w-1/4 px-4 py-3 font-semibold text-neutral-500 bg-neutral-50/30">Rent Amount</td>
                                <td className="w-1/4 px-4 py-3 font-medium text-neutral-800">{formatCurrency(invoice.rentAmount)}</td>
                                <td className="w-1/4 px-4 py-3 font-semibold text-neutral-500 bg-neutral-50/30">Meal Charges</td>
                                <td className="w-1/4 px-4 py-3 font-medium text-neutral-800">{formatCurrency(invoice.mealAmount)}</td>
                            </tr>
                            <tr className="border-b border-neutral-100">
                                <td className="w-1/4 px-4 py-3 font-semibold text-neutral-500 bg-neutral-50/30">Additional Charges</td>
                                <td className="w-1/4 px-4 py-3 font-medium text-neutral-800">{formatCurrency(invoice.additionalCharges)}</td>
                                <td className="w-1/4 px-4 py-3 font-semibold text-neutral-500 bg-neutral-50/30">Discount</td>
                                <td className="w-1/4 px-4 py-3 font-medium text-emerald-700">- {formatCurrency(invoice.discountAmount)}</td>
                            </tr>
                            <tr className="border-b border-neutral-100 bg-neutral-50/40 font-semibold">
                                <td className="w-1/4 px-4 py-3 text-neutral-700">Subtotal</td>
                                <td className="w-1/4 px-4 py-3 text-neutral-900">{formatCurrency(invoice.subtotal)}</td>
                                <td className="w-1/4 px-4 py-3 text-neutral-700">Total Invoiced</td>
                                <td className="w-1/4 px-4 py-3 font-bold text-neutral-900">{formatCurrency(invoice.totalAmount)}</td>
                            </tr>
                            <tr className="border-b border-neutral-100">
                                <td className="w-1/4 px-4 py-3 font-semibold text-neutral-500 bg-neutral-50/30">Amount Paid</td>
                                <td className="w-1/4 px-4 py-3 font-bold text-emerald-700">{formatCurrency(invoice.paidAmount)}</td>
                                <td className="w-1/4 px-4 py-3 font-semibold text-neutral-500 bg-neutral-50/30">Remaining Due</td>
                                <td className={`w-1/4 px-4 py-3 font-bold ${isDue ? "text-amber-600" : "text-emerald-700"}`}>
                                    {formatCurrency(invoice.dueAmount)}
                                </td>
                            </tr>

                            {/* Section 3: Notes (if any) */}
                            {invoice.notes && (
                                <>
                                    <tr className="border-b border-neutral-100 bg-neutral-50/70">
                                        <th colSpan={4} className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                                            <div className="flex items-center gap-1.5">
                                                <AlignLeft className="h-3.5 w-3.5 text-neutral-400" />
                                                <span>Notes</span>
                                            </div>
                                        </th>
                                    </tr>
                                    <tr>
                                        <td colSpan={4} className="px-4 py-3 text-xs sm:text-sm text-neutral-700 bg-white">
                                            {invoice.notes}
                                        </td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}