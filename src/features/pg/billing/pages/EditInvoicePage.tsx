import { useNavigate, useParams } from "react-router";
import { useInvoices } from "../hooks/useInvoices";
import { useEffect, useState } from "react";
import { Invoice } from "../types/invoice.types";
import { InvoiceForm } from "../components/InvoiceForm";
import { CustomerMeal } from "../../meals/types/meal.types";
import { getCustomerMealsByBooking } from "../../meals/services/customerMealServie";

export default function EditInvoicePage() {
    const { invoiceId } = useParams<{ invoiceId: string }>()

    const navigate = useNavigate()

    const { getInvoiceById, editInvoice } = useInvoices()

    const [invoice, setInvoice] = useState<Invoice | null>(null)
    const [loading, setLoading] = useState(true)
    const [customerMeals, setCustomerMeals] = useState<CustomerMeal[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!invoiceId) {
            setError('Invoice Id is missing')
            setLoading(false)
            return
        }

        const loadInvoice = async () => {
            try {
                setLoading(true)
                setError(null)

                const data = await getInvoiceById(invoiceId)

                if (!data) {
                    setError('Invoice not found')
                    return
                }

                setInvoice(data)

                const meals = await getCustomerMealsByBooking(data.bookingId)
                const servedMeals = meals.filter((meal) => meal.status === 'served')
                setCustomerMeals(servedMeals)

            } catch (error) {
                console.error('Failed to load invoice', error)
                setError(error instanceof Error ? error.message : 'Failed to load invoice')

            } finally {
                setLoading(false)
            }
        }
        loadInvoice()
    }, [invoiceId, getInvoiceById])

    const handleSubmit = async (data: Parameters<typeof editInvoice>[1]) => {
        if (!invoiceId) return

        await editInvoice(invoiceId, data)

        navigate(`/pg/billing/invoices/${invoiceId}`)
    }

    if (loading) {
        return (
            <div className="p-6">
                <p className="text-gray-500">
                    Loading invoice...
                </p>
            </div>
        );
    }

    if (error || !invoice) {
        return (
            <div className="p-6">
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-red-600">
                        {error ?? "Invoice not found"}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/pg/billing")}
                    className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-white"
                >
                    Back to Billing
                </button>
            </div>
        );
    }

    return (
        <div className="p-6">

            <div className="mb-6">
                <h1 className="text-2xl font-semibold">
                    Edit Invoice
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Update invoice information.
                </p>
            </div>

            <InvoiceForm
                invoice={invoice}
                organizationId={invoice.organizationId}
                branchId={invoice.branchId}
                customerId={invoice.customerId}
                bookingId={invoice.bookingId}
                customerMeals={customerMeals}
                onSubmit={handleSubmit}
                onCancel={() =>
                    navigate(`/pg/billing/invoices/${invoice.id}`)
                }
            />

        </div>
    );

}