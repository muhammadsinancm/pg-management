import { FormEvent, useState } from "react"
import { CreatePaymentInput } from "../services/paymentService"
import { PaymentMethod, PaymentType } from "../types/payment.types"

interface PaymentFormProps {
  branchId: string
  organizationId: string
  createdBy: string
  onSubmit: (data: CreatePaymentInput) => Promise<void>
  onCancel?: () => void
}

export function PaymentForm({ branchId, organizationId, createdBy, onSubmit, onCancel }: PaymentFormProps) {
  const [paymentNumber, setPaymentNumber] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [bookingId, setBookingId] = useState('')
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [paymentType, setPaymentType] = useState<PaymentType>('rent')
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    const numericAmount = Number(amount)

    if (!paymentNumber.trim()) {
      setError('Payment number is required.')
      return
    }

    if (!customerId.trim()) {
      setError('Customer ID is required.')
      return
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('Amount must be greater than zero.')
      return
    }

    if (!branchId) {
      setError('Branch Id is required.')
      return
    }

    if (!organizationId) {
      setError('Organization ID is required.')
      return
    }

    if (!createdBy) {
      setError('User information is required.')
      return
    }

    try {
      setSubmitting(true)

      const data: CreatePaymentInput = {
        paymentNumber: paymentNumber.trim(),
        organizationId,
        branchId,
        customerId: customerId.trim(),
        bookingId: bookingId.trim() ? bookingId.trim() : null,
        amount: numericAmount,
        paymentMethod,
        paymentType,
        paymentDate: paymentDate ? new Date(`${paymentDate}T00:00:00`) : new Date(),
        status: 'paid',
        notes: notes.trim(),
        createdBy
      }

      await onSubmit(data)

      setPaymentNumber('')
      setCustomerId('')
      setBookingId('')
      setAmount('')
      setPaymentMethod('cash')
      setPaymentType('rent')
      setPaymentDate(new Date().toISOString().split('T')[0])
      setNotes('')

    } catch (error) {
      console.error('Failed to submit payment', error)
      setError(error instanceof Error ? error.message : 'Failed to record payment.')

    } finally {
      setSubmitting(false)
    }
  }
  return (
      <form
    onSubmit={handleSubmit}
    className="w-full max-w-3xl mx-auto p-6 md:p-8 bg-white border border-stone-200 rounded-xl shadow-sm"
  >
    {/* Header */}
    <div className="mb-7">
      <h2 className="text-2xl font-semibold text-slate-900">
        Payment Information
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Enter the payment details below.
      </p>
    </div>

    {/* Error */}
    {error && (
      <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    )}

    {/* Payment Number */}
    <div className="mb-5">
      <label
        htmlFor="paymentNumber"
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        Payment Number
      </label>

      <input
        id="paymentNumber"
        type="text"
        placeholder="PAY-001"
        value={paymentNumber}
        onChange={(event) =>
          setPaymentNumber(event.target.value)
        }
        disabled={submitting}
        className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 disabled:bg-stone-100"
      />
    </div>

    {/* Customer */}
    <div className="mb-5">
      <label
        htmlFor="customerId"
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        Customer ID
      </label>

      <input
        id="customerId"
        type="text"
        placeholder="Customer ID"
        value={customerId}
        onChange={(event) =>
          setCustomerId(event.target.value)
        }
        disabled={submitting}
        className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 disabled:bg-stone-100"
      />
    </div>

    {/* Booking */}
    <div className="mb-5">
      <label
        htmlFor="bookingId"
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        Booking ID
      </label>

      <input
        id="bookingId"
        type="text"
        placeholder="Booking ID (optional)"
        value={bookingId}
        onChange={(event) =>
          setBookingId(event.target.value)
        }
        disabled={submitting}
        className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 disabled:bg-stone-100"
      />
    </div>

    {/* Amount */}
    <div className="mb-5">
      <label
        htmlFor="amount"
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        Amount
      </label>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
          ₹
        </span>

        <input
          id="amount"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(event) =>
            setAmount(event.target.value)
          }
          disabled={submitting}
          className="w-full rounded-lg border border-stone-300 py-2.5 pl-8 pr-3 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 disabled:bg-stone-100"
        />
      </div>
    </div>

    {/* Payment Type */}
    <div className="mb-5">
      <label
        htmlFor="paymentType"
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        Payment Type
      </label>

      <select
        id="paymentType"
        value={paymentType}
        onChange={(event) =>
          setPaymentType(
            event.target.value as PaymentType
          )
        }
        disabled={submitting}
        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 disabled:bg-stone-100"
      >
        <option value="rent">Rent</option>
        <option value="advance">Advance</option>
        <option value="deposit">Deposit</option>
        <option value="other">Other</option>
      </select>
    </div>

    {/* Payment Method */}
    <div className="mb-5">
      <label
        htmlFor="paymentMethod"
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        Payment Method
      </label>

      <select
        id="paymentMethod"
        value={paymentMethod}
        onChange={(event) =>
          setPaymentMethod(
            event.target.value as PaymentMethod
          )
        }
        disabled={submitting}
        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 disabled:bg-stone-100"
      >
        <option value="cash">Cash</option>
        <option value="upi">UPI</option>
        <option value="card">Card</option>
        <option value="bank_transfer">
          Bank Transfer
        </option>
      </select>
    </div>

    {/* Payment Date */}
    <div className="mb-5">
      <label
        htmlFor="paymentDate"
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        Payment Date
      </label>

      <input
        id="paymentDate"
        type="date"
        value={paymentDate}
        onChange={(event) =>
          setPaymentDate(event.target.value)
        }
        disabled={submitting}
        className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 disabled:bg-stone-100"
      />
    </div>

    {/* Notes */}
    <div className="mb-6">
      <label
        htmlFor="notes"
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        Notes
      </label>

      <textarea
        id="notes"
        placeholder="Optional notes..."
        value={notes}
        onChange={(event) =>
          setNotes(event.target.value)
        }
        disabled={submitting}
        rows={4}
        className="w-full resize-y rounded-lg border border-stone-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 disabled:bg-stone-100"
      />
    </div>

    {/* Actions */}
    <div className="flex flex-col-reverse gap-3 border-t border-stone-200 pt-5 sm:flex-row sm:justify-end">
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-lg border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting
          ? "Saving..."
          : "Record Payment"}
      </button>
    </div>
  </form>
  )
}