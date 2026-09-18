import { useNavigate, useParams } from "react-router";
import { useMeals } from "../hooks/useMeals";
import { useEffect, useState } from "react";
import { Meal, UpdateMealInput } from "../types/meal.types";
import { MealForm } from "../components/MealForm";

export default function EditMealPage() {
    const { mealId } = useParams<{ mealId: string }>()

    const navigate = useNavigate()

    const { getMealById, editMeal, loading, error } = useMeals()

    const [meal, setMeal] = useState<Meal | null>(null)
    const [loadingMeal, setLoadingMeal] = useState(true)

    useEffect(() => {
        if (!mealId) {
            setLoadingMeal(false)
            return
        }

        const loadMeal = async () => {
            try {
                const data = await getMealById(mealId)
                setMeal(data)

            } finally {
                setLoadingMeal(false)
            }
        }

        loadMeal()
    }, [mealId, getMealById])

    const handleSubmit = async (data: UpdateMealInput) => {
        if (!mealId) {
            return
        }

        await editMeal(mealId, data)
        navigate(`/pg/meals/${mealId}`)
    }

    const handleCancel = () => {
        if (mealId) {
            navigate(`/pg/meals/${mealId}`)
            return
        }

        navigate('/pg/meals')
    }

    if (loadingMeal) {
        return (
            <div className="flex min-h-[300px] items-center justify-center p-6">
                <p className="text-sm text-gray-500">
                    Loading meal...
                </p>
            </div>
        )
    }

    if (!meal) {
        return (
            <div className="space-y-4 p-6">
                <button
                    type="button"
                    onClick={() => navigate("/pg/meals")}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                    ← Back to Meals
                </button>

                <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Meal Not Found
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        The requested meal could not be found.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div>
                <button
                    type="button"
                    onClick={handleCancel}
                    className="mb-2 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                    ← Back to Meal
                </button>

                <h1 className="text-2xl font-bold text-gray-900">
                    Edit Meal
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Update meal and menu information
                </p>
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Form */}
            <MealForm
                meal={meal}
                organizationId={meal.organizationId}
                branchId={meal.branchId}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={loading}
            />
        </div>
    )
}