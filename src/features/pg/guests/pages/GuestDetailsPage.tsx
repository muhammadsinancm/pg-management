import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Guest } from "../types/guests.types";
import { getGuest, updateGuest } from "../services/guestService";
import { GuestStatusBadge } from "../components/GuestStatusBadge";

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
        setLoading(false)
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

      {/* HEADER */}
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
            Guest personal and contact information
          </p>

        </div>

        <GuestStatusBadge status={guest.status} />

      </div>

      {/* PERSONAL INFORMATION */}
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
            label="Date of Birth"
            value={guest.dateOfBirth}
          />

          <DetailItem
            label="Gender"
            value={formatGender(guest.gender)}
          />

        </div>

      </div>

      {/* IDENTIFICATION */}
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

      {/* ADDRESS */}
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

      {/* EMERGENCY CONTACT */}
      <div className="rounded-xl border p-5">

        <h2 className="mb-6 text-lg font-semibold">
          Emergency Contact
        </h2>

        {guest.emergencyContact ? (

          <div className="grid grid-cols-3 gap-6">

            <DetailItem
              label="Name"
              value={guest.emergencyContact.name}
            />

            <DetailItem
              label="Phone"
              value={guest.emergencyContact.phone}
            />

            <DetailItem
              label="Relationship"
              value={guest.emergencyContact.relation}
            />

          </div>

        ) : (

          <p className="text-sm text-muted-foreground">
            No emergency contact provided.
          </p>

        )}

      </div>

      {/* NOTES */}
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

      {/* FOOTER */}
      <div className="border-t pt-6">

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-md border px-4 py-2"
        >
          ← Back
        </button>

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