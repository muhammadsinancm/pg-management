import { Download, FileText, RefreshCw } from "lucide-react"

interface ReportHeaderProps {
    title?: string
    description?: string
    onExport?: () => void
    onRefresh?: () => void
    loading?: boolean
}

export function ReportHeader({
    title = 'Reports',
    description = 'View and analyze PG management reports.',
    onExport,
    onRefresh,
    loading = false,
}: ReportHeaderProps) {
    return (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between py-0.5">
            <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700 sm:h-9 sm:w-9">
                    <FileText className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-neutral-700" />
                </div>
                <div className="min-w-0">
                    <h1 className="text-lg font-bold tracking-tight text-neutral-900 sm:text-xl">
                        {title}
                    </h1>
                    <p className="text-[11px] font-normal text-neutral-500 sm:text-xs">
                        {description}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                {onExport && (
                    <button
                        type="button"
                        onClick={onExport}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-neutral-700 shadow-2xs transition-colors hover:bg-neutral-50 hover:border-neutral-300 sm:px-3 sm:text-xs cursor-pointer"
                    >
                        <Download className="h-3.5 w-3.5 text-neutral-500" />
                        <span>Export</span>
                    </button>
                )}

                {onRefresh && (
                    <button
                        type="button"
                        onClick={onRefresh}
                        disabled={loading}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-neutral-700 shadow-2xs transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-xs cursor-pointer"
                    >
                        <RefreshCw
                            className={`h-3.5 w-3.5 ${
                                loading ? "animate-spin text-neutral-400" : "text-neutral-500"
                            }`}
                        />
                        <span>{loading ? "Refreshing..." : "Refresh"}</span>
                    </button>
                )}
            </div>
        </div>
    )
}