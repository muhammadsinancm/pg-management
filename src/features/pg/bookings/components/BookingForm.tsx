import { FormEvent, useState } from "react"
import { CreateBookingInput } from "../types/booking.types"

interface BookingFormProps {
    branchId: string
    organizationId: string
    createdBy: string
    onSubmit: (data: CreateBookingInput) => Promise<void>
    onCancel?: () => void
}

export function BookingForm({branchId, organizationId, createdBy, onSubmit, onCancel}: BookingFormProps) {
    const [bookingNumber, setBookingNumber] = useState('')
    const [customerId, setCustomerId] = useState('')
    const [roomId, setRoomId] = useState('')
    const [roomNumber, setRoomNumber] = useState('')
    const [bedId, setBedId] = useState('')
    const [bedNumber, setBedNumber] = useState('')
    const [checkInDate, setCheckInDate] = useState(new Date().toISOString().split('T')[0])
    const [checkOutDate, setCheckOutDate] = useState('')
    const [rentAmount, setRentAmount] = useState('')
    const [advanceAmount, setAdvanceAmount] = useState('')
    const [securityDeposit, setSecurityDeposit] = useState('')
    const [paymentStatus, setPaymentStatus] = useState<CreateBookingInput['paymentStatus']>('unpaid')
    const [notes, setNotes] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        setError(null)

        if (!organizationId) {
            setError('Organization ID is required.')
            return
        }

        if (!branchId) {
            setError('Branch ID is required.')
            return
        }

        if (!createdBy) {
            setError('User information is required.')
            return
        }
        if (!bookingNumber.trim()) {
            setError('Booking number is required.')
            return
        }
        if (!customerId.trim()) {
            setError('Customer ID is required.')
            return
        }
        if (!roomId.trim()) {
            setError('Room ID is required.')
            return
        }
        if (!roomNumber.trim()) {
            setError('Room number is required.')
            return
        }
        
        const rent = Number(rentAmount)
        const advance = Number(advanceAmount || 0)
        const deposit = Number(securityDeposit || 0)

        if (!Number.isFinite(rent) || rent <= 0) {
            setError('Rent amount must be greater than zero.')
            return
        }

        try {
            setSubmitting(true)
            const data: CreateBookingInput = {
                organizationId,
                branchId,
                customerId: customerId.trim(),
                roomId: roomId.trim(),
                roomNumber: roomNumber.trim(),
                bedId: bedId.trim() ? bedId.trim() : null,
                bedNumber: bedNumber.trim() ? bedNumber.trim() : null,
                bookingNumber: bookingNumber.trim(),
                checkInDate: new Date(`${checkInDate}T00:00:00`),
                checkOutDate: checkOutDate ? new Date(`${checkOutDate}T00:00:00`) : null,
                status: 'confirmed',
                rentAmount: rent,
                advanceAmount: advance,
                securityDeposit: deposit,
                paymentStatus,
                notes: notes.trim(),
                createdBy
            }

            await onSubmit(data)

        } catch (error) {
            console.error('Failed to create booking.', error)
            setError(error instanceof Error ? error.message : 'Failed to create booking.')

        } finally {
            setSubmitting(false)
        }
    }

    return (
         <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Create Booking
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Create a new PG room booking.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Booking Information */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold">
          Booking Information
        </h3>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">

          <FormInput
            label="Booking Number"
            value={bookingNumber}
            onChange={setBookingNumber}
            placeholder="BOOK-001"
            disabled={submitting}
          />

          <FormInput
            label="Customer ID"
            value={customerId}
            onChange={setCustomerId}
            placeholder="Customer ID"
            disabled={submitting}
          />

        </div>
      </section>

      {/* Room */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold">
          Room Information
        </h3>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">

          <FormInput
            label="Room ID"
            value={roomId}
            onChange={setRoomId}
            placeholder="Room ID"
            disabled={submitting}
          />

          <FormInput
            label="Room Number"
            value={roomNumber}
            onChange={setRoomNumber}
            placeholder="101"
            disabled={submitting}
          />

          <FormInput
            label="Bed ID"
            value={bedId}
            onChange={setBedId}
            placeholder="Optional"
            disabled={submitting}
          />

          <FormInput
            label="Bed Number"
            value={bedNumber}
            onChange={setBedNumber}
            placeholder="B1"
            disabled={submitting}
          />

        </div>
      </section>

      {/* Dates */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold">
          Booking Dates
        </h3>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">

          <FormInput
            label="Check In Date"
            type="date"
            value={checkInDate}
            onChange={setCheckInDate}
            disabled={submitting}
          />

          <FormInput
            label="Check Out Date"
            type="date"
            value={checkOutDate}
            onChange={setCheckOutDate}
            disabled={submitting}
          />

        </div>
      </section>

      {/* Financial */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold">
          Financial Information
        </h3>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">

          <FormInput
            label="Rent Amount"
            type="number"
            value={rentAmount}
            onChange={setRentAmount}
            placeholder="8000"
            disabled={submitting}
          />

          <FormInput
            label="Advance Amount"
            type="number"
            value={advanceAmount}
            onChange={setAdvanceAmount}
            placeholder="3000"
            disabled={submitting}
          />

          <FormInput
            label="Security Deposit"
            type="number"
            value={securityDeposit}
            onChange={setSecurityDeposit}
            placeholder="5000"
            disabled={submitting}
          />

        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Payment Status
          </label>

          <select
            value={paymentStatus}
            onChange={(event) =>
              setPaymentStatus(
                event.target.value as CreateBookingInput["paymentStatus"]
              )
            }
            disabled={submitting}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-teal-600 md:w-1/3"
          >
            <option value="unpaid">
              Unpaid
            </option>

            <option value="partial">
              Partial
            </option>

            <option value="paid">
              Paid
            </option>
          </select>
        </div>
      </section>

      {/* Notes */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Notes
        </label>

        <textarea
          rows={4}
          value={notes}
          onChange={(event) =>
            setNotes(event.target.value)
          }
          disabled={submitting}
          placeholder="Optional notes..."
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
        />
      </section>

      {/* Actions */}
      <div className="flex justify-end gap-3">

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? "Creating..."
            : "Create Booking"}
        </button>

      </div>
    </form>
    )
}

interface FormInputProps {
    label: string
    value: string
    onChange: (value: string) => void
    placeholder?: string
    type?:string
    disabled?: boolean
}

function FormInput({label, value, onChange, placeholder, type = 'text', disabled}: FormInputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
      />
    </div>
  )
}