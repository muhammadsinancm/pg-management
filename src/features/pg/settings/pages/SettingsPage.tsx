import { useState } from "react";

import SettingsSidebar, { type SettingsSection, } from "../components/SettingsSidebar";
import { useSettings } from "../hooks/useSettings";
import GeneralSettings from "../components/GeneralSettings";
import BranchSettings from "../components/BranchSettings";
import MealSettings from "../components/MealSettings";
import BillingSettings from "../components/BillingSettings";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState<SettingsSection>('general')

    const {user} = useAuth()

    if (!user) {
        return (
        <div className="p-6">
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                Please login to access settings.
            </div>
        </div>
    )
    }

    const organizationId = user.organizationId
    const branchId = user.branchId

    const { generalSettings, branchSettings, billingSettings, mealSettings, loading, error, saveGeneralSettings, saveBranchSettings, saveBillingSettings, saveMealSettings } = useSettings(organizationId, branchId)

    const renderSection = () => {
        switch (activeSection) {
            case 'general':
                return (
                    <GeneralSettings
                        settings={generalSettings}
                        loading={loading}
                        onSave={saveGeneralSettings}
                    />
                )
            case 'branch':
                return (
                    <BranchSettings
                        settings={branchSettings}
                        loading={loading}
                        onSave={saveBranchSettings}
                    />
                )
            case 'billing':
                return (
                    <BillingSettings
                        settings={billingSettings}
                        loading={loading}
                        onSave={saveBillingSettings}
                    />
                )
            case 'meals':
                return (
                    <MealSettings
                        settings={mealSettings}
                        loading={loading}
                        onSave={saveMealSettings}
                    />
                )
            default: return null
        }
    }

    return (
        <div className="w-full">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Settings
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage your PG organization, branch, billing, and meal
                        settings.
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Settings Layout */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <SettingsSidebar
                            activeSection={activeSection}
                            onSectionChange={setActiveSection}
                        />
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3">
                        {renderSection()}
                    </div>
                </div>
            </div>
        </div>
    )
}