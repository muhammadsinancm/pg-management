import { useNavigate } from "react-router";
import { useRooms } from "../hooks/useRooms";
import { useState } from "react";
import { Room } from "../types/room.types";
import { RoomCard } from "../components/RoomCard";
import { RoomTable } from "../components/RoomTable";

export function RoomsPage() {

    const navigate = useNavigate()
    const { rooms, isLoading, error, removeRoom } = useRooms()

    const [search, setSearch] = useState('')
    const [view, setView] = useState<'table' | 'card'>('table')

    const filteredRooms = rooms.filter((room) => {
        const query = search.toLowerCase().trim()
        if (!query) {
            return true
        }

        return (
            room.roomNumber.toLowerCase().includes(query) ||
            room.floorId.toLowerCase().includes(query) ||
            room.type.toLowerCase().includes(query) ||
            room.sharingType.toLowerCase().includes(query)
        )
    })


    function handleEdit(room: Room) {
       navigate(`/pg/floors/${room.floorId}`)
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

    function handleAdd() {
       navigate('/pg/floors')
    }

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                        PG Management
                    </p>

                    <h1 className="mt-1 text-3xl font-semibold">
                        Rooms
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage rooms, beds, occupancy
                        and room status.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleAdd}
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                    + Add Room
                </button>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
                <input
                    value={search}
                    onChange={(event) =>
                        setSearch(
                            event.target.value
                        )
                    }
                    placeholder="Search rooms..."
                    className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
                />

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() =>
                            setView('table')
                        }
                        className={`rounded-md border px-4 py-2 text-sm ${view === 'table'
                                ? 'bg-muted'
                                : ''
                            }`}
                    >
                        Table
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setView('card')
                        }
                        className={`rounded-md border px-4 py-2 text-sm ${view === 'card'
                                ? 'bg-muted'
                                : ''
                            }`}
                    >
                        Cards
                    </button>
                </div>
            </div>

            {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="rounded-xl border p-10 text-center">
                    <p className="text-sm text-muted-foreground">
                        Loading rooms...
                    </p>
                </div>
            ) : filteredRooms.length === 0 ? (
                <div className="rounded-xl border border-dashed p-12 text-center">
                    <h2 className="font-semibold">
                        No rooms found
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Add your first room to get
                        started.
                    </p>

                    <button
                        type="button"
                        onClick={handleAdd}
                        className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
                    >
                        Add Room
                    </button>
                </div>
            ) : view === 'table' ? (
                <RoomTable
                    rooms={filteredRooms}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filteredRooms.map(
                        (room) => (
                            <RoomCard
                                key={room.id}
                                room={room}
                                onView={handleView}
                                onEdit={handleEdit}
                                onDelete={
                                    handleDelete
                                }
                            />
                        )
                    )}
                </div>
            )}
        </div>
    )
}