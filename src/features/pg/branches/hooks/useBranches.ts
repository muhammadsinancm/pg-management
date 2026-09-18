import { useCallback, useEffect, useState } from "react";
import { Branch, CreateBranchInput } from "../types/branch.types";
import { createBranch, deleteBranch, getBranch, getBranches, updateBranch } from "../services/branchService";
import { useAuth } from "@/features/auth/hooks/useAuth";

let cachedBranches: Branch[] | null = null;

export function useBranches() {
    const { user } = useAuth();

    const [branches, setBranches] = useState<Branch[]>(() => cachedBranches || []);
    const [loading, setLoading] = useState<boolean>(() => !cachedBranches);
    const [error, setError] = useState<string | null>(null);

    const loadBranches = useCallback(async () => {
        if (!user) {
            setBranches([]);
            setLoading(false);
            return;
        }

        try {
            if (!cachedBranches) {
                setLoading(true);
            }
            setError(null);

            if (user.role === 'super_admin') {
                const data = await getBranches();
                cachedBranches = data;
                setBranches(data);
                return;
            }
            if (user.role === 'branch_manager') {
                if (!user.branchId) {
                    setBranches([]);
                    setError('Branch is not assigned to this user');
                    return;
                }

                const branch = await getBranch(user.branchId);
                const list = branch ? [branch] : [];
                cachedBranches = list;
                setBranches(list);
                return;
            }

            setBranches([]);

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