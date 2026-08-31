import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Floor } from "../types/floor.types";
import { CreateRoomInput, Room } from "../types/room.types";
import { useRooms } from "../hooks/useRooms";
import { RoomForm } from "../components/RoomForm";
import { getFloor } from "../services/floorService";

export function FloorRoomsPage() {
    const navigate = useNavigate()
    const { floorId } = useParams<{ floorId: string }>()
    const [floor, setFloor] = useState<Floor | null>(null)
    const [loadingFloor, setLoadingFloor] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingRoom, setEditingRoom] = useState<Room | undefined>()
    const [search, setSearch] = useState('')

    const { rooms, isLoading, error, addRoom, editRoom, removeRoom } = useRooms(floorId ?? '')

    const branchId = floor?.branchId ?? 'branch-001'

    useEffect(() => {
        async function loadFloor() {

            if (!floorId) {
                return
            }

            try {
                setLoadingFloor(true)
                const data = await getFloor(floorId)
                setFloor(data)

            } catch (error) {
                console.error(error)
            } finally {
                setLoadingFloor(false)
            }

        }
        loadFloor()
    }, [floorId])

    async function handleSubmit(data: CreateRoomInput) {
        
        if (editingRoom) {
            await editRoom(editingRoom.id, data)
        } else {
            await addRoom(data)
        }
        setEditingRoom(undefined)
        setShowForm(false)
    }

    function handleAddRoom() {
        setEditingRoom(undefined)
        setShowForm(true)
    }

    function handleEdit(room: Room) {
        setEditingRoom(room)
        setShowForm(true)
    }

    async function handleDelete(room: Room) {
        const confirmed = window.confirm(`Delete room ${room.roomNumber}?`)
        if (!confirmed) {
            return
        }
        await removeRoom(room.id)
    }

    function handleView(room: Room) {
        navigate(`/pg/rooms/${room.id}`)
    }

    const filteredRooms = rooms.filter(room => {
        const query = search.toLowerCase().trim()
        if (!query) {
            return true
        }
        return (
            room.roomNumber.toLowerCase().includes(query) ||
            room.type.toLowerCase().includes(query) ||
            room.sharingType.toLowerCase().includes(query)
        )
    })

    if (loadingFloor || isLoading) {
        return (

            <div className="p-10 text-center">

                Loading...

            </div>
        )
    }

    if (!floor) {
        return (

            <div className="space-y-4">

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            '/pg/rooms'
                        )
                    }
                    className="text-sm text-muted-foreground"
                >
                    ← Back to floors
                </button>

                <div className="rounded-xl border p-8 text-center">

                    <h2 className="font-semibold">
                        Floor not found
                    </h2>

                </div>

            </div>
        )
    }

    if (showForm) {
        return (

            <div className="mx-auto max-w-4xl">

                <div className="mb-6">

                    <button
                        type="button"
                        onClick={() => {
                            setShowForm(false)
                            setEditingRoom(undefined)
                        }}
                        className="text-sm text-muted-foreground"
                    >
                        ← Back to rooms
                    </button>

                    <h1 className="mt-3 text-3xl font-semibold">

                        {editingRoom
                            ? 'Edit Room'
                            : 'Add Room'}

                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">

                        {floor.name}

                    </p>

                </div>


                <div className="rounded-xl border bg-card p-6">

                    <RoomForm
                        branchId={
                            branchId
                        }

                        floorId={
                            floor.id
                        }

                        room={
                            editingRoom
                        }

                        onSubmit={
                            handleSubmit
                        }

                        onCancel={() => {
                            setShowForm(false)
                            setEditingRoom(undefined)
                        }}
                    />

                </div>

            </div>
        )
    }

    return (

        <div className="mx-auto max-w-7xl space-y-6">

            {/* Back */}

            <button
                type="button"
                onClick={() =>
                    navigate(
                        '/pg/rooms'
                    )
                }
                className="text-sm text-muted-foreground hover:text-foreground"
            >
                ← Back to floors
            </button>


            {/* Header */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                <div>

                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                        Floor {floor.floorNumber}
                    </p>

                    <h1 className="mt-1 text-3xl font-semibold">
                        {floor.name}
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {rooms.length} rooms
                    </p>

                </div>


                <button
                    type="button"
                    onClick={
                        handleAddRoom
                    }
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                    + Add Room
                </button>

            </div>


            {/* Search */}

            <input
                value={search}
                onChange={event =>
                    setSearch(
                        event.target.value
                    )
                }
                placeholder="Search rooms..."
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />


            {/* Error */}

            {error && (

                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                </div>

            )}


            {/* Rooms */}

            {filteredRooms.length === 0 ? (

                <div className="rounded-xl border border-dashed p-12 text-center">

                    <h2 className="font-semibold">
                        No rooms found
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Add the first room to this floor.
                    </p>

                    <button
                        type="button"
                        onClick={
                            handleAddRoom
                        }
                        className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
                    >
                        + Add Room
                    </button>

                </div>

            ) : (

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                    {filteredRooms.map(
                        room => (

                            <div
                                key={room.id}
                                className="rounded-xl border bg-card p-5"
                            >

                                <div className="flex items-start justify-between">

                                    <div>

                                        <p className="text-sm text-muted-foreground">
                                            Room
                                        </p>

                                        <h2 className="text-2xl font-semibold">
                                            {room.roomNumber}
                                        </h2>

                                    </div>


                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${room.status === 'available'
                                                ? 'bg-green-100 text-green-700'
                                                : room.status === 'occupied'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}
                                    >
                                        {room.status}
                                    </span>

                                </div>


                                <div className="mt-5 space-y-3 text-sm">

                                    <div className="flex justify-between">

                                        <span className="text-muted-foreground">
                                            Type
                                        </span>

                                        <span>
                                            {room.type === 'AC'
                                                ? 'AC'
                                                : 'Non AC'}
                                        </span>

                                    </div>


                                    <div className="flex justify-between">

                                        <span className="text-muted-foreground">
                                            Sharing
                                        </span>

                                        <span>
                                            {room.sharingType}
                                        </span>

                                    </div>


                                    <div className="flex justify-between">

                                        <span className="text-muted-foreground">
                                            Capacity
                                        </span>

                                        <span>
                                            {room.capacity} beds
                                        </span>

                                    </div>


                                    <div className="flex justify-between">

                                        <span className="text-muted-foreground">
                                            Rent
                                        </span>

                                        <span>
                                            ₹
                                            {room.rent.toLocaleString(
                                                'en-IN'
                                            )}
                                        </span>

                                    </div>

                                </div>


                                <div className="mt-5 flex gap-2">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleView(
                                                room
                                            )
                                        }
                                        className="flex-1 rounded-md border px-3 py-2 text-sm"
                                    >
                                        View
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleEdit(
                                                room
                                            )
                                        }
                                        className="rounded-md border px-3 py-2 text-sm"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(
                                                room
                                            )
                                        }
                                        className="rounded-md border px-3 py-2 text-sm text-red-500"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}

        </div>
    )

}