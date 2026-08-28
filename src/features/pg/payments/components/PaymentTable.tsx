import { useNavigate } from "react-router";
import { Payment } from "../types/payment.types";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { PaymentMethodBadge } from "./PaymentMethodBadge";

interface PaymentTableProps {
    payments: Payment[]
}

export function PaymentTable({ payments }: PaymentTableProps) {
    const navigate = useNavigate()

    if (payments.length === 0) {
            return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center">

        <h3 className="text-lg font-semibold text-slate-900">
          No payments found
        </h3>

        <p className="mt-2 max-w-md text-sm text-slate-500">
          There are no payments matching your
          search or filters.
        </p>

        <button
          type="button"
          onClick={() =>
            navigate("/pg/payments/create")
          }
          className="mt-5 rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          + Record Payment
        </button>

      </div>
    );

    }

   return (
    <div className="w-full overflow-hidden rounded-xl border border-stone-200 bg-white">

      {/* Responsive wrapper */}
      <div className="w-full overflow-x-auto">

        <table className="w-full min-w-[900px] border-collapse">

          {/* Header */}
          <thead className="bg-stone-50">

            <tr className="border-b border-stone-200">

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                Payment
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                Customer
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                Type
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                Amount
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                Method
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                Date
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                Status
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                Action
              </th>

            </tr>

          </thead>


          {/* Body */}
          <tbody className="divide-y divide-stone-100">

            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="transition hover:bg-stone-50"
              >

                {/* Payment Number */}
                <td className="whitespace-nowrap px-5 py-4">

                  <strong className="text-sm font-semibold text-slate-900">
                    {payment.paymentNumber}
                  </strong>

                </td>


                {/* Customer */}
                <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">

                  {payment.customerId}

                </td>


                {/* Payment Type */}
                <td className="whitespace-nowrap px-5 py-4">

                  <span className="text-sm text-slate-700">
                    {formatPaymentType(
                      payment.paymentType
                    )}
                  </span>

                </td>


                {/* Amount */}
                <td className="whitespace-nowrap px-5 py-4">

                  <strong className="text-sm font-semibold text-slate-900">
                    ₹
                    {payment.amount.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </td>


                {/* Payment Method */}
                <td className="whitespace-nowrap px-5 py-4">

                  <PaymentMethodBadge
                    method={payment.paymentMethod}
                  />

                </td>


                {/* Date */}
                <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">

                  {formatDate(
                    payment.paymentDate
                  )}

                </td>


                {/* Status */}
                <td className="whitespace-nowrap px-5 py-4">

                  <PaymentStatusBadge
                    status={payment.status}
                  />

                </td>


                {/* Action */}
                <td className="whitespace-nowrap px-5 py-4">

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/pg/payments/${payment.id}`
                      )
                    }
                    className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-teal-600 hover:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1"
                  >
                    View
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export function formatPaymentType(type: Payment['paymentType']): string {
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

export function formatDate(date: Payment['paymentDate']): string {
    if (!date) {
        return '-'
    }

    const paymentDate = date instanceof Date ? date : new Date(date)

    if (Number.isNaN(paymentDate.getTime())) {
        return '-'
    }

    return paymentDate.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}