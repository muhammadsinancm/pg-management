export type BedStatus = | 'available' | 'occupied' | 'maintenance'

export interface Bed {
    id: string
    bedNumber: string
    status: BedStatus
    
    guestId?: string | null
    guestName?:string | null
}