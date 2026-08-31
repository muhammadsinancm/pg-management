import { useCallback, useEffect, useState } from "react";
import { CreateFloorInput, Floor } from "../types/floor.types";
import { createFloor, deleteFloor, getFloors, updateFloor } from "../services/floorService";

export function useFloors() {
    const [floors, setFloors] = useState<Floor[]>([])
    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadFloors = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const data = await getFloors()

            setFloors(data)

        } catch (error) {
            console.error(error)
            setError(error instanceof Error ? error.message : 'Failed to load floors')

        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadFloors()
    }, [loadFloors])

    async function addFloor(data: CreateFloorInput) {
        try {
            const newFloor = await createFloor(data)
            setFloors(current => [...current, newFloor])
            return newFloor

        } catch (error) {
            console.error(error)
            setError(error instanceof Error ? error.message : 'Failed to create floor')
            throw error
        }
    }

    async function editFloor(id: string, data: Partial<Floor>) {
        try {
            const updatedFloor = await updateFloor(id, data)
            setFloors(current => current.map(floor => floor.id === id ? updatedFloor : floor))
            return updatedFloor

        } catch (error) {
            console.error(error)
            setError(error instanceof Error ? error.message : 'Failed to update floor')
            throw error
        }
    }

    async function removeFloor(id: string) {
        try {
            await deleteFloor(id)
            setFloors(current => current.filter(floor => floor.id !== id))
            
        } catch (error) {
            console.error(error)
            setError(error instanceof Error ? error.message : 'Failed to delete floor')
            throw error
        }
    }

    return {
        floors, isLoading, error, addFloor, editFloor, removeFloor, reload: loadFloors
    }

}