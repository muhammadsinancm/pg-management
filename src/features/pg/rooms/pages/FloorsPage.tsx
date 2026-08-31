import { useNavigate } from "react-router";
import { useFloors } from "../hooks/useFloors";
import { useState } from "react";
import { Floor } from "../types/floor.types";
import { FloorCard } from "../components/FloorCard";
import { FloorForm } from "../components/FloorForm";
import { useRooms } from "../hooks/useRooms";

export function FloorsPage() {
    const navigate = useNavigate()

    const { floors, isLoading, error, addFloor, editFloor, removeFloor } = useFloors()

    const [showForm, setShowForm] = useState(false)
    const [editingFloor, setEditingFloor] = useState<Floor | undefined>()

    const branchId = 'branch-001'

    const {rooms} = useRooms()

    function getRoomCount(floorId: string): number {
        return rooms.filter(room => room.floorId === floorId).length
    }

    async function handleSubmit(data: any) {
        if (editingFloor) {
            await editFloor(editingFloor.id, data)

        } else {
            await addFloor(data)
        }

        setEditingFloor(undefined)
        setShowForm(false)
    }

    function handleAdd() {
        setEditingFloor(undefined)
        setShowForm(true)
    }

    function handleEdit(floor: Floor) {
        setEditingFloor(floor)
        setShowForm(true)
    }

    async function handleDelete(floor: Floor) {
        const confirmed = window.confirm(`Delete ${floor.name}`)

        if (!confirmed) {
            return
        }

        await removeFloor(floor.id)
    }

    function handleViewRooms(floor: Floor) {
        navigate(`/pg/rooms/floor/${floor.id}`)
    }

    if (showForm) {
        return (

            <div className="mx-auto max-w-4xl">

                <div className="mb-6">

                    <button
                        type="button"
                        onClick={() => {
                            setShowForm(false)
                            setEditingFloor(undefined)
                        }}
                        className="text-sm text-muted-foreground"
                    >
                        ← Back to floors
                    </button>

                    <h1 className="mt-3 text-3xl font-semibold">
                        {editingFloor
                            ? 'Edit Floor'
                            : 'Create Floor'}
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Create and manage a floor in your PG.
                    </p>

                </div>


                <div className="rounded-xl border bg-card p-6">

                    <FloorForm
                        branchId={branchId}
                        floor={editingFloor}
                        onSubmit={handleSubmit}
                        onCancel={() => {
                            setShowForm(false)
                            setEditingFloor(undefined)
                        }}
                    />

                </div>

            </div>
        )
    }

    return (

        <div className="mx-auto max-w-7xl space-y-6">

            {/* Header */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                <div>

                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                        PG Management
                    </p>

                    <h1 className="mt-1 text-3xl font-semibold">
                        Floors
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage floors and rooms in your PG.
                    </p>

                </div>


                <button
                    type="button"
                    onClick={handleAdd}
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                    + Add Floor
                </button>

            </div>


            {/* Error */}

            {error && (

                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                </div>

            )}


            {/* Loading */}

            {isLoading ? (

                <div className="rounded-xl border p-10 text-center">

                    <p className="text-sm text-muted-foreground">
                        Loading floors...
                    </p>

                </div>

            ) : floors.length === 0 ? (

                <div className="rounded-xl border border-dashed p-12 text-center">

                    <h2 className="font-semibold">
                        No floors found
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Create your first floor to add rooms.
                    </p>

                    <button
                        type="button"
                        onClick={handleAdd}
                        className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
                    >
                        + Add Floor
                    </button>

                </div>

            ) : (

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                    {floors
                        .sort(
                            (a, b) =>
                                a.floorNumber -
                                b.floorNumber
                        )
                        .map(floor => (

                            <FloorCard
                                key={floor.id}
                                floor={floor}

                                /*
                                 * For now room count is 0.
                                 * Later we can load counts efficiently.
                                 */
                                roomCount={getRoomCount(floor.id)}

                                onViewRooms={
                                    handleViewRooms
                                }

                                onEdit={
                                    handleEdit
                                }

                                onDelete={
                                    handleDelete
                                }
                            />

                        ))}

                </div>

            )}

        </div>
    )

}