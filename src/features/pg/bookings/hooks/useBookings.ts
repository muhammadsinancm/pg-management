import { useCallback, useEffect, useState } from "react";
import { Booking, BookingStatus, CreateBookingInput, UpdateBookingInput } from "../types/booking.types";
import { createBooking, deleteBooking, getBooking, getBookings, updateBooking, updateBookingStatus } from "../services/bookingService";

export function useBookings() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadBookings = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const data = await getBookings()
            setBookings(data)

        } catch (error) {
            console.error('Failed to load bookings', error)
            setError(error instanceof Error ? error.message : 'Failed to load bookings.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadBookings()
    }, [loadBookings])


    const addBooking = async (input: CreateBookingInput) => {
        await createBooking(input)
        await loadBookings()
    }

    const editBooking = async (id: string, input: UpdateBookingInput) => {
        await updateBooking(id, input)
        await loadBookings()
    }

    const removeBooking = async (id: string) => {
        await deleteBooking(id)
        await loadBookings()
    }

    const findBooking = async (id: string) => {
        return getBooking(id)
    }

    async function changeBookingStatus(bookingId: string, status: BookingStatus) {
        await updateBookingStatus(bookingId, status)
        await loadBookings()
    }

    return {
        bookings, loading, error, reload: loadBookings, addBooking, editBooking, removeBooking, findBooking, changeBookingStatus
    }
}