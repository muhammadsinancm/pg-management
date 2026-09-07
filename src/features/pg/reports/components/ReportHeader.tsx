import { Download, FileText } from "lucide-react"

interface ReportHeaderProps {
    title?: string
    description?: string
    onExport?: () => void
}

export function ReportHeader({ title = 'Reports', description = 'View and analyze PG management reports', onExport }: ReportHeaderProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
                <div className="flex items-center gap-2">
                    <FileText className="h-6 w-6 text-teal-700" />

                    <h1 className="text-2xl font-bold text-gray-900">
                        {title}
                    </h1>
                </div>

                <p className="mt-1 text-sm text-gray-500">
                    {description}
                </p>
            </div>

            {onExport && (
                <button
                    type="button"
                    onClick={onExport}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-2 font-medium text-white hover:bg-teal-800"
                >
                    <Download className="h-4 w-4" />
                    Export
                </button>
            )}

        </div>
    )
}