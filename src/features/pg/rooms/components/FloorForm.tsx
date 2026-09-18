import { FormEvent, useEffect, useState } from "react";
import type { CreateFloorInput, Floor } from "../types/floor.types";

interface FloorFormProps {
    branchId: string;
    floor?: Floor;
    onSubmit: (data: CreateFloorInput) => Promise<void>;
    onCancel: () => void;
}

export function FloorForm({ branchId, floor, onSubmit, onCancel }: FloorFormProps) {
    const [floorNumber, setFloorNumber] = useState(String(floor?.floorNumber ?? ""));
    const [name, setName] = useState(floor?.name ?? "");
    const [description, setDescription] = useState(floor?.description ?? "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({ floorNumber: "", name: "" });

    useEffect(() => {
        setFloorNumber(String(floor?.floorNumber ?? ""));
        setName(floor?.name ?? "");
        setDescription(floor?.description ?? "");
    }, [floor]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const newErrors = {
            floorNumber: "",
            name: "",
        };

        if (!floorNumber.trim()) {
            newErrors.floorNumber = "Floor number is required";
        } else if (!Number.isInteger(Number(floorNumber))) {
            newErrors.floorNumber = "Floor number must be an integer";
        }

        if (!name.trim()) {
            newErrors.name = "Floor name is required";
        }

        setErrors(newErrors);

        if (Object.values(newErrors).some(Boolean)) {
            return;
        }

        if (!branchId) {
            return;
        }

        const data: CreateFloorInput = {
            branchId,
            floorNumber: Number(floorNumber),
            name: name.trim(),
            description: description.trim() || undefined,
        };

        try {
            setIsSubmitting(true);
            await onSubmit(data);
        } catch (error) {
            console.error("Floor form error", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Floor Number */}
            <div className="space-y-1.5">
                <label
                    htmlFor="floorNumber"
                    className="block text-xs font-semibold text-neutral-700"
                >
                    Floor Number
                </label>
                <input
                    id="floorNumber"
                    type="number"
                    value={floorNumber}
                    onChange={(event) => {
                        setFloorNumber(event.target.value);
                        setErrors((prev) => ({ ...prev, floorNumber: "" }));
                    }}
                    placeholder="e.g. 0, 1, 2"
                    className={`w-full rounded-xl border bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors ${
                        errors.floorNumber
                            ? "border-red-400 focus:ring-1 focus:ring-red-500"
                            : "border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                    }`}
                />
                {errors.floorNumber && (
                    <p className="text-[11px] font-medium text-red-600">
                        {errors.floorNumber}
                    </p>
                )}
            </div>

            {/* Floor Name */}
            <div className="space-y-1.5">
                <label
                    htmlFor="floorName"
                    className="block text-xs font-semibold text-neutral-700"
                >
                    Floor Name
                </label>
                <input
                    id="floorName"
                    value={name}
                    onChange={(event) => {
                        setName(event.target.value);
                        setErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    placeholder="e.g. Ground Floor, 1st Floor"
                    className={`w-full rounded-xl border bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors ${
                        errors.name
                            ? "border-red-400 focus:ring-1 focus:ring-red-500"
                            : "border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                    }`}
                />
                {errors.name && (
                    <p className="text-[11px] font-medium text-red-600">
                        {errors.name}
                    </p>
                )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
                <label
                    htmlFor="description"
                    className="block text-xs font-semibold text-neutral-700"
                >
                    Description <span className="font-normal text-neutral-400">(optional)</span>
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Add any notes about this floor..."
                    rows={3}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-neutral-700 shadow-2xs transition-colors hover:bg-neutral-50 cursor-pointer"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-neutral-900 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-2xs transition-all hover:bg-neutral-800 disabled:opacity-50 cursor-pointer"
                >
                    {isSubmitting
                        ? "Saving..."
                        : floor
                        ? "Update Floor"
                        : "Create Floor"}
                </button>
            </div>
        </form>
    );
}