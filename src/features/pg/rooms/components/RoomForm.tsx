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

        if (!branchId.trim()) {
            alert('Branch is required')
            return
        }
        if (!roomNumber.trim()) {
            alert('Room number is required')
            return
        }

        const capacityNumber = Number(capacity)

        if (!Number.isInteger(capacityNumber) || capacityNumber <= 0) {
            alert('Enter a valid capacity')
            return
        }

        const rentNumber = Number(rent)

        if (Number.isNaN(rentNumber) || rentNumber < 0) {
            alert('Enter a valid rent')
            return
        }

        const data: CreateRoomInput = {
            branchId: branchId.trim(),
            roomNumber: roomNumber.trim(),
            floor: floor.trim(),
            type,
            sharingType,
            capacity: capacityNumber,
            rent: rentNumber,
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
    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >

            {/* Branch */}
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
                    onChange={(e) => setBranchId(e.target.value)}
                    placeholder="Enter branch ID"
                    className="w-full rounded-md border px-3 py-2"
                    required
                />
            </div>

            {/* Room Number */}
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
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="101"
                    className="w-full rounded-md border px-3 py-2"
                    required
                />
            </div>

            {/* Floor */}
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
                    onChange={(e) => setFloor(e.target.value)}
                    placeholder="Ground Floor"
                    className="w-full rounded-md border px-3 py-2"
                />
            </div>

            {/* Room Type */}
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
                        setType(e.target.value as RoomType)
                    }
                    className="w-full rounded-md border px-3 py-2"
                >
                    <option value="AC">AC</option>
                    <option value="NON_AC">Non AC</option>
                </select>
            </div>

            {/* Sharing */}
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
                        setSharingType(e.target.value as SharingType)
                    }
                    className="w-full rounded-md border px-3 py-2"
                >
                    <option value="SINGLE">Single</option>
                    <option value="DOUBLE">Double</option>
                    <option value="TRIPLE">Triple</option>
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
                    className="text-sm font-medium"
                >
                    Capacity
                </label>

                <input
                    id="capacity"
                    type="number"
                    min="1"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="4"
                    className="w-full rounded-md border px-3 py-2"
                    required
                />
            </div>

            {/* Rent */}
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
                    onChange={(e) => setRent(e.target.value)}
                    placeholder="8000"
                    className="w-full rounded-md border px-3 py-2"
                    required
                />
            </div>

            {/* Status */}
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
                        setStatus(e.target.value as Room['status'])
                    }
                    className="w-full rounded-md border px-3 py-2"
                >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">
                        Maintenance
                    </option>
                </select>
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
                    onChange={(e) =>
                        setDescription(e.target.value)
                    }
                    placeholder="Room description..."
                    rows={4}
                    className="w-full rounded-md border px-3 py-2"
                />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">

                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-md border px-4 py-2"
                    >
                        Cancel
                    </button>
                )}

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
    )

}