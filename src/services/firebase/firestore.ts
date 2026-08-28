/**
 * Firestore stubs — implement when wiring Firebase Database.
 */
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc, type DocumentData } from "firebase/firestore"
import { firestoreDb } from "./config"

export interface FirestoreDocument {
  id: string
  // [key: string]: unknown
}

export interface FirestoreRepository<T extends FirestoreDocument> {
  list(collectionName: string): Promise<T[]>
  get(collectionName: string, id: string): Promise<T | null>
  create(collectionName: string, data: Omit<T, 'id'>): Promise<T>
  update(collectionName: string, id: string, data: Partial<Omit<T, 'id'>>): Promise<T>
  remove(collectionName: string, id: string): Promise<void>
}

export class FirebaseFirestoreRepository<T extends FirestoreDocument> implements FirestoreRepository<T> {

  async list(collectionName: string): Promise<T[]> {
    const snapshot = await getDocs(
      collection(firestoreDb, collectionName)
    )
    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as T[]
  }

  async get(collectionName: string, id: string): Promise<T | null> {
    const documentRef = doc(firestoreDb, collectionName, id)

    const snapshot = await getDoc(documentRef)
    if (!snapshot.exists()) {
      return null
    }
    return {
      id: snapshot.id,
      ...snapshot.data()
    } as T
  }

  async create(collectionName: string, data: Omit<T, 'id'>): Promise<T> {
    const documentRef = await addDoc(collection(firestoreDb, collectionName), data as DocumentData)

    return {
      id: documentRef.id,
      ...data
    } as T
  }

  async update(collectionName: string, id: string, data: Partial<Omit<T, 'id'>>): Promise<T> {
    const documentRef = doc(firestoreDb, collectionName, id)

    await updateDoc(documentRef, data as DocumentData)

    const snapshot = await getDoc(documentRef)
    if (!snapshot.exists()) {
      throw new Error('Document not found after update')
    }

    return {
      id: snapshot.id,
      ...snapshot.data()
    } as T
  }

  async remove(collectionName: string, id: string): Promise<void> {
    const documentRef = doc(firestoreDb, collectionName, id)
    await deleteDoc(documentRef)
  }
}

export const firestoreRepository = new FirebaseFirestoreRepository<FirestoreDocument>()
