import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { CreateGuestInput, Guest } from "../types/guests.types";
import { firestoreDb } from "@/services/firebase/config";

const COLLECTION = 'guests'

export async function getGuests(branchId: string): Promise<Guest[]> {
    const guestsRef = collection(firestoreDb, COLLECTION)
    const q = query(guestsRef, where('branchId', '==', branchId))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data()
    })) as Guest[]
}

export async function getGuest(guestId: string): Promise<Guest | null> {
    const guestRef = doc(firestoreDb, COLLECTION, guestId)
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
    const now = new Date().toISOString()
    const guestData = {
        ...data,
        status: data.status ?? 'active',
        createdAt: now,
        updatedAt: now,
    }

    const guestRef = await addDoc(collection(firestoreDb, COLLECTION), guestData)
    return {
        id: guestRef.id,
        ...guestData
    }
}

export async function updateGuest(guestId: string, data: Partial<CreateGuestInput>): Promise<Guest> {
    const guestRef = doc(firestoreDb, COLLECTION, guestId)
    const updateData = {
        ...data,
        updatedAt: new Date().toISOString()
    }
    await updateDoc(guestRef, updateData)

    const updated = await getDoc(guestRef)
    if (!updated.exists()) {
        throw new Error
            ('Guest not found')
    }
    return {
        id: updated.id,
        ...updated.data()
    } as Guest
}

export async function deleteGuest(guestId: string): Promise<void> {
    const guestRef = doc(firestoreDb, COLLECTION, guestId)
    await deleteDoc(guestRef)
}