import { useState } from "react"
import { useGuests } from "../hooks/useGuests"
import { CreateGuestInput, Guest } from "../types/guests.types"
import { GuestForm } from "./GuestForm"
import { GuestTable } from "./GuestTable"
import { useNavigate } from "react-router"

export function GuestsPage() {
    const navigate = useNavigate()

    const { guests, loading, error, addGuest, editGuest } = useGuests()
    const [showForm, setShowForm] = useState(false)
    const [editingGuest, setEditingGuest] = useState<Guest | undefined>()

    async function handleSubmit(data: CreateGuestInput) {
        try {
            if (editingGuest) {
                await editGuest(editingGuest.id, data)
            } else {
                await addGuest(data)
            }

            setEditingGuest(undefined)
            setShowForm(false)
        } catch (error) {
            console.error(error)
            alert(editingGuest ? 'Failed to update guest' : 'Failed to add guest')
        }
    }

    function handleEdit(guest: Guest) {
        setEditingGuest(guest)
        setShowForm(true)
    }

    function handleView(guest: Guest) {
        navigate(`/pg/customers/${guest.id}`)
    }

    function handleAddGuest() {
        setEditingGuest(undefined)
        setShowForm(true)
    }

    function handleCancelForm() {
        setShowForm(false)
        setEditingGuest(undefined)
    }

    if (loading) {
        return (
            <div className="p-6">
                Loading customers...
            </div>
        )
    }

    return (
        <div className="space-y-6 p-6">

            {/* HEADER */}
            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-2xl font-semibold">
                        Guests
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Manage guest personal and contact information.
                    </p>
                </div>

                <button
                    onClick={handleAddGuest}
                    className="rounded-md bg-primary px-4 py-2 text-white"
                >
                    + Add Guest
                </button>

            </div>

            {/* ERROR */}
            {error && (
                <div className="rounded-md bg-red-50 p-4 text-red-600">
                    {error}
                </div>
            )}

            {/* TABLE */}
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
                />
            )}

            {/* FORM MODAL */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-background p-6 shadow-xl">

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold">
                                {editingGuest
                                    ? "Edit Guest"
                                    : "Add Guest"}
                            </h2>
                        </div>

                        <GuestForm
                            guest={editingGuest}
                            onSubmit={handleSubmit}
                            onCancel={handleCancelForm}
                        />

                    </div>

                </div>
            )}

        </div>
    )
}