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

let roomsCache: Room[] | null = null;
let roomsCacheTimestamp = 0;
const ROOMS_CACHE_TTL_MS = 60 * 1000;

export function clearRoomsCache(): void {
    roomsCache = null;
    roomsCacheTimestamp = 0;
}

export async function getRooms(floorId?: string, forceRefresh = false): Promise<Room[]> {
    const now = Date.now();
    if (!forceRefresh && roomsCache && (now - roomsCacheTimestamp < ROOMS_CACHE_TTL_MS)) {
        if (!floorId) {
            return roomsCache;
        }
        return roomsCache.filter((room) => room.floorId === floorId);
    }

    const rooms = await roomRepository.list(COLLECTION);
    const roomsWithBeds = await Promise.all(rooms.map((room) => ensureRoomBeds(room)));
    roomsCache = roomsWithBeds;
    roomsCacheTimestamp = now;

    if (!floorId) {
        return roomsWithBeds;
    }

    return roomsWithBeds.filter((room) => room.floorId === floorId);
}

export async function getRoom(id: string): Promise<Room | null> {
    if (roomsCache) {
        const found = roomsCache.find((r) => r.id === id);
        if (found) return found;
    }
    const room = await roomRepository.get(COLLECTION, id);

    if (!room) {
        return null;
    }

    return ensureRoomBeds(room);
}

export async function getRoomsByFloor(floorId: string): Promise<Room[]> {
    const rooms = await getRooms(floorId);
    return rooms;
}

export async function createRoom(room: CreateRoomInput): Promise<Room> {
    const beds = room.beds?.length ? room.beds : createBeds(room.capacity);
    const data: Omit<Room, 'id'> = {
        ...room,
        beds,
    };

    const created = await roomRepository.create(COLLECTION, data);
    if (roomsCache) {
        roomsCache.push(created);
    }
    return created;
}

export async function addMissingGedsToRooms(): Promise<void> {
    const rooms = await roomRepository.list(COLLECTION);

    for (const room of rooms) {
        if (room.beds && room.beds.length > 0) {
            continue;
        }

        const beds = createBeds(room.capacity);
        await roomRepository.update(COLLECTION, room.id, {
            beds
        });
    }
}

export async function updateRoom(id: string, data: Partial<Omit<Room, 'id'>>): Promise<Room> {
    const updated = await roomRepository.update(COLLECTION, id, data);
    if (roomsCache) {
        roomsCache = roomsCache.map((r) => (r.id === id ? { ...r, ...updated } : r));
    }
    return updated;
}

export async function deleteRoom(id: string): Promise<void> {
    await roomRepository.remove(COLLECTION, id);
    if (roomsCache) {
        roomsCache = roomsCache.filter((r) => r.id !== id);
    }
}

async function ensureRoomBeds(room: Room): Promise<Room> {
    if (room.beds && room.beds.length > 0) {
        return room
    }
    const beds = createBeds(room.capacity)

    return roomRepository.update(COLLECTION, room.id, {
        beds
    })
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

export async function allocateBed(roomId: string, bedId: string, guestId: string, guestName: string): Promise<Room> {
    return updateBed(roomId, bedId, {
        status: 'occupied',
        guestId,
        guestName
    })
}

export async function vacateBed(roomId: string, bedId: string): Promise<Room> {
    return updateBed(roomId, bedId, {
        status: 'available',
        guestId: null,
        guestName: null
    })
}

export async function setBedMaintenance(roomId: string, bedId: string): Promise<Room> {
    return updateBed(roomId, bedId, {
        status: 'maintenance',
        guestId: null,
        guestName: null
    })
}

export async function makeBedAvailable(roomId: string, bedId: string): Promise<Room> {
    return updateBed(roomId, bedId, {
        status: 'available',
        guestId: null,
        guestName: null
    })
}