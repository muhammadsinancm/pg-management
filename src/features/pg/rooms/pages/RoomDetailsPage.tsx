import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, AlertCircle } from "lucide-react";
import {
    allocateBed,
    getRoom,
    makeBedAvailable,
    setBedMaintenance,
    vacateBed,
} from "../services/roomService";
import { VacateBedDialog } from "../components/VacateBedDialog";
import { BedAllocation } from "../components/BedAllocation";
import { RoomDetails } from "../components/RoomDetails";
import type { Room } from "../types/room.types";
import type { Bed } from "../types/bed.types";

export function RoomDetailsPage() {
    const navigate = useNavigate();
    const { roomId } = useParams<{ roomId: string }>();

    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [allocationBed, setAllocationBed] = useState<Bed | null>(null);
    const [vacateBedState, setVacateBedState] = useState<Bed | null>(null);

    async function loadRoom() {
        if (!roomId) return;

        try {
            setLoading(true);
            setError(null);
            const data = await getRoom(roomId);

            if (!data) {
                setError("Room not found");
                return;
            }

            setRoom(data);
        } catch (err) {
            console.error(err);
            setError("Failed to load room");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadRoom();
    }, [roomId]);

    async function handleAllocate(customerId: string, customerName: string) {
        if (!roomId || !allocationBed) return;
        const updated = await allocateBed(roomId, allocationBed.id, customerId, customerName);
        setRoom(updated);
        setAllocationBed(null);
    }

    async function handleVacate() {
        if (!roomId || !vacateBedState) return;
        const updated = await vacateBed(roomId, vacateBedState.id);
        setRoom(updated);
        setVacateBedState(null);
    }

    async function handleMaintenance(bed: Bed) {
        if (!roomId) return;
        const updated = await setBedMaintenance(roomId, bed.id);
        setRoom(updated);
    }

    async function handleMakeAvailable(bed: Bed) {
        if (!roomId) return;
        const updated = await makeBedAvailable(roomId, bed.id);
        setRoom(updated);
    }

    const backUrl = room?.floorId ? `/pg/rooms/floor/${room.floorId}` : "/pg/rooms";

    if (loading) {
        return (
            <div className="w-full space-y-4 animate-pulse">
                <div className="h-4 w-32 rounded bg-neutral-200" />
                <div className="h-48 rounded-2xl border border-neutral-100 bg-white p-6 shadow-2xs" />
                <div className="grid grid-cols-3 gap-2.5">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-20 rounded-2xl border border-neutral-100 bg-white p-4 shadow-2xs" />
                    ))}
                </div>
            </div>
        );
    }

    if (error || !room) {
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

                <div className="rounded-2xl border border-red-200 bg-red-50/80 p-6 text-center shadow-2xs">
                    <AlertCircle className="mx-auto h-8 w-8 text-red-600" />
                    <h2 className="mt-2 text-base font-bold text-red-900">
                        {error ?? "Room not found"}
                    </h2>
                    <p className="mt-0.5 text-xs text-red-700">
                        The requested room could not be loaded.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-4">
            {/* Back to Floor / Rooms */}
            <button
                type="button"
                onClick={() => navigate(backUrl)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
            >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Floor Rooms
            </button>

            {/* Room Details component */}
            <RoomDetails
                room={room}
                onAllocate={(bed) => setAllocationBed(bed)}
                onVacate={(bed) => setVacateBedState(bed)}
                onMaintenance={handleMaintenance}
                onMakeAvailable={handleMakeAvailable}
            />

            {/* Allocate Bed Modal */}
            <BedAllocation
                bed={allocationBed}
                open={Boolean(allocationBed)}
                onClose={() => setAllocationBed(null)}
                onSubmit={handleAllocate}
            />

            {/* Vacate Bed Dialog */}
            <VacateBedDialog
                bed={vacateBedState}
                open={Boolean(vacateBedState)}
                onClose={() => setVacateBedState(null)}
                onConfirm={handleVacate}
            />
        </div>
    );
}