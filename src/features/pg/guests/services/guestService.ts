import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { CreateGuestInput, Guest, GuestStatus } from "../types/guests.types";
import { firestoreDb } from "@/services/firebase/config";
import { allocateGuestBed, releaseGuestBed } from "./guestAccommodationService";

const guestsCollection = collection(firestoreDb, 'guests')

export async function getGuests(): Promise<Guest[]> {
    const snapshot = await getDocs(guestsCollection)
    return snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data()
    })) as Guest[]
}

export async function getGuest(guestId: string): Promise<Guest | null> {
    const guestRef = doc(guestsCollection, guestId)
    const snapshot = await getDoc(guestRef)

    if (!snapshot.exists()) {
        return null
    }

    return {
        id: snapshot.id,
        ...snapshot.data()
    } as Guest
}

export async function createGuest(data: CreateGuestInput): Promise<Guest> {

    const guestRef = doc(guestsCollection)
    const status: GuestStatus = data.status ?? 'active'

    const now = new Date().toISOString()

    const guest: Guest = {
        id: guestRef.id,
        ...data,
        status,
        createdAt: now,
        updatedAt: now
    }

    await setDoc(guestRef, guest)

    if (status === 'active' && data.roomId && data.bedId) {
        try {
            await allocateGuestBed(data.roomId, data.bedId, guest.id, guest.fullName)

        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Failed to allocate bed')
        }
    }

    return guest

}

export async function updateGuest(guestId: string, data: Partial<CreateGuestInput>): Promise<void> {
    const guestRef = doc(firestoreDb, 'guests', guestId)

    await updateDoc(guestRef, {
        ...data,
        updatedAt: new Date().toISOString()
    })
}

export async function deleteGuest(guestId: string): Promise<void> {
    const guestRef = doc(firestoreDb, 'guests', guestId)
    const snapshot = await getDoc(guestRef)
    if (!snapshot.exists()) {
        throw new Error('Guest not found')
    }

    const guest = snapshot.data() as Guest

    if (guest.status === 'active') {
        throw new Error('Active guest can not be removed')
    }

    await deleteDoc(guestRef)
}

export async function checkOutGuest(guest: Guest): Promise<void> {
    if (guest.status !== 'active') {
        throw new Error('Guest is not active')
    }

    const actualCheckOutDate = new Date().toISOString().split('T')[0]
    await updateGuest(guest.id, {
        status: 'checked_out',
        actualCheckOutDate
    })

    if (guest.roomId && guest.bedId) {
        await releaseGuestBed(guest.roomId, guest.bedId)
    }
}


export async function cancelGuest(guest: Guest): Promise<void> {
    if (guest.status !== 'active') {
        throw new Error('Guest is not active')
    }

    await updateGuest(guest.id, {
        status: 'cancelled'
    })

    if (guest.roomId && guest.bedId) {
        await releaseGuestBed(guest.roomId, guest.bedId)
    }

}