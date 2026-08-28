import { useNavigate } from "react-router";
import { usePayments } from "../hooks/usePayments";
import { PaymentForm } from "../components/PaymentForm";

export function PaymentCreatePage() {
    const navigate = useNavigate()

    const branchId = 'branch001'
    const organizationId = 'organization001'
    const createdBy = 'user001'

    const { addPayment } = usePayments(branchId)

    const handleSubmit = async (data: any) => {
        await addPayment(data)
        navigate('/pg/payments')
    }
        return (
        <section className="min-h-full p-4 md:p-6 lg:p-8">

            {/* Page Header */}
            <div className="mb-6">
                <small className="text-xs font-medium uppercase tracking-widest text-teal-700">
                    PG MANAGEMENT / PAYMENTS
                </small>

                <h1 className="mt-1 text-2xl font-semibold text-slate-900">
                    Record Payment
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Create a new payment record.
                </p>
            </div>

            {/* Payment Form */}
            <PaymentForm
                branchId={branchId}
                organizationId={organizationId}
                createdBy={createdBy}
                onSubmit={handleSubmit}
                onCancel={() => navigate("/pg/payments")}
            />

        </section>
    );
}