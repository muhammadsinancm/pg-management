import {
    Wallet,
    Receipt,
    CalendarCheck,
    DoorOpen,
    Building2,
    BedDouble,
    Wrench,
    BarChart3,
} from "lucide-react";
import type { ReportSummaryData } from "../types/report.types";
import { ReportCard } from "./ReportCard";

interface ReportSummaryProps {
    summary: ReportSummaryData;
}

export function ReportSummary({ summary }: ReportSummaryProps) {
    const occupancyRate = summary.occupancyRate ?? (summary.totalRooms > 0 ? (summary.occupiedRooms / summary.totalRooms) * 100 : 0);

    return (
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-4">
            <ReportCard
                title="Total Revenue"
                value={`₹${summary.totalRevenue.toLocaleString("en-IN")}`}
                icon={Wallet}
            />

            <ReportCard
                title="Total Payments"
                value={summary.totalPayments}
                icon={Receipt}
            />

            <ReportCard
                title="Total Bookings"
                value={summary.totalBookings}
                icon={CalendarCheck}
            />

            <ReportCard
                title="Occupancy Rate"
                value={`${occupancyRate.toFixed(1)}%`}
                icon={BarChart3}
            />

            <ReportCard
                title="Total Rooms"
                value={summary.totalRooms}
                icon={DoorOpen}
            />

            <ReportCard
                title="Occupied Rooms"
                value={summary.occupiedRooms}
                icon={Building2}
            />

            <ReportCard
                title="Available Rooms"
                value={summary.availableRooms}
                icon={BedDouble}
            />

            <ReportCard
                title="Maintenance Rooms"
                value={summary.maintenanceRooms}
                icon={Wrench}
            />
        </div>
    );
}