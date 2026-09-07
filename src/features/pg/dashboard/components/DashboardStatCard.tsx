import { LucideIcon } from "lucide-react"

interface DashboardStatCardProps {
    title: string
    value: string | number
    description?: string
    icon: LucideIcon
}

export default function DashboardStatCard({title, value, description, icon: Icon}: DashboardStatCardProps) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">
                        {title}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900">
                        {value}
                    </p>

                    {description && (
                        <p className="mt-1 text-xs text-gray-500">
                            {description}
                        </p>
                    )}
                </div>

                <div className="rounded-lg bg-gray-100 p-3">
                    <Icon
                        className="h-5 w-5 text-gray-700"
                        aria-hidden="true"
                    />
                </div>
            </div>
        </div>
    )
}