import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { AlertCircle, Plus } from "lucide-react";
import { useMeals } from "../hooks/useMeals";
import { MealStatus, MealType } from "../types/meal.types";
import { MealTable } from "../components/MealTable";
import { MealFilters } from "../components/MealFilters";
import { MealSummary } from "../components/MealSummary";

export function MealsPage() {
    const navigate = useNavigate();
    const { meals, loading, error, removeMeal } = useMeals();

    const [mealType, setMealType] = useState<MealType | "all">("all");
    const [status, setStatus] = useState<MealStatus | "all">("all");
    const [date, setDate] = useState("");

    const filteredMeals = useMemo(() => {
        return meals.filter((meal) => {
            const matchesMealType = mealType === "all" || meal.mealType === mealType;
            const matchesStatus = status === "all" || meal.status === status;
            const matchesDate = date === "" || meal.mealDate === date;

            return matchesMealType && matchesStatus && matchesDate;
        });
    }, [meals, mealType, status, date]);

    const handleDelete = async (mealId: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this meal?");
        if (!confirmed) return;

        try {
            await removeMeal(mealId);
        } catch (err) {
            console.error("Failed to delete meal", err);
            alert("Failed to delete meal.");
        }
    };

    const handleClearFilters = () => {
        setMealType("all");
        setStatus("all");
        setDate("");
    };

    const handleStatusCardSelect = (newStatus: MealStatus | "all") => {
        setStatus((prev) => (prev === newStatus ? "all" : newStatus));
    };

    return (
        <div className="w-full min-w-0 space-y-4">
            {/* Header */}
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                        Meals
                    </h1>
                    <p className="mt-0.5 text-xs text-neutral-400">
                        Manage daily meal records, menus, and dining schedules
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/pg/meals/create")}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-neutral-800 cursor-pointer shrink-0"
                >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Meal</span>
                </button>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50/80 p-3.5 shadow-2xs">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                    <p className="text-xs font-semibold text-red-800">{error}</p>
                </div>
            )}

            {/* Metric Summary Cards */}
            <MealSummary
                meals={meals}
                selectedStatus={status}
                onStatusSelect={handleStatusCardSelect}
            />

            {/* Filters Bar */}
            <MealFilters
                mealType={mealType}
                status={status}
                date={date}
                onMealTypeChange={setMealType}
                onStatusChange={setStatus}
                onDateChange={setDate}
                onClear={handleClearFilters}
            />

            {/* Results Count Bar */}
            <div className="flex items-center justify-between px-0.5">
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-500">
                    Meal Records
                </h2>

                <span className="inline-flex items-center rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-semibold text-neutral-600 shadow-2xs">
                    {filteredMeals.length} {filteredMeals.length === 1 ? "meal" : "meals"}
                </span>
            </div>

            {/* Meals Table */}
            <MealTable
                meals={filteredMeals}
                loading={loading}
                onView={(meal) => navigate(`/pg/meals/${meal.id}`)}
                onEdit={(meal) => navigate(`/pg/meals/edit/${meal.id}`)}
                onDelete={handleDelete}
                onAdd={() => navigate("/pg/meals/create")}
            />
        </div>
    );
}

export default MealsPage;