import type { LucideIcon } from "lucide-react";

interface ReportCardProps {
    title: string
    value: string | number
    description?: string
    icon?: LucideIcon
}

export function ReportCard({ title, value, description, icon: Icon }: ReportCardProps) {
    return (
        <div className="flex min-h-[76px] sm:min-h-[82px] items-center justify-between rounded-2xl border border-neutral-100 bg-white px-3.5 py-2.5 shadow-2xs transition-all hover:border-neutral-200 sm:px-4 sm:py-3">
            <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-neutral-500">
                    {title}
                </p>

                <p className="mt-0.5 truncate text-xl font-bold tracking-tight text-neutral-900 leading-tight sm:text-2xl">
                    {value}
                </p>

                {description && (
                    <p className="mt-0.5 truncate text-[11px] text-neutral-400">
                        {description}
                    </p>
                )}
            </div>

            {Icon && (
                <div className="ml-2.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-neutral-100/90 text-neutral-400 sm:h-9 sm:w-9">
                    <Icon className="h-4 w-4 text-neutral-500" strokeWidth={1.75} />
                </div>
            )}
        </div>
    )
}