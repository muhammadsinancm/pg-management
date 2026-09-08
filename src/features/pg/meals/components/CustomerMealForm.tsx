import { FormEvent, useState } from "react";
import { CreateCustomerMealInput, MealType } from "../types/meal.types";

interface CustomerMealFormProps {
    organizationId: string;
    branchId: string;
    customerId: string;
    bookingId: string;
    mealId: string;
    mealType: MealType;
    defaultAmount: number;
    onSubmit: (data: CreateCustomerMealInput) => Promise<void>;
    onCancel?: () => void;
}

export function CustomerMealForm({ organizationId, branchId, customerId, bookingId, mealId, mealType, defaultAmount, onSubmit, onCancel }: CustomerMealFormProps) {
    const [mealDate, setMealDate] = useState(new Date().toISOString().split('T')[0])
    const [amount, setAmount] = useState(String(defaultAmount))
    const [status, setStatus] = useState<'served' | 'cancelled'>('served')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!mealDate) {
            setError('Meal date is required')
            return
        }
        if (Number(amount) < 0) {
            setError('Meal amount can not be negative')
            return
        }

        try {
            setLoading(true)
            setError(null)

            const data: CreateCustomerMealInput = {
                organizationId,
                branchId,
                customerId,
                bookingId,
                mealId,
                mealType,
                mealDate,
                amount: Number(amount),
                status
            }

            await onSubmit(data)

        } catch (error) {
            console.error('Failed to create customer meal', error)
            setError(error instanceof Error ? error.message : 'Failed to create customer meal')

        } finally {
            setLoading(false)
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Meal Type */}
            <div>
                <label className="mb-1 block text-sm font-medium">
                    Meal Type
                </label>

                <input
                    type="text"
                    value={mealType}
                    disabled
                    className="w-full rounded-lg border bg-gray-100 px-3 py-2 capitalize"
                />
            </div>

            {/* Meal Date */}
            <div>
                <label className="mb-1 block text-sm font-medium">
                    Meal Date
                </label>

                <input
                    type="date"
                    value={mealDate}
                    onChange={(event) =>
                        setMealDate(event.target.value)
                    }
                    className="w-full rounded-lg border px-3 py-2"
                    required
                />
            </div>

            {/* Amount */}
            <div>
                <label className="mb-1 block text-sm font-medium">
                    Amount
                </label>

                <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(event) =>
                        setAmount(event.target.value)
                    }
                    className="w-full rounded-lg border px-3 py-2"
                    required
                />
            </div>

            {/* Status */}
            <div>
                <label className="mb-1 block text-sm font-medium">
                    Status
                </label>

                <select
                    value={status}
                    onChange={(event) =>
                        setStatus(
                            event.target.value as
                            | "served"
                            | "cancelled"
                        )
                    }
                    className="w-full rounded-lg border px-3 py-2"
                >
                    <option value="served">
                        Served
                    </option>

                    <option value="cancelled">
                        Cancelled
                    </option>
                </select>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-lg border px-4 py-2"
                    >
                        Cancel
                    </button>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
                >
                    {loading
                        ? "Saving..."
                        : "Record Meal"}
                </button>
            </div>
        </form>
    );
}