import { OccupancyReportData } from "../types/report.types";

interface OccupancyReportProps {
    occupancy: OccupancyReportData
}

export function OccupancyReport({ occupancy }: OccupancyReportProps) {
    return (
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-gray-900">
                Occupancy Report
            </h2>

            <div className="mt-5">

                <div className="mb-4 flex justify-between">

                    <span className="text-sm text-gray-600">
                        Occupancy Rate
                    </span>

                    <strong>
                        {occupancy.occupancyRate.toFixed(1)}%
                    </strong>

                </div>

                <div className="h-3 overflow-hidden rounded-full bg-gray-200">

                    <div
                        className="h-full rounded-full bg-teal-600"
                        style={{
                            width: `${Math.min(
                                occupancy.occupancyRate,
                                100
                            )}%`,
                        }}
                    />

                </div>

            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">

                <Stat
                    label="Total"
                    value={occupancy.totalRooms}
                />

                <Stat
                    label="Occupied"
                    value={occupancy.occupiedRooms}
                />

                <Stat
                    label="Available"
                    value={occupancy.availableRooms}
                />

                <Stat
                    label="Maintenance"
                    value={occupancy.maintenanceRooms}
                />

            </div>

        </section>

    )
}

function Stat({ label, value }: {
    label: string
    value: number
}) {
    return (
        <div className="rounded-lg bg-gray-50 p-4">

            <p className="text-sm text-gray-500">
                {label}
            </p>

            <p className="mt-1 text-xl font-bold text-gray-900">
                {value}
            </p>

        </div>
    )
}