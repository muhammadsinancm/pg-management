export type UserRole = | 'super_admin' | 'branch_manager' | 'reception_staff'

export interface AuthUser {
  id: string
  email: string
  displayName: string
  role: UserRole
  organizationId: string
  branchId?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthSession {
  user: AuthUser
  token: string
}
