import { useCallback, useEffect, useState } from "react";
import { CreateGuestInput, Guest } from "../types/guests.types";
import { createGuest, getGuests, updateGuest } from "../services/guestService";

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

    return {
        guests,
        loading,
        error,
        addGuest,
        editGuest,
        refresh: loadGuests
    }

}