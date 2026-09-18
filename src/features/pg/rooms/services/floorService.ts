import { FirebaseFirestoreRepository } from "@/services/firebase/firestore"
import { CreateFloorInput, Floor } from "../types/floor.types"

const COLLECTION = 'floor'

const floorRepository = new FirebaseFirestoreRepository<Floor>()

let floorsCache: Floor[] | null = null
let floorsCacheTimestamp = 0
const CACHE_TTL_MS = 60 * 1000 // 60 seconds

export function clearFloorsCache(): void {
    floorsCache = null
    floorsCacheTimestamp = 0
}

export async function getFloors(branchId?: string, forceRefresh = false): Promise<Floor[]> {
    const now = Date.now()
    if (!forceRefresh && floorsCache && (now - floorsCacheTimestamp < CACHE_TTL_MS)) {
        if (!branchId) {
            return floorsCache
        }
        return floorsCache.filter(floor => floor.branchId === branchId)
    }

    const floors = await floorRepository.list(COLLECTION)
    if (!floors) {
        return []
    }
    floorsCache = floors
    floorsCacheTimestamp = now

    if (!branchId) {
        return floors
    }

    return floors.filter(floor => floor.branchId === branchId)
}

export async function getFloor(id: string): Promise<Floor | null> {
    if (floorsCache) {
        const found = floorsCache.find(f => f.id === id)
        if (found) return found
    }
    return floorRepository.get(COLLECTION, id)
}

export async function createFloor(floor: CreateFloorInput): Promise<Floor> {
    const created = await floorRepository.create(COLLECTION, floor)
    if (floorsCache) {
        floorsCache.push(created)
    }
    return created
}

export async function updateFloor(id: string, data: Partial<Omit<Floor, 'id'>>): Promise<Floor> {
    const updated = await floorRepository.update(COLLECTION, id, data)
    if (floorsCache) {
        floorsCache = floorsCache.map(f => f.id === id ? updated : f)
    }
    return updated
}

export async function deleteFloor(id: string): Promise<void> {
    await floorRepository.remove(COLLECTION, id)
    if (floorsCache) {
        floorsCache = floorsCache.filter(f => f.id !== id)
    }
}