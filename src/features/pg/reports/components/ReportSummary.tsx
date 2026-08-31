import { ReportSummaryData } from "../types/report.types";
import { ReportCard } from "./ReportCard";

interface ReportSummaryProps {
    summary: ReportSummaryData
}

export function ReportSummaray({summary}: ReportSummaryProps) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

      <ReportCard
        title="Total Revenue"
        value={`₹${summary.totalRevenue.toLocaleString("en-IN")}`}
      />

      <ReportCard
        title="Total Payments"
        value={summary.totalPayments}
      />

      <ReportCard
        title="Total Bookings"
        value={summary.totalBookings}
      />

      <ReportCard
        title="Total Rooms"
        value={summary.totalRooms}
      />

      <ReportCard
        title="Occupied Rooms"
        value={summary.occupiedRooms}
      />

      <ReportCard
        title="Available Rooms"
        value={summary.availableRooms}
      />

      <ReportCard
        title="Maintenance Rooms"
        value={summary.maintenanceRooms}
      />

    </div>
    )
}