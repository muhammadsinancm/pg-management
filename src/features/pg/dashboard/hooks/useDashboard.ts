import { useCallback, useEffect, useState } from "react";
import { DashboardData } from "../types/dahsboard.types";
import { getDashboardData } from "../services/dashboardService";

export function useDashboard(organizatinId: string, brnanchId?: string) {
    const [data, setData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadDashboard = useCallback(async () => {
        if (!organizatinId) {
            setError('Organization ID is required.')
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            setError(null)

            const dashboardData = await getDashboardData(organizatinId, brnanchId)
            setData(dashboardData)

        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to load dashboard.')

        } finally {
            setLoading(false)
        }
    }, [organizatinId, brnanchId])

    useEffect(() => {
        loadDashboard()
    }, [loadDashboard])

    return {
        data,
        loading,
        error,
        loadDashboard
    }

}