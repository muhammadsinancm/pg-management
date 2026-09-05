import { useNavigate } from "react-router";
import { useMemo, useState } from "react";
import { usePayments } from "../hooks/usePayments";
import { PaymentTable } from "../components/PaymentTable";
import { useInvoices } from "../hooks/useInvoices";
import { Invoice } from "../types/invoice.types";

export function BillingPage() {
    const navigate = useNavigate()

    const { invoices, loading: invoiceLoading, error: invoiceError } = useInvoices()
    const { payments, loading: paymentLoading, error: paymentError } = usePayments()

    // const [billingCycle, setBillingCycle] = useState<BillingCycle | 'all'>('all')
    const [status, setStatus] = useState<Invoice['status'] | 'all'>('all')
    const [search, setSearch] = useState('')
    const [activeTab, setActiveTab] = useState<'billing' | 'payments'>('billing')

    const filteredInvoices = useMemo(() => {
        const searchValue = search.trim().toLowerCase()

        return invoices.filter((invoice) => {
            const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchValue) ||
                invoice.customerId.toLowerCase().includes(searchValue) ||
                invoice.billingId?.toLowerCase().includes(searchValue)

            const matchesStatus = status === 'all' || invoice.status === status

            return (matchesSearch && matchesStatus)

        })
    }, [invoices, search, status])

    const totalInvoices = invoices.length
    const totalAmount = invoices.reduce((sum, invoice) => sum + Number(invoice.totalAmount || 0), 0)
    const totalPaid = invoices.reduce((sum, invoice) => sum + Number(invoice.paidAmount || 0), 0)
    const totalDue = invoices.reduce((sum, invoice) => sum + Number(invoice.dueAmount || 0), 0)
    const paidInvoices = invoices.filter((invoice) => invoice.status === 'paid').length
    const partialInvoices = invoices.filter((invoice) => invoice.status == 'partial').length
    const overdueInvoices = invoices.filter((invoice) => invoice.status === 'overdue').length
    const loading = invoiceLoading || paymentLoading
    const error = invoiceError || paymentError

    const handleReset = () => {
        setStatus('all')
        setSearch('')
    }

    return (
        <div className="space-y-6 p-6">

            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>
                    <h1 className="text-2xl font-bold">
                        Billing
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage invoices and payments.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/pg/billing/invoices/create"
                        )
                    }
                    className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
                >
                    Create Invoice
                </button>

            </div>

            {/* Error */}
            {error && (
                <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <div className="rounded-lg border bg-white p-5">
                    <p className="text-sm text-gray-500">
                        Total Invoices
                    </p>

                    <p className="mt-2 text-2xl font-semibold">
                        {totalInvoices}
                    </p>
                </div>

                <div className="rounded-lg border bg-white p-5">
                    <p className="text-sm text-gray-500">
                        Total Amount
                    </p>

                    <p className="mt-2 text-2xl font-semibold">
                        ₹{totalAmount.toFixed(2)}
                    </p>
                </div>

                <div className="rounded-lg border bg-white p-5">
                    <p className="text-sm text-gray-500">
                        Total Paid
                    </p>

                    <p className="mt-2 text-2xl font-semibold">
                        ₹{totalPaid.toFixed(2)}
                    </p>
                </div>

                <div className="rounded-lg border bg-white p-5">
                    <p className="text-sm text-gray-500">
                        Total Due
                    </p>

                    <p className="mt-2 text-2xl font-semibold">
                        ₹{totalDue.toFixed(2)}
                    </p>
                </div>

            </div>

            {/* Status statistics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                <div className="rounded-lg border bg-white p-5">
                    <p className="text-sm text-gray-500">
                        Paid Invoices
                    </p>

                    <p className="mt-2 text-2xl font-semibold">
                        {paidInvoices}
                    </p>
                </div>

                <div className="rounded-lg border bg-white p-5">
                    <p className="text-sm text-gray-500">
                        Partial Invoices
                    </p>

                    <p className="mt-2 text-2xl font-semibold">
                        {partialInvoices}
                    </p>
                </div>

                <div className="rounded-lg border bg-white p-5">
                    <p className="text-sm text-gray-500">
                        Overdue Invoices
                    </p>

                    <p className="mt-2 text-2xl font-semibold">
                        {overdueInvoices}
                    </p>
                </div>

            </div>

            {/* Filters */}
            <div className="rounded-lg border bg-white p-4">

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Search
                        </label>

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search invoice, customer or booking..."
                            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-black"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Status
                        </label>

                        <select
                            value={status}
                            onChange={(event) =>
                                setStatus(
                                    event.target.value as Invoice['status'] | 'all'
                                )
                            }
                            className="w-full rounded-md border px-3 py-2 text-sm"
                        >
                            <option value="all">
                                All Status
                            </option>

                            <option value="draft">
                                Draft
                            </option>

                            <option value="unpaid">
                                Unpaid
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
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="w-full rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                        >
                            Reset Filters
                        </button>
                    </div>

                </div>

            </div>

            {/* Tabs */}
            <div className="border-b">
                <div className="flex gap-6">

                    <button
                        type="button"
                        onClick={() =>
                            setActiveTab("billing")
                        }
                        className={`border-b-2 px-1 pb-3 text-sm font-medium ${activeTab === "billing"
                                ? "border-black text-black"
                                : "border-transparent text-gray-500"
                            }`}
                    >
                        Invoices
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setActiveTab("payments")
                        }
                        className={`border-b-2 px-1 pb-3 text-sm font-medium ${activeTab === "payments"
                                ? "border-black text-black"
                                : "border-transparent text-gray-500"
                            }`}
                    >
                        Payments
                    </button>

                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="rounded-lg border bg-white p-8 text-center">
                    <p className="text-sm text-gray-500">
                        Loading billing data...
                    </p>
                </div>
            )}

            {/* Invoices */}
            {!loading &&
                activeTab === "billing" && (
                    <div className="space-y-4">

                        <div className="flex items-center justify-between">

                            <h2 className="text-lg font-semibold">
                                Invoices
                            </h2>

                            <span className="text-sm text-gray-500">
                                {filteredInvoices.length} records
                            </span>

                        </div>

                        {filteredInvoices.length === 0 ? (
                            <div className="rounded-lg border bg-white p-8 text-center">
                                <p className="text-sm text-gray-500">
                                    No invoices found.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-lg border bg-white">

                                <table className="w-full min-w-[900px] text-left text-sm">

                                    <thead className="border-b bg-gray-50">
                                        <tr>

                                            <th className="px-4 py-3">
                                                Invoice
                                            </th>

                                            <th className="px-4 py-3">
                                                Customer
                                            </th>

                                            <th className="px-4 py-3">
                                                Issue Date
                                            </th>

                                            <th className="px-4 py-3">
                                                Total
                                            </th>

                                            <th className="px-4 py-3">
                                                Paid
                                            </th>

                                            <th className="px-4 py-3">
                                                Due
                                            </th>

                                            <th className="px-4 py-3">
                                                Status
                                            </th>

                                        </tr>
                                    </thead>

                                    <tbody className="divide-y">

                                        {filteredInvoices.map(
                                            (invoice) => (
                                                <tr
                                                    key={invoice.id}
                                                    className="cursor-pointer hover:bg-gray-50"
                                                    onClick={() =>
                                                        navigate(
                                                            `/pg/billing/invoices/${invoice.id}`
                                                        )
                                                    }
                                                >

                                                    <td className="px-4 py-3 font-medium">
                                                        {
                                                            invoice.invoiceNumber
                                                        }
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        {
                                                            invoice.customerId
                                                        }
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        {
                                                            invoice.issueDate
                                                        }
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        ₹
                                                        {Number(
                                                            invoice.totalAmount
                                                        ).toFixed(2)}
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        ₹
                                                        {Number(
                                                            invoice.paidAmount
                                                        ).toFixed(2)}
                                                    </td>

                                                    <td className="px-4 py-3 font-medium">
                                                        ₹
                                                        {Number(
                                                            invoice.dueAmount
                                                        ).toFixed(2)}
                                                    </td>

                                                    <td className="px-4 py-3 capitalize">
                                                        {
                                                            invoice.status
                                                        }
                                                    </td>

                                                </tr>
                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>
                        )}

                    </div>
                )}

            {/* Payments */}
            {!loading &&
                activeTab === "payments" && (
                    <div className="space-y-4">

                        <div className="flex items-center justify-between">

                            <h2 className="text-lg font-semibold">
                                Payments
                            </h2>

                            <span className="text-sm text-gray-500">
                                {payments.length} records
                            </span>

                        </div>

                        <PaymentTable
                            payments={payments}
                            onView={(payment) =>
                                navigate(
                                    `/pg/billing/payments/${payment.id}`
                                )
                            }
                            onEdit={(payment) =>
                                navigate(
                                    `/pg/billing/payments/${payment.id}/edit`
                                )
                            }
                        />

                    </div>
                )}

        </div>
    );
}