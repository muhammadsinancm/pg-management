import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Guest } from "../types/guests.types";
import { getGuest, updateGuest } from "../services/guestService";

export function GuestDetailsPage() {
  const { guestId } = useParams<{ guestId: string }>()
  const navigate = useNavigate()

  const [guest, setGuest] = useState<Guest | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadGuest() {
      if (!guestId) {
        setError('Guest ID is missing')
        return
      }

      try {
        setLoading(true)
        setError(null)

        const data = await getGuest(guestId)
        setGuest(data)

      } catch (error) {
        console.error('Failed to load guest', error)
        setError('Failed to load guest details')

      } finally {
        setLoading(false)
      }

    }

    loadGuest()
  }, [guestId])

  async function handleCheckOut() {
    if (!guest) {
      return
    }

    const confirmed = window.confirm(`Are you sure you want to check out ${guest.fullName}`)
    if (!confirmed) {
      return
    }

    try {
      setActionLoading(true)

      const today = new Date().toISOString().split('T')[0]

      await updateGuest(guest.id, {
        status: 'checked_out',
        actualCheckOutDate: today
      })

      setGuest({
        ...guest,
        status: 'checked_out',
        actualcheckOutDate: today
      })

    } catch (error) {
      console.error('Checkout failed', error)
      alert('Faild to check out guest')

    } finally {
      setActionLoading(false)
    }

  }

  async function handleCancel() {
    if (!guest) {
      return
    }

    const confirmed = window.confirm(`Are you sure you want to cancel ${guest.fullName}`)
    if (!confirmed) {
      return
    }

    try {
      setActionLoading(true)
      await updateGuest(guest.id, {
        status: 'cancelled',
      })

      setGuest({
        ...guest,
        status: 'cancelled'
      })

    } catch (error) {
      console.error('Cancel failed', error)
      alert('Failed to cancel guest')

    } finally {
      setActionLoading(false)
    }

  }

  if (loading) {
    return (

      <div className="p-6">

        <div className="rounded-xl border p-8 text-center">

          Loading guest details...

        </div>

      </div>

    )

  }

  if (error || !guest) {
    return (

      <div className="space-y-4 p-6">

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-md border px-4 py-2"
        >
          ← Back
        </button>

        <div className="rounded-xl border p-8 text-center text-red-600">

          {error || "Guest not found"}

        </div>

      </div>

    )
  }

  return (

    <div className="space-y-6 p-6">

      {/* ================================= */}
      {/* Header */}
      {/* ================================= */}

      <div className="flex items-start justify-between">

        <div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-4 text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Guests
          </button>

          <h1 className="text-2xl font-semibold">
            {guest.fullName}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Guest details and stay information
          </p>

        </div>


        {/* Status */}

        <StatusBadge status={guest.status} />

      </div>


      {/* ================================= */}
      {/* Action Buttons */}
      {/* ================================= */}

      {guest.status === "active" && (

        <div className="flex justify-end gap-3">

          <button
            type="button"
            onClick={handleCancel}
            disabled={actionLoading}
            className="rounded-md border border-red-300 px-4 py-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            {actionLoading
              ? "Processing..."
              : "Cancel Guest"}
          </button>


          <button
            type="button"
            onClick={handleCheckOut}
            disabled={actionLoading}
            className="rounded-md bg-primary px-4 py-2 text-white disabled:opacity-50"
          >
            {actionLoading
              ? "Processing..."
              : "Check Out"}
          </button>

        </div>

      )}


      {/* ================================= */}
      {/* Personal Information */}
      {/* ================================= */}

      <div className="rounded-xl border p-5">

        <h2 className="mb-6 text-lg font-semibold">
          Personal Information
        </h2>


        <div className="grid grid-cols-2 gap-6">

          <DetailItem
            label="Full Name"
            value={guest.fullName}
          />

          <DetailItem
            label="Phone"
            value={guest.phone}
          />

          <DetailItem
            label="Email"
            value={guest.email}
          />

          <DetailItem
            label="Gender"
            value={formatGender(guest.gender)}
          />

        </div>

      </div>


      {/* ================================= */}
      {/* Identification */}
      {/* ================================= */}

      <div className="rounded-xl border p-5">

        <h2 className="mb-6 text-lg font-semibold">
          Identification
        </h2>


        <div className="grid grid-cols-2 gap-6">

          <DetailItem
            label="ID Type"
            value={formatIdType(guest.idType)}
          />

          <DetailItem
            label="ID Number"
            value={guest.idNumber}
          />

        </div>

      </div>


      {/* ================================= */}
      {/* Address */}
      {/* ================================= */}

      <div className="rounded-xl border p-5">

        <h2 className="mb-6 text-lg font-semibold">
          Address
        </h2>


        <div className="space-y-5">

          <DetailItem
            label="Address"
            value={guest.address}
          />


          <div className="grid grid-cols-3 gap-6">

            <DetailItem
              label="City"
              value={guest.city}
            />

            <DetailItem
              label="State"
              value={guest.state}
            />

            <DetailItem
              label="Pincode"
              value={guest.pincode}
            />

          </div>

        </div>

      </div>


      {/* ================================= */}
      {/* Accommodation */}
      {/* ================================= */}

      <div className="rounded-xl border p-5">

        <h2 className="mb-6 text-lg font-semibold">
          Accommodation
        </h2>


        <div className="grid grid-cols-3 gap-6">

          <DetailItem
            label="Floor"
            value={
              guest.floorName
                ? `${guest.floorName}${guest.floorNumber !== undefined
                  ? ` (${guest.floorNumber})`
                  : ""
                }`
                : guest.floorNumber !== undefined
                  ? `Floor ${guest.floorNumber}`
                  : undefined
            }
          />


          <DetailItem
            label="Room"
            value={
              guest.roomNumber
                ? `Room ${guest.roomNumber}`
                : undefined
            }
          />


          <DetailItem
            label="Bed"
            value={
              guest.bedNumber
                ? `Bed ${guest.bedNumber}`
                : undefined
            }
          />

        </div>

      </div>


      {/* ================================= */}
      {/* Stay Information */}
      {/* ================================= */}

      <div className="rounded-xl border p-5">

        <h2 className="mb-6 text-lg font-semibold">
          Stay Information
        </h2>


        <div className="grid grid-cols-3 gap-6">

          {/* Check In */}

          <DetailItem
            label="Check In"
            value={guest.checkInDate}
          />


          {/* Expected Check Out */}

          <DetailItem
            label="Expected Check Out"
            value={guest.expectedCheckOutDate}
          />


          {/* Actual Check Out */}

          <DetailItem
            label="Actual Check Out"
            value={guest.actualcheckOutDate}
          />

        </div>

      </div>


      {/* ================================= */}
      {/* Emergency Contact */}
      {/* ================================= */}

      <div className="rounded-xl border p-5">

        <h2 className="mb-6 text-lg font-semibold">
          Emergency Contact
        </h2>


        {guest.emergencyContact ? (

          <div className="grid grid-cols-3 gap-6">

            <DetailItem
              label="Name"
              value={
                guest.emergencyContact.name
              }
            />

            <DetailItem
              label="Phone"
              value={
                guest.emergencyContact.phone
              }
            />

            <DetailItem
              label="Relationship"
              value={
                guest.emergencyContact.relation
              }
            />

          </div>

        ) : (

          <p className="text-sm text-muted-foreground">
            No emergency contact provided.
          </p>

        )}

      </div>


      {/* ================================= */}
      {/* Notes */}
      {/* ================================= */}

      <div className="rounded-xl border p-5">

        <h2 className="mb-4 text-lg font-semibold">
          Notes
        </h2>


        {guest.notes ? (

          <p className="whitespace-pre-wrap text-sm">
            {guest.notes}
          </p>

        ) : (

          <p className="text-sm text-muted-foreground">
            No notes added.
          </p>

        )}

      </div>


      {/* ================================= */}
      {/* Footer Actions */}
      {/* ================================= */}

      <div className="flex justify-between border-t pt-6">

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-md border px-4 py-2"
        >
          ← Back
        </button>


        {guest.status === "active" && (

          <div className="flex gap-3">

            <button
              type="button"
              onClick={handleCancel}
              disabled={actionLoading}
              className="rounded-md border border-red-300 px-4 py-2 text-red-600 disabled:opacity-50"
            >
              Cancel Guest
            </button>


            <button
              type="button"
              onClick={handleCheckOut}
              disabled={actionLoading}
              className="rounded-md bg-primary px-4 py-2 text-white disabled:opacity-50"
            >
              Check Out
            </button>

          </div>

        )}

      </div>

    </div>

  )
}

interface DetailItemProps {
  label: string
  value?: string | number
}

function DetailItem({ label, value }: DetailItemProps) {
  return (

    <div>

      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium">
        {value ?? "-"}
      </p>

    </div>

  )
}

function StatusBadge({ status }: {
  status: Guest['status']
}) {
  const styles = {
    active: "bg-green-100 text-green-700",
    checked_out: "bg-blue-100 text-blue-700",
    cancelled: "bg-red-100 text-red-700"
  }

  const labels = {
    active: 'Active',
    checked_out: 'Checked Out',
    cancelled: 'Cancelled'
  }

   return (

        <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${styles[status]}`}
        >
            {labels[status]}
        </span>

    )
}

function formatGender(gender?: Guest['gender']) {
  if (!gender) {
    return undefined
  }

  return gender.charAt(0).toUpperCase() + gender.slice(1)
}

function formatIdType(idType?: Guest['idType']) {
  if (!idType) {
     return undefined
  }

  const labels: Record<string, string> = {
    aadhar: 'AAdhar',
    passport: 'Passport',
    driving_license: 'Driving License',
    voter_id: 'Voter ID',
    other: 'Other'
  }

  return labels[idType] ?? idType
}