export type BedStatus = | 'available' | 'occupied' | 'maintenance'

export interface Bed {
    id: string
    bedNumber: string
    status: BedStatus
    
    customerId?: string | null
    customerName?:string | null
}