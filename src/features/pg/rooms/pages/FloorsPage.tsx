import { useNavigate } from "react-router";
import { useFloors } from "../hooks/useFloors";
import { useState } from "react";
import { CreateFloorInput, Floor } from "../types/floor.types";
import { FloorCard } from "../components/FloorCard";
import { FloorForm } from "../components/FloorForm";
import { useRooms } from "../hooks/useRooms";
import { useBranches } from "../../branches/hooks/useBranches";
import { BranchSelector } from "../../branches/components/BranchSelector";

export function FloorsPage() {
    const navigate = useNavigate()

    const { branches, loading: branchesLoading, error: branchesError } = useBranches()

    const [showForm, setShowForm] = useState(false)
    const [editingFloor, setEditingFloor] = useState<Floor | undefined>()
    const [selectedBranchId, setSelectedBranchId] = useState<string>('')

    const { floors, isLoading, error, addFloor, editFloor, removeFloor } = useFloors(selectedBranchId)


    const { rooms } = useRooms()

    const selectedBranch = branches.find(branch => branch.id === selectedBranchId)

    function getRoomCount(floorId: string): number {
        return rooms.filter(room => room.floorId === floorId).length
    }

    function handleBranchChange(branchId: string) {
        setSelectedBranchId(branchId)
        setShowForm(false)
        setEditingFloor(undefined)
    }

    async function handleSubmit(data: CreateFloorInput) {
        if (!selectedBranchId) {
            alert('Please select a branch first')
            return
        }

        try {
            if (editingFloor) {
                await editFloor(editingFloor.id, {
                    branchId: selectedBranchId
                })
            }
            else {
                await addFloor({
                    ...data,
                    branchId: selectedBranchId
                })
            }
            setEditingFloor(undefined)
            setShowForm(false)

        } catch (error) {
            console.error('Failed to save floor', error)
        }
    }

    function handleAdd() {
        if (!selectedBranchId) {
            alert('Please select a branch first')
            return
        }

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

        try {
            await removeFloor(floor.id)
        } catch (error) {
            console.error('Failed to delete floors', error)
        }

    }

    function handleViewRooms(floor: Floor) {
        navigate(`/pg/rooms/floor/${floor.id}`)
    }

    function handleCancelForm() {
        setShowForm(false)
        setEditingFloor(undefined)
    }

    if (branchesLoading) {
        return (
            <div className="p-10 text-center">

                <p className="text-sm text-muted-foreground">
                    Loading branches...
                </p>

            </div>
        );
    }

    if (branchesError) {
        return (
            <div className="mx-auto max-w-7xl p-6">

                <div className="
                    rounded-md
                    bg-destructive/10
                    p-4
                    text-sm
                    text-destructive
                ">
                    {branchesError}
                </div>

            </div>
        );
    }

    if (showForm) {
        return (

            <div className="mx-auto max-w-4xl space-y-6">

                {/* Back */}

                <div>

                    <button
                        type="button"
                        onClick={handleCancelForm}
                        className="
                            text-sm
                            text-muted-foreground
                            hover:underline
                        "
                    >
                        ← Back to Floors
                    </button>

                </div>


                {/* Header */}

                <div>

                    <p className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-[0.18em]
                        text-primary
                    ">
                        PG Management
                    </p>

                    <h1 className="
                        mt-1
                        text-3xl
                        font-semibold
                    ">
                        {editingFloor
                            ? "Edit Floor"
                            : "Create Floor"}
                    </h1>

                    <p className="
                        mt-1
                        text-sm
                        text-muted-foreground
                    ">
                        {editingFloor
                            ? "Update floor information."
                            : "Create a new floor inside the selected branch."}
                    </p>

                </div>


                {/* Selected Branch */}

                <div className="
                    rounded-xl
                    border
                    bg-card
                    p-5
                ">

                    <p className="
                        text-xs
                        font-medium
                        uppercase
                        tracking-wide
                        text-muted-foreground
                    ">
                        Branch
                    </p>

                    <p className="
                        mt-1
                        text-lg
                        font-semibold
                    ">
                        {selectedBranch?.name ??
                            "Selected Branch"}
                    </p>

                    {selectedBranch && (
                        <p className="
                            mt-1
                            text-sm
                            text-muted-foreground
                        ">
                            Code: {selectedBranch.code}
                        </p>
                    )}

                </div>


                {/* Floor Form */}

                <div className="
                    rounded-xl
                    border
                    bg-card
                    p-6
                ">

                    <FloorForm
                        branchId={selectedBranchId}
                        floor={editingFloor}
                        onSubmit={handleSubmit}
                        onCancel={handleCancelForm}
                    />

                </div>

            </div>
        );

    }

    return (

        <div className="
            mx-auto
            max-w-7xl
            space-y-6
        ">

            {/* ---------------------------------------- */}
            {/* HEADER */}
            {/* ---------------------------------------- */}

            <div className="
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-end
                sm:justify-between
            ">

                <div>

                    <p className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-[0.18em]
                        text-primary
                    ">
                        PG Management
                    </p>

                    <h1 className="
                        mt-1
                        text-3xl
                        font-semibold
                    ">
                        Floors
                    </h1>

                    <p className="
                        mt-1
                        text-sm
                        text-muted-foreground
                    ">
                        Select a branch to manage its floors and rooms.
                    </p>

                </div>


                <button
                    type="button"
                    onClick={handleAdd}
                    disabled={!selectedBranchId}
                    className="
                        rounded-md
                        bg-primary
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-primary-foreground
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    + Add Floor
                </button>

            </div>


            {/* ---------------------------------------- */}
            {/* BRANCH SELECTOR */}
            {/* ---------------------------------------- */}

            <BranchSelector
                branches={branches}
                value={selectedBranchId}
                onChange={handleBranchChange}
            />


            {/* ---------------------------------------- */}
            {/* NO BRANCH SELECTED */}
            {/* ---------------------------------------- */}

            {!selectedBranchId && (

                <div className="
                    rounded-xl
                    border
                    border-dashed
                    p-12
                    text-center
                ">

                    <h2 className="font-semibold">
                        Select a branch
                    </h2>

                    <p className="
                        mt-1
                        text-sm
                        text-muted-foreground
                    ">
                        Select a branch above to view and manage its floors.
                    </p>

                </div>
            )}


            {/* ---------------------------------------- */}
            {/* SELECTED BRANCH */}
            {/* ---------------------------------------- */}

            {selectedBranchId && (

                <>

                    {/* Branch heading */}

                    <div className="
                        flex
                        items-center
                        justify-between
                        rounded-xl
                        border
                        bg-card
                        px-5
                        py-4
                    ">

                        <div>

                            <p className="
                                text-xs
                                uppercase
                                tracking-wide
                                text-muted-foreground
                            ">
                                Selected Branch
                            </p>

                            <h2 className="
                                mt-1
                                text-xl
                                font-semibold
                            ">
                                {selectedBranch?.name}
                            </h2>

                        </div>


                        <span className="
                            rounded-md
                            bg-muted
                            px-3
                            py-1
                            text-sm
                            font-medium
                        ">
                            {floors.length}{" "}
                            {floors.length === 1
                                ? "Floor"
                                : "Floors"}
                        </span>

                    </div>


                    {/* Error */}

                    {error && (

                        <div className="
                            rounded-md
                            bg-destructive/10
                            p-3
                            text-sm
                            text-destructive
                        ">
                            {error}
                        </div>
                    )}


                    {/* Loading */}

                    {isLoading ? (

                        <div className="
                            rounded-xl
                            border
                            p-10
                            text-center
                        ">

                            <p className="
                                text-sm
                                text-muted-foreground
                            ">
                                Loading floors...
                            </p>

                        </div>

                    ) : floors.length === 0 ? (

                        /* No floors */

                        <div className="
                            rounded-xl
                            border
                            border-dashed
                            p-12
                            text-center
                        ">

                            <h2 className="font-semibold">
                                No floors found
                            </h2>

                            <p className="
                                mt-1
                                text-sm
                                text-muted-foreground
                            ">
                                This branch does not have any floors yet.
                            </p>

                            <button
                                type="button"
                                onClick={handleAdd}
                                className="
                                    mt-4
                                    rounded-md
                                    bg-primary
                                    px-4
                                    py-2
                                    text-sm
                                    text-primary-foreground
                                "
                            >
                                + Add Floor
                            </button>

                        </div>

                    ) : (

                        /* Floors */

                        <div className="
                            grid
                            gap-4
                            md:grid-cols-2
                            xl:grid-cols-3
                        ">

                            {floors
                                .slice()
                                .sort(
                                    (a, b) =>
                                        a.floorNumber -
                                        b.floorNumber
                                )
                                .map(
                                    (floor) => (

                                        <FloorCard
                                            key={floor.id}
                                            floor={floor}

                                            roomCount={
                                                getRoomCount(
                                                    floor.id
                                                )
                                            }

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

                                    )
                                )}

                        </div>
                    )}

                </>
            )}

        </div>
    );

}