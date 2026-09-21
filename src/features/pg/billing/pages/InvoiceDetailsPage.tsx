import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Invoice } from "../types/invoice.types";
import { useInvoices } from "../hooks/useInvoices";
import { InvoiceDetails } from "../components/InvoiceDetails";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

export default function InvoiceDetailsPage() {
    const { invoiceId } = useParams<{ invoiceId: string }>();
    const navigate = useNavigate();

    const { getInvoiceById } = useInvoices();

    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!invoiceId) {
            setError("Invoice ID is missing from URL route.");
            setLoading(false);
            return;
        }

        const loadInvoice = async () => {
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
                setError(err instanceof Error ? err.message : "Failed to load invoice details.");
            } finally {
                setLoading(false);
            }
        };

        loadInvoice();
    }, [invoiceId, getInvoiceById]);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-neutral-100 bg-white shadow-2xs m-4 sm:m-6">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
                    <span className="text-xs font-medium text-neutral-500">Loading invoice details...</span>
                </div>
            </div>
        );
    }

    if (error || !invoice) {
        return (
            <div className="m-4 sm:m-6 space-y-4">
                <div className="rounded-2xl border border-red-100 bg-red-50/50 p-6 text-center shadow-2xs">
                    <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
                    <h3 className="mt-2 text-sm font-bold text-red-900">Unable to load invoice</h3>
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
        <div className="p-4 sm:p-6 space-y-6">
            <InvoiceDetails
                invoice={invoice}
                onBack={() => navigate("/pg/billing")}
                onEdit={() => navigate(`/pg/billing/invoices/${invoice.id}/edit`)}
                onRecordPayment={() =>
                    navigate(`/pg/billing/payments/create?invoiceId=${invoice.id}`)
                }
            />
        </div>
    );
}