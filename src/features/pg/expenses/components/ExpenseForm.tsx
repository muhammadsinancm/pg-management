import { FormEvent, useEffect, useState } from "react";
import { CreateExpenseInput, Expense, ExpenseCategory, ExpensePaymentMethod, ExpenseStatus, UpdateExpenseInput } from "../types/expense.types";

interface ExpenseFormProps {
    expense?: Expense
    organizationId: string
    branchId: string
    onSubmit: (data: CreateExpenseInput | UpdateExpenseInput) => Promise<void>
    onCancel?: () => void
    loading?: boolean
}

const categories: ExpenseCategory[] = [
    'electricity',
    'water',
    'internet',
    'maintenance',
    'food',
    'cleaning',
    'salary',
    'rent',
    'supplies',
    'ohter'
]

const paymentMethods: ExpensePaymentMethod[] = [
    'cash',
    'upi',
    'bank_transfer',
    'card'
]

const statuses: ExpenseStatus[] = [
    'pending',
    'paid',
    'cancelled'
]

function getTody(): string {
    return new Date().toISOString().split('T')[0]
}

export function ExpenseForm({ expense, organizationId, branchId, onSubmit, onCancel, loading = false }: ExpenseFormProps) {
    const isEditMode = Boolean(expense)

    const [category, setCategory] = useState<ExpenseCategory>(expense?.category ?? 'electricity')
    const [amount, setAmount] = useState<string>(expense?.amount?.toString() ?? '')
    const [expenseDate, setExpenseDate] = useState<string>(expense?.expenseDate ? expense.expenseDate.split('T')[0] : getTody())
    const [paymentMethod, setPaymentMethod] = useState<ExpensePaymentMethod>(expense?.paymentMethod ?? 'cash')
    const [status, setStatus] = useState<ExpenseStatus>(expense?.status ?? 'paid')
    const [description, setDescription] = useState<string>(expense?.description ?? '')
    const [referenceNumber, setReferenceNumber] = useState<string>(expense?.referenceNumber ?? '')
    const [formError, setFormError] = useState<string | null>(null)

    useEffect(() => {
        if (!expense) {
            return
        }

        setCategory(expense.category)
        setAmount(expense.amount.toString())
        setExpenseDate(expense.expenseDate.split('T')[0])
        setPaymentMethod(expense.paymentMethod)
        setStatus(expense.status)
        setDescription(expense.description ?? '')
        setReferenceNumber(expense.referenceNumber ?? '')
    }, [expense])

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        setFormError(null)

        const numericAmount = Number(amount)

        if (!amount || numericAmount <= 0) {
            setFormError('Amount must be greater than 0')
            return
        }
        if (!expenseDate) {
            setFormError('Expense date is required')
            return
        }

        try {
            if (isEditMode && expense) {
                const updateData: UpdateExpenseInput = {
                    category,
                    amount: numericAmount,
                    expenseDate,
                    paymentMethod,
                    status,
                    description: description.trim() || undefined,
                    referenceNumber: referenceNumber.trim() || undefined
                }

                await onSubmit(updateData)

            }
            else {
                const createData: CreateExpenseInput = {
                    organizationId,
                    branchId,
                    category,
                    amount: numericAmount,
                    expenseDate,
                    paymentMethod,
                    status,
                    description: description.trim() || undefined,
                    referenceNumber: referenceNumber.trim() || undefined
                }
                await onSubmit(createData)
            }

        } catch (error) {
            setFormError(error instanceof Error ? error.message : 'Failed to save expense')
        }

    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >

            {/* Category */}

            <div>
                <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Expense Category
                </label>

                <select
                    id="category"
                    value={category}
                    onChange={(event) =>
                        setCategory(
                            event.target.value as ExpenseCategory
                        )
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
                    disabled={loading}
                >
                    {categories.map((item) => (
                        <option
                            key={item}
                            value={item}
                        >
                            {item
                                .replace("_", " ")
                                .replace(/\b\w/g, (char) =>
                                    char.toUpperCase()
                                )}
                        </option>
                    ))}
                </select>
            </div>

            {/* Amount */}

            <div>
                <label
                    htmlFor="amount"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Amount
                </label>

                <input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(event) =>
                        setAmount(event.target.value)
                    }
                    placeholder="Enter amount"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
                    disabled={loading}
                />
            </div>

            {/* Date */}

            <div>
                <label
                    htmlFor="expenseDate"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Expense Date
                </label>

                <input
                    id="expenseDate"
                    type="date"
                    value={expenseDate}
                    onChange={(event) =>
                        setExpenseDate(event.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
                    disabled={loading}
                />
            </div>

            {/* Payment Method */}

            <div>
                <label
                    htmlFor="paymentMethod"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Payment Method
                </label>

                <select
                    id="paymentMethod"
                    value={paymentMethod}
                    onChange={(event) =>
                        setPaymentMethod(
                            event.target.value as ExpensePaymentMethod
                        )
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
                    disabled={loading}
                >
                    {paymentMethods.map((method) => (
                        <option
                            key={method}
                            value={method}
                        >
                            {method
                                .replace("_", " ")
                                .replace(/\b\w/g, (char) =>
                                    char.toUpperCase()
                                )}
                        </option>
                    ))}
                </select>
            </div>

            {/* Status */}

            <div>
                <label
                    htmlFor="status"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Status
                </label>

                <select
                    id="status"
                    value={status}
                    onChange={(event) =>
                        setStatus(
                            event.target.value as ExpenseStatus
                        )
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
                    disabled={loading}
                >
                    {statuses.map((item) => (
                        <option
                            key={item}
                            value={item}
                        >
                            {item
                                .replace("_", " ")
                                .replace(/\b\w/g, (char) =>
                                    char.toUpperCase()
                                )}
                        </option>
                    ))}
                </select>
            </div>

            {/* Description */}

            <div>
                <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Description
                </label>

                <textarea
                    id="description"
                    value={description}
                    onChange={(event) =>
                        setDescription(event.target.value)
                    }
                    placeholder="Enter expense description"
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
                    disabled={loading}
                />
            </div>

            {/* Reference Number */}

            <div>
                <label
                    htmlFor="referenceNumber"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Reference Number
                </label>

                <input
                    id="referenceNumber"
                    type="text"
                    value={referenceNumber}
                    onChange={(event) =>
                        setReferenceNumber(
                            event.target.value
                        )
                    }
                    placeholder="Optional"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
                    disabled={loading}
                />
            </div>

            {/* Error */}

            {formError && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                    {formError}
                </div>
            )}

            {/* Buttons */}

            <div className="flex items-center justify-end gap-3">

                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading
                        ? "Saving..."
                        : isEditMode
                            ? "Update Expense"
                            : "Create Expense"}
                </button>

            </div>

        </form>
    )
}