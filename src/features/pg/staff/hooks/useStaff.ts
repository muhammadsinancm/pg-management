import { useCallback, useEffect, useState } from "react";
import { CreateStaffInput, Staff } from "../types/staff.types";
import { createStaff, deleteStaff, getStaff, updateStaff } from "../services/staffService";

export function useStaff() {
    const [staff, setStaff] = useState<Staff[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadStaff = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const data = await getStaff()
            setStaff(data)

        } catch (error) {
            console.error('Failed to load staff', error)
            setError(error instanceof Error ? error.message : 'Failed to load staff')

        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadStaff()
    }, [loadStaff])

    async function addStaff(data: CreateStaffInput) {
        await createStaff(data)
        await loadStaff()
    }

    async function editStaff(staffId: string, data: Partial<CreateStaffInput>) {
        await updateStaff(staffId, data)
        await loadStaff()
    }

    async function removeStaff(staffId: string) {
        await deleteStaff(staffId)
        await loadStaff()
    }

    return {
        staff,
        loading,
        error,
        addStaff,
        editStaff,
        removeStaff,
        refresh: loadStaff
    }

}