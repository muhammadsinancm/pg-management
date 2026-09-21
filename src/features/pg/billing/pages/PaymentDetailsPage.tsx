import { useNavigate, useParams } from "react-router";
import { usePayments } from "../hooks/usePayments";
import { useEffect, useState } from "react";
import { Payment } from "../types/payment.types";
import { PaymentStatusBadge } from "../components/PaymentStatusBadge";
import {
    AlertCircle,
    AlignLeft,
    ArrowLeft,
    Calendar,
    CreditCard,
    FileText,
    Loader2,
    Pencil,
    Receipt,
} from "lucide-react";

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

function formatPaymentMethod(method: Payment["paymentMethod"]): string {
    if (method === "upi") return "UPI";
    return method
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export default function PaymentDetailsPage() {
    const { paymentId } = useParams<{ paymentId: string }>();
    const navigate = useNavigate();

    const { getPaymentById } = usePayments();

    const [payment, setPayment] = useState<Payment | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!paymentId) {
            setError("Payment ID is missing from URL route.");
            setLoading(false);
            return;
        }

        const loadPayment = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getPaymentById(paymentId);
                if (!data) {
                    setError("Payment not found.");
                    return;
                }

                setPayment(data);
            } catch (err) {
                console.error("Failed to load payment", err);
                setError(err instanceof Error ? err.message : "Failed to load payment information.");
            } finally {
                setLoading(false);
            }
        };

        loadPayment();
    }, [paymentId, getPaymentById]);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-neutral-100 bg-white shadow-2xs m-4 sm:m-6">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
                    <span className="text-xs font-medium text-neutral-500">Loading payment details...</span>
                </div>
            </div>
        );
    }

    if (error || !payment) {
        return (
            <div className="m-4 sm:m-6 space-y-4">
                <div className="rounded-2xl border border-red-100 bg-red-50/50 p-6 text-center shadow-2xs">
                    <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
                    <h3 className="mt-2 text-sm font-bold text-red-900">Unable to load payment</h3>
                    <p className="mt-1 text-xs text-red-600">{error || "Payment not found."}</p>
                    <button
                        type="button"
                        onClick={() => navigate("/pg/billing")}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-neutral-800 transition-all cursor-pointer"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Back to Billing</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 p-4 sm:space-y-5 sm:p-6">
            {/* Top Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                    type="button"
                    onClick={() => navigate("/pg/billing")}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Billing</span>
                </button>

                <div className="flex items-center gap-2">
                    {payment.invoiceId && (
                        <button
                            type="button"
                            onClick={() =>
                                navigate(`/pg/billing/invoices/${payment.invoiceId}`)
                            }
                            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 shadow-2xs hover:bg-neutral-50 hover:text-neutral-900 transition-all cursor-pointer"
                        >
                            <Receipt className="h-3.5 w-3.5" />
                            <span>View Invoice</span>
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() =>
                            navigate(`/pg/billing/payments/${payment.id}/edit`)
                        }
                        className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 shadow-2xs hover:bg-neutral-50 hover:text-neutral-900 transition-all cursor-pointer"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                        <span>Edit</span>
                    </button>
                </div>
            </div>

            {/* Single Unified Container */}
            <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-2xs">
                {/* Header Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 bg-neutral-50/50 px-4 py-3.5 sm:px-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-2xs">
                            <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2.5">
                                <h2 className="text-base sm:text-lg font-mono font-bold text-neutral-900 leading-tight">
                                    {payment.paymentNumber}
                                </h2>
                                <PaymentStatusBadge status={payment.status} size="sm" />
                            </div>
                            <p className="mt-0.5 text-xs text-neutral-500 font-mono">
                                Customer: {payment.customerId} {payment.bookingId ? `• Booking: ${payment.bookingId}` : ""}
                            </p>
                        </div>
                    </div>

                    {/* Financial Summary Pill */}
                    <div className="flex items-center gap-2 text-xs">
                        <div className="rounded-xl border border-neutral-100 bg-white px-3.5 py-1.5 shadow-2xs text-right">
                            <span className="block text-[10px] font-bold uppercase text-neutral-400">Method</span>
                            <span className="font-semibold text-neutral-800">
                                {formatPaymentMethod(payment.paymentMethod)}
                            </span>
                        </div>
                        <div className="rounded-xl border border-neutral-100 bg-white px-3.5 py-1.5 shadow-2xs text-right">
                            <span className="block text-[10px] font-bold uppercase text-neutral-400">Amount Paid</span>
                            <span className="font-bold text-emerald-600">
                                {formatCurrency(payment.amount)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Details Table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] text-left text-xs sm:text-sm border-collapse">
                        <tbody>
                            {/* Section 1: Transaction Information */}
                            <tr className="border-b border-neutral-100 bg-neutral-50/70">
                                <th colSpan={4} className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                                        <span>Transaction Details</span>
                                    </div>
                                </th>
                            </tr>
                            <tr className="border-b border-neutral-100">
                                <td className="w-1/4 px-4 py-3 font-semibold text-neutral-500 bg-neutral-50/30">Payment Date</td>
                                <td className="w-1/4 px-4 py-3 font-medium text-neutral-800">{formatDate(payment.paymentDate)}</td>
                                <td className="w-1/4 px-4 py-3 font-semibold text-neutral-500 bg-neutral-50/30">Payment Method</td>
                                <td className="w-1/4 px-4 py-3 font-medium text-neutral-800">{formatPaymentMethod(payment.paymentMethod)}</td>
                            </tr>
                            <tr className="border-b border-neutral-100">
                                <td className="w-1/4 px-4 py-3 font-semibold text-neutral-500 bg-neutral-50/30">Payment Amount</td>
                                <td className="w-1/4 px-4 py-3 font-bold text-emerald-700">{formatCurrency(payment.amount)}</td>
                                <td className="w-1/4 px-4 py-3 font-semibold text-neutral-500 bg-neutral-50/30">Reference No.</td>
                                <td className="w-1/4 px-4 py-3 font-mono text-neutral-800">{payment.referenceNumber || "—"}</td>
                            </tr>

                            {/* Section 2: Associated Records */}
                            <tr className="border-b border-neutral-100 bg-neutral-50/70">
                                <th colSpan={4} className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                                    <div className="flex items-center gap-1.5">
                                        <FileText className="h-3.5 w-3.5 text-neutral-400" />
                                        <span>Associated Records</span>
                                    </div>
                                </th>
                            </tr>
                            <tr className="border-b border-neutral-100">
                                <td className="w-1/4 px-4 py-3 font-semibold text-neutral-500 bg-neutral-50/30">Customer ID</td>
                                <td className="w-1/4 px-4 py-3 font-mono font-medium text-neutral-800">{payment.customerId}</td>
                                <td className="w-1/4 px-4 py-3 font-semibold text-neutral-500 bg-neutral-50/30">Booking ID</td>
                                <td className="w-1/4 px-4 py-3 font-mono font-medium text-neutral-800">{payment.bookingId || "—"}</td>
                            </tr>
                            <tr className="border-b border-neutral-100">
                                <td className="w-1/4 px-4 py-3 font-semibold text-neutral-500 bg-neutral-50/30">Invoice ID</td>
                                <td className="w-1/4 px-4 py-3 font-mono font-medium text-neutral-800">
                                    {payment.invoiceId ? (
                                        <span
                                            onClick={() => navigate(`/pg/billing/invoices/${payment.invoiceId}`)}
                                            className="cursor-pointer text-blue-600 hover:underline"
                                        >
                                            {payment.invoiceId}
                                        </span>
                                    ) : (
                                        "—"
                                    )}
                                </td>
                                <td className="w-1/4 px-4 py-3 font-semibold text-neutral-500 bg-neutral-50/30">Branch ID</td>
                                <td className="w-1/4 px-4 py-3 font-mono font-medium text-neutral-800">{payment.branchId || "—"}</td>
                            </tr>

                            {/* Section 3: Notes (if any) */}
                            {payment.notes && (
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
                                            {payment.notes}
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