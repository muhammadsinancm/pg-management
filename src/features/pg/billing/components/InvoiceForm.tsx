import { FormEvent, useEffect, useState } from "react";
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
            className="space-y-6 rounded-lg border bg-white p-6"
        >

            {/* Invoice Information */}
            <div>
                <h2 className="mb-4 text-lg font-semibold">
                    Invoice Information
                </h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    {/* Invoice Number */}
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Invoice Number
                        </label>

                        <input
                            type="text"
                            value={invoiceNumber}
                            onChange={(e) =>
                                setInvoiceNumber(e.target.value)
                            }
                            placeholder="INV-0001"
                            required
                            className="w-full rounded-md border px-3 py-2"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Status
                        </label>

                        <select
                            value={status}
                            onChange={(e) =>
                                setStatus(
                                    e.target.value as Invoice["status"]
                                )
                            }
                            className="w-full rounded-md border px-3 py-2"
                        >
                            <option value="draft">
                                Draft
                            </option>

                            <option value="issued">
                                Issued
                            </option>

                            <option value="partial">
                                Partial
                            </option>

                            <option value="paid">
                                Paid
                            </option>

                            <option value="overdue">
                                Overdue
                            </option>

                            <option value="cancelled">
                                Cancelled
                            </option>
                        </select>
                    </div>

                    {/* Issue Date */}
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Issue Date
                        </label>

                        <input
                            type="date"
                            value={issueDate}
                            onChange={(e) =>
                                setIssueDate(e.target.value)
                            }
                            required
                            className="w-full rounded-md border px-3 py-2"
                        />
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Due Date
                        </label>

                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) =>
                                setDueDate(e.target.value)
                            }
                            required
                            className="w-full rounded-md border px-3 py-2"
                        />
                    </div>
                </div>
            </div>


            {/* Charges */}
            <div>
                <h2 className="mb-4 text-lg font-semibold">
                    Charges
                </h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    {/* Rent */}
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Rent Amount
                        </label>

                        <input
                            type="number"
                            min="0"
                            value={rentAmount}
                            readOnly
                            className="w-full cursor-not-allowed rounded-md border bg-gray-100 px-3 py-2"
                        />

                        <p className="mt-1 text-xs text-gray-500">
                            Taken from the booking.
                        </p>
                    </div>


                    {/* Meal */}
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Meal Amount
                        </label>

                        <input
                            type="number"
                            min="0"
                            value={mealAmount}
                            readOnly
                            className="w-full cursor-not-allowed rounded-md border bg-gray-100 px-3 py-2"
                        />

                        <p className="mt-1 text-xs text-gray-500">
                            Calculated from served customer meals.
                        </p>
                    </div>


                    {/* Additional Charges */}
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Additional Charges
                        </label>

                        <input
                            type="number"
                            min="0"
                            value={additionalCharges}
                            onChange={(e) =>
                                setAdditionalCharges(e.target.value)
                            }
                            className="w-full rounded-md border px-3 py-2"
                        />
                    </div>


                    {/* Discount */}
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Discount
                        </label>

                        <input
                            type="number"
                            min="0"
                            value={discountAmount}
                            onChange={(e) =>
                                setDiscountAmount(e.target.value)
                            }
                            className="w-full rounded-md border px-3 py-2"
                        />
                    </div>
                </div>
            </div>


            {/* Customer Meal Details */}
            {customerMeals.length > 0 && (
                <div>
                    <h2 className="mb-4 text-lg font-semibold">
                        Meal Details
                    </h2>

                    <div className="overflow-hidden rounded-lg border">
                        <table className="w-full text-sm">

                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left">
                                        Date
                                    </th>

                                    <th className="px-4 py-3 text-left">
                                        Meal
                                    </th>

                                    <th className="px-4 py-3 text-right">
                                        Amount
                                    </th>

                                    <th className="px-4 py-3 text-center">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {customerMeals.map((meal) => (
                                    <tr
                                        key={meal.id}
                                        className="border-t"
                                    >
                                        <td className="px-4 py-3">
                                            {meal.mealDate}
                                        </td>

                                        <td className="px-4 py-3 capitalize">
                                            {meal.mealType}
                                        </td>

                                        <td className="px-4 py-3 text-right">
                                            ₹{meal.amount.toFixed(2)}
                                        </td>

                                        <td className="px-4 py-3 text-center">
                                            <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                                                {meal.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                            <tfoot className="bg-gray-50">
                                <tr>
                                    <td
                                        colSpan={2}
                                        className="px-4 py-3 font-semibold"
                                    >
                                        Total Meals
                                    </td>

                                    <td className="px-4 py-3 text-right font-semibold">
                                        ₹{Number(mealAmount).toFixed(2)}
                                    </td>

                                    <td />
                                </tr>
                            </tfoot>

                        </table>
                    </div>
                </div>
            )}


            {/* Payment */}
            <div>
                <h2 className="mb-4 text-lg font-semibold">
                    Payment
                </h2>

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Paid Amount
                    </label>

                    <input
                        type="number"
                        min="0"
                        max={totalAmount}
                        value={paidAmount}
                        onChange={(e) =>
                            setPaidAmount(e.target.value)
                        }
                        className="w-full rounded-md border px-3 py-2"
                    />
                </div>
            </div>


            {/* Summary */}
            <div className="rounded-md bg-gray-50 p-4">
                <div className="space-y-2">

                    <div className="flex justify-between">
                        <span>
                            Rent
                        </span>

                        <span>
                            ₹{Number(rentAmount || 0).toFixed(2)}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span>
                            Meals
                        </span>

                        <span>
                            ₹{Number(mealAmount || 0).toFixed(2)}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span>
                            Additional Charges
                        </span>

                        <span>
                            ₹{Number(
                                additionalCharges || 0
                            ).toFixed(2)}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span>
                            Discount
                        </span>

                        <span>
                            -₹{Number(
                                discountAmount || 0
                            ).toFixed(2)}
                        </span>
                    </div>

                    <div className="border-t pt-2" />

                    <div className="flex justify-between">
                        <span>
                            Subtotal
                        </span>

                        <span>
                            ₹{subtotal.toFixed(2)}
                        </span>
                    </div>

                    <div className="flex justify-between text-lg font-semibold">
                        <span>
                            Total
                        </span>

                        <span>
                            ₹{totalAmount.toFixed(2)}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span>
                            Paid
                        </span>

                        <span>
                            ₹{paid.toFixed(2)}
                        </span>
                    </div>

                    <div className="flex justify-between text-lg font-semibold">
                        <span>
                            Due
                        </span>

                        <span>
                            ₹{dueAmount.toFixed(2)}
                        </span>
                    </div>

                </div>
            </div>


            {/* Notes */}
            <div>
                <label className="mb-1 block text-sm font-medium">
                    Notes
                </label>

                <textarea
                    value={notes}
                    onChange={(e) =>
                        setNotes(e.target.value)
                    }
                    rows={3}
                    placeholder="Invoice notes..."
                    className="w-full rounded-md border px-3 py-2"
                />
            </div>


            {/* Actions */}
            <div className="flex justify-end gap-3">

                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={submitting}
                        className="rounded-md border px-4 py-2"
                    >
                        Cancel
                    </button>
                )}

                <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
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