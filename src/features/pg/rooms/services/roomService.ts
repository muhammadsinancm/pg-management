import { FirebaseFirestoreRepository } from "@/services/firebase/firestore";
import { CreateRoomInput, Room } from "../types/room.types";
import { Bed } from "../types/bed.types";

const COLLECTION = 'rooms'

const roomRepository = new FirebaseFirestoreRepository<Room>()

function createBeds(capacity: number): Bed[] {
    return Array.from({ length: capacity }, (_, index) => ({
        id: `bed-${index + 1}`,
        bedNumber: `${index + 1}`,
        status: 'available'
    }))
}

export async function getRooms(): Promise<Room[]> {
    return roomRepository.list(COLLECTION)
}

export async function getRoom(id: string): Promise<Room | null> {
    return roomRepository.get(COLLECTION, id)
}

export async function createRoom(room: CreateRoomInput): Promise<Room> {

    const beds = room.beds?.length ? room.beds : createBeds(room.capacity)
    const data: Omit<Room, 'id'> = {
        ...room,
        status: 'available',
        beds,
    }
    return roomRepository.create(COLLECTION, data)
}

export async function updateRoom(id: string, data: Partial<Omit<Room, 'id'>>): Promise<Room> {
    return roomRepository.update(COLLECTION, id, data)
}

export async function deleteRoom(id: string): Promise<void> {
    return roomRepository.remove(COLLECTION, id)
}

export async function updateBed(roomId: string, bedId: string, data: Partial<Bed>): Promise<Room> {
    const room = await getRoom(roomId)

    if (!room) {
        throw new Error('Room not found')
    }

    const beds = (room.beds ?? []).map((bed) => bed.id === bedId ? { ...bed, ...data } : bed)

    return updateRoom(roomId, {
        beds
    })
}

export async function allocateBed(roomId: string, bedId: string, customerId: string, customerName: string): Promise<Room> {
    return updateBed(roomId, bedId, {
        status: 'occupied',
        customerId,
        customerName
    })
}

export async function vacateBed(roomId: string, bedId: string): Promise<Room> {
    return updateBed(roomId, bedId, {
        status: 'available',
        customerId: null,
        customerName: null
    })
}

export async function setBedMaintenance(roomId: string, bedId: string): Promise<Room> {
    return updateBed(roomId, bedId, {
        status: 'maintenance',
        customerId: null,
        customerName: null
    })
}

export async function makeBedAvailable(roomId: string, bedId: string): Promise<Room> {
    return updateBed(roomId, bedId, {
        status: 'available',
        customerId: null,
        customerName: null
    })
}