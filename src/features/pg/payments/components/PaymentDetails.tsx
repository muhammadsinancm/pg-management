import { Payment } from "../types/payment.types";
import { PaymentMethodBadge } from "./PaymentMethodBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";

interface PaymentDetailsProps {
  payment: Payment
}

export function PaymentDetails({ payment }: PaymentDetailsProps) {
  const paymentDate = payment.paymentDate instanceof Date ? payment.paymentDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }) : '-'

  const createdAt = payment.createdAt instanceof Date ? payment.createdAt.toLocaleString('en-IN') : '-'
  const updatedAt = payment.updatedAt instanceof Date ? payment.updatedAt.toLocaleString('en-IN') : '-'

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">

      {/* Payment Header */}
      <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-white p-6">

        <div>
          <span className="text-sm text-gray-500">
            Payment Number
          </span>

          <h2 className="mt-1 text-2xl font-semibold text-gray-900">
            {payment.paymentNumber}
          </h2>
        </div>

        <PaymentStatusBadge
          status={payment.status}
        />

      </div>


      {/* Amount */}
      <div className="rounded-xl border border-stone-200 bg-white p-6">

        <span className="text-sm text-gray-500">
          Payment Amount
        </span>

        <strong className="mt-2 block text-3xl font-semibold text-teal-700">
          ₹{payment.amount.toLocaleString("en-IN")}
        </strong>

      </div>


      {/* Payment Information */}
      <section className="rounded-xl border border-stone-200 bg-white p-6">

        <h3 className="mb-5 text-lg font-semibold text-gray-900">
          Payment Information
        </h3>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          <DetailItem
            label="Payment Type"
            value={formatPaymentType(
              payment.paymentType
            )}
          />

          <div className="flex flex-col gap-2">

            <span className="text-sm text-gray-500">
              Payment Method
            </span>

            <div>
              <PaymentMethodBadge
                method={payment.paymentMethod}
              />
            </div>

          </div>

          <DetailItem
            label="Payment Date"
            value={paymentDate}
          />

          <DetailItem
            label="Customer ID"
            value={payment.customerId}
          />

          <DetailItem
            label="Booking ID"
            value={payment.bookingId || "-"}
          />

        </div>

      </section>


      {/* Branch Information */}
      <section className="rounded-xl border border-stone-200 bg-white p-6">

        <h3 className="mb-5 text-lg font-semibold text-gray-900">
          Branch Information
        </h3>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          <DetailItem
            label="Organization ID"
            value={payment.organizationId}
          />

          <DetailItem
            label="Branch ID"
            value={payment.branchId}
          />

        </div>

      </section>


      {/* Notes */}
      {payment.notes && (
        <section className="rounded-xl border border-stone-200 bg-white p-6">

          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Notes
          </h3>

          <p className="rounded-lg bg-stone-50 p-4 text-sm leading-6 text-gray-700">
            {payment.notes}
          </p>

        </section>
      )}


      {/* Audit Information */}
      <section className="rounded-xl border border-stone-200 bg-white p-6">

        <h3 className="mb-5 text-lg font-semibold text-gray-900">
          Record Information
        </h3>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          <DetailItem
            label="Created By"
            value={payment.createdBy}
          />

          <DetailItem
            label="Created At"
            value={createdAt}
          />

          <DetailItem
            label="Updated At"
            value={updatedAt}
          />

        </div>

      </section>

    </div>
  );

}

interface DetailItemProps {
  label: string
  value: string
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="flex flex-col gap-2">

      <span className="text-sm text-gray-500">
        {label}
      </span>

      <strong className="break-words text-sm font-medium text-gray-900">
        {value}
      </strong>

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