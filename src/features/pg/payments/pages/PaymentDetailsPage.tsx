import { useNavigate, useParams } from "react-router";
import { usePayments } from "../hooks/usePayments";
import { useEffect, useState } from "react";
import { Payment } from "../types/payment.types";
import { PaymentDetails } from "../components/PaymentDetails";

export function PaymentDetailsPage() {
    const { paymentId } = useParams<{ paymentId: string }>()

    const navigate = useNavigate()

    const branchId = 'branch001'

    const { getPayment } = usePayments(branchId)

    const [payment, setPayment] = useState<Payment | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadPayment = async () => {
            if (!paymentId) {
                setError('Payment ID is required.')
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                setError(null)

                const data = await getPayment(paymentId)

                if (!data) {
                    setError('Payment not found')
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
        loadPayment()
    }, [paymentId])

    if (loading) {
           return (
      <section className="w-full max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-teal-700 uppercase">
            PG MANAGEMENT
          </p>

          <h1 className="text-3xl font-semibold text-slate-900">
            Payment Details
          </h1>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-slate-600">

            <div className="h-5 w-5 animate-spin rounded-full border-2 border-stone-300 border-t-teal-700" />

            <p>
              Loading payment...
            </p>

          </div>
        </div>

      </section>
    );

    }

    if (error || !payment) {
        return (
      <section className="w-full max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-teal-700 uppercase">
            PG MANAGEMENT
          </p>

          <h1 className="text-3xl font-semibold text-slate-900">
            Payment Details
          </h1>
        </div>


        <div className="rounded-xl border border-red-200 bg-red-50 p-8">

          <div className="mb-6">

            <h2 className="mb-2 text-lg font-semibold text-red-800">
              Unable to load payment
            </h2>

            <p className="text-sm text-red-700">
              {error ?? "Payment not found."}
            </p>

          </div>


          <button
            type="button"
            onClick={() =>
              navigate("/pg/payments")
            }
            className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-800"
          >
            ← Back to Payments
          </button>

        </div>

      </section>
    );
    }

    return (
    <section className="w-full max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <button
            type="button"
            onClick={() =>
              navigate("/pg/payments")
            }
            className="mb-5 inline-flex items-center rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-stone-50"
          >
            ← Back to Payments
          </button>


          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-teal-700 uppercase">
            PG MANAGEMENT / PAYMENTS
          </p>


          <h1 className="text-3xl font-semibold text-slate-900">
            Payment Details
          </h1>


          <p className="mt-2 text-sm text-slate-500">
            View complete information about this payment.
          </p>

        </div>


        <button
          type="button"
          onClick={() =>
            navigate(
              `/pg/payments/${payment.id}/receipt`
            )
          }
          className="inline-flex items-center justify-center rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
        >
          View Receipt
        </button>

      </div>


      {/* Payment Details Card */}
      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">

        <PaymentDetails
          payment={payment}
        />

      </div>

    </section>
  );
}