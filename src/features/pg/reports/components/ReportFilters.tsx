import { useEffect, useState } from "react"
import { Calendar, Filter, RotateCcw, RefreshCw } from "lucide-react"

interface ReportFiltersProps {
  onFilterChange: (startDate?: Date, endDate?: Date) => void
  initialStartDate?: Date
  initialEndDate?: Date
  loading?: boolean
}

function formatDateInputValue(d?: Date): string {
  if (!d || Number.isNaN(d.getTime())) return ''
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function ReportFilters({
  onFilterChange,
  initialStartDate,
  initialEndDate,
  loading = false,
}: ReportFiltersProps) {
  const [startDate, setStartDate] = useState(() => formatDateInputValue(initialStartDate))
  const [endDate, setEndDate] = useState(() => formatDateInputValue(initialEndDate))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setStartDate(formatDateInputValue(initialStartDate))
  }, [initialStartDate])

  useEffect(() => {
    setEndDate(formatDateInputValue(initialEndDate))
  }, [initialEndDate])

  const handleApply = () => {
    setError('')

    if (startDate && endDate && startDate > endDate) {
      setError('End date must be after or equal to start date.')
      return
    }

    const start = startDate ? new Date(`${startDate}T00:00:00`) : undefined
    const end = endDate ? new Date(`${endDate}T23:59:59.999`) : undefined

    onFilterChange(start, end)
  }

  const handleClear = () => {
    setStartDate('')
    setEndDate('')
    setError('')
    onFilterChange(undefined, undefined)
  }

  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-3 sm:p-3.5 shadow-2xs">
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 lg:items-end">
        <div>
          <label
            htmlFor="startDate"
            className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-500"
          >
            <Calendar className="h-3 w-3 text-neutral-400" />
            <span>Start Date</span>
          </label>

          <input
            id="startDate"
            type="date"
            value={startDate}
            max={endDate || undefined}
            onChange={(event) => {
              setStartDate(event.target.value)
              setError("")
            }}
            className="w-full rounded-lg border border-neutral-200 bg-neutral-50/50 px-2.5 py-1.5 text-xs text-neutral-800 outline-none transition-all focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/10"
          />
        </div>

        <div>
          <label
            htmlFor="endDate"
            className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-500"
          >
            <Calendar className="h-3 w-3 text-neutral-400" />
            <span>End Date</span>
          </label>

          <input
            id="endDate"
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(event) => {
              setEndDate(event.target.value)
              setError("")
            }}
            className="w-full rounded-lg border border-neutral-200 bg-neutral-50/50 px-2.5 py-1.5 text-xs text-neutral-800 outline-none transition-all focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/10"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleApply}
            disabled={loading}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-lg bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-neutral-800 transition-colors disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Filter className="h-3.5 w-3.5" />
            )}
            <span>{loading ? "Filtering..." : "Apply Filter"}</span>
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-2xs hover:bg-neutral-50 hover:border-neutral-300 transition-colors disabled:opacity-60 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 text-neutral-500" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-2.5 rounded-lg border border-red-200/80 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}