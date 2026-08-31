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
    const [loading, setLoading] = useState(false)
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
            <div className="space-y-2">

                <label
                    htmlFor="roomNumber"
                    className="text-sm font-medium text-gray-900"
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
                    className={`w-full rounded-md border px-3 py-2 outline-none transition ${errors.roomNumber
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 focus:border-teal-600"
                        }`}
                />

                {errors.roomNumber && (
                    <p className="text-sm text-red-500">
                        {errors.roomNumber}
                    </p>
                )}

            </div>


            {/* Room Type */}
            <div className="space-y-2">

                <label
                    htmlFor="type"
                    className="text-sm font-medium text-gray-900"
                >
                    Room Type
                </label>

                <select
                    id="type"
                    value={type}
                    onChange={(event) =>
                        setType(
                            event.target.value as RoomType
                        )
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-teal-600"
                >

                    <option value="AC">
                        AC
                    </option>

                    <option value="NON_AC">
                        Non AC
                    </option>

                </select>

            </div>


            {/* Sharing Type */}
            <div className="space-y-2">

                <label
                    htmlFor="sharingType"
                    className="text-sm font-medium text-gray-900"
                >
                    Sharing Type
                </label>

                <select
                    id="sharingType"
                    value={sharingType}
                    onChange={(event) =>
                        setSharingType(
                            event.target.value as SharingType
                        )
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-teal-600"
                >

                    <option value="SINGLE">
                        Single
                    </option>

                    <option value="DOUBLE">
                        Double
                    </option>

                    <option value="TRIPLE">
                        Triple
                    </option>

                    <option value="FOUR_SHARING">
                        Four Sharing
                    </option>

                    <option value="DORMITORY">
                        Dormitory
                    </option>

                </select>

            </div>


            {/* Capacity */}
            <div className="space-y-2">

                <label
                    htmlFor="capacity"
                    className="text-sm font-medium text-gray-900"
                >
                    Capacity
                </label>

                <input
                    id="capacity"
                    type="number"
                    min="1"
                    value={capacity}
                    onChange={(event) => {

                        setCapacity(
                            event.target.value
                        );

                        if (
                            event.target.value.trim()
                        ) {
                            clearError(
                                "capacity"
                            );
                        }

                    }}
                    placeholder="4"
                    className={`w-full rounded-md border px-3 py-2 outline-none transition ${errors.capacity
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 focus:border-teal-600"
                        }`}
                />

                {errors.capacity && (
                    <p className="text-sm text-red-500">
                        {errors.capacity}
                    </p>
                )}

            </div>


            {/* Monthly Rent */}
            <div className="space-y-2">

                <label
                    htmlFor="rent"
                    className="text-sm font-medium text-gray-900"
                >
                    Monthly Rent
                </label>

                <input
                    id="rent"
                    type="number"
                    min="0"
                    value={rent}
                    onChange={(event) => {

                        setRent(
                            event.target.value
                        );

                        if (
                            event.target.value.trim()
                        ) {
                            clearError("rent");
                        }

                    }}
                    placeholder="8000"
                    className={`w-full rounded-md border px-3 py-2 outline-none transition ${errors.rent
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 focus:border-teal-600"
                        }`}
                />

                {errors.rent && (
                    <p className="text-sm text-red-500">
                        {errors.rent}
                    </p>
                )}

            </div>


            {/* Status */}
            <div className="space-y-2">

                <label
                    htmlFor="status"
                    className="text-sm font-medium text-gray-900"
                >
                    Status
                </label>

                <select
                    id="status"
                    value={status}
                    onChange={(event) =>
                        setStatus(
                            event.target.value as Room["status"]
                        )
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-teal-600"
                >

                    <option value="available">
                        Available
                    </option>

                    <option value="occupied">
                        Occupied
                    </option>

                    <option value="maintenance">
                        Maintenance
                    </option>

                </select>

            </div>


            {/* Description */}
            <div className="space-y-2">

                <label
                    htmlFor="description"
                    className="text-sm font-medium text-gray-900"
                >
                    Description
                </label>

                <textarea
                    id="description"
                    value={description}
                    onChange={(event) =>
                        setDescription(
                            event.target.value
                        )
                    }
                    placeholder="Room description..."
                    rows={4}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-teal-600"
                />

            </div>


            {/* Buttons */}
            <div className="flex justify-end gap-3 border-t pt-5">

                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
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