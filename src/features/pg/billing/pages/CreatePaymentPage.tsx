import { useNavigate, useSearchParams } from "react-router";
import { usePayments } from "../hooks/usePayments";
import { CreatePaymentInput } from "../types/payment.types";
import { PaymentForm } from "../components/PaymentForm";
import { useInvoices } from "../hooks/useInvoices";
import { useEffect, useState } from "react";
import { Invoice } from "../types/invoice.types";
import { AlertCircle, ArrowLeft, Loader2, Receipt } from "lucide-react";
import { InvoiceStatusBadge } from "../components/InvoiceStatusBadge";

export default function CreatePaymentPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const { addPayment } = usePayments();
    const { getInvoiceById } = useInvoices();

    const invoiceId = searchParams.get("invoiceId");

    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadInvoice = async () => {
            if (!invoiceId) {
                setError("Invoice ID is missing from URL query parameters.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const data = await getInvoiceById(invoiceId);

                if (!data) {
                    setError("Invoice not found.");
                    return;
                }

                setInvoice(data);
            } catch (err) {
                console.error("Failed to load invoice", err);
                setError(err instanceof Error ? err.message : "Failed to load invoice information.");
            } finally {
                setLoading(false);
            }
        };
        loadInvoice();
    }, [invoiceId, getInvoiceById]);

    const handleSubmit = async (data: CreatePaymentInput) => {
        try {
            if (!invoice) return;

            const paymentData: CreatePaymentInput = {
                ...data,
                organizationId: invoice.organizationId,
                branchId: invoice.branchId,
                customerId: invoice.customerId,
                bookingId: invoice.bookingId,
                invoiceId: invoice.id,
            };

            await addPayment(paymentData);
            navigate(`/pg/billing/invoices/${invoice.id}`);
        } catch (err) {
            console.error("Failed to create payment", err);
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-neutral-100 bg-white shadow-2xs m-4 sm:m-6">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
                    <span className="text-xs font-medium text-neutral-500">Loading invoice information...</span>
                </div>
            </div>
        );
    }

    if (error || !invoice) {
        return (
            <div className="m-4 sm:m-6 space-y-4">
                <div className="rounded-2xl border border-red-100 bg-red-50/50 p-6 text-center shadow-2xs">
                    <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
                    <h3 className="mt-2 text-sm font-bold text-red-900">Unable to record payment</h3>
                    <p className="mt-1 text-xs text-red-600">{error || "Invoice not found."}</p>
                    <button
                        type="button"
                        onClick={() => navigate("/pg/billing")}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-neutral-800 transition-all cursor-pointer"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Back to Billing</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5 p-4 sm:space-y-6 sm:p-6">
            {/* Top Navigation & Header */}
            <div>
                <button
                    type="button"
                    onClick={() => navigate(`/pg/billing/invoices/${invoice.id}`)}
                    className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Invoice</span>
                </button>

                <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
                    Record Payment
                </h1>
                <p className="mt-0.5 text-xs text-neutral-500">
                    Record a payment transaction against invoice #{invoice.invoiceNumber}.
                </p>
            </div>

            {/* Invoice Summary Banner */}
            <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white p-4 sm:p-5 shadow-2xs">
                <div className="mb-3 flex items-center justify-between border-b border-neutral-100 pb-2">
                    <div className="flex items-center gap-2">
                        <Receipt className="h-4 w-4 text-neutral-500" />
                        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                            Invoice Overview
                        </h2>
                    </div>
                    <InvoiceStatusBadge status={invoice.status} size="sm" />
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                            Invoice Number
                        </span>
                        <span className="mt-0.5 block font-mono text-xs sm:text-sm font-bold text-neutral-900">
                            {invoice.invoiceNumber}
                        </span>
                    </div>

                    <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                            Total Invoiced
                        </span>
                        <span className="mt-0.5 block font-mono text-xs sm:text-sm font-semibold text-neutral-800">
                            ₹{invoice.totalAmount.toLocaleString("en-IN")}
                        </span>
                    </div>

                    <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                            Amount Paid
                        </span>
                        <span className="mt-0.5 block font-mono text-xs sm:text-sm font-semibold text-emerald-600">
                            ₹{invoice.paidAmount.toLocaleString("en-IN")}
                        </span>
                    </div>

                    <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                            Remaining Due
                        </span>
                        <span className="mt-0.5 block font-mono text-xs sm:text-sm font-bold text-amber-600">
                            ₹{invoice.dueAmount.toLocaleString("en-IN")}
                        </span>
                    </div>
                </div>
            </div>

            {/* Payment Form */}
            <PaymentForm
                organizationId={invoice.organizationId}
                branchId={invoice.branchId}
                customerId={invoice.customerId}
                bookingId={invoice.bookingId}
                invoiceId={invoice.id}
                onSubmit={handleSubmit}
                onCancel={() => navigate(`/pg/billing/invoices/${invoice.id}`)}
                totalAmount={invoice.totalAmount}
                paidAmount={invoice.paidAmount}
                dueAmount={invoice.dueAmount}
            />
        </div>
    );
}