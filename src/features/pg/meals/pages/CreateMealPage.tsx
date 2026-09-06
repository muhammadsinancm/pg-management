import { useNavigate } from "react-router";
import { useMeals } from "../hooks/useMeals";
import { CreateMealInput, UpdateMealInput } from "../types/meal.types";
import { MealForm } from "../components/MealForm";

export default function CreateMealPage() {
    const navigate = useNavigate()

    const { addMeal, loading, error } = useMeals()

    const organizationId = 'organization-id'
    const branchId = 'branch-id'

    const handleSubmit = async (data: CreateMealInput | UpdateMealInput) => {
        if (!('organizationId' in data)) {
            return
        }
        await addMeal({
            ...data,
            organizationId,
            branchId
        })

        navigate('/pg/meals')
    }

    const handleCancel = () => {
        navigate('/pg/meals')
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Add Meal
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Create a new meal and menu
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
                organizationId={organizationId}
                branchId={branchId}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={loading}
            />
        </div>
    )
}