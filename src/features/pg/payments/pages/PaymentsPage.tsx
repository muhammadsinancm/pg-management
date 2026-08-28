import { useNavigate } from "react-router";
import { usePayments } from "../hooks/usePayments";
import { useMemo, useState } from "react";
import { PaymentStatus, PaymentType } from "../types/payment.types";
import { PaymentTable } from "../components/PaymentTable";
import { PaymentFilters } from "../components/PaymentFilters";
import { PaymentSummary } from "../components/PaymentSummary";

export function PaymentsPage() {
  const navigate = useNavigate()

  const branchId = 'branch001'
  const { payments, loading, error, refresh } = usePayments(branchId)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<PaymentType | 'all'>('all')

  const filteredPayments = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    return payments.filter((payment) => {
      const matchesSearch = !searchValue || payment.paymentNumber.toLowerCase().includes(searchValue) || payment.customerId.toLowerCase().includes(searchValue)

      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
      const matchesType = typeFilter === 'all' || payment.paymentType === typeFilter

      return (
        matchesSearch && matchesStatus && matchesType
      )
    })
  }, [payments, search, statusFilter, typeFilter])

  const totalAmount = useMemo(() => {
    return payments.filter((payment) => payment.status === 'paid')
      .reduce((total, payment) => total + payment.amount, 0)
  }, [payments])

  const pendingAmount = useMemo(() => {
    return payments.filter((payment) => payment.status === 'pending')
      .reduce((total, payment) => total + payment.amount, 0)
  }, [payments])

  const paidPaymentsCount = useMemo(() => {
    return payments.filter((payment) => payment.status === 'paid').length
  }, [payments])

  if (loading) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

        <div className="mb-8">
          <span className="text-xs font-semibold tracking-[0.2em] text-teal-700">
            PG MANAGEMENT
          </span>

          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Payments
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage payments and payment history.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Loading payments...
        </div>

      </section>
    );
  }

  if (error) {
        return (
      <section className="w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

        <div className="mb-8">
          <span className="text-xs font-semibold tracking-[0.2em] text-teal-700">
            PG MANAGEMENT
          </span>

          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Payments
          </h1>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">

          <p className="text-sm text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={refresh}
            className="mt-4 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-800"
          >
            Try Again
          </button>

        </div>

      </section>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

      {/* -------------------------------------- */}
      {/* Header */}
      {/* -------------------------------------- */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <span className="text-xs font-semibold tracking-[0.2em] text-teal-700">
            PG MANAGEMENT
          </span>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Payments
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage payments and payment history.
          </p>

        </div>


        {/* Record Payment */}
        <button
          type="button"
          onClick={() =>
            navigate(
              "/pg/payments/create"
            )
          }
          className="inline-flex items-center justify-center rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
        >
          + Record Payment
        </button>

      </div>


      {/* -------------------------------------- */}
      {/* Summary */}
      {/* -------------------------------------- */}

      <div className="mb-6">
        <PaymentSummary
          totalAmount={totalAmount}
          pendingAmount={pendingAmount}
          paidPaymentsCount={
            paidPaymentsCount
          }
          totalPayments={
            payments.length
          }
        />
      </div>


      {/* -------------------------------------- */}
      {/* Filters */}
      {/* -------------------------------------- */}

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

        <PaymentFilters
          search={search}
          status={statusFilter}
          type={typeFilter}
          onSearchChange={setSearch}
          onStatusChange={
            setStatusFilter
          }
          onTypeChange={
            setTypeFilter
          }
        />

      </div>


      {/* -------------------------------------- */}
      {/* Payment History */}
      {/* -------------------------------------- */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        {/* Results Header */}

        <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-lg font-semibold text-slate-900">
              Payment History
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              View and manage recorded payments.
            </p>

          </div>


          <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {filteredPayments.length}{" "}
            {filteredPayments.length === 1
              ? "payment"
              : "payments"}
          </span>

        </div>


        {/* Table */}

        <div className="overflow-x-auto">

          <PaymentTable
            payments={filteredPayments}
          />

        </div>

      </div>

    </section>
  );


}