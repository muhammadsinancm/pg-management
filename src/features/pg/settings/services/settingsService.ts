import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore"
import { BillingSettings, BranchSettings, GeneralSettings, MealSettings, UpdateBillingSettingsInput, UpdateBranchSettingsInput, UpdateGeneralSettingsInput, UpdateMealSettingsInput } from "../types/settings.type"
import { firestoreDb } from "@/services/firebase/config"

const SETTINGS_COLLECTION = 'settings'

const removeUndefined = <T extends object>(
    data: T
): Partial<T> => {
    return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined)) as Partial<T>
}

export const getGeneralSettings = async (organizationId: string): Promise<GeneralSettings | null> => {
    if (!organizationId) {
        throw new Error('Organization ID is required')
    }

    const settingsRef = doc(firestoreDb, SETTINGS_COLLECTION, organizationId)
    const snapshot = await getDoc(settingsRef)

    if (!snapshot.exists()) {
        return null
    }

    const data = snapshot.data()

    return {
        organizationId,
        organizationName: data.organizationName ?? '',
        email: data.email,
        phone: data.phone,
        address: data.address,
        logoUrl: data.logoUrl,
        currency: data.currency ?? 'INR',
        timezone: data.timezone ?? 'Asia/kolkata',
        dateFormat: data.dateFormat ?? 'DD/MM/YYYY',
        timeFormat: data.timeFormat ?? '12-hour',
        theme: data.theme ?? 'system'
    }
}

export const updateGeneralSettings = async (organizationId: string, data: UpdateGeneralSettingsInput): Promise<void> => {
    if (!organizationId) {
        throw new Error('Organization ID is required')
    }

    const cleanedData = removeUndefined(data)

    const settingsRef = doc(firestoreDb, SETTINGS_COLLECTION, organizationId)

    await setDoc(settingsRef,
        {
            ...cleanedData,
            updatedAt: Timestamp.now()
        },
        { merge: true }
    )
}

export const getBranchSettings = async (branchId: string): Promise<BranchSettings | null> => {
    if (!branchId) {
        throw new Error('Branch ID is required')
    }

    const branchRef = doc(firestoreDb, 'branches', branchId)
    const snapshot = await getDoc(branchRef)

    if (!snapshot.exists()) {
        return null
    }

    const data = snapshot.data()

    return {
        branchId,
        branchName: data.branchName ?? data.name ?? '',
        address: data.address,
        phone: data.phone,
        email: data.email,
        managerName: data.managerName
    }
}

export const updateBranchSettings = async (branchId: string, data: UpdateBranchSettingsInput): Promise<void> => {
    if (!branchId) {
        throw new Error('Branch ID is required')
    }

    const cleanedData = removeUndefined(data)
    const branchRef = doc(firestoreDb, 'branches', branchId)

    await setDoc(branchRef,
        {
            ...cleanedData,
            updatedAt: Timestamp.now()
        },
        { merge: true }
    )
}

export const getBillingSettings = async (organizationId: string): Promise<BillingSettings | null> => {
    if (!organizationId) {
        throw new Error('Organization ID is required')
    }

    const settingsRef = doc(firestoreDb, SETTINGS_COLLECTION, organizationId)
    const snapshot = await getDoc(settingsRef)

    if (!snapshot.exists()) {
        return null
    }

    const data = snapshot.data()

    return {
        organizationId,
        invoicePrefix: data.invoicePrefix ?? 'INV',
        invoiceStartingNumber: data.invoiceStartingNumber ?? 1,
        paymentDueDays: data.paymentDueDays ?? 7,
        lateFeeEnabled: data.lateFeeEnabled.lateFeeEnabled ?? false,
        lateFeeAmount: data.lateFeeAmount,
        taxEnabled: data.taxEnabled ?? false,
        taxPercentage: data.taxPercentage
    }
}

export const updateBillingSettings = async (organizationId: string, data: UpdateBillingSettingsInput): Promise<void> => {
    if (!organizationId) {
        throw new Error('Organization ID is required')
    }

    const cleanedData = removeUndefined(data)
    const settingsRef = doc(firestoreDb, SETTINGS_COLLECTION, organizationId)

    await setDoc(settingsRef,
        {
            ...cleanedData,
            updatedAt: Timestamp.now()
        },
        { merge: true }
    )
}

export const getMealSettings = async (organizationId: string): Promise<MealSettings | null> => {
    if (!organizationId) {
        throw new Error('Organization ID is required')
    }

    const settingsRef = doc(firestoreDb, SETTINGS_COLLECTION, organizationId)
    const snapshot = await getDoc(settingsRef)

    if (!snapshot.exists()) {
        return null
    }

    const data = snapshot.data()

    return {
        organizationId,
        breakfastEnabled: data.breakfastEnabled ?? true,
        lunchEnabled: data.lunchEnabled ?? true,
        dinnerEnabled: data.dinnerEnabled ?? true,
        snacksEnabled: data.snacksEnabled ?? false,
        defaultMealPrice: data.defaultMealPrice ?? 0
    }

}

export const updateMealSettings = async (organizationId: string, data: UpdateMealSettingsInput): Promise<void> => {
    if (!organizationId) {
        throw new Error('Organization ID is required')
    }

    const cleanedData = removeUndefined(data)
    const settingsRef = doc(firestoreDb, SETTINGS_COLLECTION, organizationId)

    await setDoc(settingsRef,
        {
            ...cleanedData,
            updatedAt: Timestamp.now()
        },
        { merge: true }
    )

}