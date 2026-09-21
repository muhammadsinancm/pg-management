import { useNavigate } from "react-router";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useMeals } from "../hooks/useMeals";
import { CreateMealInput, UpdateMealInput } from "../types/meal.types";
import { MealForm } from "../components/MealForm";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function CreateMealPage() {
    const navigate = useNavigate();
    const { addMeal, loading, error } = useMeals();
    const { user } = useAuth();

    if (!user) {
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
                    <span>Please log in to create a meal.</span>
                </div>
            </div>
        );
    }

    const organizationId = user.organizationId;
    const branchId = user.branchId ?? "";

    if (!organizationId) {
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
                    <span>Your account is not assigned to an organization.</span>
                </div>
            </div>
        );
    }

    if (!branchId) {
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
                <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-xs font-semibold text-amber-800 shadow-2xs">
                    <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                    <span>Your account is not assigned to a branch.</span>
                </div>
            </div>
        );
    }

    const handleSubmit = async (data: CreateMealInput | UpdateMealInput) => {
        if (!("organizationId" in data)) return;

        await addMeal({
            ...data,
            organizationId,
            branchId,
        });

        navigate("/pg/meals");
    };

    const handleCancel = () => {
        navigate("/pg/meals");
    };

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
                    <span>Back to Meals</span>
                </button>
            </div>

            {/* Header */}
            <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                    Add Meal
                </h1>
                <p className="mt-0.5 text-xs text-neutral-400">
                    Create a new meal schedule and daily menu for residents
                </p>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50/80 p-3.5 text-xs font-semibold text-red-700 shadow-2xs">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                    <span>{error}</span>
                </div>
            )}

            {/* Card Form Container */}
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-2xs max-w-3xl">
                <MealForm
                    organizationId={organizationId}
                    branchId={branchId}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    loading={loading}
                />
            </div>
        </div>
    );
}

export default CreateMealPage;