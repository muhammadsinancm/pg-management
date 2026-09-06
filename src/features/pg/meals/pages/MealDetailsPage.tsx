import { useNavigate, useParams } from "react-router";
import { useMeals } from "../hooks/useMeals";
import { useEffect, useState } from "react";
import { Meal } from "../types/meal.types";
import MealDetails from "../components/MealDetails";

export default function MealDetailsPage() {
    const { mealId } = useParams<{ mealId: string }>()

    const navigate = useNavigate()

    const { getMealById, loading, error } = useMeals()

    const [meal, setMeal] = useState<Meal | null>(null)

    useEffect(() => {
        if (!mealId) {
            return
        }

        const loadMeal = async () => {
            const data = await getMealById(mealId)
            setMeal(data)
        }
        loadMeal()
    }, [mealId, getMealById])

    if (loading) {
        return (
            <div className="flex min-h-[300px] items-center justify-center p-6">
                <p className="text-sm text-gray-500">
                    Loading meal...
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="space-y-4 p-6">
                <button
                    type="button"
                    onClick={() => navigate("/pg/meals")}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                    ← Back to Meals
                </button>

                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
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
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <button
                        type="button"
                        onClick={() => navigate("/pg/meals")}
                        className="mb-2 text-sm font-medium text-gray-500 hover:text-gray-900"
                    >
                        ← Back to Meals
                    </button>

                    <h1 className="text-2xl font-bold text-gray-900">
                        Meal Details
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        View meal and menu information
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/pg/meals/edit/${meal.id}`
                        )
                    }
                    className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                    Edit Meal
                </button>
            </div>

            {/* Details */}
            <MealDetails meal={meal} />
        </div>
    )
}