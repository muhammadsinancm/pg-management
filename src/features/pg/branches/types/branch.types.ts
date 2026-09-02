export type BranchStatus = | 'active' | 'inactive' | 'maintenance'

export interface Branch {
    id: string
    name: string
    code: string
    address: string
    city: string
    state: string
    pincode: string
    phone?: string
    email?: string
    managerId?: string
    managerName?: string
    status: BranchStatus
    createdAt?: string
    updatedAt?: string
}

export type CreateBranchInput = Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>