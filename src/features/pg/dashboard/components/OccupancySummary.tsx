import { OccupancyData } from "../types/dahsboard.types";

interface OccupancySummarayProps {
    occupancy: OccupancyData
}

export default function OccupancySummary({ occupancy }: OccupancySummarayProps) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5">
                <h2 className="text-lg font-semibold text-gray-900">
                    Occupancy
                </h2>

                <p className="text-sm text-gray-500">
                    Current room occupancy
                </p>
            </div>

            <div className="flex items-center gap-5">
                <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-8 border-gray-200">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">
                            {occupancy.occupancyPercentage}%
                        </p>

                        <p className="text-xs text-gray-500">
                            Occupied
                        </p>
                    </div>
                </div>

                <div className="flex-1 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                            Total Rooms
                        </span>

                        <span className="font-medium text-gray-900">
                            {occupancy.totalRooms}
                        </span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                            Occupied
                        </span>

                        <span className="font-medium text-gray-900">
                            {occupancy.occupiedRooms}
                        </span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                            Vacant
                        </span>

                        <span className="font-medium text-gray-900">
                            {occupancy.vacantRooms}
                        </span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                            Maintenance
                        </span>

                        <span className="font-medium text-gray-900">
                            {occupancy.maintenanceRooms}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}