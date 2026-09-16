import {
    BedDouble,
    Building2,
    CreditCard,
    DoorOpen,
    Receipt,
    Users,
} from "lucide-react";

import DashboardHeader from "../components/DashboardHeader";
import DashboardStatCard from "../components/DashboardStatCard";
import OccupancySummary from "../components/OccupancySummary";
import RecentCustomers from "../components/RecentCustomers";
import RecentPayments from "../components/RecentPayment";
import RevenueSummary from "../components/RevenueSummary";
import { useDashboard } from "../hooks/useDashboard";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function DashboardPage() {
    const { user } = useAuth();

    const organizationId = user?.organizationId ?? "";
    const branchId = user?.branchId;

    const { data, loading, error, loadDashboard } = useDashboard(
        organizationId,
        branchId
    );

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    if (!user) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-600">
                Please login to view the dashboard.
            </div>
        );
    }

    if (loading && !data) {
        return (
            <div className="flex min-h-[300px] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-7 w-7 animate-spin rounded-full border-3 border-neutral-300 border-t-neutral-900" />
                    <p className="mt-3 text-xs font-medium text-neutral-500">
                        Loading dashboard...
                    </p>
                </div>
            </div>
        );
    }

    if (error && !data) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 sm:p-5">
                <h2 className="text-sm font-bold text-red-800">
                    Failed to load dashboard
                </h2>
                <p className="mt-1 text-xs text-red-700">
                    {error}
                </p>
                <button
                    type="button"
                    onClick={loadDashboard}
                    className="mt-3 rounded-lg bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    const {
        stats,
        revenue,
        occupancy,
        recentPayments,
        recentCustomers,
    } = data;

    return (
        <div className="w-full space-y-2 sm:space-y-2.5">
            {/* Header */}
            <DashboardHeader
                onRefresh={loadDashboard}
                loading={loading}
            />

            {/* Error after refresh */}
            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                    {error}
                </div>
            )}

            {/* Stats Grid - Unified 4x2 on desktop, 2x4 on mobile */}
            <section className="grid grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-4">
                <DashboardStatCard
                    title="Total Customers"
                    value={stats.totalCustomers}
                    description={`${stats.activeCustomers} active`}
                    icon={Users}
                />

                <DashboardStatCard
                    title="Vacant Rooms"
                    value={stats.vacantRooms}
                    description={`${stats.totalRooms} total`}
                    icon={DoorOpen}
                />

                <DashboardStatCard
                    title="Due Payments"
                    value={formatCurrency(stats.dueAmount)}
                    description="Outstanding"
                    icon={Receipt}
                />

                <DashboardStatCard
                    title="Occupied Rooms"
                    value={stats.occupiedRooms}
                    description={`${stats.maintenanceRooms} maintenance`}
                    icon={Building2}
                />

                <DashboardStatCard
                    title="Total Beds"
                    value={stats.totalBeds}
                    description={`${stats.occupiedBeds} occupied`}
                    icon={BedDouble}
                />

                <DashboardStatCard
                    title="Available Beds"
                    value={stats.availableBeds}
                    description="Ready to allocate"
                    icon={BedDouble}
                />

                <DashboardStatCard
                    title="Maintenance"
                    value={stats.maintenanceRooms}
                    description="Rooms unavailable"
                    icon={Building2}
                />

                <DashboardStatCard
                    title="Expenses"
                    value={formatCurrency(stats.totalExpenses)}
                    description="Total expenses"
                    icon={CreditCard}
                />
            </section>

            {/* Revenue + Occupancy */}
            <section className="grid grid-cols-1 gap-2 sm:gap-2.5 lg:grid-cols-2 items-stretch">
                <RevenueSummary revenue={revenue} />
                <OccupancySummary occupancy={occupancy} />
            </section>

            {/* Recent Data */}
            <section className="grid grid-cols-1 gap-2 sm:gap-2.5 lg:grid-cols-2 items-start">
                <RecentPayments payments={recentPayments} />
                <RecentCustomers customers={recentCustomers} />
            </section>
        </div>
    );
}