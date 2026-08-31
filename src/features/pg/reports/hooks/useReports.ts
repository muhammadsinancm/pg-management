import { useCallback, useEffect, useState } from "react";
import { ReportFilters, ReportsData } from "../types/report.types";
import { getReports } from "../services/reportService";

export function useReports(filters: ReportFilters = {}) {
    const [reports, setReports] = useState<ReportsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadReports = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const data = await getReports(filters)
            setReports(data)

        } catch (error) {
            console.error('Failed to load reports', error)
            setError(error instanceof Error ? error.message : 'Failed to load reports.')

        } finally {
            setLoading(false)
        }
    }, [filters.branchId, filters.startDate, filters.endDate])

useEffect(() => {
    loadReports()
}, [loadReports])

return {
    reports, loading, error, refresh: loadReports
}

}