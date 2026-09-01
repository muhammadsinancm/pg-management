export type GuestStatus = | 'active' | 'checked_out' | 'cancelled'

export type Gender = 'male' | 'female' | 'other'

export type IdType = | 'aadhar' | 'passport' | 'driving_license' | 'voter_id' | 'other'

interface EmergencyContact {
    name: string
    phone: string
    relation: string
}

export interface Guest {
    id: string
    branchId: string
    fullName: string
    phone: string
    email?: string
    dateOfBirth?: string
    gender?: Gender
    idType?: IdType
    idNumber?: string
    address?: string
    city?: string
    state?: string
    pincode?: string
    emergencyContact?: EmergencyContact
    floorId?: string
    floorNumber?: number
    floorName?: string
    roomId?: string
    roomNumber?: string
    bedId?: string
    bedNumber?: string
    checkInDate?: string
    expectedCheckOutDate?: string
    actualcheckOutDate?: string
    status: GuestStatus
    notes?: string
    createdAt?: string
    updatedAt?: string
}

export interface CreateGuestInput {
    branchId: string
    fullName: string
    phone: string
    email?: string
    dateOfBirth?: string
    gender?: Gender
    idType?: IdType
    idNumber?: string
    address?: string
    city?: string
    state?: string
    pincode?: string
    emergencyContact?: EmergencyContact
    floorId?: string
    floorNumber?: number
    floorName?: string
    roomId?: string
    roomNumber?: string
    bedId?: string
    bedNumber?: string
    checkInDate?: string
    expectedCheckOutDate?: string
    status?: GuestStatus
    notes?: string
}