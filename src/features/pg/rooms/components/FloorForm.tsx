import { FormEvent, useEffect, useState } from "react"
import { CreateFloorInput, Floor } from "../types/floor.types"

interface FloorFormProps {
    branchId: string
    floor?: Floor
    onSubmit: (data: CreateFloorInput) => Promise<void>
    onCancel: () => void
}

export function FloorForm({ branchId, floor, onSubmit, onCancel }: FloorFormProps) {
    const [floorNumber, setFloorNumber] = useState(String(floor?.floorNumber ?? ''))
    const [name, setName] = useState(floor?.name ?? '')
    const [description, setDescription] = useState(floor?.description ?? '')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState({ floorNumber: '', name: '' })

    useEffect(() => {
        setFloorNumber(String(floor?.floorNumber ?? ''))
        setName(floor?.name ?? '')
        setDescription(floor?.description ?? '')
    }, [floor])

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const newErrors = {
            floorNumber: '',
            name: ''
        }

        if (!floorNumber.trim()) {
            newErrors.floorNumber = 'Floor number is required'
        } else if (!Number.isInteger(Number(floorNumber))) {
            newErrors.name = 'Floor name is required'
        }

        if (!name.trim()) {
            newErrors.floorNumber = 'Floor name is required'
        }

        setErrors(newErrors)

        if (Object.values(newErrors).some(Boolean)) {
            return
        }

        if (!branchId) {
            return
        }

        const data: CreateFloorInput = {
            branchId,
            floorNumber: Number(floorNumber),
            name: name.trim(),
            description: description.trim() || undefined
        }

        try {
            setIsSubmitting(true)
            await onSubmit(data)

        } catch (error) {
            console.error('Floor form error', error)

        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-6"
        >

            {/* Floor Number */}

            <div className="space-y-2">

                <label
                    htmlFor="floorNumber"
                    className="text-sm font-medium"
                >
                    Floor Number
                </label>

                <input
                    id="floorNumber"
                    type="number"
                    value={floorNumber}
                    onChange={event => {
                        setFloorNumber(
                            event.target.value
                        )

                        setErrors(prev => ({
                            ...prev,
                            floorNumber: ''
                        }))
                    }}
                    placeholder="0"
                    className={`w-full rounded-md border px-3 py-2 outline-none ${errors.floorNumber
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                />

                {errors.floorNumber && (
                    <p className="text-sm text-red-500">
                        {errors.floorNumber}
                    </p>
                )}

            </div>


            {/* Floor Name */}

            <div className="space-y-2">

                <label
                    htmlFor="floorName"
                    className="text-sm font-medium"
                >
                    Floor Name
                </label>

                <input
                    id="floorName"
                    value={name}
                    onChange={event => {

                        setName(
                            event.target.value
                        )

                        setErrors(prev => ({
                            ...prev,
                            name: ''
                        }))
                    }}
                    placeholder="Ground Floor"
                    className={`w-full rounded-md border px-3 py-2 outline-none ${errors.name
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                />

                {errors.name && (
                    <p className="text-sm text-red-500">
                        {errors.name}
                    </p>
                )}

            </div>


            {/* Description */}

            <div className="space-y-2">

                <label
                    htmlFor="description"
                    className="text-sm font-medium"
                >
                    Description
                </label>

                <textarea
                    id="description"
                    value={description}
                    onChange={event =>
                        setDescription(
                            event.target.value
                        )
                    }
                    placeholder="Ground floor description..."
                    rows={4}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none"
                />

            </div>


            {/* Actions */}

            <div className="flex justify-end gap-3">

                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-md border px-4 py-2"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-md bg-primary px-4 py-2 text-white disabled:opacity-50"
                >
                    {isSubmitting
                        ? 'Saving...'
                        : floor
                            ? 'Update Floor'
                            : 'Create Floor'}
                </button>

            </div>

        </form>
    )

}