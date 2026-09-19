import { FormEvent, useEffect, useState } from "react";
import { CreateRoomInput, Room, RoomType, SharingType } from "../types/room.types";

interface RoomFormProps {
    branchId: string
    floorId: string
    room?: Room
    onSubmit: (date: CreateRoomInput) => Promise<void>
    onCancel: () => void
}

export function RoomForm({ branchId, floorId, room, onSubmit, onCancel }: RoomFormProps) {

    const [roomNumber, setRoomNumber] = useState(room?.roomNumber ?? '')
    const [type, setType] = useState<RoomType>(room?.type ?? 'AC')
    const [sharingType, setSharingType] = useState<SharingType>(room?.sharingType ?? 'SINGLE')
    const [capacity, setCapacity] = useState('')
    const [rent, setRent] = useState('')
    const [status, setStatus] = useState<Room['status']>(room?.status ?? 'available')
    const [description, setDescription] = useState(room?.description ?? '')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState({
        roomNumber: '',
        capacity: '',
        rent: '',
    })

    useEffect(() => {
        if (!room) {
            setRoomNumber('')
            setType('AC')
            setSharingType('SINGLE')
            setCapacity('')
            setRent('')
            setStatus('available')
            setDescription('')
            return
        }

        setRoomNumber(room.roomNumber)
        setType(room.type as RoomType)
        setSharingType(room.sharingType)
        setCapacity(String(room.capacity))
        setRent(String(room.rent))
        setStatus(room.status)
        setDescription(room.description ?? '')

    }, [room])

    async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault()

        const newErrors = {
            roomNumber: '',
            capacity: '',
            rent: ''
        }

        // if (!branchId.trim()) {
        //     newErrors.branchId = 'Branch is required'
        // }
        if (!roomNumber.trim()) {
            newErrors.roomNumber = 'Room number is required'
        }
        // if (!floorId.trim()) {
        //     newErrors.floor = 'Floor is required'
        // }

        if (!capacity.trim()) {
            newErrors.capacity = 'Capacity is required'
        } else if (!Number.isInteger(Number(capacity)) || Number(capacity) <= 0) {
            newErrors.capacity = 'Enter a valid capacity'
        }

        if (!rent.trim()) {
            newErrors.rent = 'Monthly rent is required'
        } else if (Number.isNaN(Number(rent)) || Number(rent) < 0) {
            newErrors.rent = 'Enter a valid rent'
        }

        setErrors(newErrors)

        if (Object.values(newErrors).some(Boolean)) {
            return
        }

        const data: CreateRoomInput = {
            branchId,
            floorId,
            roomNumber: roomNumber.trim(),
            type,
            sharingType,
            capacity: Number(capacity),
            rent: Number(rent),
            status,
            description: description.trim() || undefined
        }

        try {
            setIsSubmitting(true)

            await onSubmit(data)

        } catch (error) {
            console.error('Room form error', error)

        } finally {
            setIsSubmitting(false)
        }
    }

    function clearError(field: keyof typeof errors) {
        setErrors((pre) => ({
            ...pre,
            [field]: ''
        }))
    }

    return (
        <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-6"
        >

            {/* Room Number */}
            <div className="space-y-1.5">
                <label
                    htmlFor="roomNumber"
                    className="block text-xs font-semibold text-neutral-700"
                >
                    Room Number
                </label>

                <input
                    id="roomNumber"
                    type="text"
                    value={roomNumber}
                    onChange={(event) => {

                        setRoomNumber(
                            event.target.value
                        );

                        if (
                            event.target.value.trim()
                        ) {
                            clearError(
                                "roomNumber"
                            );
                        }

                    }}
                    placeholder="101"
                    className={`w-full rounded-xl border bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 outline-none transition-colors ${
                        errors.roomNumber
                            ? "border-red-400 focus:ring-1 focus:ring-red-500"
                            : "border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                    }`}
                />

                {errors.roomNumber && (
                    <p className="text-[11px] font-medium text-red-600">
                        {errors.roomNumber}
                    </p>
                )}
            </div>

            {/* Room Type */}
            <div className="space-y-1.5">
                <label
                    htmlFor="type"
                    className="block text-xs font-semibold text-neutral-700"
                >
                    Room Type
                </label>

                <select
                    id="type"
                    value={type}
                    onChange={(event) => setType(event.target.value as RoomType)}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                >
                    <option value="AC">AC</option>
                    <option value="NON_AC">Non AC</option>
                </select>
            </div>

            {/* Sharing Type */}
            <div className="space-y-1.5">
                <label
                    htmlFor="sharingType"
                    className="block text-xs font-semibold text-neutral-700"
                >
                    Sharing Type
                </label>

                <select
                    id="sharingType"
                    value={sharingType}
                    onChange={(event) =>
                        setSharingType(event.target.value as SharingType)
                    }
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                >
                    <option value="SINGLE">Single</option>
                    <option value="DOUBLE">Double</option>
                    <option value="TRIPLE">Triple</option>
                    <option value="FOUR_SHARING">Four Sharing</option>
                    <option value="DORMITORY">Dormitory</option>
                </select>
            </div>

            {/* Capacity */}
            <div className="space-y-1.5">
                <label
                    htmlFor="capacity"
                    className="block text-xs font-semibold text-neutral-700"
                >
                    Capacity (Beds)
                </label>

                <input
                    id="capacity"
                    type="number"
                    min="1"
                    value={capacity}
                    onChange={(event) => {
                        setCapacity(event.target.value);
                        if (event.target.value.trim()) {
                            clearError("capacity");
                        }
                    }}
                    placeholder="e.g. 2"
                    className={`w-full rounded-xl border bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 outline-none transition-colors ${
                        errors.capacity
                            ? "border-red-400 focus:ring-1 focus:ring-red-500"
                            : "border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                    }`}
                />

                {errors.capacity && (
                    <p className="text-[11px] font-medium text-red-600">
                        {errors.capacity}
                    </p>
                )}
            </div>

            {/* Monthly Rent */}
            <div className="space-y-1.5">
                <label
                    htmlFor="rent"
                    className="block text-xs font-semibold text-neutral-700"
                >
                    Monthly Rent (₹)
                </label>

                <input
                    id="rent"
                    type="number"
                    min="0"
                    value={rent}
                    onChange={(event) => {
                        setRent(event.target.value);
                        if (event.target.value.trim()) {
                            clearError("rent");
                        }
                    }}
                    placeholder="e.g. 8000"
                    className={`w-full rounded-xl border bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 outline-none transition-colors ${
                        errors.rent
                            ? "border-red-400 focus:ring-1 focus:ring-red-500"
                            : "border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                    }`}
                />

                {errors.rent && (
                    <p className="text-[11px] font-medium text-red-600">
                        {errors.rent}
                    </p>
                )}
            </div>

            {/* Status */}
            <div className="space-y-1.5">
                <label
                    htmlFor="status"
                    className="block text-xs font-semibold text-neutral-700"
                >
                    Status
                </label>

                <select
                    id="status"
                    value={status}
                    onChange={(event) =>
                        setStatus(event.target.value as Room["status"])
                    }
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                </select>
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
                    placeholder="Add room notes, balcony details, etc..."
                    rows={3}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                />
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 border-t border-neutral-100 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-neutral-700 shadow-2xs hover:bg-neutral-50 transition-colors disabled:opacity-50 cursor-pointer"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto rounded-xl bg-neutral-900 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-2xs hover:bg-neutral-800 transition-all disabled:opacity-50 cursor-pointer"
                >
                    {isSubmitting
                        ? "Saving..."
                        : room
                        ? "Update Room"
                        : "Create Room"}
                </button>
            </div>

        </form>
    );

}