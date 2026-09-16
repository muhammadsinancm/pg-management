import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import type { OccupancyData } from "./dashboard.types";

interface OccupancySummaryProps {
    occupancy: OccupancyData;
}

export default function OccupancySummary({
    occupancy,
}: OccupancySummaryProps) {
    const chartData = [
        {
            status: "Occupied",
            rooms: occupancy.occupiedRooms,
        },
        {
            status: "Vacant",
            rooms: occupancy.vacantRooms,
        },
        {
            status: "Maintenance",
            rooms: occupancy.maintenanceRooms,
        },
    ];

    return (
        <div className="flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-2xs">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-3.5 py-2.5 sm:px-4 sm:py-3">
                <div>
                    <h2 className="text-xs sm:text-sm font-bold text-neutral-900">
                        Occupancy Summary
                    </h2>
                    <p className="text-[10px] sm:text-[11px] text-neutral-400">
                        Current room occupancy
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-base sm:text-lg font-bold leading-none text-neutral-900">
                        {occupancy.occupancyPercentage}%
                    </p>
                    <p className="mt-0.5 text-[10px] text-neutral-400">
                        occupied
                    </p>
                </div>
            </div>

            {/* Chart */}
            <div className="px-2 pt-2 pb-1 sm:px-3">
                <div className="h-[80px] sm:h-[86px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{
                                top: 4,
                                right: 8,
                                left: -24,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid
                                vertical={false}
                                strokeDasharray="3 3"
                                stroke="#f5f5f5"
                            />

                            <XAxis
                                dataKey="status"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={4}
                                fontSize={11}
                                stroke="#525252"
                            />

                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={4}
                                allowDecimals={false}
                                fontSize={10}
                                stroke="#a3a3a3"
                            />

                            <Tooltip
                                cursor={false}
                                contentStyle={{
                                    backgroundColor: "#18181b",
                                    borderRadius: "8px",
                                    border: "none",
                                    color: "#fff",
                                    fontSize: "12px",
                                    padding: "4px 8px",
                                }}
                                itemStyle={{ color: "#fff" }}
                            />

                            <Bar
                                dataKey="rooms"
                                name="Rooms"
                                fill="#000000"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={56}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}