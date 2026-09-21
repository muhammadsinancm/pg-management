import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AlertCircle, ArrowLeft, Utensils } from "lucide-react";
import { useMeals } from "../hooks/useMeals";
import { Meal, UpdateMealInput } from "../types/meal.types";
import { MealForm } from "../components/MealForm";

export function EditMealPage() {
    const { mealId } = useParams<{ mealId: string }>();
    const navigate = useNavigate();

    const { getMealById, editMeal, loading, error } = useMeals();
    const [meal, setMeal] = useState<Meal | null>(null);
    const [loadingMeal, setLoadingMeal] = useState(true);

    useEffect(() => {
        if (!mealId) {
            setLoadingMeal(false);
            return;
        }

        const loadMeal = async () => {
            try {
                const data = await getMealById(mealId);
                setMeal(data);
            } finally {
                setLoadingMeal(false);
            }
        };

        loadMeal();
    }, [mealId, getMealById]);

    const handleSubmit = async (data: UpdateMealInput) => {
        if (!mealId) return;

        await editMeal(mealId, data);
        navigate(`/pg/meals/${mealId}`);
    };

    const handleCancel = () => {
        if (mealId) {
            navigate(`/pg/meals/${mealId}`);
            return;
        }
        navigate("/pg/meals");
    };

    if (loadingMeal) {
        return (
            <div className="w-full max-w-3xl space-y-4 animate-pulse">
                <div className="h-4 w-28 rounded bg-neutral-200" />
                <div className="h-8 w-48 rounded bg-neutral-200" />
                <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-2xs space-y-6">
                    <div className="h-5 w-40 rounded bg-neutral-100" />
                    <div className="grid grid-cols-3 gap-4">
                        <div className="h-10 rounded-xl bg-neutral-100" />
                        <div className="h-10 rounded-xl bg-neutral-100" />
                        <div className="h-10 rounded-xl bg-neutral-100" />
                    </div>
                    <div className="h-10 rounded-xl bg-neutral-100" />
                </div>
            </div>
        );
    }

    if (!meal) {
        return (
            <div className="w-full max-w-3xl space-y-4">
                <button
                    type="button"
                    onClick={() => navigate("/pg/meals")}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Meals</span>
                </button>

                <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-8 text-center shadow-2xs">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
                        <Utensils className="h-5 w-5" />
                    </div>
                    <h3 className="mt-3 text-sm font-bold text-neutral-900">
                        Meal not found
                    </h3>
                    <p className="mt-1 text-xs text-neutral-400 max-w-sm mx-auto">
                        The requested meal record could not be found or has been deleted.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-w-0 space-y-4">
            {/* Top Action / Back Link */}
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Meal Details</span>
                </button>
            </div>

            {/* Header */}
            <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                    Edit Meal
                </h1>
                <p className="mt-0.5 text-xs text-neutral-400">
                    Update meal schedule, pricing, and menu information
                </p>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50/80 p-3.5 text-xs font-semibold text-red-700 shadow-2xs">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                    <span>{error}</span>
                </div>
            )}

            {/* Form Card */}
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-2xs max-w-3xl">
                <MealForm
                    meal={meal}
                    organizationId={meal.organizationId}
                    branchId={meal.branchId}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    loading={loading}
                />
            </div>
        </div>
    );
}

export default EditMealPage;