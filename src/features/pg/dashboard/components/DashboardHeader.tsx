interface DashboardHeaderProps {
    onRefresh: () => void
    loading?: boolean
}

export default function DashboardHeader({ onRefresh, loading = false }: DashboardHeaderProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Dashboard
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Overview of your PG management system.
                </p>
            </div>

            <button
                type="button"
                onClick={onRefresh}
                disabled={loading}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {loading ? "Refreshing..." : "Refresh"}
            </button>
        </div>
    )
}