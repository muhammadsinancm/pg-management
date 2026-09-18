import { useCallback, useEffect, useState } from "react";
import { DashboardData } from "../types/dahsboard.types";
import { getDashboardData } from "../services/dashboardService";

export function useDashboard(organizationId: string, branchId?: string) {
    const [data, setData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadDashboard = useCallback(async () => {
        if (!organizationId) {
            setError('Organization ID is required.')
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            setError(null)

            const dashboardData = await getDashboardData(organizationId, branchId)
            setData(dashboardData)

        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to load dashboard.')

        } finally {
            setLoading(false)
        }
    }, [organizationId, branchId])

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