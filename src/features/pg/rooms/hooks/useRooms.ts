import { useCallback, useEffect, useState } from "react";
import { Room } from "../types/room.types";
import { createRoom, deleteRoom, getRooms, updateRoom } from "../services/roomService";

export function useRooms() {

    const [rooms, setRooms] = useState<Room[]>([])
    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadRooms = useCallback(async () => {

        try {
            setLoading(true)
            setError(null)

            const data = await getRooms()
            setRooms(data)

        } catch (error) {
            console.error(error)
            setError('Faild to load rooms')

        } finally {
            setLoading(false)
        }

    }, [])

    useEffect(() => {
        loadRooms()
    }, [loadRooms])

    async function addRoom(room: Omit<Room, 'id'>) {
        try {

            const newRoom = await createRoom(room)
            setRooms((current) => [...current, newRoom])
            return newRoom

        } catch (error) {
            console.error(error)
            setError('Failed to create room')
            throw error
        }
    }

    async function editRoom(id: string, data: Partial<Room>) {

        try {

            const updateRooms = await updateRoom(id, data)

            setRooms((current) => current.map((room) => room.id === id ? updateRooms : room))
            return updateRooms

        } catch (error) {

            console.error(error)
            setError('Failed to update room')
            throw error
        }
    }

    async function removeRoom(id: string) {
        try {

            await deleteRoom(id)

            setRooms((current) => current.filter((room) => room.id !== id))

        } catch (error) {

            console.error(error)
            setError('Failed to delete room')
            throw error
        }
    }
    return {
        rooms, isLoading, error, addRoom, editRoom, removeRoom, reload: loadRooms
    }

}