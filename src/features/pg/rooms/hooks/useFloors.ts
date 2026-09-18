import { useCallback, useEffect, useState } from "react";
import { CreateFloorInput, Floor } from "../types/floor.types";
import { createFloor, deleteFloor, getFloors, updateFloor } from "../services/floorService";

// In-memory cache by branchId to eliminate loading flashes when switching branches
const branchFloorsCache = new Map<string, Floor[]>();

export function useFloors(branchId?: string) {
    const [floors, setFloors] = useState<Floor[]>(() => {
        if (branchId && branchFloorsCache.has(branchId)) {
            return branchFloorsCache.get(branchId)!;
        }
        return [];
    });
    const [isLoading, setLoading] = useState<boolean>(() => {
        if (!branchId) return false;
        return !branchFloorsCache.has(branchId);
    });
    const [error, setError] = useState<string | null>(null);

    const loadFloors = useCallback(async (force = false) => {
        if (!branchId) {
            setFloors([]);
            setLoading(false);
            return;
        }

        const cached = branchFloorsCache.get(branchId);
        if (cached && !force) {
            setFloors(cached);
            setLoading(false);
        } else if (!cached) {
            setLoading(true);
        }

        try {
            setError(null);
            const data = await getFloors(branchId, force);
            branchFloorsCache.set(branchId, data);
            setFloors(data);
        } catch (error) {
            console.error(error);
            setError(error instanceof Error ? error.message : 'Failed to load floors');
        } finally {
            setLoading(false);
        }
    }, [branchId]);

    useEffect(() => {
        loadFloors();
    }, [loadFloors]);

    async function addFloor(data: CreateFloorInput) {
        try {
            const newFloor = await createFloor(data);
            setFloors((current) => {
                const updated = [...current, newFloor];
                if (branchId) branchFloorsCache.set(branchId, updated);
                return updated;
            });
            return newFloor;
        } catch (error) {
            console.error(error);
            setError(error instanceof Error ? error.message : 'Failed to create floor');
            throw error;
        }
    }

    async function editFloor(id: string, data: Partial<Floor>) {
        try {
            const updatedFloor = await updateFloor(id, data);
            setFloors((current) => {
                const updated = current.map((floor) => (floor.id === id ? updatedFloor : floor));
                if (branchId) branchFloorsCache.set(branchId, updated);
                return updated;
            });
            return updatedFloor;
        } catch (error) {
            console.error(error);
            setError(error instanceof Error ? error.message : 'Failed to update floor');
            throw error;
        }
    }

    async function removeFloor(id: string) {
        try {
            await deleteFloor(id);
            setFloors((current) => {
                const updated = current.filter((floor) => floor.id !== id);
                if (branchId) branchFloorsCache.set(branchId, updated);
                return updated;
            });
        } catch (error) {
            console.error(error);
            setError(error instanceof Error ? error.message : 'Failed to delete floor');
            throw error;
        }
    }

    return {
        floors, isLoading, error, addFloor, editFloor, removeFloor, reload: loadFloors
    }

}