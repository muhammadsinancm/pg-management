import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { CreateGuestInput, Guest } from "../types/guests.types";
import { firestoreDb } from "@/services/firebase/config";

const COLLECTION = 'guests'

export async function getGuests(): Promise<Guest[]> {
    const snapshot = await getDocs(collection(firestoreDb, COLLECTION))
    return snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data()
    })) as Guest[]
}

export async function getGuest(guestId: string): Promise<Guest> {
    const guestRef = doc(firestoreDb, COLLECTION, guestId)
    const snapshot = await getDoc(guestRef)

    if (!snapshot.exists()) {
        throw new Error('Guest not found')
    }

    return {
        id: snapshot.id,
        ...snapshot.data()
    } as Guest
}

export async function createGuest(data: CreateGuestInput): Promise<string> {

    const guestData: CreateGuestInput = {
        ...data,
        status: data.status ?? 'active'
    }

    const docRef = addDoc(collection(firestoreDb, COLLECTION), {
        ...guestData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    })

    return (await docRef).id


}

export async function updateGuest(guestId: string, data: Partial<CreateGuestInput>): Promise<void> {
    const guestRef = doc(firestoreDb, COLLECTION, guestId)

    await updateDoc(guestRef, {
        ...data,
        updatedAt: new Date().toISOString()
    })
}