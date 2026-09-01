import { useState } from "react"
import { useGuests } from "../hooks/useGuests"
import { Guest } from "../types/guests.types"
import { GuestForm } from "./GuestForm"
import { GuestTable } from "./GuestTable"
import { GuestDetails } from "./GuestDetails"

export function GuestsPage() {
    const branchId = 'branch-001'
    const { guests, loading, error, addGuest, editGuest, removeGuest } = useGuests(branchId)
    const [showForm, setShowForm] = useState(false)
    const [editingGuest, setEditingGuest] = useState<Guest | undefined>()
    const [viewingGuest, setViewingGuest] = useState<Guest | undefined>()

    async function handleSubmit(data: any) {
        if (editingGuest) {
            await editGuest(editingGuest.id, data)
        } else {
            await addGuest(data)
        }

        setEditingGuest(undefined)
        setShowForm(false)
    }

    function handleEdit(guest: Guest) {
        setEditingGuest(guest)
        setShowForm(true)
    }

    async function handleDelete(guest: Guest) {
        const confirmed = window.confirm(`Delete ${guest.fullName}`)
        if (!confirmed) {
            return
        }
        await removeGuest(guest.id)
    }

    function handleView(guest: Guest) {
        setViewingGuest(guest)
    }

    if (loading) {
        return (
            <div className="p-6">
                Loading guests...
            </div>
        )
    }

    if (viewingGuest) {
        return (
            <GuestDetails
                guest={viewingGuest}
                onBack={() => {
                    setViewingGuest(undefined)
                }}
                onEdit={(guest) => {

                    setViewingGuest(undefined)

                    setEditingGuest(guest)

                    setShowForm(true)
                }}
            />
        )
    }

return (

        <div className="space-y-6 p-6">

            {/* Header */}

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-2xl font-semibold">
                        Guests
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Manage PG guests and their stay details.
                    </p>

                </div>


                <button
                    type="button"
                    onClick={() => {

                        setEditingGuest(undefined)

                        setShowForm(true)
                    }}
                    className="rounded-md bg-primary px-4 py-2 text-white"
                >
                    + Add Guest
                </button>

            </div>


            {/* Error */}

            {error && (

                <div className="rounded-md bg-red-50 p-4 text-red-600">
                    {error}
                </div>

            )}


            {/* Guest Table */}

            {!guests.length ? (

                <div className="rounded-xl border border-dashed p-10 text-center">

                    <h2 className="font-medium">
                        No guests found
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Add your first guest.
                    </p>

                </div>

            ) : (

                <GuestTable
                    guests={guests}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

            )}


            {/* Guest Form Modal */}

            {showForm && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-background p-6 shadow-xl">

                        <div className="mb-6 flex items-center justify-between">

                            <div>

                                <h2 className="text-xl font-semibold">
                                    {editingGuest
                                        ? 'Edit Guest'
                                        : 'Add Guest'}
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Enter guest information and accommodation.
                                </p>

                            </div>

                        </div>


                        <GuestForm
                            branchId={branchId}
                            guest={editingGuest}
                            onSubmit={handleSubmit}
                            onCancel={() => {

                                setShowForm(false)

                                setEditingGuest(undefined)
                            }}
                        />

                    </div>

                </div>

            )}

        </div>
    )
}