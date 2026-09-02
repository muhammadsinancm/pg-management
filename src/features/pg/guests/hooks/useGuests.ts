import { useCallback, useEffect, useState } from "react";
import { CreateGuestInput, Guest } from "../types/guests.types";
import { cancelGuest, checkOutGuest, createGuest, deleteGuest, getGuests, updateGuest } from "../services/guestService";

export function useGuests() {
    const [guests, setGuests] = useState<Guest[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadGuests = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const data = await getGuests()
            setGuests(data)

        } catch (error) {
            console.error(error)
            setError('Failed to load guests')

        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadGuests()
    }, [loadGuests])

    async function addGuest(data: CreateGuestInput) {
        await createGuest(data)
        await loadGuests()
    }

    async function editGuest(guestId: string, data: Partial<CreateGuestInput>) {
        await updateGuest(guestId, data)
        await loadGuests()
    }

    async function removeGuest(guestId: string) {
        await deleteGuest(guestId)
        await loadGuests()
    }

    async function handleCheckOut(guest: Guest) {
        await checkOutGuest(guest)
        await loadGuests()
    }

    async function handleCancel(guest: Guest) {
        await cancelGuest(guest)
        await loadGuests()
    }

    return {
        guests,
        loading,
        error,
        addGuest,
        editGuest,
        removeGuest,
        checkOutGuest: handleCheckOut,
        cancelGuest: handleCancel,
        refresh: loadGuests
    }

}