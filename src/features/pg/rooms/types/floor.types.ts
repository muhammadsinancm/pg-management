export interface Floor {
    id: string
    branchId: string
    floorNumber: number
    name: string
    description?: string
    createdAt?: string
    updatedAt?: string
}

export type CreateFloorInput = Omit<
    Floor,
    'id' | 'createdAt' | 'updatedAt'
>