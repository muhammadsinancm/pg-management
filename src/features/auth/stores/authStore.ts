import { create } from 'zustand'
import type { AuthUser, LoginCredentials } from '../types'
import { authService } from '@/services/firebase/auth'

interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

const SESSION_KEY = 'pg-management.session'

function loadPersistedSession(): Pick<AuthState, 'user' | 'token' | 'isAuthenticated'> {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) {
      return { user: null, token: null, isAuthenticated: false }
    }
    const parsed = JSON.parse(raw) as { user: AuthUser; token: string }
    return {
      user: parsed.user,
      token: parsed.token,
      isAuthenticated: Boolean(parsed.user && parsed.token)
    }
  } catch {
    return { user: null, token: null, isAuthenticated: false }
  }
}

function persistSession(user: AuthUser, token: string): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ user, token }))
}

function clearPersistedSession(): void {
  localStorage.removeItem(SESSION_KEY)
}

export const useAuthStore = create<AuthState>((set) => ({
  ...loadPersistedSession(),
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null })
    try {
      const session = await authService.signIn(credentials)
      persistSession(session.user, session.token)
      set({
        user: session.user,
        token: session.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed'
      set({ isLoading: false, error: message, isAuthenticated: false, user: null, token: null })
      throw err
    }
  },

  logout: async () => {
    await authService.signOut()
    clearPersistedSession()
    set({ user: null, token: null, isAuthenticated: false, error: null })
  },

  clearError: () => set({ error: null })
}))
