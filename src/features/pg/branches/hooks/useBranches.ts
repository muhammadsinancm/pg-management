import { useCallback, useEffect, useState } from "react";
import { Branch, CreateBranchInput } from "../types/branch.types";
import { createBranch, deleteBranch, getBranch, getBranches, updateBranch } from "../services/branchService";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function useBranches() {

const {user} = useAuth()

    const [branches, setBranches] = useState<Branch[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadBranches = useCallback(async () => {
        if (!user) {
            setBranches([])
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            setError(null)

            if (user.role === 'super_admin') {
                const data = await getBranches()
                setBranches(data)
                return
            }
            if (user.role === 'branch_manager') {
                if (!user.branchId) {
                    setBranches([])
                    setError('Branch is not assigned to this user')
                    return
                }

                const branch = await getBranch(user.branchId)
                setBranches(branch ? [branch] : [])
                return
            }

            setBranches([])

        } catch (error) {
            console.error(error)
            setError('Failed to load branches')

        } finally {
            setLoading(false)
        }
    }, [user])

    useEffect(()=> {
        loadBranches()
    }, [loadBranches])

    async function addBranch(data: CreateBranchInput) {
        await createBranch(data)
        await loadBranches()
    }

    async function editBranch(id: string, data: Partial<CreateBranchInput>) {
        await updateBranch(id, data)
        await loadBranches()
    }

    async function removeBranch(id: string) {        
        await deleteBranch(id)
        await loadBranches()
    }

    return {
        branches,
        loading,
        error,
        addBranch,
        editBranch,
        removeBranch,
        refresh: loadBranches
    }

}