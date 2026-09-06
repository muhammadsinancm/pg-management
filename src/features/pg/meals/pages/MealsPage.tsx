import { useNavigate } from "react-router";
import { useMeals } from "../hooks/useMeals";
import { useMemo, useState } from "react";
import { MealStatus, MealType } from "../types/meal.types";
import MealTable from "../components/MealTable";
import MealFilters from "../components/MealFilters";
import MealSummaray from "../components/MealSummary";

export default function MealsPage() {
    const navigate = useNavigate()

    const { meals, loading, error, removeMeal } = useMeals()

    const [mealType, setMealType] = useState<MealType | 'all'>('all')
    const [status, setStatus] = useState<MealStatus | 'all'>('all')
    const [date, setDate] = useState('')

    const filteredMeals = useMemo(() => {
        return meals.filter((meal) => {
            const matchesMealType = mealType === 'all' || meal.mealType === mealType
            const matchesStatus = status === 'all' || meal.status === status
            const matchesDate = date === '' || meal.mealDate === date

            return (matchesMealType && matchesStatus && matchesDate)
        })
    }, [meals, mealType, status, date])

    const handleDelete = async (mealId: string) => {
        const confirmed = window.confirm('Are you sure you want to delete this meal?')

        if (!confirmed) {
            return
        }


        await removeMeal(mealId)
    }
        const handleClearFilters = () => {
            setMealType('all')
            setStatus('all')
            setDate('')
        }

        return (
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Meals
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Manage daily meals and menus
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/pg/meals/create")
                        }
                        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                        Add Meal
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Summary */}
                <MealSummaray meals={meals} />

                {/* Filters */}
                <MealFilters
                    mealType={mealType}
                    status={status}
                    date={date}
                    onMealTypeChange={setMealType}
                    onStatusChange={setStatus}
                    onDateChange={setDate}
                    onClear={handleClearFilters}
                />

                {/* Results count */}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Meal List
                    </h2>

                    <span className="text-sm text-gray-500">
                        {filteredMeals.length} meal
                        {filteredMeals.length !== 1 ? "s" : ""}
                    </span>
                </div>

                {/* Table */}
                <MealTable
                    meals={filteredMeals}
                    loading={loading}
                    onEdit={(meal) =>
                        navigate(
                            `/pg/meals/edit/${meal.id}`
                        )
                    }
                    onDelete={handleDelete}
                />
            </div>
        )
    }