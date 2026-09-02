import { firestoreDb } from "@/services/firebase/config";
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { Branch, CreateBranchInput } from "../types/branch.types";

const branchesCollection = collection(firestoreDb, 'branches')

export async function getBranches(): Promise<Branch[]> {
    const snapshot = await getDocs(branchesCollection)

    return snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data()
    })) as Branch[]
}

export async function getBranch(branchId: string): Promise<Branch | null> {
    const branchRef = doc(firestoreDb, 'branches', branchId)
    const snapshot = await getDoc(branchRef)

    if (!snapshot.exists()) {
        return null
    }

    return {
        id: snapshot.id,
        ...snapshot.data()
    } as Branch
}

export async function createBranch(data: CreateBranchInput): Promise<Branch> {
    const branchRef = doc(branchesCollection)
    const now = new Date().toISOString()

    const branch: Branch = {
        id: branchRef.id,
        ...data,
        createdAt: now,
        updatedAt: now
    }

    await setDoc(branchRef, branch)

    return branch
}

export async function updateBranch(branchId: string, data: Partial<CreateBranchInput>) {
    const branchRef = doc(firestoreDb, 'branches', branchId)

    await updateDoc(branchRef, {
        ...data,
        updatedAt: new Date().toISOString()
    })
}

export async function deleteBranch(branchId: string) {
    console.log(branchId);
    
    await deleteDoc(doc(firestoreDb, 'branches', branchId))
}