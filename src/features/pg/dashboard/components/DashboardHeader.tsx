import { RefreshCw } from "lucide-react";

interface DashboardHeaderProps {
    onRefresh: () => void;
    loading?: boolean;
}

export default function DashboardHeader({
    onRefresh,
    loading = false,
}: DashboardHeaderProps) {
    return (
        <div className="flex items-center justify-between py-0.5">
            <div className="min-w-0">
                <h1 className="text-lg font-bold tracking-tight text-neutral-900 sm:text-xl">
                    Dashboard
                </h1>

                <p className="text-[11px] text-neutral-500 font-normal sm:text-xs">
                    Overview of your PG management system.
                </p>
            </div>

            <button
                type="button"
                onClick={onRefresh}
                disabled={loading}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-neutral-700 shadow-2xs transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-xs"
            >
                <RefreshCw
                    className={`h-3.5 w-3.5 ${
                        loading
                            ? "animate-spin text-neutral-400"
                            : "text-neutral-500"
                    }`}
                />

                <span>
                    {loading ? "Refreshing..." : "Refresh"}
                </span>
            </button>
        </div>
    );
}