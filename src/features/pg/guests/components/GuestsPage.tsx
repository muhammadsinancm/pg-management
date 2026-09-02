import { useState } from "react"
import { useGuests } from "../hooks/useGuests"
import { CreateGuestInput, Guest } from "../types/guests.types"
import { GuestForm } from "./GuestForm"
import { GuestTable } from "./GuestTable"
import { useNavigate } from "react-router"

export function GuestsPage() {
    const navigate = useNavigate()

    const { guests, loading, error, addGuest, editGuest, removeGuest, checkOutGuest, cancelGuest } = useGuests()
    const [showForm, setShowForm] = useState(false)
    const [editingGuest, setEditingGuest] = useState<Guest | undefined>()

    async function handleSubmit(data: CreateGuestInput) {
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

    async function handleCheckOut(guest: Guest) {
        const confirmed = window.confirm(`Check out ${guest.fullName}`)

        if (!confirmed) {
            return
        }

        try {
            await checkOutGuest(guest)
            alert(`${guest.fullName} checked out successfully`)
        } catch (error) {
            console.error(error)
            alert('Failed to checkout guest')
        }
    }

    async function handleCancel(guest: Guest) {
        const confirmed = window.confirm(`Cancel the stay of ${guest.fullName}`)

        if (!confirmed) {
            return
        }

        try {
            await cancelGuest(guest)
            alert(`${guest.fullName}'s stay has beed cancelled`)
        } catch (error) {
            console.error(error)
            alert('Failed to cancel guest')
        }

    }

    function handleView(guest: Guest) {
        navigate(`/pg/customers/${guest.id}`)
    }

    async function handleRemove(guest: Guest) {
        if (guest.status === 'active') {
            return
        }

        const confirmed = window.confirm(`Are you sure you want to permanently remove ${guest.fullName}`)

        if (!confirmed) return

        try {
            await removeGuest(guest.id)
        } catch (error) {
            console.error(error)
            alert('failed to remove guest')
        }

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
                        Customers
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Manage PG customers and their stay details.
                    </p>

                </div>


                <button
                    onClick={() => {

                        setEditingGuest(undefined)
                        setShowForm(true)

                    }}
                    className="rounded-md bg-primary px-4 py-2 text-white"
                >
                    + Add Customers
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
                        No customers found
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Add your first customers.
                    </p>

                </div>

            ) : (

                <GuestTable

                    guests={guests}

                    onView={handleView}

                    onEdit={handleEdit}

                    onCheckOut={handleCheckOut}

                    onCancel={handleCancel}

                    onRemove={handleRemove}

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