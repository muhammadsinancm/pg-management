import { CheckCircle2, Clock, Receipt, XCircle } from "lucide-react";
import { Expense, ExpenseStatus } from "../types/expense.types";

interface ExpenseSummaryProps {
    expenses: Expense[];
    selectedStatus?: ExpenseStatus | "all";
    onSelectStatus?: (status: ExpenseStatus | "all") => void;
}

function formatAmount(amount: number) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);
}

export function ExpenseSummary({
    expenses,
    selectedStatus = "all",
    onSelectStatus,
}: ExpenseSummaryProps) {
    const totalExpenses = expenses.filter((e) => e.status !== "cancelled");
    const totalAmount = totalExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    const paidExpenses = expenses.filter((e) => e.status === "paid");
    const paidAmount = paidExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    const pendingExpenses = expenses.filter((e) => e.status === "pending");
    const pendingAmount = pendingExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    const cancelledExpenses = expenses.filter((e) => e.status === "cancelled");
    const cancelledAmount = cancelledExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    const cards = [
        {
            key: "all" as const,
            label: "Total Expenses",
            amount: totalAmount,
            count: totalExpenses.length,
            sublabel: "active records",
            icon: Receipt,
            iconColor: "text-neutral-700 bg-neutral-100",
            activeClass: "border-neutral-900 bg-neutral-50/80 shadow-xs ring-2 ring-neutral-900/10",
        },
        {
            key: "paid" as const,
            label: "Paid",
            amount: paidAmount,
            count: paidExpenses.length,
            sublabel: "settled",
            icon: CheckCircle2,
            iconColor: "text-emerald-700 bg-emerald-50",
            activeClass: "border-emerald-600 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-600/10",
        },
        {
            key: "pending" as const,
            label: "Pending",
            amount: pendingAmount,
            count: pendingExpenses.length,
            sublabel: "awaiting payment",
            icon: Clock,
            iconColor: "text-amber-700 bg-amber-50",
            activeClass: "border-amber-600 bg-amber-50/70 shadow-xs ring-2 ring-amber-600/10",
        },
        {
            key: "cancelled" as const,
            label: "Cancelled",
            amount: cancelledAmount,
            count: cancelledExpenses.length,
            sublabel: "voided",
            icon: XCircle,
            iconColor: "text-rose-700 bg-rose-50",
            activeClass: "border-rose-600 bg-rose-50/70 shadow-xs ring-2 ring-rose-600/10",
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-4 sm:gap-3">
            {cards.map((card) => {
                const Icon = card.icon;
                const isSelected = selectedStatus === card.key;
                const isClickable = Boolean(onSelectStatus);

                return (
                    <div
                        key={card.key}
                        onClick={() => onSelectStatus?.(card.key)}
                        role={isClickable ? "button" : undefined}
                        tabIndex={isClickable ? 0 : undefined}
                        onKeyDown={(e) => {
                            if (isClickable && (e.key === "Enter" || e.key === " ")) {
                                e.preventDefault();
                                onSelectStatus?.(card.key);
                            }
                        }}
                        className={`flex min-h-[78px] sm:min-h-[88px] flex-col justify-between rounded-2xl border p-3 sm:p-3.5 lg:p-4 shadow-2xs transition-all text-left ${
                            isClickable ? "cursor-pointer select-none" : ""
                        } ${
                            isSelected
                                ? card.activeClass
                                : "border-neutral-200/80 bg-white hover:border-neutral-300 hover:shadow-xs"
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                                {card.label}
                            </span>
                            <div
                                className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl shrink-0 ${card.iconColor}`}
                            >
                                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </div>
                        </div>

                        <div className="mt-1.5 sm:mt-2">
                            <div className="text-base sm:text-lg lg:text-xl font-bold tracking-tight text-neutral-900 leading-tight">
                                {formatAmount(card.amount)}
                            </div>
                            <div className="mt-0.5 flex items-center justify-between text-[11px] text-neutral-400">
                                <span>{card.count} {card.count === 1 ? "expense" : "expenses"}</span>
                                <span className="hidden sm:inline capitalize">{card.sublabel}</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}