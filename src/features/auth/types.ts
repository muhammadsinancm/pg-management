export interface AuthUser {
  id: string
  email: string
  displayName: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthSession {
  user: AuthUser
  token: string
}
