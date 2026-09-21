import { FormEvent, useEffect, useState } from "react";
import { AlignLeft, CreditCard, DollarSign, Receipt, Utensils } from "lucide-react";
import { CreateInvoiceInput, Invoice } from "../types/invoice.types";
import { CustomerMeal } from "../../meals/types/meal.types";

interface InvoiceFormProps {
    invoice?: Invoice
    organizationId: string
    branchId: string
    customerId: string
    bookingId: string
    rentAmount?: number;
    mealAmount?: number;
    customerMeals: CustomerMeal[];
    onSubmit: (data: CreateInvoiceInput) => Promise<void>
    onCancel?: () => void
}

export function InvoiceForm({ invoice, organizationId, branchId, customerId, bookingId, onSubmit, onCancel, rentAmount: bookingRentAmount = 0, mealAmount: bookingMealAmount = 0, customerMeals }: InvoiceFormProps) {
    const [invoiceNumber, setInvoiceNumber] = useState(invoice?.invoiceNumber ?? '')
    const [issueDate, setIssueDate] = useState(invoice?.issueDate ? invoice.issueDate.slice(0, 10) : new Date().toISOString().slice(0, 10))
    const [dueDate, setDueDate] = useState(invoice?.dueDate ? invoice.dueDate.slice(0, 10) : '')
    const [rentAmount, setRentAmount] = useState(invoice?.rentAmount?.toString() ?? '0')
    const [mealAmount, setMealAmount] = useState(invoice?.mealAmount?.toString() ?? '0')
    const [additionalCharges, setAdditionalCharges] = useState(invoice?.additionalCharges?.toString() ?? '0')
    const [discountAmount, setDiscountAmount] = useState(invoice?.discountAmount?.toString() ?? '0')
    const [paidAmount, setPaidAmount] = useState(invoice?.paidAmount?.toString() ?? '0')
    const [notes, setNotes] = useState(invoice?.notes ?? '')
    const [submitting, setSubmitting] = useState(false)

    const [status, setStatus] = useState<Invoice['status']>(invoice?.status ?? 'draft')

    useEffect(()=> {
        if (!invoice) {
        setRentAmount(bookingRentAmount.toString())
        setMealAmount(bookingMealAmount.toString())
       }
    }, [invoice, bookingRentAmount, bookingMealAmount])

    useEffect(() => {
       if (invoice) {
        setStatus(invoice.status)
       }
    }, [invoice])

    const subtotal = Number(rentAmount || 0) + Number(mealAmount || 0) + Number(additionalCharges || 0)

    const totalAmount = subtotal - Number(discountAmount || 0)
    const paid = Number(paidAmount || 0)
    const dueAmount = Math.max(totalAmount - paid, 0)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (paid > totalAmount) {
            alert('Paid amount can not be greater than total amount')
            return
        }

        try {
            setSubmitting(true)

            const data: CreateInvoiceInput = {
                organizationId,
                branchId,
                customerId,
                bookingId,
                invoiceNumber,
                issueDate,
                dueDate,
                rentAmount: Number(rentAmount || 0),
                mealAmount: Number(mealAmount || 0),
                additionalCharges: Number(additionalCharges || 0),
                discountAmount: Number(discountAmount || 0),
                subtotal,
                totalAmount,
                paidAmount: Number(paidAmount || 0),
                dueAmount,
                status,
                notes: notes || undefined
            }

            await onSubmit(data)

        } finally {
            setSubmitting(false)
        }
    }

     return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border border-neutral-100 bg-white p-5 sm:p-6 shadow-2xs"
        >
            {/* 1. Invoice Information */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                    <Receipt className="h-4 w-4 text-neutral-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                        Invoice Information
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Invoice Number */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Invoice Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={invoiceNumber}
                            onChange={(e) => setInvoiceNumber(e.target.value)}
                            placeholder="e.g. INV-0001"
                            required
                            disabled={submitting}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 font-mono placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as Invoice["status"])}
                            disabled={submitting}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-neutral-800 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs cursor-pointer"
                        >
                            <option value="draft">Draft</option>
                            <option value="issued">Issued</option>
                            <option value="partial">Partial</option>
                            <option value="paid">Paid</option>
                            <option value="overdue">Overdue</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    {/* Issue Date */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Issue Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={issueDate}
                            onChange={(e) => setIssueDate(e.target.value)}
                            required
                            disabled={submitting}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs cursor-pointer"
                        />
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Due Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            required
                            disabled={submitting}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* 2. Charges Breakdown */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                    <DollarSign className="h-4 w-4 text-neutral-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                        Charges Breakdown
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Rent */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Rent Amount (₹)
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={rentAmount}
                            readOnly
                            className="w-full cursor-not-allowed rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-xs sm:text-sm font-semibold text-neutral-700 outline-none shadow-2xs"
                        />
                        <p className="mt-1 text-[10px] text-neutral-400">
                            Pre-filled from booking rent.
                        </p>
                    </div>

                    {/* Meal */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Meal Amount (₹)
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={mealAmount}
                            readOnly
                            className="w-full cursor-not-allowed rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-xs sm:text-sm font-semibold text-neutral-700 outline-none shadow-2xs"
                        />
                        <p className="mt-1 text-[10px] text-neutral-400">
                            Calculated from served meals.
                        </p>
                    </div>

                    {/* Additional Charges */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Additional Charges (₹)
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={additionalCharges}
                            onChange={(e) => setAdditionalCharges(e.target.value)}
                            disabled={submitting}
                            placeholder="0"
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                        />
                    </div>

                    {/* Discount */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Discount (₹)
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={discountAmount}
                            onChange={(e) => setDiscountAmount(e.target.value)}
                            disabled={submitting}
                            placeholder="0"
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                        />
                    </div>
                </div>
            </div>

            {/* 3. Customer Meal Details (if present) */}
            {customerMeals.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                        <Utensils className="h-4 w-4 text-neutral-500" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                            Served Meals Included ({customerMeals.length})
                        </h3>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-2xs">
                        <table className="w-full text-xs sm:text-sm text-left">
                            <thead className="border-b border-neutral-100 bg-neutral-50/70 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                                <tr>
                                    <th className="px-3.5 py-2.5">Date</th>
                                    <th className="px-3.5 py-2.5">Meal Type</th>
                                    <th className="px-3.5 py-2.5 text-right">Amount</th>
                                    <th className="px-3.5 py-2.5 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {customerMeals.map((meal) => (
                                    <tr key={meal.id} className="hover:bg-neutral-50/60 transition-colors">
                                        <td className="px-3.5 py-2 text-neutral-700">{meal.mealDate}</td>
                                        <td className="px-3.5 py-2 capitalize font-medium text-neutral-800">{meal.mealType}</td>
                                        <td className="px-3.5 py-2 text-right font-semibold text-neutral-900">
                                            ₹{meal.amount.toFixed(2)}
                                        </td>
                                        <td className="px-3.5 py-2 text-center">
                                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200/60 capitalize">
                                                {meal.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="border-t border-neutral-100 bg-neutral-50/70 text-xs font-semibold">
                                <tr>
                                    <td colSpan={2} className="px-3.5 py-2 text-neutral-600">Total Meals Charge</td>
                                    <td className="px-3.5 py-2 text-right font-bold text-neutral-900">
                                        ₹{Number(mealAmount).toFixed(2)}
                                    </td>
                                    <td />
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}

            {/* 4. Payment & Financial Summary */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                    <CreditCard className="h-4 w-4 text-neutral-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                        Payment & Financial Summary
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                            Paid Amount (₹)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max={totalAmount}
                            value={paidAmount}
                            onChange={(e) => setPaidAmount(e.target.value)}
                            disabled={submitting}
                            placeholder="0"
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                        />
                        <p className="mt-1 text-[10px] text-neutral-400">
                            Amount already received for this invoice.
                        </p>
                    </div>

                    {/* Live Calculation Statement */}
                    <div className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-4 shadow-2xs space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between text-neutral-600">
                            <span>Base Rent:</span>
                            <span className="font-medium text-neutral-900">₹{Number(rentAmount || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-neutral-600">
                            <span>Meals Charge:</span>
                            <span className="font-medium text-neutral-900">₹{Number(mealAmount || 0).toFixed(2)}</span>
                        </div>
                        {Number(additionalCharges || 0) > 0 && (
                            <div className="flex justify-between text-neutral-600">
                                <span>Additional Charges:</span>
                                <span className="font-medium text-neutral-900">+₹{Number(additionalCharges).toFixed(2)}</span>
                            </div>
                        )}
                        {Number(discountAmount || 0) > 0 && (
                            <div className="flex justify-between text-emerald-700">
                                <span>Discount:</span>
                                <span className="font-semibold">-₹{Number(discountAmount).toFixed(2)}</span>
                            </div>
                        )}
                        <div className="border-t border-neutral-200/80 pt-2 flex justify-between font-bold text-neutral-900">
                            <span>Total Invoiced:</span>
                            <span>₹{totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-neutral-600">
                            <span>Paid Amount:</span>
                            <span className="font-medium text-neutral-800">₹{paid.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-neutral-200/80 pt-2 flex justify-between font-bold">
                            <span className="text-neutral-900">Balance Due:</span>
                            <span className={dueAmount > 0 ? "text-amber-600" : "text-emerald-600"}>
                                ₹{dueAmount.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. Notes */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                    <AlignLeft className="h-4 w-4 text-neutral-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                        Notes & Comments
                    </h3>
                </div>

                <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                        Invoice Notes (Optional)
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        disabled={submitting}
                        rows={3}
                        placeholder="Add any specific notes, bank transfer details, or billing terms..."
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                    />
                </div>
            </div>

            {/* Form Actions */}
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
                    disabled={submitting}
                    className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-neutral-800 transition-all cursor-pointer disabled:opacity-50"
                >
                    {submitting
                        ? "Saving..."
                        : invoice
                            ? "Update Invoice"
                            : "Create Invoice"}
                </button>
            </div>
        </form>
    );
}