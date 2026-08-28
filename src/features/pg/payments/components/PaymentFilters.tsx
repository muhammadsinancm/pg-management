import { PaymentStatus, PaymentType } from "../types/payment.types"

interface PaymentFiltersProps {
    search: string
    status: PaymentStatus | 'all'
    type: PaymentType | 'all'
    onSearchChange: (value: string) => void
    onStatusChange: (value: PaymentStatus | 'all') => void
    onTypeChange: (value: PaymentType | 'all') => void
}

export function PaymentFilters({search, status, type, onSearchChange, onStatusChange, onTypeChange}: PaymentFiltersProps) {
return (
    <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-white p-5 md:grid-cols-3">

      {/* Search */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="payment-search"
          className="text-sm font-medium text-gray-700"
        >
          Search
        </label>

        <input
          id="payment-search"
          type="text"
          placeholder="Search payment or customer..."
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
        />
      </div>


      {/* Status */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="payment-status"
          className="text-sm font-medium text-gray-700"
        >
          Status
        </label>

        <select
          id="payment-status"
          value={status}
          onChange={(event) =>
            onStatusChange(
              event.target.value as
                | PaymentStatus
                | "all"
            )
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
        >
          <option value="all">
            All Statuses
          </option>

          <option value="paid">
            Paid
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="failed">
            Failed
          </option>

          <option value="refunded">
            Refunded
          </option>
        </select>
      </div>


      {/* Payment Type */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="payment-type"
          className="text-sm font-medium text-gray-700"
        >
          Payment Type
        </label>

        <select
          id="payment-type"
          value={type}
          onChange={(event) =>
            onTypeChange(
              event.target.value as
                | PaymentType
                | "all"
            )
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
        >
          <option value="all">
            All Types
          </option>

          <option value="rent">
            Rent
          </option>

          <option value="advance">
            Advance
          </option>

          <option value="deposit">
            Deposit
          </option>

          <option value="other">
            Other
          </option>
        </select>
      </div>

    </div>
  );
}