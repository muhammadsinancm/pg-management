import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import {
    ArrowLeft,
    Plus,
    Search,
    LayoutGrid,
    Table as TableIcon,
    AlertCircle,
    BedDouble,
    Layers,
} from "lucide-react";
import { useRooms } from "../hooks/useRooms";
import { getFloor, getFloors } from "../services/floorService";
import { RoomForm } from "../components/RoomForm";
import { RoomCard, RoomCardSkeleton } from "../components/RoomCard";
import { RoomTable } from "../components/RoomTable";
import type { Floor } from "../types/floor.types";
import type { CreateRoomInput, Room, RoomStatus } from "../types/room.types";

interface LocationState {
    floor?: Floor;
    floors?: Floor[];
    branch?: { id: string; name: string };
}

export function FloorRoomsPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { floorId } = useParams<{ floorId: string }>();

    const state = (location.state as LocationState) || {};
    const [floor, setFloor] = useState<Floor | null>(() => {
        if (state.floor && state.floor.id === floorId) {
            return state.floor;
        }
        return null;
    });
    const [floorsList, setFloorsList] = useState<Floor[]>(() => state.floors || []);
    const [loadingFloor, setLoadingFloor] = useState(() => !state.floor || state.floor.id !== floorId);

    const [showForm, setShowForm] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | undefined>();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<RoomStatus | "all">("all");
    const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

    const { rooms, isLoading, error, addRoom, editRoom, removeRoom } = useRooms(floorId ?? "");

    const branchId = floor?.branchId ?? "";

    useEffect(() => {
        if (!floorId) return;

        // If floor matches state, just ensure floors list is loaded
        if (state.floor && state.floor.id === floorId) {
            setFloor(state.floor);
            setLoadingFloor(false);
            if (state.floor.branchId && floorsList.length === 0) {
                getFloors(state.floor.branchId).then(setFloorsList).catch(console.error);
            }
            return;
        }

        async function loadFloor() {
            try {
                setLoadingFloor(true);
                const data = await getFloor(floorId!);
                setFloor(data);
                if (data?.branchId) {
                    const branchFloors = await getFloors(data.branchId);
                    setFloorsList(branchFloors);
                }
            } catch (err) {
                console.error("Failed to load floor", err);
            } finally {
                setLoadingFloor(false);
            }
        }
        loadFloor();
    }, [floorId, state.floor]);

    async function handleSubmit(data: CreateRoomInput) {
        if (editingRoom) {
            await editRoom(editingRoom.id, data);
        } else {
            await addRoom(data);
        }
        setEditingRoom(undefined);
        setShowForm(false);
    }

    function handleAddRoom() {
        setEditingRoom(undefined);
        setShowForm(true);
    }

    function handleEdit(room: Room) {
        setEditingRoom(room);
        setShowForm(true);
    }

    async function handleDelete(room: Room) {
        const confirmed = window.confirm(`Delete room ${room.roomNumber}?`);
        if (!confirmed) return;
        await removeRoom(room.id);
    }

    function handleView(room: Room) {
        navigate(`/pg/rooms/${room.id}`);
    }

    const filteredRooms = rooms.filter((room) => {
        const query = search.toLowerCase().trim();
        const matchesSearch =
            !query ||
            room.roomNumber.toLowerCase().includes(query) ||
            room.type.toLowerCase().includes(query) ||
            room.sharingType.toLowerCase().includes(query);

        const matchesStatus = statusFilter === "all" || room.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const totalRooms = rooms.length;
    const availableCount = rooms.filter((r) => r.status === "available").length;
    const occupiedCount = rooms.filter((r) => r.status === "occupied").length;
    const maintenanceCount = rooms.filter((r) => r.status === "maintenance").length;

    if (!floor && !loadingFloor) {
        return (
            <div className="space-y-4">
                <button
                    type="button"
                    onClick={() => navigate("/pg/rooms")}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Floors
                </button>

                <div className="rounded-2xl border border-neutral-100 bg-white p-10 text-center shadow-2xs">
                    <AlertCircle className="mx-auto h-8 w-8 text-neutral-400" />
                    <h2 className="mt-2 text-base font-bold text-neutral-900">Floor not found</h2>
                    <p className="mt-0.5 text-xs text-neutral-400">
                        The requested floor could not be located.
                    </p>
                </div>
            </div>
        );
    }

    if (showForm && floor) {
        return (
            <div className="mx-auto max-w-2xl space-y-4">
                <button
                    type="button"
                    onClick={() => {
                        setShowForm(false);
                        setEditingRoom(undefined);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Rooms
                </button>

                <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
                    <div className="border-b border-neutral-100 pb-3">
                        <h2 className="text-base sm:text-lg font-bold text-neutral-900">
                            {editingRoom ? "Edit Room" : "Add Room"}
                        </h2>
                        <p className="text-xs text-neutral-400">
                            {floor.name} — Floor {floor.floorNumber}
                        </p>
                    </div>

                    <RoomForm
                        branchId={branchId}
                        floorId={floor.id}
                        room={editingRoom}
                        onSubmit={handleSubmit}
                        onCancel={() => {
                            setShowForm(false);
                            setEditingRoom(undefined);
                        }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-3.5">
            {/* Back Navigation */}
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => navigate("/pg/rooms")}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Floors
                </button>
            </div>

            {/* Header */}
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    {floor ? (
                        <>
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                                {floor.name}
                            </h1>
                            <p className="mt-0.5 text-xs text-neutral-400">
                                Floor {floor.floorNumber} — {totalRooms} {totalRooms === 1 ? "room" : "rooms"} registered
                            </p>
                        </>
                    ) : (
                        <div className="space-y-1.5 animate-pulse">
                            <div className="h-6 w-36 rounded-md bg-neutral-200" />
                            <div className="h-3 w-48 rounded bg-neutral-100" />
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleAddRoom}
                    disabled={!floor}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-neutral-800 disabled:opacity-50 cursor-pointer shrink-0"
                >
                    <Plus className="h-3.5 w-3.5" />
                    Add Room
                </button>
            </div>

            {/* Floor Switcher Tabs (Switch floors instantly without reloading whole page) */}
            {floorsList.length > 1 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 shrink-0 mr-1">
                        Floors:
                    </span>
                    {floorsList
                        .slice()
                        .sort((a, b) => a.floorNumber - b.floorNumber)
                        .map((f) => {
                            const isActive = f.id === floorId;
                            return (
                                <button
                                    key={f.id}
                                    type="button"
                                    onClick={() => {
                                        if (!isActive) {
                                            navigate(`/pg/rooms/floor/${f.id}`, {
                                                state: { floor: f, floors: floorsList }
                                            });
                                        }
                                    }}
                                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0 ${
                                        isActive
                                            ? "bg-neutral-900 text-white shadow-xs"
                                            : "border border-neutral-100 bg-white text-neutral-600 hover:border-neutral-200 hover:bg-neutral-50"
                                    }`}
                                >
                                    <Layers className="h-3.5 w-3.5" />
                                    <span>{f.name}</span>
                                </button>
                            );
                        })}
                </div>
            )}

            {/* Quick Stat Badges */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5">
                <button
                    type="button"
                    onClick={() => setStatusFilter("all")}
                    className={`rounded-xl border p-2.5 text-left transition-all cursor-pointer shadow-2xs ${
                        statusFilter === "all"
                            ? "border-neutral-900 bg-neutral-900 text-white"
                            : "border-neutral-100 bg-white hover:border-neutral-200"
                    }`}
                >
                    <span className="text-[10px] font-semibold opacity-70 block">TOTAL ROOMS</span>
                    <span className="text-base font-bold">{totalRooms}</span>
                </button>

                <button
                    type="button"
                    onClick={() => setStatusFilter("available")}
                    className={`rounded-xl border p-2.5 text-left transition-all cursor-pointer shadow-2xs ${
                        statusFilter === "available"
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : "border-neutral-100 bg-white hover:border-neutral-200"
                    }`}
                >
                    <span className="text-[10px] font-semibold opacity-70 block">AVAILABLE</span>
                    <span className="text-base font-bold">{availableCount}</span>
                </button>

                <button
                    type="button"
                    onClick={() => setStatusFilter("occupied")}
                    className={`rounded-xl border p-2.5 text-left transition-all cursor-pointer shadow-2xs ${
                        statusFilter === "occupied"
                            ? "border-neutral-800 bg-neutral-800 text-white"
                            : "border-neutral-100 bg-white hover:border-neutral-200"
                    }`}
                >
                    <span className="text-[10px] font-semibold opacity-70 block">OCCUPIED</span>
                    <span className="text-base font-bold">{occupiedCount}</span>
                </button>

                <button
                    type="button"
                    onClick={() => setStatusFilter("maintenance")}
                    className={`rounded-xl border p-2.5 text-left transition-all cursor-pointer shadow-2xs ${
                        statusFilter === "maintenance"
                            ? "border-amber-600 bg-amber-600 text-white"
                            : "border-neutral-100 bg-white hover:border-neutral-200"
                    }`}
                >
                    <span className="text-[10px] font-semibold opacity-70 block">MAINTENANCE</span>
                    <span className="text-base font-bold">{maintenanceCount}</span>
                </button>
            </div>

            {/* Search and View Controls */}
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search rooms by number, type, sharing..."
                        className="w-full rounded-xl border border-neutral-200 bg-white pl-9 pr-3.5 py-2 text-xs sm:text-sm placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                    />
                </div>

                {/* Grid / Table View Mode Toggle */}
                <div className="inline-flex items-center rounded-xl border border-neutral-200 bg-white p-0.5 shadow-2xs">
                    <button
                        type="button"
                        onClick={() => setViewMode("grid")}
                        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                            viewMode === "grid"
                                ? "bg-neutral-900 text-white"
                                : "text-neutral-500 hover:text-neutral-900"
                        }`}
                    >
                        <LayoutGrid className="h-3.5 w-3.5" />
                        Grid
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode("table")}
                        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                            viewMode === "table"
                                ? "bg-neutral-900 text-white"
                                : "text-neutral-500 hover:text-neutral-900"
                        }`}
                    >
                        <TableIcon className="h-3.5 w-3.5" />
                        Table
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50/80 p-3.5 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                        <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                        <p className="text-xs font-semibold text-red-800">{error}</p>
                    </div>
                </div>
            )}

            {/* Rooms View */}
            {isLoading && filteredRooms.length === 0 ? (
                <div className="grid grid-cols-1 gap-2.5 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <RoomCardSkeleton key={i} />
                    ))}
                </div>
            ) : filteredRooms.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-8 text-center shadow-2xs">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
                        <BedDouble className="h-5 w-5" />
                    </div>
                    <h3 className="mt-2 text-sm font-bold text-neutral-900">No Rooms Found</h3>
                    <p className="mt-0.5 text-xs text-neutral-400">
                        {search || statusFilter !== "all"
                            ? "No rooms match your filter criteria."
                            : "Add the first room to this floor."}
                    </p>
                    <button
                        type="button"
                        onClick={handleAddRoom}
                        className="mt-3.5 inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-neutral-800 transition-all cursor-pointer"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Add Room
                    </button>
                </div>
            ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 gap-2.5 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredRooms.map((room) => (
                        <RoomCard
                            key={room.id}
                            room={room}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            ) : (
                <RoomTable
                    rooms={filteredRooms}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
}