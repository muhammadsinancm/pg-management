import { useAuth } from "@/features/auth/hooks/useAuth";
import { UserRole } from "@/features/auth/types";
import React from "react";
import { Navigate, Outlet } from "react-router";

interface RoleGuardProps {
    allowedRoles: UserRole[]
}
export function RoleGuard({ allowedRoles }: RoleGuardProps): React.JSX.Element {
    const { user } = useAuth()

    if (!user) {
        return <Navigate to='/login' replace />
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to='/pg/rooms' replace />
    }

    return <Outlet />

}