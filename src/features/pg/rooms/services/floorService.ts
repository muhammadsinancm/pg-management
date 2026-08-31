import { FirebaseFirestoreRepository } from "@/services/firebase/firestore"
import { CreateFloorInput, Floor } from "../types/floor.types"

const COLLECTION = 'floor'

const floorRepository = new FirebaseFirestoreRepository<Floor>()

export async function getFloors(): Promise<Floor[]> {
    return floorRepository.list(COLLECTION)
}

export async function getFloor(id: string): Promise<Floor | null> {
    return floorRepository.get(COLLECTION, id)
}

export async function createFloor(floor: CreateFloorInput): Promise<Floor> {
    return floorRepository.create(COLLECTION, floor)
}

export async function updateFloor(id: string, data: Partial<Omit<Floor, 'id'>>): Promise<Floor> {
    return floorRepository.update(COLLECTION, id, data)
}

export async function deleteFloor(id: string): Promise<void> {
    return floorRepository.remove(COLLECTION, id)
}