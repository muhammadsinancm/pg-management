import { BedDouble, Building2, CreditCard, DoorOpen, Receipt, Users } from "lucide-react"
import DashboardStatCard from "../components/DashboardStatCard"
import OccupancySummary from "../components/OccupancySummary"
import RecentCustomers from "../components/RecentCustomers"
import RecentPayments from "../components/RecentPayment"
import RevenueSummary from "../components/RevenueSummary"
import { useDashboard } from "../hooks/useDashboard"
import DashboardHeader from "../components/DashboardHeader"
import { useAuth } from "@/features/auth/hooks/useAuth"

export default function DashboardPage() {

    const {user} = useAuth()


    const organizationId = user?.organizationId ?? ''
    const branchId = user?.branchId

    const { data, loading, error, loadDashboard } = useDashboard(organizationId, branchId)

    
    if (!user) {
         return (
        <div className="p-6">
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                Please login to view the dashboard.
            </div>
        </div>
    );
    }

    if (loading && !data) {
        return (
            <div className="w-full">
                <div className="mx-auto w-full max-w-7xl">
                    <div className="flex min-h-[400px] items-center justify-center">
                        <div className="text-center">
                            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />

                            <p className="mt-4 text-sm text-gray-500">
                                Loading dashboard...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error && !data) {
        return (
            <div className="w-full">
                <div className="mx-auto w-full max-w-7xl">
                    <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                        <h2 className="font-semibold text-red-800">
                            Failed to load dashboard
                        </h2>

                        <p className="mt-2 text-sm text-red-700">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={loadDashboard}
                            className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (!data) {
        return null
    }

    const { stats, revenue, occupancy, recentPayments, recentCustomers } = data

  return (
        <div className="w-full">
            <div className="mx-auto w-full max-w-7xl space-y-6">

                {/* Header */}
                <DashboardHeader
                    onRefresh={loadDashboard}
                    loading={loading}
                />

                {/* Error after refresh */}
                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Main Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    <DashboardStatCard
                        title="Total Customers"
                        value={stats.totalCustomers}
                        description={`${stats.activeCustomers} active`}
                        icon={Users}
                    />

                    <DashboardStatCard
                        title="Vacant Rooms"
                        value={stats.vacantRooms}
                        description={`${stats.totalRooms} total rooms`}
                        icon={DoorOpen}
                    />

                    <DashboardStatCard
                        title="Due Payments"
                        value={new Intl.NumberFormat(
                            "en-IN",
                            {
                                style: "currency",
                                currency: "INR",
                                maximumFractionDigits: 0,
                            }
                        ).format(stats.dueAmount)}
                        description="Outstanding amount"
                        icon={CreditCard}
                    />

                    <DashboardStatCard
                        title="Occupied Rooms"
                        value={stats.occupiedRooms}
                        description={`${occupancy.occupancyPercentage}% occupancy`}
                        icon={Building2}
                    />

                </div>

                {/* Secondary Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    <DashboardStatCard
                        title="Total Beds"
                        value={stats.totalBeds}
                        description={`${stats.occupiedBeds} occupied`}
                        icon={BedDouble}
                    />

                    <DashboardStatCard
                        title="Available Beds"
                        value={stats.availableBeds}
                        description="Ready for allocation"
                        icon={BedDouble}
                    />

                    <DashboardStatCard
                        title="Maintenance Rooms"
                        value={stats.maintenanceRooms}
                        description="Currently unavailable"
                        icon={Building2}
                    />

                    <DashboardStatCard
                        title="Expenses"
                        value={new Intl.NumberFormat(
                            "en-IN",
                            {
                                style: "currency",
                                currency: "INR",
                                maximumFractionDigits: 0,
                            }
                        ).format(stats.totalExpenses)}
                        description="Total expenses"
                        icon={Receipt}
                    />

                </div>

                {/* Revenue + Occupancy */}
                <div className="grid gap-6 lg:grid-cols-2">

                    <RevenueSummary
                        revenue={revenue}
                    />

                    <OccupancySummary
                        occupancy={occupancy}
                    />

                </div>

                {/* Recent Data */}
                <div className="grid gap-6 lg:grid-cols-2">

                    <RecentPayments
                        payments={recentPayments}
                    />

                    <RecentCustomers
                        customers={recentCustomers}
                    />

                </div>

            </div>
        </div>
    )

}