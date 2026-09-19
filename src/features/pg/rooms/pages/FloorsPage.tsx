import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Layers, Plus, AlertCircle, ArrowLeft } from "lucide-react";
import { useFloors } from "../hooks/useFloors";
import { useRooms } from "../hooks/useRooms";
import { useBranches } from "../../branches/hooks/useBranches";
import { BranchSelector, BranchSelectorSkeleton } from "../../branches/components/BranchSelector";
import { FloorCard, FloorCardSkeleton } from "../components/FloorCard";
import { FloorForm } from "../components/FloorForm";
import type { CreateFloorInput, Floor } from "../types/floor.types";

export function FloorsPage() {
    const navigate = useNavigate();

    const { branches, loading: branchesLoading, error: branchesError } = useBranches();

    const [showForm, setShowForm] = useState(false);
    const [editingFloor, setEditingFloor] = useState<Floor | undefined>();
    const [selectedBranchId, setSelectedBranchId] = useState<string>(() => {
        return localStorage.getItem("selected_branch_id") || "";
    });

    const { floors, isLoading, error, addFloor, editFloor, removeFloor } = useFloors(selectedBranchId);
    const { rooms, isLoading: roomsLoading } = useRooms();

    // Auto-select first branch or restore from localStorage
    useEffect(() => {
        if (branches.length > 0) {
            const valid = selectedBranchId && branches.some((b) => b.id === selectedBranchId);
            if (!valid) {
                const newId = branches[0].id;
                setSelectedBranchId(newId);
                localStorage.setItem("selected_branch_id", newId);
            }
        }
    }, [branches, selectedBranchId]);

    const selectedBranch = branches.find((branch) => branch.id === selectedBranchId);

    function getRoomCount(floorId: string): number {
        return rooms.filter((room) => room.floorId === floorId).length;
    }

    function handleBranchChange(branchId: string) {
        setSelectedBranchId(branchId);
        localStorage.setItem("selected_branch_id", branchId);
        setShowForm(false);
        setEditingFloor(undefined);
    }

    async function handleSubmit(data: CreateFloorInput) {
        if (!selectedBranchId) {
            alert("Please select a branch first");
            return;
        }

        try {
            if (editingFloor) {
                await editFloor(editingFloor.id, {
                    branchId: selectedBranchId,
                });
            } else {
                await addFloor({
                    ...data,
                    branchId: selectedBranchId,
                });
            }
            setEditingFloor(undefined);
            setShowForm(false);
        } catch (err) {
            console.error("Failed to save floor", err);
        }
    }

    function handleAdd() {
        if (!selectedBranchId) {
            alert("Please select a branch first");
            return;
        }

        setEditingFloor(undefined);
        setShowForm(true);
    }

    function handleEdit(floor: Floor) {
        setEditingFloor(floor);
        setShowForm(true);
    }

    async function handleDelete(floor: Floor) {
        const confirmed = window.confirm(`Delete ${floor.name}?`);
        if (!confirmed) return;

        try {
            await removeFloor(floor.id);
        } catch (err) {
            console.error("Failed to delete floor", err);
        }
    }

    function handleViewRooms(floor: Floor) {
        navigate(`/pg/rooms/floor/${floor.id}`, {
            state: { floor, floors, branch: selectedBranch }
        });
    }

    function handleCancelForm() {
        setShowForm(false);
        setEditingFloor(undefined);
    }

    if (branchesLoading) {
        return (
            <div className="w-full space-y-4">
                {/* Header Skeleton */}
                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between animate-pulse">
                    <div className="space-y-1.5">
                        <div className="h-6 w-36 rounded-md bg-neutral-200" />
                        <div className="h-3.5 w-64 max-w-full rounded bg-neutral-100" />
                    </div>
                    <div className="h-8 w-full sm:w-24 rounded-xl bg-neutral-100" />
                </div>

                {/* Branch Selector Skeleton */}
                <BranchSelectorSkeleton />

                {/* Floors Section Skeleton */}
                <div className="space-y-2.5">
                    <div className="flex items-center justify-between px-0.5 animate-pulse">
                        <div className="space-y-1">
                            <div className="h-4 w-32 rounded bg-neutral-200" />
                            <div className="h-3 w-56 rounded bg-neutral-100" />
                        </div>
                        <div className="h-5 w-16 rounded-md bg-neutral-100" />
                    </div>

                    <div className="grid grid-cols-1 gap-2.5 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <FloorCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (branchesError) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50/80 p-4 shadow-2xs">
                <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                    <div>
                        <h3 className="text-sm font-bold text-red-900">Failed to load branches</h3>
                        <p className="mt-0.5 text-xs text-red-700">{branchesError}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Form View
    if (showForm) {
        return (
            <div className="mx-auto max-w-2xl space-y-4">
                <button
                    type="button"
                    onClick={handleCancelForm}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Floors
                </button>

                <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
                    <div className="border-b border-neutral-100 pb-3">
                        <h2 className="text-base sm:text-lg font-bold text-neutral-900">
                            {editingFloor ? "Edit Floor" : "Create Floor"}
                        </h2>
                        <p className="text-xs text-neutral-400">
                            {editingFloor
                                ? `Updating floor in ${selectedBranch?.name ?? "branch"}`
                                : `Adding a new floor to ${selectedBranch?.name ?? "branch"}`}
                        </p>
                    </div>

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
        <div className="w-full space-y-4">
            {/* Header */}
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                        Floors & Rooms
                    </h1>
                    <p className="mt-0.5 text-xs text-neutral-400">
                        Select a branch to manage its floors, rooms, and bed capacity
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleAdd}
                    disabled={!selectedBranchId}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
                >
                    <Plus className="h-3.5 w-3.5" />
                    Add Floor
                </button>
            </div>

            {/* Interactive Branch Selector Cards */}
            <BranchSelector
                branches={branches}
                value={selectedBranchId}
                onChange={handleBranchChange}
            />

            {/* Error banner if floor fetch fails */}
            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50/80 p-3.5 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                        <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                        <p className="text-xs font-semibold text-red-800">{error}</p>
                    </div>
                </div>
            )}

            {/* Floors Section */}
            {selectedBranchId && (
                <div className="space-y-2.5">
                    <div className="flex items-center justify-between px-0.5 gap-2">
                        <div className="min-w-0 flex-1">
                            <h2 className="text-xs sm:text-sm font-bold tracking-tight text-neutral-900 truncate">
                                {selectedBranch?.name} — Floors
                            </h2>
                            <p className="text-[10px] sm:text-[11px] text-neutral-400 truncate">
                                Click View Rooms to manage rooms and beds
                            </p>
                        </div>

                        <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-600 shrink-0">
                            {floors.length} {floors.length === 1 ? "Floor" : "Floors"}
                        </span>
                    </div>

                    {isLoading && floors.length === 0 ? (
                        <div className="grid grid-cols-1 gap-2.5 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <FloorCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : floors.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-8 text-center shadow-2xs">
                            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
                                <Layers className="h-5 w-5" />
                            </div>
                            <h3 className="mt-2 text-sm font-bold text-neutral-900">
                                No Floors Found
                            </h3>
                            <p className="mt-0.5 text-xs text-neutral-400">
                                This branch does not have any floors registered yet.
                            </p>
                            <button
                                type="button"
                                onClick={handleAdd}
                                className="mt-3.5 inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-neutral-800 transition-all cursor-pointer"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                Add First Floor
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-2.5 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {floors
                                .slice()
                                .sort((a, b) => a.floorNumber - b.floorNumber)
                                .map((floor) => (
                                    <FloorCard
                                        key={floor.id}
                                        floor={floor}
                                        roomCount={getRoomCount(floor.id)}
                                        isLoadingRoomCount={roomsLoading}
                                        onViewRooms={handleViewRooms}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}