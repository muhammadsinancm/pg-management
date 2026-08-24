import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Room } from "../types/room.types";
import { Bed } from "../types/bed.types";
import { allocateBed, getRoom, setBedMaintenance, vacateBed } from "../services/roomService";
import { VacateBedDialog } from "../components/VacateBedDialog";
import { BedAllocation } from "../components/BedAllocation";
import { RoomDetails } from "../components/RoomDetails";

export function RoomDetailsPage() {

    const navigate = useNavigate()

    const { roomId } = useParams<{ roomId: string }>()

    const [room, setRoom] = useState<Room | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [allocationBed, setAllocationBed] = useState<Bed | null>(null)
    const [vacateBedState, setVacateBedState] = useState<Bed | null>(null)

    async function loadRoom() {
        if (!roomId) {
            return
        }

        try {
            setLoading(true)
            setError(null)

            const data = await getRoom(roomId)

            if (!data) {
                setError('Room not found')
                return
            }

            setRoom(data)

        } catch (error) {
            console.error(error)
            setError('Failed to load room')

        } finally {
            setLoading(false)
        }

    }

    useEffect(() => {
        loadRoom()
    }, [roomId])

    async function handleAllocate(customerId: string, customerName: string) {
        if (!roomId || !allocationBed) {
            return
        }
        const updated = await allocateBed(roomId, allocationBed?.id, customerId, customerName)
        setRoom(updated)
    }

    async function handleVacate() {
        if (!roomId || !vacateBedState) {
            return
        }
        const updated = await vacateBed(roomId, vacateBedState.id)
        setRoom(updated)
    }

    async function handleMaintenance(bed: Bed) {
        if (!roomId) {
            return
        }
        const updated = await setBedMaintenance(roomId, bed.id)
        setRoom(updated)
    }

    if (loading) {
        return (
            <div className="p-10 text-center">
                Loading room...
            </div>
        )
    }

    if (error || !room) {
        return (
            <div className="space-y-4">
                <button
                    type="button"
                    onClick={() =>
                        navigate('/rooms')
                    }
                    className="text-sm text-muted-foreground"
                >
                    ← Back to rooms
                </button>

                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
                    <h2 className="font-semibold">
                        {error ??
                            'Room not found'}
                    </h2>
                </div>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <button
                type="button"
                onClick={() =>
                    navigate('/rooms')
                }
                className="text-sm text-muted-foreground hover:text-foreground"
            >
                ← Back to rooms
            </button>

            <RoomDetails
                room={room}
                onAllocate={(bed) =>
                    setAllocationBed(bed)
                }
                onVacate={(bed) =>
                    setVacateBedState(bed)
                }
                onMaintenance={
                    handleMaintenance
                }
            />

            <BedAllocation
                bed={allocationBed}
                open={Boolean(
                    allocationBed
                )}
                onClose={() =>
                    setAllocationBed(null)
                }
                onSubmit={
                    handleAllocate
                }
            />

            <VacateBedDialog
                bed={vacateBedState}
                open={Boolean(
                    vacateBedState
                )}
                onClose={() =>
                    setVacateBedState(null)
                }
                onConfirm={
                    handleVacate
                }
            />
        </div>
    )

}