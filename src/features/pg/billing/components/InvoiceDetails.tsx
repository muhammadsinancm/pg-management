import { Invoice } from "../types/invoice.types";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";

interface InvoiceDetailsProps {
    invoice: Invoice
}

export function InvoiceDetails({ invoice }: InvoiceDetailsProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(Number(amount || 0))
    }

    const formatDate = (date: string) => {
        if (!date) return '-'
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    }

    return (
        <div className="space-y-6 rounded-lg border bg-white p-6">

            {/* Header */}
            <div className="flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-start">
                <div>
                    <p className="text-sm text-gray-500">
                        Invoice Number
                    </p>

                    <h2 className="mt-1 text-2xl font-semibold">
                        {invoice.invoiceNumber}
                    </h2>
                </div>

                <InvoiceStatusBadge
                    status={invoice.status}
                />
            </div>

            {/* Invoice Information */}
            <div>
                <h3 className="mb-4 text-lg font-semibold">
                    Invoice Information
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <p className="text-sm text-gray-500">
                            Issue Date
                        </p>

                        <p className="mt-1 font-medium">
                            {formatDate(invoice.issueDate)}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Due Date
                        </p>

                        <p className="mt-1 font-medium">
                            {formatDate(invoice.dueDate)}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Customer ID
                        </p>

                        <p className="mt-1 font-medium">
                            {invoice.customerId}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Booking ID
                        </p>

                        <p className="mt-1 font-medium">
                            {invoice.bookingId}
                        </p>
                    </div>
                </div>
            </div>

            {/* Charges */}
            <div>
                <h3 className="mb-4 text-lg font-semibold">
                    Charges
                </h3>

                <div className="space-y-3">
                    <div className="flex justify-between gap-4">
                        <span className="text-gray-600">
                            Rent
                        </span>

                        <span className="font-medium">
                            {formatCurrency(invoice.rentAmount)}
                        </span>
                    </div>

                    <div className="flex justify-between gap-4">
                        <span className="text-gray-600">
                            Meals
                        </span>

                        <span className="font-medium">
                            {formatCurrency(invoice.mealAmount)}
                        </span>
                    </div>

                    <div className="flex justify-between gap-4">
                        <span className="text-gray-600">
                            Additional Charges
                        </span>

                        <span className="font-medium">
                            {formatCurrency(
                                invoice.additionalCharges
                            )}
                        </span>
                    </div>

                    <div className="flex justify-between gap-4">
                        <span className="text-gray-600">
                            Discount
                        </span>

                        <span className="font-medium">
                            - {formatCurrency(
                                invoice.discountAmount
                            )}
                        </span>
                    </div>

                    <div className="flex justify-between border-t pt-3">
                        <span className="font-semibold">
                            Subtotal
                        </span>

                        <span className="font-semibold">
                            {formatCurrency(invoice.subtotal)}
                        </span>
                    </div>

                    <div className="flex justify-between border-t pt-3 text-lg">
                        <span className="font-semibold">
                            Total
                        </span>

                        <span className="font-bold">
                            {formatCurrency(invoice.totalAmount)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Payment Summary */}
            <div>
                <h3 className="mb-4 text-lg font-semibold">
                    Payment Summary
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-md border p-4">
                        <p className="text-sm text-gray-500">
                            Paid Amount
                        </p>

                        <p className="mt-1 text-xl font-semibold">
                            {formatCurrency(invoice.paidAmount)}
                        </p>
                    </div>

                    <div className="rounded-md border p-4">
                        <p className="text-sm text-gray-500">
                            Due Amount
                        </p>

                        <p className="mt-1 text-xl font-semibold">
                            {formatCurrency(invoice.dueAmount)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
                <div>
                    <h3 className="mb-2 text-lg font-semibold">
                        Notes
                    </h3>

                    <p className="rounded-md bg-gray-50 p-3 text-sm text-gray-700">
                        {invoice.notes}
                    </p>
                </div>
            )}

        </div>
    )

}