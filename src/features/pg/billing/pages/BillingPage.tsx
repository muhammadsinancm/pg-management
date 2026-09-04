import { useNavigate } from "react-router";
import { useBilling } from "../hooks/useBilling";
import { useMemo, useState } from "react";
import { BillingCycle, BillingStatus } from "../types/billing.types";
import { usePayments } from "../hooks/usePayments";
import { PaymentTable } from "../components/PaymentTable";
import { BillingStats } from "../components/BillingStats";
import { BillingFilters } from "../components/BillingFilters";

export function BillingPage() {
    const navigate = useNavigate()

    const { billings, loading: billingLoading, error: billingError } = useBilling()

    const { payments, loading: paymentLoading, error: paymentError } = usePayments()

    const [billingCycle, setBillingCycle] = useState<BillingCycle | 'all'>('all')
    const [status, setStatus] = useState<BillingStatus | 'all'>('all')
    const [search, setSearch] = useState('')
    const [activeTab, setActiveTab] = useState<'billing' | 'payments'>('billing')

    const filteredBillings = useMemo(() => {
        const searchValue = search.trim().toLowerCase()

        return billings.filter((billing) => {
            const matchesCycle = billingCycle === 'all' || billing.billingCycle === billingCycle
            const matchesStatus = status === 'all' || billing.status === status

            const matchesSearch = billing.customerId.toLowerCase().includes(searchValue) ||
                billing.bookingId.toLowerCase().includes(searchValue) ||
                billing.invoiceId?.toLowerCase().includes(searchValue)

            return (matchesCycle && matchesStatus && matchesSearch)

        })
    }, [billings, billingCycle, status, search])

    const handleReset = () => {
        setBillingCycle('all')
        setStatus('all')
        setSearch('')
    }

    const loading = billingLoading || paymentLoading
    const error = billingError || paymentError

    return (
        <div className="space-y-6 p-6">

            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold">
                        Billing
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage invoices, billing and payments.
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() =>
                            navigate("/pg/billing/invoices/create")
                        }
                        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
                    >
                        Create Invoice
                    </button>


                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Billing Stats */}
            <BillingStats
                billings={billings}
            />

            {/* Filters */}
            <BillingFilters
                billingCycle={billingCycle}
                status={status}
                search={search}
                onBillingCycleChange={
                    setBillingCycle
                }
                onStatusChange={setStatus}
                onSearchChange={setSearch}
                onReset={handleReset}
            />

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
                        Billing
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

            {/* Billing */}
            {!loading &&
                activeTab === "billing" && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">
                                Invoices
                            </h2>

                            <span className="text-sm text-gray-500">
                                {filteredBillings.length}{" "}
                                records
                            </span>
                        </div>

                        {filteredBillings.length === 0 ? (
                            <div className="rounded-lg border bg-white p-8 text-center">
                                <p className="text-sm text-gray-500">
                                    No billing records found.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-lg border bg-white">
                                <table className="w-full min-w-[900px] text-left text-sm">
                                    <thead className="border-b bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3">
                                                Customer
                                            </th>

                                            <th className="px-4 py-3">
                                                Cycle
                                            </th>

                                            <th className="px-4 py-3">
                                                Period
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
                                        {filteredBillings.map(
                                            (billing) => (
                                                <tr
                                                    key={
                                                        billing.id
                                                    }
                                                    className="cursor-pointer hover:bg-gray-50"
                                                    onClick={() =>
                                                        billing.invoiceId
                                                            ? navigate(
                                                                `/pg/billing/invoices/${billing.invoiceId}`
                                                            )
                                                            : undefined
                                                    }
                                                >
                                                    <td className="px-4 py-3 font-medium">
                                                        {
                                                            billing.customerId
                                                        }
                                                    </td>

                                                    <td className="px-4 py-3 capitalize">
                                                        {
                                                            billing.billingCycle
                                                        }
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        {
                                                            billing.billingStartDate
                                                        }{" "}
                                                        -{" "}
                                                        {
                                                            billing.billingEndDate
                                                        }
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        ₹
                                                        {Number(
                                                            billing.totalAmount
                                                        ).toFixed(
                                                            2
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        ₹
                                                        {Number(
                                                            billing.paidAmount
                                                        ).toFixed(
                                                            2
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-3 font-medium">
                                                        ₹
                                                        {Number(
                                                            billing.dueAmount
                                                        ).toFixed(
                                                            2
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-3 capitalize">
                                                        {
                                                            billing.status
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
    )
}