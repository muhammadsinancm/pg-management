import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { usePayments } from "../hooks/usePayments";
import { Payment } from "../types/payment.types";

export function ReceiptPage() {
    const {paymentId} = useParams<{
        paymentId: string
    }>()

    const navigate = useNavigate()

    const branchId = 'branch001'

    const {getPayment} = usePayments(branchId)

    const [payment, setPayment] = useState<Payment | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(()=> {
        const loadingPayment = async () => {
            if (!paymentId) {
                setError('Payment ID is missing.')
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                setError(null)

                const data = await getPayment(paymentId)

                if (!data) {
                    setError('Payment not found.')
                    return
                }
                setPayment(data)

            } catch (error) {
                console.error('Failed to load payment', error)
                setError(error instanceof Error ? error.message : 'Failed to load payment')

            } finally {
                setLoading(false)
            }
        }
        loadingPayment()
    }, [paymentId, getPayment])

    if (loading) {
        return (
      <div className="flex min-h-[500px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading receipt...
        </p>
      </div>
    );
    }

    if (error || !payment) {
         return (
      <div className="mx-auto max-w-3xl px-6 py-10">

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">

          <h1 className="text-lg font-semibold text-red-800">
            Receipt unavailable
          </h1>

          <p className="mt-2 text-sm text-red-700">
            {error ?? "Payment not found."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/pg/payments")
            }
            className="mt-5 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800"
          >
            Back to Payments
          </button>

        </div>

      </div>
    );
    }

    const paymentDate = payment.paymentDate instanceof Date ? payment.paymentDate.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }) : '-'

      return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8">

      {/* Actions */}
      <div className="mb-6 flex items-center justify-between">

        <button
          type="button"
          onClick={() =>
            navigate(
              `/pg/payments/${payment.id}`
            )
          }
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          ← Back
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
        >
          Print Receipt
        </button>

      </div>


      {/* Receipt */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Header */}
        <div className="border-b border-slate-200 px-8 py-7 text-center">

          <p className="text-xs font-semibold tracking-[0.25em] text-teal-700">
            PG MANAGEMENT
          </p>

          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            Payment Receipt
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Payment confirmation
          </p>

        </div>


        {/* Payment Status */}
        <div className="flex justify-center px-8 py-6">

          <span className="rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            {formatStatus(payment.status)}
          </span>

        </div>


        {/* Amount */}
        <div className="px-8 text-center">

          <p className="text-sm text-slate-500">
            Amount Paid
          </p>

          <p className="mt-1 text-4xl font-bold text-slate-900">
            ₹{payment.amount.toLocaleString("en-IN")}
          </p>

        </div>


        {/* Payment Information */}
        <div className="px-8 py-8">

          <div className="border-t border-slate-200 pt-7">

            <h2 className="mb-5 text-base font-semibold text-slate-900">
              Payment Information
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">

              <ReceiptItem
                label="Payment Number"
                value={payment.paymentNumber}
              />

              <ReceiptItem
                label="Payment Date"
                value={paymentDate}
              />

              <ReceiptItem
                label="Payment Type"
                value={formatPaymentType(
                  payment.paymentType
                )}
              />

              <ReceiptItem
                label="Payment Method"
                value={fromatPaymentMethod(
                  payment.paymentMethod
                )}
              />

              <ReceiptItem
                label="Customer ID"
                value={payment.customerId}
              />

              <ReceiptItem
                label="Booking ID"
                value={payment.bookingId || "-"}
              />

            </div>

          </div>


          {/* Branch Information */}
          <div className="mt-8 border-t border-slate-200 pt-7">

            <h2 className="mb-5 text-base font-semibold text-slate-900">
              Branch Information
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">

              <ReceiptItem
                label="Organization ID"
                value={payment.organizationId}
              />

              <ReceiptItem
                label="Branch ID"
                value={payment.branchId}
              />

            </div>

          </div>


          {/* Notes */}
          {payment.notes && (
            <div className="mt-8 border-t border-slate-200 pt-7">

              <h2 className="mb-3 text-base font-semibold text-slate-900">
                Notes
              </h2>

              <p className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                {payment.notes}
              </p>

            </div>
          )}

        </div>


        {/* Footer */}
        <div className="border-t border-slate-200 px-8 py-6 text-center">

          <p className="text-xs text-slate-500">
            Thank you for your payment.
          </p>

          <p className="mt-1 text-xs text-slate-400">
            This is a computer-generated receipt.
          </p>

        </div>

      </div>

    </div>
  );
}

interface ReceiptItemProps {
label: string
value: string
}

function ReceiptItem({label, value}: ReceiptItemProps) {
      return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-800">
        {value}
      </p>
    </div>
  );
}

function formatPaymentType(type: Payment['paymentType']): string {
    switch (type) {
        case 'rent':
            return 'Rent'
        case 'advance':
            return 'Advance'
        case 'deposit':
            return 'Deposit'
        case 'other':
            return 'Other'
        default: return type
    }
}

function fromatPaymentMethod(method: Payment['paymentMethod']): string {
    switch(method) {
     case 'cash':
        return 'Cash'
    case 'upi':
        return 'UPI'
    case 'card':
        return 'Card'
    case 'back_transfer':
        return 'Bank Transfer'
    default: return method
    }
}

function formatStatus(status: Payment['status']): string {
    switch(status) {
        case 'paid':
            return 'Paid'
        case 'pending':
            return 'Pending'
        case 'failed':
            return 'Failed'
        case 'refunded':
            return 'Refunded'
        default: return status
    }
}