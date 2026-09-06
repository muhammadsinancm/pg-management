import { useCallback, useEffect, useState } from "react";
import { BillingSettings, BranchSettings, GeneralSettings, MealSettings, UpdateBillingSettingsInput, UpdateBranchSettingsInput, UpdateGeneralSettingsInput, UpdateMealSettingsInput } from "../types/settings.type";
import { getBillingSettings, getBranchSettings, getGeneralSettings, getMealSettings, updateBillingSettings, updateBranchSettings, updateGeneralSettings, updateMealSettings } from "../services/settingsService";

interface UseSettingsReturn {
    generalSettings: GeneralSettings | null
    branchSettings: BranchSettings | null
    billingSettings: BillingSettings | null
    mealSettings: MealSettings | null
    loading: boolean
    error: string | null
    loadGeneralSettings: () => Promise<void>
    saveGeneralSettings: (data: UpdateGeneralSettingsInput) => Promise<void>
    loadBranchSettings: () => Promise<void>
    saveBranchSettings: (data: UpdateBranchSettingsInput) => Promise<void>
    loadBillingSettings: () => Promise<void>
    saveBillingSettings: (data: UpdateBillingSettingsInput) => Promise<void>
    loadMealSettings: () => Promise<void>
    saveMealSettings: (data: UpdateMealSettingsInput) => Promise<void>
}

export function useSettings(organizationId: string, branchId?: string): UseSettingsReturn {
    const [generalSettings, setGeneralSettings] = useState<GeneralSettings | null>(null)
    const [branchSettings, setBranchSettings] = useState<BranchSettings | null>(null)
    const [billingSettings, setBillingSettings] = useState<BillingSettings | null>(null)
    const [mealSettings, setMealSettings] = useState<MealSettings | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const loadGeneralSettings = useCallback(async () => {
        if (!organizationId) {
            return
        }

        try {
            setLoading(true)
            setError(null)

            const data = await getGeneralSettings(organizationId)
            setGeneralSettings(data)

        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to load general settings')

        } finally {
            setLoading(false)
        }

    }, [organizationId])

    const saveGeneralSettings = useCallback(async (data: UpdateGeneralSettingsInput) => {
        if (!organizationId) {
            throw new Error('Organization ID os required')
        }

        try {
            setLoading(true)
            setError(null)

            await updateGeneralSettings(organizationId, data)
            await loadGeneralSettings()

        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update genral settings'
            setError(message)
            throw error

        } finally {
            setLoading(false)
        }
    }, [organizationId, loadGeneralSettings])

    const loadBranchSettings = useCallback(async () => {
        if (!branchId) {
            return
        }

        try {
            setLoading(true)
            setError(null)

            const data = await getBranchSettings(branchId)

            setBranchSettings(data)

        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to load branch settings')

        } finally {
            setLoading(false)
        }
    }, [branchId])

    const saveBranchSettings = useCallback(async (data: UpdateBranchSettingsInput) => {
        if (!branchId) {
            throw new Error('Branch ID id required')
        }

        try {
            setLoading(true)
            setError(null)

            await updateBranchSettings(branchId, data)
            await loadBranchSettings()

        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update branch settings'
            setError(message)
            throw error

        } finally {
            setLoading(false)
        }
    }, [branchId, loadBranchSettings])

    const loadBillingSettings = useCallback(async () => {
        if (!organizationId) {
            return
        }

        try {
            setLoading(true)
            setError(null)

            const data = await getBillingSettings(organizationId)

            setBillingSettings(data)

        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to load billing settings')

        } finally {
            setLoading(false)
        }
    }, [organizationId])

    const saveBillingSettings = useCallback(async (data: UpdateBillingSettingsInput) => {
        if (!organizationId) {
            throw new Error('Organization ID is required')
        }

        try {
            setLoading(true)
            setError(null)

            await updateBillingSettings(organizationId, data)
            await loadBillingSettings()

        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update settings'
            setError(message)
            throw error

        } finally {
            setLoading(false)
        }
    }, [organizationId, loadBillingSettings])

    const loadMealSettings = useCallback(async () => {
        if (!organizationId) {
            return
        }

        try {
            setLoading(true)
            setError(null)

            const data = await getMealSettings(organizationId)
            setMealSettings(data)

        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to load meal settings')

        } finally {
            setLoading(false)
        }
    }, [organizationId])

    const saveMealSettings = useCallback(async (data: UpdateMealSettingsInput) => {
        if (!organizationId) {
            throw new Error('Organization ID is required')
        }

        try {
            setLoading(true)
            setError(null)

            await updateMealSettings(organizationId, data)
            await loadBillingSettings()

        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update settings'
            setError(message)
            throw error

        } finally {
            setLoading(false)
        }
    }, [organizationId, loadBillingSettings])

    useEffect(() => {
        if (!organizationId) {
            return
        }

        loadGeneralSettings()
        loadBillingSettings()
        loadMealSettings()
    }, [organizationId, loadBillingSettings, loadBillingSettings, loadMealSettings])

    useEffect(() => {
        if (!branchId) {
            return
        }

        loadBranchSettings()
    }, [branchId, loadBranchSettings])

    return {
        generalSettings,
        branchSettings,
        billingSettings,
        mealSettings,
        loading,
        error,
        loadGeneralSettings,
        saveGeneralSettings,
        loadBranchSettings,
        saveBranchSettings,
        loadBillingSettings,
        saveBillingSettings,
        loadMealSettings,
        saveMealSettings
    }

}