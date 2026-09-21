import { FormEvent, useEffect, useState } from "react";
import { AlertCircle, Calendar, FileText, IndianRupee, Utensils } from "lucide-react";
import { CreateMealInput, Meal, MealStatus, MealType, UpdateMealInput } from "../types/meal.types";

interface BaseMealFormProps {
    organizationId: string;
    branchId: string;
    onCancel?: () => void;
    loading?: boolean;
}

interface CreateMealFormProps extends BaseMealFormProps {
    meal?: undefined;
    onSubmit: (data: CreateMealInput | UpdateMealInput) => Promise<void>;
}

interface EditMealFormProps extends BaseMealFormProps {
    meal: Meal;
    onSubmit: (data: UpdateMealInput) => Promise<void>;
}

type MealFormProps = CreateMealFormProps | EditMealFormProps;

const mealTypes: {
    value: MealType;
    label: string;
}[] = [
    { value: "breakfast", label: "Breakfast" },
    { value: "lunch", label: "Lunch" },
    { value: "dinner", label: "Dinner" },
    { value: "snacks", label: "Snacks" },
];

const mealStatuses: {
    value: MealStatus;
    label: string;
}[] = [
    { value: "scheduled", label: "Scheduled" },
    { value: "served", label: "Served" },
    { value: "cancelled", label: "Cancelled" },
];

export function MealForm({
    meal,
    organizationId,
    branchId,
    onSubmit,
    onCancel,
    loading = false,
}: MealFormProps) {
    const isEdit = Boolean(meal);

    const [mealType, setMealType] = useState<MealType>(meal?.mealType ?? "breakfast");
    const [mealDate, setMealDate] = useState(
        meal?.mealDate ? meal.mealDate.slice(0, 10) : new Date().toISOString().slice(0, 10)
    );
    const [menu, setMenu] = useState(meal?.menu ?? "");
    const [amount, setAmount] = useState(meal?.amount !== undefined ? String(meal.amount) : "");
    const [status, setStatus] = useState<MealStatus>(meal?.status ?? "scheduled");
    const [description, setDescription] = useState(meal?.description ?? "");
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        if (!meal) return;
        setMealType(meal.mealType);
        setMealDate(meal.mealDate ? meal.mealDate.slice(0, 10) : new Date().toISOString().slice(0, 10));
        setMenu(meal.menu);
        setAmount(String(meal.amount));
        setStatus(meal.status);
        setDescription(meal.description ?? "");
    }, [meal]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormError(null);

        if (!mealDate) {
            setFormError("Meal date is required.");
            return;
        }

        if (!menu.trim()) {
            setFormError("Menu description is required.");
            return;
        }

        const parsedAmount = Number(amount);
        if (amount.trim() === "" || Number.isNaN(parsedAmount) || parsedAmount < 0) {
            setFormError("Please enter a valid meal amount.");
            return;
        }

        try {
            if (isEdit) {
                const updateData: UpdateMealInput = {
                    mealType,
                    mealDate,
                    menu: menu.trim(),
                    amount: parsedAmount,
                    status,
                };
                if (description.trim()) {
                    updateData.description = description.trim();
                }
                await onSubmit(updateData);
            } else {
                const createData: CreateMealInput = {
                    organizationId,
                    branchId,
                    mealType,
                    mealDate,
                    menu: menu.trim(),
                    amount: parsedAmount,
                    status,
                };
                if (description.trim()) {
                    createData.description = description.trim();
                }
                await onSubmit(createData);
            }
        } catch (error) {
            setFormError(error instanceof Error ? error.message : "Failed to save meal.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {formError && (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700 shadow-2xs">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                    <span>{formError}</span>
                </div>
            )}

            {/* Section 1: Schedule & Type */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                    <Calendar className="h-4 w-4 text-neutral-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                        Schedule & Classification
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {/* Meal Date */}
                    <div>
                        <label
                            htmlFor="mealDate"
                            className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700"
                        >
                            Meal Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="mealDate"
                            type="date"
                            value={mealDate}
                            onChange={(e) => setMealDate(e.target.value)}
                            disabled={loading}
                            required
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs cursor-pointer"
                        />
                    </div>

                    {/* Meal Type */}
                    <div>
                        <label
                            htmlFor="mealType"
                            className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700"
                        >
                            Meal Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="mealType"
                            value={mealType}
                            onChange={(e) => setMealType(e.target.value as MealType)}
                            disabled={loading}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs sm:text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs cursor-pointer"
                        >
                            {mealTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status */}
                    <div>
                        <label
                            htmlFor="status"
                            className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700"
                        >
                            Status <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as MealStatus)}
                            disabled={loading}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs sm:text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs cursor-pointer"
                        >
                            {mealStatuses.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Section 2: Menu & Pricing */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                    <Utensils className="h-4 w-4 text-neutral-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                        Menu & Pricing
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {/* Menu Items */}
                    <div className="sm:col-span-2">
                        <label
                            htmlFor="menu"
                            className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700"
                        >
                            Menu Items <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="menu"
                            type="text"
                            value={menu}
                            onChange={(e) => setMenu(e.target.value)}
                            placeholder="e.g. Basmati Rice, Paneer Butter Masala, Roti, Salad"
                            disabled={loading}
                            required
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                        />
                    </div>

                    {/* Amount */}
                    <div>
                        <label
                            htmlFor="amount"
                            className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700"
                        >
                            Amount (₹) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                            <input
                                id="amount"
                                type="number"
                                min="0"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                disabled={loading}
                                required
                                className="w-full rounded-xl border border-neutral-200 bg-white pl-8 pr-3.5 py-2 text-xs sm:text-sm font-mono text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 3: Notes & Description */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                    <FileText className="h-4 w-4 text-neutral-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                        Additional Notes
                    </h3>
                </div>

                <div>
                    <label
                        htmlFor="description"
                        className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-700"
                    >
                        Description & Instructions
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Dietary notes, serving timings, allergen information..."
                        rows={3}
                        disabled={loading}
                        className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                    />
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-2.5 border-t border-neutral-100 pt-5">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-neutral-700 shadow-2xs transition-all hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    >
                        Cancel
                    </button>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-neutral-900 px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-2xs transition-all hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                    {loading ? "Saving..." : isEdit ? "Update Meal" : "Create Meal"}
                </button>
            </div>
        </form>
    );
}

export default MealForm;