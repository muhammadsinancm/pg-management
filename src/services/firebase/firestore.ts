/**
 * Firestore stubs — implement when wiring Firebase Database.
 */

export interface FirestoreDocument {
  id: string
  [key: string]: unknown
}

export interface FirestoreRepository<T extends FirestoreDocument> {
  list(collection: string): Promise<T[]>
  get(collection: string, id: string): Promise<T | null>
  create(collection: string, data: Omit<T, 'id'>): Promise<T>
  update(collection: string, id: string, data: Partial<T>): Promise<T>
  remove(collection: string, id: string): Promise<void>
}

export class StubFirestoreRepository implements FirestoreRepository<FirestoreDocument> {
  async list(): Promise<FirestoreDocument[]> {
    return []
  }

  async get(): Promise<FirestoreDocument | null> {
    return null
  }

  async create(_collection: string, data: Omit<FirestoreDocument, 'id'>): Promise<FirestoreDocument> {
    return { id: `stub-${Date.now()}`, ...data }
  }

  async update(
    _collection: string,
    id: string,
    data: Partial<FirestoreDocument>
  ): Promise<FirestoreDocument> {
    return { id, ...data }
  }

  async remove(): Promise<void> {
    // no-op stub
  }
}

export const firestoreRepository = new StubFirestoreRepository()
