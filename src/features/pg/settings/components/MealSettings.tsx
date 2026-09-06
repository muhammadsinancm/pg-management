import React, { useEffect, useState } from "react";
import { MealSettings as MealSettingsType, UpdateMealSettingsInput } from "../types/settings.type";

interface MealSettingsProps {
    settings: MealSettingsType | null
    loading?: boolean
    onSave: (data: UpdateMealSettingsInput) => Promise<void>
}

export default function MealSettings({ settings, loading = false, onSave }: MealSettingsProps) {
    const [breakfastEnabled, setBreakfastEnabled] = useState(true)
    const [lunchEnabled, setLunchEnabled] = useState(true)
    const [dinnerEnabled, setDinnerEnabled] = useState(true)
    const [snacksEnabled, setSnacksEnabled] = useState(true)
    const [defaultMealPrice, setDefaultMealPrice] = useState('0')
    const [error, setError] = useState('')

    useEffect(() => {
        if (!settings) return

        setBreakfastEnabled(settings.breakfastEnabled)
        setLunchEnabled(settings.lunchEnabled)
        setDinnerEnabled(settings.dinnerEnabled)
        setSnacksEnabled(settings.snacksEnabled)
        setDefaultMealPrice(String(settings.defaultMealPrice))
    }, [settings])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')

        const price = Number(defaultMealPrice)

        if (Number.isNaN(price) || price < 0) {
            setError('Default meal price must be 0 or greater')
            return
        }

        try {
            await onSave({
                breakfastEnabled,
                lunchEnabled,
                dinnerEnabled,
                snacksEnabled,
                defaultMealPrice: price
            })

        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to save meal settings.')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900">
                    Meal Settings
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Configure which meals are available and set the default
                    meal price.
                </p>
            </div>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Meal Availability */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="text-base font-semibold text-gray-900">
                    Meal Availability
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                    Enable or disable meals available for your PG residents.
                </p>

                <div className="mt-5 space-y-4">
                    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-4">
                        <div>
                            <p className="font-medium text-gray-900">
                                Breakfast
                            </p>
                            <p className="text-sm text-gray-500">
                                Enable breakfast service
                            </p>
                        </div>

                        <input
                            type="checkbox"
                            checked={breakfastEnabled}
                            onChange={(e) =>
                                setBreakfastEnabled(e.target.checked)
                            }
                            className="h-5 w-5 rounded border-gray-300"
                        />
                    </label>

                    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-4">
                        <div>
                            <p className="font-medium text-gray-900">
                                Lunch
                            </p>
                            <p className="text-sm text-gray-500">
                                Enable lunch service
                            </p>
                        </div>

                        <input
                            type="checkbox"
                            checked={lunchEnabled}
                            onChange={(e) =>
                                setLunchEnabled(e.target.checked)
                            }
                            className="h-5 w-5 rounded border-gray-300"
                        />
                    </label>

                    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-4">
                        <div>
                            <p className="font-medium text-gray-900">
                                Dinner
                            </p>
                            <p className="text-sm text-gray-500">
                                Enable dinner service
                            </p>
                        </div>

                        <input
                            type="checkbox"
                            checked={dinnerEnabled}
                            onChange={(e) =>
                                setDinnerEnabled(e.target.checked)
                            }
                            className="h-5 w-5 rounded border-gray-300"
                        />
                    </label>

                    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-4">
                        <div>
                            <p className="font-medium text-gray-900">
                                Snacks
                            </p>
                            <p className="text-sm text-gray-500">
                                Enable snacks service
                            </p>
                        </div>

                        <input
                            type="checkbox"
                            checked={snacksEnabled}
                            onChange={(e) =>
                                setSnacksEnabled(e.target.checked)
                            }
                            className="h-5 w-5 rounded border-gray-300"
                        />
                    </label>
                </div>
            </div>

            {/* Default Meal Price */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="text-base font-semibold text-gray-900">
                    Default Meal Price
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                    Set the default price used when creating a meal.
                </p>

                <div className="mt-5 max-w-md">
                    <label
                        htmlFor="defaultMealPrice"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Default Price
                    </label>

                    <div className="flex items-center">
                        <span className="rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-600">
                            ₹
                        </span>

                        <input
                            id="defaultMealPrice"
                            type="number"
                            min="0"
                            step="0.01"
                            value={defaultMealPrice}
                            onChange={(e) =>
                                setDefaultMealPrice(e.target.value)
                            }
                            className="w-full rounded-r-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                            placeholder="0"
                        />
                    </div>
                </div>
            </div>

            {/* Save */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </form>
    )
}