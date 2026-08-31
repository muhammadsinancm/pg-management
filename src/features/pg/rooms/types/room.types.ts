import { Bed } from "./bed.types"

export type RoomType = | 'AC' | 'NON_AC'

export type SharingType = | 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'FOUR_SHARING' | 'DORMITORY'

export type RoomStatus = | 'available' | 'occupied' | 'maintenance'

export interface Room {
    id: string
    branchId: string
    floorId: string
    roomNumber: string
    type: RoomType
    sharingType: SharingType
    capacity: number
    rent: number
    status: RoomStatus
    description?: string
    beds?:Bed[]

    createdAt?: string
    updatedAt?: string
}

export type CreateRoomInput = Omit<
    Room,
    'id' | 'createdAt' | 'updatedAt'
>