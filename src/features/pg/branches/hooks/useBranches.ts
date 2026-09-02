import { useCallback, useEffect, useState } from "react";
import { Branch, CreateBranchInput } from "../types/branch.types";
import { createBranch, deleteBranch, getBranches, updateBranch } from "../services/branchService";

export function useBranches() {
    const [branches, setBranches] = useState<Branch[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadBranches = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const data = await getBranches()
            setBranches(data)

        } catch (error) {
            console.error(error)
            setError('Failed to load branches')

        } finally {
            setLoading(false)
        }
    }, [])

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
        console.log(id);
        
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