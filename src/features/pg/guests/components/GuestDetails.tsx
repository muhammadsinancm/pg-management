import { Guest } from "../types/guests.types";

interface GuestDetailsProps {
    guest: Guest
    onBack: () => void
    onEdit: (guest: Guest) => void
}

function InfoRow({ label, value }: {
    label: string
    value?: string | number | null
}) {
    return (

        <div className="flex flex-col gap-1">

            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
            </span>

            <span className="text-sm">

                {value !== undefined &&
                    value !== null &&
                    value !== ''
                    ? value
                    : '-'}

            </span>

        </div>

    )
}

function Section({ title, children }: {
    title: string
    children: React.ReactNode
}) {
    return (

        <section className="rounded-xl border bg-background p-5">

            <h2 className="mb-5 text-lg font-semibold">
                {title}
            </h2>

            {children}

        </section>

    )

}

export function GuestDetails({ guest, onBack, onEdit }: GuestDetailsProps) {
    return (

        <div className="space-y-6 p-6">


            {/* =============================== */}
            {/* HEADER */}
            {/* =============================== */}

            <div className="flex items-center justify-between">

                <div>

                    <button
                        type="button"
                        onClick={onBack}
                        className="mb-3 text-sm text-muted-foreground hover:text-foreground"
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


                <button
                    type="button"
                    onClick={() => onEdit(guest)}
                    className="rounded-md bg-primary px-4 py-2 text-sm text-white"
                >
                    Edit Guest
                </button>

            </div>


            {/* =============================== */}
            {/* STATUS */}
            {/* =============================== */}

            <div className="rounded-xl border bg-background p-5">

                <div className="flex items-center justify-between">

                    <div>

                        <p className="text-sm text-muted-foreground">
                            Guest Status
                        </p>

                        <p className="mt-1 font-medium">

                            {guest.status === 'active'
                                ? 'Active'
                                : guest.status === 'checked_out'
                                    ? 'Checked Out'
                                    : 'Cancelled'}

                        </p>

                    </div>


                    <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${guest.status === 'active'
                                ? 'bg-green-100 text-green-700'
                                : guest.status === 'checked_out'
                                    ? 'bg-gray-100 text-gray-700'
                                    : 'bg-red-100 text-red-700'
                            }`}
                    >

                        {guest.status.replace('_', ' ')}

                    </span>

                </div>

            </div>


            {/* =============================== */}
            {/* PERSONAL INFORMATION */}
            {/* =============================== */}

            <Section title="Personal Information">

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    <InfoRow
                        label="Full Name"
                        value={guest.fullName}
                    />

                    <InfoRow
                        label="Gender"
                        value={guest.gender}
                    />

                    <InfoRow
                        label="Date of Birth"
                        value={guest.dateOfBirth}
                    />

                    <InfoRow
                        label="Phone"
                        value={guest.phone}
                    />

                    <InfoRow
                        label="Email"
                        value={guest.email}
                    />

                </div>

            </Section>


            {/* =============================== */}
            {/* IDENTIFICATION */}
            {/* =============================== */}

            <Section title="Identification">

                <div className="grid gap-5 sm:grid-cols-2">

                    <InfoRow
                        label="ID Type"
                        value={guest.idType}
                    />

                    <InfoRow
                        label="ID Number"
                        value={guest.idNumber}
                    />

                </div>

            </Section>


            {/* =============================== */}
            {/* ADDRESS */}
            {/* =============================== */}

            <Section title="Address">

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    <InfoRow
                        label="Address"
                        value={guest.address}
                    />

                    <InfoRow
                        label="City"
                        value={guest.city}
                    />

                    <InfoRow
                        label="State"
                        value={guest.state}
                    />

                    <InfoRow
                        label="Pincode"
                        value={guest.pincode}
                    />

                </div>

            </Section>


            {/* =============================== */}
            {/* EMERGENCY CONTACT */}
            {/* =============================== */}

            <Section title="Emergency Contact">

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                    <InfoRow
                        label="Name"
                        value={
                            guest.emergencyContact?.name
                        }
                    />

                    <InfoRow
                        label="Phone"
                        value={
                            guest.emergencyContact?.phone
                        }
                    />

                    <InfoRow
                        label="Relationship"
                        value={
                            guest.emergencyContact?.relation
                        }
                    />

                </div>

            </Section>


            {/* =============================== */}
            {/* NOTES */}
            {/* =============================== */}

            <Section title="Notes">

                <p className="whitespace-pre-wrap text-sm text-muted-foreground">

                    {guest.notes || 'No notes added.'}

                </p>

            </Section>


        </div>

    )


}