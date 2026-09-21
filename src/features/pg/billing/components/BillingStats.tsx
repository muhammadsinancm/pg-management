import { AlertCircle, CheckCircle2, Clock, Receipt } from "lucide-react";
import { Billing } from "../types/billing.types";
import { Invoice } from "../types/invoice.types";

interface BillingStatsProps {
    invoices?: Invoice[];
    billings?: Billing[];
    selectedStatus?: string;
    onSelectStatus?: (status: any) => void;
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number(amount || 0));
}

export function BillingStats({
    invoices,
    billings,
    selectedStatus = "all",
    onSelectStatus,
}: BillingStatsProps) {
    const items = invoices || billings || [];

    const totalCount = items.length;
    const totalAmount = items.reduce((sum, item) => sum + Number(item.totalAmount || 0), 0);
    const totalPaid = items.reduce((sum, item) => sum + Number(item.paidAmount || 0), 0);
    const totalDue = items.reduce((sum, item) => sum + Number(item.dueAmount || 0), 0);

    const paidCount = items.filter((item) => (item.status || "").toLowerCase() === "paid").length;
    const partialCount = items.filter((item) => {
        const s = (item.status || "").toLowerCase();
        return s === "partial" || s === "pending";
    }).length;
    const overdueCount = items.filter((item) => (item.status || "").toLowerCase() === "overdue").length;

    const cards = [
        {
            key: "all",
            label: "Total Invoiced",
            amount: totalAmount,
            count: totalCount,
            sublabel: "total records",
            icon: Receipt,
            iconColor: "text-neutral-700 bg-neutral-100",
            activeClass: "border-neutral-900 bg-neutral-50/80 shadow-xs ring-2 ring-neutral-900/10",
        },
        {
            key: "paid",
            label: "Total Collected",
            amount: totalPaid,
            count: paidCount,
            sublabel: "settled in full",
            icon: CheckCircle2,
            iconColor: "text-emerald-700 bg-emerald-50",
            activeClass: "border-emerald-600 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-600/10",
        },
        {
            key: "partial",
            label: "Partial / Pending",
            amount: items.filter(i => (i.status || "").toLowerCase() === "partial").reduce((s, i) => s + Number(i.dueAmount || 0), 0),
            count: partialCount,
            sublabel: "partially cleared",
            icon: Clock,
            iconColor: "text-amber-700 bg-amber-50",
            activeClass: "border-amber-600 bg-amber-50/70 shadow-xs ring-2 ring-amber-600/10",
        },
        {
            key: "overdue",
            label: "Total Due / Overdue",
            amount: totalDue,
            count: overdueCount,
            sublabel: overdueCount > 0 ? `${overdueCount} overdue` : "outstanding",
            icon: AlertCircle,
            iconColor: "text-red-700 bg-red-50",
            activeClass: "border-red-600 bg-red-50/70 shadow-xs ring-2 ring-red-600/10",
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
            {cards.map((card) => {
                const Icon = card.icon;
                const isActive = selectedStatus === card.key;
                const isClickable = Boolean(onSelectStatus);

                return (
                    <button
                        key={card.label}
                        type="button"
                        disabled={!isClickable}
                        onClick={() => onSelectStatus?.(isActive ? "all" : card.key)}
                        className={`group flex flex-col justify-between rounded-2xl border p-3.5 sm:p-4 text-left transition-all shadow-2xs min-w-0 ${
                            isClickable ? "cursor-pointer" : "cursor-default"
                        } ${
                            isActive
                                ? card.activeClass
                                : "border-neutral-100 bg-white hover:border-neutral-200 hover:shadow-xs"
                        }`}
                    >
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-500 uppercase tracking-wider truncate">
                                {card.label}
                            </span>
                            <div
                                className={`flex h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 shrink-0 items-center justify-center rounded-xl transition-colors ${card.iconColor}`}
                            >
                                <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
                            </div>
                        </div>

                        <div className="mt-2.5">
                            <div className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-neutral-900 truncate">
                                {formatCurrency(card.amount)}
                            </div>
                            <div className="mt-1 flex items-center justify-between text-[11px] text-neutral-400">
                                <span>{card.sublabel}</span>
                                <span className="font-semibold text-neutral-600">{card.count}</span>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}