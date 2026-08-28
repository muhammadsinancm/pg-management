interface PaymentSummaryProps {
    totalAmount: number
    pendingAmount: number
    paidPaymentsCount: number
    totalPayments: number
}

export function PaymentSummary({totalAmount, pendingAmount, paidPaymentsCount, totalPayments}: PaymentSummaryProps) {
     return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

      {/* Total Paid */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <span className="text-sm font-medium text-gray-500">
          Total Paid
        </span>

        <strong className="mt-2 block text-2xl font-semibold text-gray-900">
          ₹{totalAmount.toLocaleString("en-IN")}
        </strong>
      </div>


      {/* Pending Amount */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <span className="text-sm font-medium text-gray-500">
          Pending Amount
        </span>

        <strong className="mt-2 block text-2xl font-semibold text-gray-900">
          ₹{pendingAmount.toLocaleString("en-IN")}
        </strong>
      </div>


      {/* Paid Payments */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <span className="text-sm font-medium text-gray-500">
          Paid Payments
        </span>

        <strong className="mt-2 block text-2xl font-semibold text-gray-900">
          {paidPaymentsCount}
        </strong>
      </div>


      {/* Total Payments */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <span className="text-sm font-medium text-gray-500">
          Total Payments
        </span>

        <strong className="mt-2 block text-2xl font-semibold text-gray-900">
          {totalPayments}
        </strong>
      </div>

    </div>
  )
}