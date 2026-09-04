import { useNavigate } from "react-router";
import { useInvoices } from "../hooks/useInvoices";
import { InvoiceForm } from "../components/InvoiceForm";

export default function CreateInvoicePage() {
    const navigate = useNavigate()

    const {addInvoice} = useInvoices()

    const organizationId = ''
    const branchId = ''
    const customerId = ''
    const bookingId = ''

    const handleSubmit = async (data: Parameters<typeof addInvoice>[0]) => {
        await addInvoice(data)
        navigate('/pg/billing')
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold">
                    Create Invoice
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Create a new invoice for a customer booking.
                </p>
            </div>

            <InvoiceForm
                organizationId={organizationId}
                branchId={branchId}
                customerId={customerId}
                bookingId={bookingId}
                onSubmit={handleSubmit}
                onCancel={() => navigate("/pg/billing")}
            />
        </div>
    )
}