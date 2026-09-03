import { firestoreDb } from "@/services/firebase/config";
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { CreateStaffInput, Staff } from "../types/staff.types";

const staffCollection = collection(firestoreDb, 'staff')

export async function getStaff(): Promise<Staff[]> {
    const snapshot = await getDocs(staffCollection)

    return snapshot.docs.map(document => ({
        id: document.id,
        ...document.data()
    })) as Staff[]
}

export async function getStaffMember(staffId: string): Promise<Staff | null> {
    const staffRef = doc(firestoreDb, 'staff', staffId)
    const snapshot = await getDoc(staffRef)

    if (!snapshot.exists()) {
        return null
    }

    return {
        id: snapshot.id,
        ...snapshot.data()
    } as Staff
}

export async function getStaffByBranch(branchId: string): Promise<Staff[]> {
    const staff = await getStaff()

    return staff.filter(member => member.branchId === branchId)

}

export async function createStaff(data: CreateStaffInput): Promise<Staff> {
    const staffRef = doc(staffCollection)
    const now = new Date().toISOString()

    const staff: Staff = {
        id: staffRef.id,
        ...data,
        createdAt: now,
        updatedAT: now
    }

    await setDoc(staffRef, staff)
    return staff
}

export async function updateStaff(staffId: string, data: Partial<CreateStaffInput>): Promise<void> {
    const staffRef = doc(firestoreDb, 'staff', staffId)

    await updateDoc(staffRef, {
        ...data,
        updatedAt: new Date().toISOString()
    })
}
export async function deleteStaff(staffId: string): Promise<void> {
    const staffRef = doc(firestoreDb, 'staff', staffId)

    await deleteDoc(staffRef)

}