import { FormEvent, useEffect, useState } from "react";
import { CreateRoomInput, Room, RoomType, SharingType } from "../types/room.types";

interface RoomFormProps {
    room?: Room
    onSubmit: (date: CreateRoomInput) => Promise<void>
    onCancel: () => void
}

export function RoomForm({ room, onSubmit, onCancel }: RoomFormProps) {

    const [branchId, setBranchId] = useState(room?.branchId ?? '')
    const [roomNumber, setRoomNumber] = useState(room?.roomNumber ?? '')
    const [floor, setFloor] = useState(room?.floor ?? '')
    const [type, setType] = useState<RoomType>(room?.type ?? 'AC')
    const [sharingType, setSharingType] = useState<SharingType>(room?.sharingType ?? 'SINGLE')
    const [capacity, setCapacity] = useState('')
    const [rent, setRent] = useState('')
    const [status, setStatus] = useState<Room['status']>(room?.status ?? 'available')
    const [description, setDescription] = useState(room?.description ?? '')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({
        branchId: '',
        roomNumber: '',
        floor: '',
        capacity: '',
        rent: '',
    })

    useEffect(() => {
        if (!room) {
            setBranchId('')
            setRoomNumber('')
            setFloor('')
            setType('AC')
            setSharingType('SINGLE')
            setCapacity('')
            setRent('')
            setStatus('available')
            setDescription('')
            return
        }

        setBranchId(room.branchId)
        setRoomNumber(room.roomNumber)
        setFloor(room.floor)
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
            branchId: '',
            roomNumber: '',
            floor: '',
            capacity: '',
            rent: ''
        }

        if (!branchId.trim()) {
            newErrors.branchId = 'Branch is required'
        }
        if (!roomNumber.trim()) {
            newErrors.roomNumber = 'Room number is required'
        }
        if (!floor.trim()) {
            newErrors.floor = 'Floor is required'
        }
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
            branchId: branchId.trim(),
            roomNumber: roomNumber.trim(),
            floor: floor.trim(),
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
            [field] : ''
        }))
    }

    return (
        <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-6"
        >

            <div className="space-y-2">

                <label
                    htmlFor="branchId"
                    className="text-sm font-medium"
                >
                    Branch
                </label>

                <input
                    id="branchId"
                    value={branchId}
                    onChange={(e) => {
                        setBranchId(e.target.value);

                        if (e.target.value.trim()) {
                            clearError('branchId');
                        }
                    }}
                    placeholder="Enter branch ID"
                    className={`w-full rounded-md border px-3 py-2 outline-none ${errors.branchId
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:border-primary'
                        }`}
                />

                {errors.branchId && (
                    <p className="text-sm text-red-500">
                        {errors.branchId}
                    </p>
                )}

            </div>

            <div className="space-y-2">

                <label
                    htmlFor="roomNumber"
                    className="text-sm font-medium"
                >
                    Room Number
                </label>

                <input
                    id="roomNumber"
                    value={roomNumber}
                    onChange={(e) => {
                        setRoomNumber(e.target.value);

                        if (e.target.value.trim()) {
                            clearError('roomNumber');
                        }
                    }}
                    placeholder="101"
                    className={`w-full rounded-md border px-3 py-2 outline-none ${errors.roomNumber
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:border-primary'
                        }`}
                />

                {errors.roomNumber && (
                    <p className="text-sm text-red-500">
                        {errors.roomNumber}
                    </p>
                )}

            </div>

            <div className="space-y-2">

                <label
                    htmlFor="floor"
                    className="text-sm font-medium"
                >
                    Floor
                </label>

                <input
                    id="floor"
                    value={floor}
                    onChange={(e) => {
                        setFloor(e.target.value);

                        if (e.target.value.trim()) {
                            clearError('floor');
                        }
                    }}
                    placeholder="Ground Floor"
                    className={`w-full rounded-md border px-3 py-2 outline-none ${errors.floor
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:border-primary'
                        }`}
                />

                {errors.floor && (
                    <p className="text-sm text-red-500">
                        {errors.floor}
                    </p>
                )}

            </div>

            <div className="space-y-2">

                <label
                    htmlFor="type"
                    className="text-sm font-medium"
                >
                    Room Type
                </label>

                <select
                    id="type"
                    value={type}
                    onChange={(e) =>
                        setType(
                            e.target.value as RoomType
                        )
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-primary"
                >
                    <option value="AC">
                        AC
                    </option>

                    <option value="NON_AC">
                        Non AC
                    </option>
                </select>

            </div>

            <div className="space-y-2">

                <label
                    htmlFor="sharingType"
                    className="text-sm font-medium"
                >
                    Sharing Type
                </label>

                <select
                    id="sharingType"
                    value={sharingType}
                    onChange={(e) =>
                        setSharingType(
                            e.target.value as SharingType
                        )
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-primary"
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

            <div className="space-y-2">

                <label
                    htmlFor="capacity"
                    className="text-sm font-medium"
                >
                    Capacity
                </label>

                <input
                    id="capacity"
                    type="number"
                    min="1"
                    value={capacity}
                    onChange={(e) => {
                        setCapacity(e.target.value);

                        if (e.target.value.trim()) {
                            clearError('capacity');
                        }
                    }}
                    placeholder="4"
                    className={`w-full rounded-md border px-3 py-2 outline-none ${errors.capacity
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:border-primary'
                        }`}
                />

                {errors.capacity && (
                    <p className="text-sm text-red-500">
                        {errors.capacity}
                    </p>
                )}

            </div>

            <div className="space-y-2">

                <label
                    htmlFor="rent"
                    className="text-sm font-medium"
                >
                    Monthly Rent
                </label>

                <input
                    id="rent"
                    type="number"
                    min="0"
                    value={rent}
                    onChange={(e) => {
                        setRent(e.target.value);

                        if (e.target.value.trim()) {
                            clearError('rent');
                        }
                    }}
                    placeholder="8000"
                    className={`w-full rounded-md border px-3 py-2 outline-none ${errors.rent
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:border-primary'
                        }`}
                />

                {errors.rent && (
                    <p className="text-sm text-red-500">
                        {errors.rent}
                    </p>
                )}

            </div>

            <div className="space-y-2">

                <label
                    htmlFor="status"
                    className="text-sm font-medium"
                >
                    Status
                </label>

                <select
                    id="status"
                    value={status}
                    onChange={(e) =>
                        setStatus(
                            e.target.value as Room['status']
                        )
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-primary"
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
                    onChange={(e) =>
                        setDescription(e.target.value)
                    }
                    placeholder="Room description..."
                    rows={4}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-primary"
                />

            </div>

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
                        : room
                            ? 'Update Room'
                            : 'Create Room'}
                </button>

            </div>

        </form>
    );

}