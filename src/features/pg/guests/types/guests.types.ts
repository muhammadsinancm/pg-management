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
    status: GuestStatus
    notes?: string
    createdAt?: string
    updatedAt?: string
}

export interface CreateGuestInput {
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
    status?: GuestStatus
    notes?: string
}