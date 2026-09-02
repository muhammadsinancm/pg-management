import { firestoreDb } from "@/services/firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Room } from "../../rooms/types/room.types";

export async function releaseGuestBed(roomId: string, bedId: string): Promise<void> {
    const roomRef = doc(firestoreDb, 'rooms', roomId)
    const snapshot = await getDoc(roomRef)

    if (!snapshot.exists()) {
        throw new Error('Room not found')
    }

    const room = {
        id: snapshot.id,
        ...snapshot.data()
    } as Room

    const beds = room.beds ?? []
    const targetBed = beds.find(bed => bed.id === bedId)

    if (!targetBed) {
        throw new Error('Bed not found')
    }

    const updatedBeds = beds.map(bed => {
        if (bed.id === bedId) {
            return {
                ...bed,
                status: 'available' as const,
                guestId: null,
                guestName: null
            }
        }
        return bed
    })

    const updatedRoom = {
        ...room,
        beds: updatedBeds
    }

    const roomStatus = getRoomStatus(updatedRoom)

    await updateDoc(roomRef, {
        beds: updatedBeds,
        status: roomStatus,
        updatedAt: new Date().toISOString()
    })

}

function getRoomStatus(room: Room): Room['status'] {
    const beds = room.beds ?? []

    const hasOccupiedBed = beds.some(bed => bed.status === 'occupied')
    const hasAvailableBed = beds.some(bed => bed.status === 'available')

    if (hasOccupiedBed) {
        return 'occupied'
    }
    if (hasAvailableBed) {
        return 'available'
    }
    return 'maintenance'
}

export async function allocateGuestBed(roomId: string, bedId: string, guestId: string, guestName: string): Promise<void> {
    const roomRef = doc(firestoreDb, 'rooms', roomId)
    const snapshot = await getDoc(roomRef)

    if (!snapshot.exists()) {
        throw new Error('Room not found')
    }

    const room = {
        id: snapshot.id,
        ...snapshot.data()
    } as Room

    const beds = room.beds ?? []
    const targetBed = beds.find(bed => bed.id === bedId)

    if (!targetBed) {
        throw new Error('Bed not found')
    }

    if (targetBed.status !== 'available') {
        throw new Error('Bed is not available')
    }

    const updatedBeds = beds.map(bed => {
        if (bed.id === bedId) {
            return {
                ...bed,
                status: 'occupied' as const,
                guestId,
                guestName
            }
        }
        return bed
    })

    const updatedRoom = {
        ...room,
        beds: updatedBeds
    }

    const roomStatus = getRoomStatus(updatedRoom)

    await updateDoc(roomRef, {
        beds: updatedBeds,
        status: roomStatus,
        updatedAt: new Date().toISOString()
    })


}