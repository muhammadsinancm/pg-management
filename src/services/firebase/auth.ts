import type { AuthSession, LoginCredentials } from '@/features/auth/types'

/**
 * AuthService interface — swap LocalAuthService for FirebaseAuthService later
 * without changing feature UI.
 */
export interface AuthService {
  signIn(credentials: LoginCredentials): Promise<AuthSession>
  signOut(): Promise<void>
  getSession(): Promise<AuthSession | null>
}

/**
 * Local mock auth for milestone 1.
 * Accepts any non-empty email/password and returns a session.
 */
export class LocalAuthService implements AuthService {
  private session: AuthSession | null = null

  async signIn(credentials: LoginCredentials): Promise<AuthSession> {
    const email = credentials.email.trim()
    const password = credentials.password

    if (!email || !password) {
      throw new Error('Email and password are required')
    }

    if (!email.includes('@')) {
      throw new Error('Enter a valid email address')
    }

    this.session = {
      user: {
        id: 'local-user',
        email,
        displayName: email.split('@')[0] || 'Manager'
      },
      token: `local-${Date.now()}`
    }

    return this.session
  }

  async signOut(): Promise<void> {
    this.session = null
  }

  async getSession(): Promise<AuthSession | null> {
    return this.session
  }
}

/** Active auth implementation — replace with Firebase when ready. */
export const authService: AuthService = new LocalAuthService()
