import { FormEvent, useState } from "react";
import { AlignLeft, CreditCard, Receipt } from "lucide-react";
import { CreatePaymentInput, Payment, PaymentMethod } from "../types/payment.types";

interface PaymentFormProps {
    payment?: Payment;
    organizationId: string;
    branchId: string;
    customerId: string;
    bookingId: string;
    invoiceId?: string;
    totalAmount: number;
    paidAmount: number;
    dueAmount: number;
    onSubmit: (data: CreatePaymentInput) => Promise<void>;
    onCancel?: () => void;
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number(amount || 0));
}

export function PaymentForm({
    payment,
    organizationId,
    branchId,
    customerId,
    bookingId,
    invoiceId,
    totalAmount,
    paidAmount,
    dueAmount,
    onSubmit,
    onCancel,
}: PaymentFormProps) {
    const [paymentNumber, setPaymentNumber] = useState(payment?.paymentNumber ?? "");
    const [amount, setAmount] = useState(payment?.amount?.toString() ?? "");
    const [paymentDate, setPaymentDate] = useState(
        payment?.paymentDate ? payment.paymentDate.slice(0, 10) : new Date().toISOString().slice(0, 10)
    );
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(payment?.paymentMethod ?? "cash");
    const [referenceNumber, setReferenceNumber] = useState(payment?.referenceNumber ?? "");
    const [notes, setNotes] = useState(payment?.notes ?? "");
    const [status, setStatus] = useState<Payment["status"]>(payment?.status ?? "completed");
    const [submitting, setSubmitting] = useState(false);

    const paymentAmount = Number(amount || 0);
    const remainingDue = Math.max(dueAmount - paymentAmount, 0);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (paymentAmount <= 0) {
            alert("Payment amount must be greater than 0");
            return;
        }

        if (paymentAmount > dueAmount) {
            alert(`Payment cannot exceed due amount of ₹${dueAmount.toLocaleString("en-IN")}`);
            return;
        }

        try {
            setSubmitting(true);

            const data: CreatePaymentInput = {
                organizationId,
                branchId,
                customerId,
                bookingId,
                invoiceId,
                paymentNumber,
                amount: paymentAmount,
                paymentDate,
                paymentMethod,
                status,
                referenceNumber: referenceNumber || undefined,
                notes: notes || undefined,
            };

            await onSubmit(data);
        } catch (error) {
            console.error("Payment submission failed", error);
            alert(error instanceof Error ? error.message : "Failed to create payment");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border border-neutral-100 bg-white p-5 sm:p-6 shadow-2xs"
        >
            {/* Invoice Summary Strip */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                    <Receipt className="h-4 w-4 text-neutral-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                        Invoice Balance Summary
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-3.5 shadow-2xs">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                            Total Invoiced
                        </span>
                        <p className="mt-1 text-base sm:text-lg font-bold text-neutral-900">
                            {formatCurrency(totalAmount)}
                        </p>
                    </div>

                    <div className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-3.5 shadow-2xs">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                            Already Paid
                        </span>
                        <p className="mt-1 text-base sm:text-lg font-bold text-emerald-700">
                            {formatCurrency(paidAmount)}
                        </p>
                    </div>

                    <div className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-3.5 shadow-2xs">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                            Outstanding Balance
                        </span>
                        <p className="mt-1 text-base sm:text-lg font-bold text-amber-700">
                            {formatCurrency(dueAmount)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                    <CreditCard className="h-4 w-4 text-neutral-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                        Transaction Details
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Payment Number */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Payment Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={paymentNumber}
                            onChange={(e) => setPaymentNumber(e.target.value)}
                            placeholder="e.g. PAY-001"
                            required
                            disabled={submitting}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 font-mono placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                        />
                    </div>

                    {/* Payment Amount */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Payment Amount (₹) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            min="0.01"
                            max={dueAmount}
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder={`Max ₹${dueAmount.toLocaleString("en-IN")}`}
                            required
                            disabled={submitting}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                        />
                    </div>

                    {/* Payment Date */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Payment Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={paymentDate}
                            onChange={(e) => setPaymentDate(e.target.value)}
                            required
                            disabled={submitting}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs cursor-pointer"
                        />
                    </div>

                    {/* Payment Method */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Payment Method
                        </label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                            disabled={submitting}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-neutral-800 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs cursor-pointer"
                        >
                            <option value="cash">Cash</option>
                            <option value="upi">UPI</option>
                            <option value="card">Card</option>
                            <option value="bank_transfer">Bank Transfer</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Reference Number */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Reference Number (Optional)
                        </label>
                        <input
                            type="text"
                            value={referenceNumber}
                            onChange={(e) => setReferenceNumber(e.target.value)}
                            placeholder="UPI / UTR / Cheque #"
                            disabled={submitting}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 font-mono placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Payment Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as Payment["status"])}
                            disabled={submitting}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-neutral-800 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs cursor-pointer"
                        >
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Payment Summary Preview */}
            <div className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-4 shadow-2xs space-y-2 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-neutral-600">
                    <span>Payment Recorded Now:</span>
                    <span className="font-bold text-neutral-900">{formatCurrency(paymentAmount)}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-600 border-t border-neutral-200/80 pt-2">
                    <span>Remaining Balance After Payment:</span>
                    <span className={`font-bold ${remainingDue > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                        {formatCurrency(remainingDue)}
                    </span>
                </div>
            </div>

            {/* Notes */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                    <AlignLeft className="h-4 w-4 text-neutral-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                        Notes & Remarks
                    </h3>
                </div>

                <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                        Payment Notes (Optional)
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        disabled={submitting}
                        rows={3}
                        placeholder="Add any transaction remarks or payment notes..."
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={submitting}
                        className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 shadow-2xs hover:bg-neutral-50 hover:text-neutral-900 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        Cancel
                    </button>
                )}

                <button
                    type="submit"
                    disabled={submitting || dueAmount <= 0}
                    className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-neutral-800 transition-all cursor-pointer disabled:opacity-50"
                >
                    {submitting
                        ? "Saving..."
                        : payment
                        ? "Update Payment"
                        : "Record Payment"}
                </button>
            </div>
        </form>
    );
}