import { useState } from "react"

interface ReportFiltersProps {
  onFilterChange: (startDate?: Date, endDate?: Date) => void
}

export function ReportFilters({ onFilterChange }: ReportFiltersProps) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleApply = () => {

    setError('')

    if (startDate && endDate && startDate > endDate) {
      setError('End date must be after or equal to start date.')
      return
    }

    const start = startDate ? new Date(`${startDate}T00:00:00`) : undefined
    const end = endDate ? new Date(`${endDate}T23:59:59`) : undefined

    onFilterChange(start, end)
  }

  const handleClear = () => {
    setStartDate('')
    setEndDate('')
    setError('')
    onFilterChange(undefined, undefined)
  }

 return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                <div>
                    <label
                        htmlFor="startDate"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Start Date
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
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                    />
                </div>

                <div>
                    <label
                        htmlFor="endDate"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        End Date
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
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                    />
                </div>

                <div className="flex items-end gap-2">
                    <button
                        type="button"
                        onClick={handleApply}
                        className="rounded-lg bg-teal-700 px-4 py-2 font-medium text-white hover:bg-teal-800"
                    >
                        Apply
                    </button>

                    <button
                        type="button"
                        onClick={handleClear}
                        className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Clear
                    </button>
                </div>

            </div>

            {error && (
                <p className="mt-3 text-sm text-red-600">
                    {error}
                </p>
            )}

        </div>
    )

}