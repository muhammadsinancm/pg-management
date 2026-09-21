import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AlertCircle, ArrowLeft, Utensils } from "lucide-react";
import { useMeals } from "../hooks/useMeals";
import { Meal } from "../types/meal.types";
import { MealDetails } from "../components/MealDetails";

export function MealDetailsPage() {
    const { mealId } = useParams<{ mealId: string }>();
    const navigate = useNavigate();

    const { getMealById, removeMeal, loading, error } = useMeals();
    const [meal, setMeal] = useState<Meal | null>(null);

    useEffect(() => {
        if (!mealId) return;

        const loadMeal = async () => {
            const data = await getMealById(mealId);
            setMeal(data);
        };
        loadMeal();
    }, [mealId, getMealById]);

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this meal?");
        if (!confirmed) return;

        try {
            await removeMeal(id);
            navigate("/pg/meals");
        } catch (err) {
            console.error("Failed to delete meal", err);
            alert("Failed to delete meal.");
        }
    };

    if (loading) {
        return (
            <div className="w-full space-y-4 animate-pulse">
                <div className="flex justify-between items-center">
                    <div className="h-4 w-28 rounded bg-neutral-200" />
                    <div className="h-8 w-20 rounded bg-neutral-200" />
                </div>
                <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-2xs space-y-4">
                    <div className="h-10 w-48 rounded bg-neutral-100" />
                    <div className="h-32 rounded-xl bg-neutral-50" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-4">
                <button
                    type="button"
                    onClick={() => navigate("/pg/meals")}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Meals</span>
                </button>

                <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50/80 p-4 text-xs font-semibold text-red-700 shadow-2xs">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    if (!meal) {
        return (
            <div className="space-y-4">
                <button
                    type="button"
                    onClick={() => navigate("/pg/meals")}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Meals</span>
                </button>

                <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-8 xl:p-12 text-center shadow-2xs">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
                        <Utensils className="h-5 w-5" />
                    </div>
                    <h3 className="mt-3 text-sm font-bold text-neutral-900">
                        Meal not found
                    </h3>
                    <p className="mt-1 text-xs text-neutral-400 max-w-sm mx-auto">
                        The requested meal record could not be found.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-w-0">
            <MealDetails
                meal={meal}
                onBack={() => navigate("/pg/meals")}
                onEdit={(m) => navigate(`/pg/meals/edit/${m.id}`)}
                onDelete={handleDelete}
            />
        </div>
    );
}

export default MealDetailsPage;