import { useCallback, useEffect, useState } from "react";
import { CreateGuestInput, Guest } from "../types/guests.types";
import { createGuest, deleteGuest, getGuests, updateGuest } from "../services/guestService";

export function useGuests(branchId: string) {
    const [guests, setGuests] = useState<Guest[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadGuests = useCallback(async () => {
        if (!branchId) {
            setGuests([])
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            setError(null)

            const data = await getGuests(branchId)
            setGuests(data)

        } catch (error) {
            console.error(error)
            setError('Failed to load guests')
        } finally {
            setLoading(false)
        }

    }, [branchId])

    useEffect(() => {
        loadGuests()
    }, [loadGuests])

    async function addGuest(data: CreateGuestInput) {
        const guest = await createGuest(data)
        setGuests((previous) => [...previous,
            guest
        ])
    }

    async function editGuest(guestId: string, data: Partial<CreateGuestInput>) {
        const updatedGuest = await updateGuest(guestId, data)
        setGuests((previous) => previous.map((guest) => guest.id === guestId ? updatedGuest : guest))

        return updatedGuest
    }

    async function removeGuest(guestId: string) {
        await deleteGuest(guestId)
        setGuests((previous) => previous.filter((guest) => guest.id !== guestId))
    }

    return {
        guests,
        loading,
        error,
        addGuest,
        editGuest,
        removeGuest,
        reload: loadGuests
    }

}