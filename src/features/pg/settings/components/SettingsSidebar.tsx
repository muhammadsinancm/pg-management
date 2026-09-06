import { Building2, CreditCard, SettingsIcon, Utensils } from "lucide-react"

export type SettingsSection = | 'general' | 'branch' | 'billing' | 'meals'

interface SettingsSideBarProps {
    activeSection: SettingsSection
    onSectionChange: (section: SettingsSection) => void
}

const settingsItems = [
    {
        id: 'general' as const,
        label: 'Generla',
        description: 'Organization information',
        icon: SettingsIcon
    },
    {
        id: 'branch' as const,
        label: 'Branch',
        description: 'Branch information',
        icon: Building2
    },
    {
        id: 'billing' as const,
        label: 'Billing',
        description: 'Invoice and payment settings',
        icon: CreditCard
    },
    {
        id: 'meals' as const,
        label: 'Meals',
        description: 'Meal configuration',
        icon: Utensils
    }
]

export default function SettingsSidebar({ activeSection, onSectionChange }: SettingsSideBarProps) {
    return (
        <aside className="w-full rounded-xl border border-gray-200 bg-white p-2 shadow-sm lg:w-64">
            <div className="px-3 py-3">
                <h2 className="text-sm font-semibold text-gray-900">
                    Settings
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                    Manage your PG settings
                </p>
            </div>

            <nav className="space-y-1">
                {settingsItems.map((item) => {
                    const Icon = item.icon
                    const isActive =
                        activeSection === item.id

                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() =>
                                onSectionChange(item.id)
                            }
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition ${isActive
                                    ? "bg-gray-900 text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            <Icon
                                className="h-5 w-5 shrink-0"
                                strokeWidth={2}
                            />

                            <div className="min-w-0">
                                <p className="text-sm font-medium">
                                    {item.label}
                                </p>

                                <p
                                    className={`mt-0.5 truncate text-xs ${isActive
                                            ? "text-gray-300"
                                            : "text-gray-500"
                                        }`}
                                >
                                    {item.description}
                                </p>
                            </div>
                        </button>
                    )
                })}
            </nav>
        </aside>
    )

}