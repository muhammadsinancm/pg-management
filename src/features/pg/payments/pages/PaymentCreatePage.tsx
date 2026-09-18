import { useNavigate } from "react-router";
import { usePayments } from "../hooks/usePayments";
import { PaymentForm } from "../components/PaymentForm";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function PaymentCreatePage() {
    const navigate = useNavigate()

    const {user} = useAuth()

    if (!user) {
        return (
            <div className="p-6">
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    Please login to create a payment.
                </div>
            </div>
        );
    }

    const branchId = user.branchId ?? ''
    const organizationId = user.organizationId
    const createdBy = user.id

    if (!organizationId) {
         return (
            <div className="p-6">
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    Your account is not assigned to an organization.
                </div>
            </div>
        );
    }

    if (!branchId) {
        return (
            <div className="p-6">
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
                    Your account is not assigned to a branch.
                </div>
            </div>
        );
    }

    const { addPayment } = usePayments(branchId)

    const handleSubmit = async (data: any) => {
        await addPayment({
            ...data,
            organizationId,
            branchId,
            createdBy
        })
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