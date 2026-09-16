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

function DashboardSkeleton() {
    return (
        <div className="w-full space-y-2 sm:space-y-2.5 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between py-0.5">
                <div className="space-y-1">
                    <div className="h-5 sm:h-6 w-28 sm:w-32 rounded-md bg-neutral-200" />
                    <div className="h-3 sm:h-3.5 w-44 sm:w-48 rounded bg-neutral-100" />
                </div>
                <div className="h-7 sm:h-8 w-20 sm:w-24 rounded-lg bg-neutral-100" />
            </div>

            {/* 8 Stat Cards Skeletons */}
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex min-h-[76px] sm:min-h-[82px] items-center justify-between rounded-2xl border border-neutral-100 bg-white px-3.5 py-2.5 shadow-2xs sm:px-4 sm:py-3"
                    >
                        <div className="min-w-0 flex-1 space-y-1.5">
                            <div className="h-3 w-16 sm:w-20 rounded bg-neutral-100" />
                            <div className="h-5 sm:h-6 w-12 sm:w-16 rounded-md bg-neutral-200" />
                            <div className="h-2.5 w-14 rounded bg-neutral-100" />
                        </div>
                        <div className="ml-2.5 h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-neutral-100 shrink-0" />
                    </div>
                ))}
            </div>

            {/* Revenue & Occupancy Skeletons */}
            <div className="grid grid-cols-1 gap-2 sm:gap-2.5 lg:grid-cols-2">
                {/* Revenue Summary Skeleton */}
                <div className="flex h-[132px] flex-col justify-between overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-2xs">
                    <div className="flex items-center gap-2.5 border-b border-neutral-100 px-3.5 py-2.5 sm:px-4 sm:py-3">
                        <div className="h-8 w-8 shrink-0 rounded-xl bg-neutral-100" />
                        <div className="space-y-1">
                            <div className="h-3.5 w-28 rounded bg-neutral-200" />
                            <div className="h-2.5 w-20 rounded bg-neutral-100" />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 divide-x divide-neutral-100">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="space-y-1.5 px-3 py-2.5 sm:px-4 sm:py-3">
                                <div className="h-3 w-12 rounded bg-neutral-100" />
                                <div className="h-5 w-20 rounded bg-neutral-200" />
                                <div className="h-2.5 w-14 rounded bg-neutral-100" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Occupancy Summary Skeleton */}
                <div className="flex h-[132px] flex-col justify-between overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-2xs">
                    <div className="flex items-center justify-between border-b border-neutral-100 px-3.5 py-2.5 sm:px-4 sm:py-3">
                        <div className="space-y-1">
                            <div className="h-3.5 w-32 rounded bg-neutral-200" />
                            <div className="h-2.5 w-24 rounded bg-neutral-100" />
                        </div>
                        <div className="space-y-1 text-right">
                            <div className="h-5 w-12 rounded bg-neutral-200 ml-auto" />
                            <div className="h-2.5 w-10 rounded bg-neutral-100 ml-auto" />
                        </div>
                    </div>
                    <div className="flex items-end justify-around h-[80px] sm:h-[86px] px-6 pb-2">
                        <div className="h-12 w-12 rounded-t-md bg-neutral-200" />
                        <div className="h-8 w-12 rounded-t-md bg-neutral-100" />
                        <div className="h-4 w-12 rounded-t-md bg-neutral-100" />
                    </div>
                </div>
            </div>

            {/* Recent Payments & Customers Skeletons */}
            <div className="grid grid-cols-1 gap-2 sm:gap-2.5 lg:grid-cols-2">
                {/* Payments Skeleton */}
                <div className="w-full overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-2xs">
                    <div className="flex items-center justify-between border-b border-neutral-100 px-3.5 py-3 sm:px-4 sm:py-3.5">
                        <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-neutral-100 shrink-0" />
                            <div className="space-y-1">
                                <div className="h-3.5 w-28 rounded bg-neutral-200" />
                                <div className="h-2.5 w-24 rounded bg-neutral-100" />
                            </div>
                        </div>
                        <div className="h-4 w-12 rounded bg-neutral-100" />
                    </div>
                    <div className="divide-y divide-neutral-100">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center justify-between px-3.5 py-2.5 sm:px-4 sm:py-3">
                                <div className="flex items-center gap-2">
                                    <div className="h-7 w-7 rounded-lg bg-neutral-100 shrink-0" />
                                    <div className="h-3.5 w-24 rounded bg-neutral-200" />
                                </div>
                                <div className="h-3.5 w-14 rounded bg-neutral-200" />
                                <div className="h-5 w-14 rounded-full bg-neutral-100" />
                                <div className="h-3 w-16 rounded bg-neutral-100 hidden sm:block" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Customers Skeleton */}
                <div className="w-full overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-2xs">
                    <div className="flex items-center justify-between border-b border-neutral-100 px-3.5 py-3 sm:px-4 sm:py-3.5">
                        <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-neutral-100 shrink-0" />
                            <div className="space-y-1">
                                <div className="h-3.5 w-28 rounded bg-neutral-200" />
                                <div className="h-2.5 w-24 rounded bg-neutral-100" />
                            </div>
                        </div>
                        <div className="h-5 w-16 rounded-full bg-neutral-100" />
                    </div>
                    <div className="divide-y divide-neutral-100">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center justify-between px-3.5 py-2.5 sm:px-4 sm:py-3">
                                <div className="flex items-center gap-2">
                                    <div className="h-7 w-7 rounded-lg bg-neutral-100 shrink-0" />
                                    <div className="h-3.5 w-24 rounded bg-neutral-200" />
                                </div>
                                <div className="h-3.5 w-14 rounded bg-neutral-100" />
                                <div className="h-5 w-16 rounded-full bg-neutral-100" />
                                <div className="h-3 w-16 rounded bg-neutral-100 hidden sm:block" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

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
        return <DashboardSkeleton />;
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