import { useNavigate, useParams } from "react-router";
import { useInvoices } from "../hooks/useInvoices";
import { useEffect, useState } from "react";
import { Invoice } from "../types/invoice.types";
import { InvoiceForm } from "../components/InvoiceForm";
import { CustomerMeal } from "../../meals/types/meal.types";
import { getCustomerMealsByBooking } from "../../meals/services/customerMealServie";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

export default function EditInvoicePage() {
    const { invoiceId } = useParams<{ invoiceId: string }>();
    const navigate = useNavigate();

    const { getInvoiceById, editInvoice } = useInvoices();

    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);
    const [customerMeals, setCustomerMeals] = useState<CustomerMeal[]>([]);
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

                const meals = await getCustomerMealsByBooking(data.bookingId);
                const servedMeals = meals.filter((meal) => meal.status === "served");
                setCustomerMeals(servedMeals);
            } catch (err) {
                console.error("Failed to load invoice", err);
                setError(err instanceof Error ? err.message : "Failed to load invoice information.");
            } finally {
                setLoading(false);
            }
        };
        loadInvoice();
    }, [invoiceId, getInvoiceById]);

    const handleSubmit = async (data: Parameters<typeof editInvoice>[1]) => {
        if (!invoiceId) return;

        await editInvoice(invoiceId, data);
        navigate(`/pg/billing/invoices/${invoiceId}`);
    };

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
                    <h3 className="mt-2 text-sm font-bold text-red-900">Unable to edit invoice</h3>
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
                    Edit Invoice
                </h1>
                <p className="mt-0.5 text-xs text-neutral-500">
                    Update billing charges, discounts, notes, or status for #{invoice.invoiceNumber}.
                </p>
            </div>

            {/* Invoice Form */}
            <InvoiceForm
                invoice={invoice}
                organizationId={invoice.organizationId}
                branchId={invoice.branchId}
                customerId={invoice.customerId}
                bookingId={invoice.bookingId}
                customerMeals={customerMeals}
                onSubmit={handleSubmit}
                onCancel={() => navigate(`/pg/billing/invoices/${invoice.id}`)}
            />
        </div>
    );
}