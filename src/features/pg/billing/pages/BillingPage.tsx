import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
    AlertCircle,
    CreditCard,
    FileText,
    LayoutGrid,
    Plus,
    Search,
    Table as TableIcon,
    X,
} from "lucide-react";
import { useInvoices } from "../hooks/useInvoices";
import { usePayments } from "../hooks/usePayments";
import { Invoice } from "../types/invoice.types";
import { BillingStats } from "../components/BillingStats";
import { InvoiceTable, InvoiceTableSkeleton } from "../components/InvoiceTable";
import { InvoiceCard, InvoiceCardSkeleton } from "../components/InvoiceCard";
import { PaymentTable, PaymentTableSkeleton } from "../components/PaymentTable";

export function BillingPage() {
    const navigate = useNavigate();

    const { invoices, loading: invoiceLoading, error: invoiceError } = useInvoices();
    const { payments, loading: paymentLoading, error: paymentError } = usePayments();

    const [status, setStatus] = useState<Invoice["status"] | "all">("all");
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState<"billing" | "payments">("billing");
    const [viewMode, setViewMode] = useState<"table" | "card">("table");

    // Filter invoices by search and status
    const filteredInvoices = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return invoices.filter((invoice) => {
            const invNum = (invoice.invoiceNumber || "").toLowerCase();
            const customer = (invoice.customerId || "").toLowerCase();
            const booking = (invoice.bookingId || "").toLowerCase();

            const matchesSearch =
                !searchValue ||
                invNum.includes(searchValue) ||
                customer.includes(searchValue) ||
                booking.includes(searchValue);

            const matchesStatus = status === "all" || invoice.status === status;

            return matchesSearch && matchesStatus;
        });
    }, [invoices, search, status]);

    // Filter payments by search
    const filteredPayments = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return payments.filter((payment) => {
            const payNum = (payment.paymentNumber || "").toLowerCase();
            const customer = (payment.customerId || "").toLowerCase();
            const invoice = (payment.invoiceId || "").toLowerCase();
            const ref = (payment.referenceNumber || "").toLowerCase();

            return (
                !searchValue ||
                payNum.includes(searchValue) ||
                customer.includes(searchValue) ||
                invoice.includes(searchValue) ||
                ref.includes(searchValue)
            );
        });
    }, [payments, search]);

    const isInitialLoading =
        (invoiceLoading && invoices.length === 0) ||
        (paymentLoading && payments.length === 0);
    const error = invoiceError || paymentError;

    const handleResetFilters = () => {
        setStatus("all");
        setSearch("");
    };

    return (
        <div className="w-full min-w-0 space-y-4 p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                        Billing & Payments
                    </h1>
                    <p className="mt-0.5 text-xs text-neutral-400">
                        Manage invoices, payments, and financial accounts
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {activeTab === "billing" ? (
                        <button
                            type="button"
                            onClick={() => navigate("/pg/billing/invoices/create")}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-neutral-800 cursor-pointer shrink-0"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Create Invoice</span>
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => navigate("/pg/billing/payments/create")}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-neutral-800 cursor-pointer shrink-0"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Record Payment</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50/80 p-3.5 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                        <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                        <p className="text-xs font-semibold text-red-800">{error}</p>
                    </div>
                </div>
            )}

            {/* Loading State: If initial load, render modern skeleton UI */}
            {isInitialLoading ? (
                <div className="space-y-4">
                    {/* Summary Skeleton */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-4 sm:gap-3 animate-pulse">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex min-h-[72px] sm:min-h-[82px] flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-3 sm:p-3.5 lg:p-4 shadow-2xs min-w-0"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="h-2.5 sm:h-3 w-16 rounded bg-neutral-100" />
                                    <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg bg-neutral-100" />
                                </div>
                                <div className="mt-2">
                                    <div className="h-5 sm:h-6 w-20 rounded-md bg-neutral-200" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Filter Skeleton */}
                    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between animate-pulse">
                        <div className="h-9 w-full sm:max-w-md rounded-xl bg-neutral-100" />
                        <div className="flex items-center gap-2">
                            <div className="h-9 w-28 rounded-xl bg-neutral-100" />
                            <div className="h-9 w-32 rounded-xl bg-neutral-100" />
                        </div>
                    </div>

                    {/* Table Skeleton */}
                    {activeTab === "billing" ? (
                        viewMode === "table" ? (
                            <InvoiceTableSkeleton />
                        ) : (
                            <div className="grid grid-cols-1 gap-2.5 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <InvoiceCardSkeleton key={i} />
                                ))}
                            </div>
                        )
                    ) : (
                        <PaymentTableSkeleton />
                    )}
                </div>
            ) : (
                <>
                    {/* Summary Metrics */}
                    <BillingStats
                        invoices={invoices}
                        selectedStatus={status}
                        onSelectStatus={(s) => setStatus(s)}
                    />

                    {/* Navigation Tabs */}
                    <div className="flex items-center justify-between border-b border-neutral-100 pt-1">
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setActiveTab("billing")}
                                className={`inline-flex items-center gap-1.5 border-b-2 px-3 pb-2.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                                    activeTab === "billing"
                                        ? "border-neutral-900 text-neutral-900"
                                        : "border-transparent text-neutral-400 hover:text-neutral-700"
                                }`}
                            >
                                <FileText className="h-3.5 w-3.5" />
                                <span>Invoices</span>
                                <span className="rounded-full bg-neutral-100 px-1.5 py-0.2 text-[10px] font-bold text-neutral-600">
                                    {invoices.length}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab("payments")}
                                className={`inline-flex items-center gap-1.5 border-b-2 px-3 pb-2.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                                    activeTab === "payments"
                                        ? "border-neutral-900 text-neutral-900"
                                        : "border-transparent text-neutral-400 hover:text-neutral-700"
                                }`}
                            >
                                <CreditCard className="h-3.5 w-3.5" />
                                <span>Payments</span>
                                <span className="rounded-full bg-neutral-100 px-1.5 py-0.2 text-[10px] font-bold text-neutral-600">
                                    {payments.length}
                                </span>
                            </button>
                        </div>

                        {/* View Switcher (for Invoices tab) */}
                        {activeTab === "billing" && (
                            <div className="mb-2 inline-flex items-center rounded-xl border border-neutral-200 bg-white p-0.5 shadow-2xs">
                                <button
                                    type="button"
                                    onClick={() => setViewMode("table")}
                                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                                        viewMode === "table"
                                            ? "bg-neutral-900 text-white shadow-2xs"
                                            : "text-neutral-500 hover:text-neutral-900"
                                    }`}
                                    title="Table View"
                                >
                                    <TableIcon className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline">Table</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode("card")}
                                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                                        viewMode === "card"
                                            ? "bg-neutral-900 text-white shadow-2xs"
                                            : "text-neutral-500 hover:text-neutral-900"
                                    }`}
                                    title="Card View"
                                >
                                    <LayoutGrid className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline">Cards</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Filters bar */}
                    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                        {/* Search input */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={
                                    activeTab === "billing"
                                        ? "Search by invoice #, customer ID, or booking..."
                                        : "Search by payment #, customer ID, or reference..."
                                }
                                className="w-full rounded-xl border border-neutral-200 bg-white pl-9 pr-8 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer p-0.5"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            )}
                        </div>

                        {/* Status Filter (Invoices) */}
                        {activeTab === "billing" && (
                            <div className="flex items-center gap-2">
                                <select
                                    value={status}
                                    onChange={(e) =>
                                        setStatus(e.target.value as Invoice["status"] | "all")
                                    }
                                    className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-800 shadow-2xs outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 cursor-pointer"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="draft">Draft</option>
                                    <option value="issued">Issued</option>
                                    <option value="partial">Partial</option>
                                    <option value="paid">Paid</option>
                                    <option value="overdue">Overdue</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>

                                {(search || status !== "all") && (
                                    <button
                                        type="button"
                                        onClick={handleResetFilters}
                                        className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-600 shadow-2xs hover:bg-neutral-50 hover:text-neutral-900 transition-colors cursor-pointer"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>
                        )}
                        {activeTab === "payments" && search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-600 shadow-2xs hover:bg-neutral-50 hover:text-neutral-900 transition-colors cursor-pointer"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Data Display: Invoices or Payments */}
                    {activeTab === "billing" ? (
                        viewMode === "table" ? (
                            <InvoiceTable
                                invoices={filteredInvoices}
                                onView={(invoice) =>
                                    navigate(`/pg/billing/invoices/${invoice.id}`)
                                }
                                onEdit={(invoice) =>
                                    navigate(`/pg/billing/invoices/${invoice.id}/edit`)
                                }
                                onAdd={() => navigate("/pg/billing/invoices/create")}
                            />
                        ) : (
                            <div className="grid grid-cols-1 gap-2.5 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {filteredInvoices.length === 0 ? (
                                    <div className="col-span-full rounded-2xl border border-dashed border-neutral-200 bg-white p-8 xl:p-12 text-center shadow-2xs">
                                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <h3 className="mt-3 text-sm font-bold text-neutral-900">
                                            No Invoices Found
                                        </h3>
                                        <p className="mt-1 text-xs text-neutral-400 max-w-sm mx-auto">
                                            No invoices match your current search and filter criteria.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => navigate("/pg/billing/invoices/create")}
                                            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-neutral-800 transition-all cursor-pointer"
                                        >
                                            + Create Invoice
                                        </button>
                                    </div>
                                ) : (
                                    filteredInvoices.map((invoice) => (
                                        <InvoiceCard
                                            key={invoice.id}
                                            invoice={invoice}
                                            onView={(inv) =>
                                                navigate(`/pg/billing/invoices/${inv.id}`)
                                            }
                                            onEdit={(inv) =>
                                                navigate(`/pg/billing/invoices/${inv.id}/edit`)
                                            }
                                        />
                                    ))
                                )}
                            </div>
                        )
                    ) : (
                        <PaymentTable
                            payments={filteredPayments}
                            onView={(payment) =>
                                navigate(`/pg/billing/payments/${payment.id}`)
                            }
                            onEdit={(payment) =>
                                navigate(`/pg/billing/payments/${payment.id}/edit`)
                            }
                            onAdd={() => navigate("/pg/billing/payments/create")}
                        />
                    )}
                </>
            )}
        </div>
    );
}