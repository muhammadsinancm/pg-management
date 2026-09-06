import { FormEvent, useEffect, useState } from "react";
import { CreateMealInput, Meal, MealStatus, MealType, UpdateMealInput } from "../types/meal.types";

interface BaseMealFormProps {
    organizationId: string
    branchId: string
    onCancel?: () => void
    loading?: boolean
}

interface CreateMealFormProps extends BaseMealFormProps {
    meal?: undefined
    onSubmit: (data: CreateMealInput | UpdateMealInput) => Promise<void>

}

interface EditMealFormProps extends BaseMealFormProps {
    meal: Meal
    onSubmit: (data: UpdateMealInput) => Promise<void>
}

type MealFormProps = | CreateMealFormProps | EditMealFormProps

const mealTypes: {
    value: MealType
    label: string
}[] = [
        {
            value: 'breakfast',
            label: 'Breakfast'
        },
        {
            value: 'lunch',
            label: 'Lunch'
        },
        {
            value: 'dinner',
            label: 'Dinner'
        },
        {
            value: 'snacks',
            label: 'Snacks'
        }
    ]

const mealStatuses: {
    value: MealStatus
    label: string
}[] = [
        {
            value: 'scheduled',
            label: 'Scheduled'
        },
        {
            value: 'served',
            label: 'Served'
        },
        {
            value: 'cancelled',
            label: 'Cancelled'
        }
    ]

export function MealForm({ meal, organizationId, branchId, onSubmit, onCancel, loading = false }: MealFormProps) {
    const isEdit = Boolean(meal)

    const [mealType, setMealType] = useState<MealType>(meal?.mealType ?? 'breakfast')
    const [mealDate, setMealDate] = useState(meal?.mealDate ? meal.mealDate.slice(0, 10) : new Date().toISOString().slice(0, 10))
    const [menu, setMenu] = useState(meal?.menu ?? '')
    const [amount, setAmount] = useState(meal?.amount !== undefined ? String(meal.amount) : '')
    const [status, setStatus] = useState<MealStatus>(meal?.status ?? 'scheduled')
    const [description, setDescription] = useState(meal?.description ?? '')
    const [formError, setFormError] = useState<string | null>(null)

    useEffect(() => {
        if (!meal) {
            return
        }

        setMealType(meal.mealType)
        setMealDate(meal.mealDate ? meal.mealDate.slice(0, 10) : new Date().toISOString().slice(0, 10))
        setMenu(meal.menu)
        setAmount(String(meal.amount))
        setStatus(meal.status)
        setDescription(meal.description ?? '')
    }, [meal])

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        setFormError(null)

        if (!mealDate) {
            setFormError('Meal data is required.')
            return
        }

        if (!menu.trim()) {
            setFormError('Menu is required.')
            return
        }

        const parsedAmount = Number(amount)

        if (amount.trim() === '' || Number.isNaN(parsedAmount) || parsedAmount < 0) {
            setFormError('Please enter a valid meal amount.')
            return
        }

        try {
            if (isEdit) {
                const updateData: UpdateMealInput = {
                    mealType,
                    mealDate,
                    menu: menu.trim(),
                    amount: parsedAmount,
                    status
                }
                if (description.trim()) {
                    updateData.description = description.trim()
                }

                await onSubmit(updateData)

            }
            else {
                const createData: CreateMealInput = {
                    organizationId,
                    branchId,
                    mealType,
                    mealDate,
                    menu: menu.trim(),
                    amount: parsedAmount,
                    status
                }

                if (description.trim()) {
                    createData.description = description.trim()
                }

                await onSubmit(createData)

            }

        } catch (error) {
           setFormError(error instanceof Error ? error.message : 'Failed to save meal.')
        }
    }

     return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            {/* Meal Type */}
            <div>
                <label
                    htmlFor="mealType"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Meal Type
                </label>

                <select
                    id="mealType"
                    value={mealType}
                    onChange={(event) =>
                        setMealType(
                            event.target.value as MealType
                        )
                    }
                    disabled={loading}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                    {mealTypes.map((type) => (
                        <option
                            key={type.value}
                            value={type.value}
                        >
                            {type.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Meal Date */}
            <div>
                <label
                    htmlFor="mealDate"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Meal Date
                </label>

                <input
                    id="mealDate"
                    type="date"
                    value={mealDate}
                    onChange={(event) =>
                        setMealDate(
                            event.target.value
                        )
                    }
                    disabled={loading}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
            </div>

            {/* Menu */}
            <div>
                <label
                    htmlFor="menu"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Menu
                </label>

                <input
                    id="menu"
                    type="text"
                    value={menu}
                    onChange={(event) =>
                        setMenu(event.target.value)
                    }
                    placeholder="e.g. Rice, Chicken Curry, Salad"
                    disabled={loading}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
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
                    placeholder="0.00"
                    disabled={loading}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
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
                            event.target.value as MealStatus
                        )
                    }
                    disabled={loading}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                    {mealStatuses.map((item) => (
                        <option
                            key={item.value}
                            value={item.value}
                        >
                            {item.label}
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
                        setDescription(
                            event.target.value
                        )
                    }
                    placeholder="Additional information..."
                    rows={4}
                    disabled={loading}
                    className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
            </div>

            {/* Error */}
            {formError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {formError}
                </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading
                        ? "Saving..."
                        : isEdit
                            ? "Update Meal"
                            : "Create Meal"}
                </button>
            </div>
        </form>
    )

}