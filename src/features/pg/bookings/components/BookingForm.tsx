import React, { FormEvent, useState } from "react"
import { CreateBookingInput } from "../types/booking.types"
import { useBranches } from "../../branches/hooks/useBranches"
import { useFloors } from "../../rooms/hooks/useFloors"
import { useRooms } from "../../rooms/hooks/useRooms"
import { useGuests } from "../../guests/hooks/useGuests"

interface BookingFormProps {
  organizationId: string
  createdBy: string
  onSubmit: (data: CreateBookingInput) => Promise<void>
  onCancel?: () => void
}

export function BookingForm({ organizationId, createdBy, onSubmit, onCancel }: BookingFormProps) {
  const [bookingNumber, setBookingNumber] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [selectedBranchId, setSelectedBranchId] = useState('')
  const [selectedFloorId, setSelectedFloorId] = useState('')
  const [selectedRoomId, setSelectedRoomId] = useState('')
  const [selectedBedId, setSelectedBedId] = useState('')
  const [checkInDate, setCheckInDate] = useState(new Date().toISOString().split('T')[0])
  const [checkOutDate, setCheckOutDate] = useState('')
  const [rentAmount, setRentAmount] = useState('')
  const [advanceAmount, setAdvanceAmount] = useState('')
  const [securityDeposit, setSecurityDeposit] = useState('')
  const [paymentStatus, setPaymentStatus] = useState<CreateBookingInput['paymentStatus']>('unpaid')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { branches } = useBranches()
  const { floors } = useFloors(selectedBranchId)
  const { rooms } = useRooms(selectedFloorId)
  const { guests } = useGuests()


  const floorList = floors.filter(room => room.branchId === selectedBranchId)
  const roomList = rooms.filter(room => room.floorId === selectedFloorId)
  const selectedRoom = rooms.find(room => room.id === selectedRoomId)
  const availableBeds = selectedRoom?.beds?.filter(bed => bed.status === 'available') ?? []
  const selectedBed = selectedRoom?.beds?.find(bed => bed.id === selectedBedId)


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setError(null)

    if (!organizationId) {
      setError('Organization ID is required.')
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
    if (!customerId) {
      setError('Customer ID is required.')
      return
    }
    if (!selectedBranchId) {
      setError('Please select a branch.')
      return
    }
    if (!selectedFloorId) {
      setError('Please select a floor.')
      return
    }
    if (!selectedRoomId) {
      setError('Please select a room.')
      return
    }
    if (selectedRoom?.beds && selectedRoom.beds.length > 0 && !selectedBedId) {
      setError('Please select an available bed.')
      return
    }


    const rent = Number(rentAmount)
    const advance = Number(advanceAmount || 0)
    const deposit = Number(securityDeposit || 0)

    if (!Number.isFinite(rent) || rent <= 0) {
      setError('Rent amount must be greater than zero.')
      return
    }

    if (!checkInDate) {
      setError('Check-in date is required.')
      return
    }
    if (checkOutDate && checkOutDate < checkInDate) {
      setError('Check-out date can not be before check-in date.')
      return
    }

    try {
      setSubmitting(true)
      const data: CreateBookingInput = {
        organizationId,
        branchId: selectedBranchId,
        floorId: selectedFloorId,
        customerId: customerId.trim(),
        roomId: selectedRoomId,
        roomNumber: selectedRoom?.roomNumber ?? '',
        bedId: selectedBed?.id ?? null,
        bedNumber: selectedBed?.bedNumber ?? null,
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

          {/* Booking Number */}

          <FormInput
            label="Booking Number"
            value={bookingNumber}
            onChange={setBookingNumber}
            placeholder="BOOK-001"
            disabled={submitting}
          />


          {/* Customer */}

          <FormSelect
            label="Customer"
            value={customerId}
            onChange={setCustomerId}
            disabled={submitting}
          >

            <option value="">
              Select Customer
            </option>

            {guests.map(
              customer => (

                <option
                  key={customer.id}
                  value={customer.id}
                >
                  {customer.fullName} - {customer.phone}
                </option>

              )
            )}

          </FormSelect>

        </div>

      </section>


      {/* Room Information */}

      <section className="rounded-xl border border-gray-200 bg-white p-6">

        <h3 className="text-lg font-semibold">
          Room Information
        </h3>


        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* Branch */}

          <FormSelect
            label="Branch"
            value={selectedBranchId}
            onChange={(value) => {

              setSelectedBranchId(
                value
              )

              setSelectedFloorId(
                ""
              )

              setSelectedRoomId(
                ""
              )

              setSelectedBedId(
                ""
              )

            }}
            disabled={submitting}
          >

            <option value="">
              Select Branch
            </option>

            {branches.map(
              branch => (

                <option
                  key={branch.id}
                  value={branch.id}
                >
                  {branch.name}
                </option>

              )
            )}

          </FormSelect>


          {/* Floor */}

          <FormSelect
            label="Floor"
            value={selectedFloorId}
            onChange={(value) => {

              setSelectedFloorId(
                value
              )

              setSelectedRoomId(
                ""
              )

              setSelectedBedId(
                ""
              )

            }}
            disabled={
              submitting ||
              !selectedBranchId
            }
          >

            <option value="">
              Select Floor
            </option>

            {floorList.map(
              floor => (

                <option
                  key={floor.id}
                  value={floor.id}
                >
                  {floor.name}
                </option>

              )
            )}

          </FormSelect>


          {/* Room */}

          <FormSelect
            label="Room"
            value={selectedRoomId}
            onChange={(value) => {

              setSelectedRoomId(
                value
              )

              setSelectedBedId(
                ""
              )

            }}
            disabled={
              submitting ||
              !selectedFloorId
            }
          >

            <option value="">
              Select Room
            </option>

            {roomList.map(
              room => (

                <option
                  key={room.id}
                  value={room.id}
                >
                  Room{" "}
                  {room.roomNumber}
                  {" - "}
                  {room.type}
                  {" - "}
                  {room.sharingType}
                </option>

              )
            )}

          </FormSelect>


          {/* Bed */}

          <FormSelect
            label="Available Bed"
            value={selectedBedId}
            onChange={setSelectedBedId}
            disabled={
              submitting ||
              !selectedRoomId
            }
          >

            <option value="">
              Select Bed
            </option>

            {availableBeds.map(
              bed => (

                <option
                  key={bed.id}
                  value={bed.id}
                >
                  {bed.bedNumber}
                </option>

              )
            )}

          </FormSelect>

        </div>


        {/* Selected Room Details */}

        {selectedRoom && (

          <div className="mt-5 rounded-lg bg-gray-50 p-4">

            <h4 className="font-medium text-gray-900">
              Selected Room
            </h4>

            <div className="mt-3 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">

              <div>
                <p className="text-gray-500">
                  Room
                </p>

                <p className="font-medium">
                  {selectedRoom.roomNumber}
                </p>
              </div>


              <div>
                <p className="text-gray-500">
                  Type
                </p>

                <p className="font-medium">
                  {selectedRoom.type}
                </p>
              </div>


              <div>
                <p className="text-gray-500">
                  Sharing
                </p>

                <p className="font-medium">
                  {selectedRoom.sharingType}
                </p>
              </div>


              <div>
                <p className="text-gray-500">
                  Rent
                </p>

                <p className="font-medium">
                  ₹
                  {selectedRoom.rent.toLocaleString(
                    "en-IN"
                  )}
                </p>
              </div>

            </div>

          </div>

        )}

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


        {/* Payment Status */}

        <div className="mt-5">

          <FormSelect
            label="Payment Status"
            value={paymentStatus}
            onChange={(value) =>
              setPaymentStatus(
                value as CreateBookingInput["paymentStatus"]
              )
            }
            disabled={submitting}
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

          </FormSelect>

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
            setNotes(
              event.target.value
            )
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
  type?: string
  disabled?: boolean
}

function FormInput({ label, value, onChange, placeholder, type = 'text', disabled }: FormInputProps) {
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
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
      />

    </div>
  )
}

interface FormSelecteProps {
  label: string
  value: string
  onChange: (value: string) => void
  disabled: boolean
  children: React.ReactNode
}

function FormSelect({ label, value, onChange, disabled, children }: FormSelecteProps) {
  return (

    <div>

      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        disabled={disabled}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 disabled:bg-gray-100"
      >

        {children}

      </select>

    </div>
  )
}