import type { AuthSession, LoginCredentials } from '@/features/auth/types'
import { signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged, type User, signOut } from 'firebase/auth'
import { firebaseAuth } from './config'

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
export const authService1: AuthService = new LocalAuthService()


////////////////////////////////////////////////
function mapFirebaseUser(user: User): AuthSession {
  return {
    user: {
      id: user.uid,
      email: user.email ?? '',
      displayName: user.displayName ?? user.email?.split('@')[0] ?? 'User',
    },
    token: ''
  }
}

export class FirevaseAuthService {
  async signIn(
    credentials: LoginCredentials
  ): Promise<AuthSession> {

    const email = credentials.email.trim()
    const password = credentials.password

    if (!email || !password) {
      throw new Error('Email and password are required')
    }

    try {
      const result = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      )

      const token = await result.user.getIdToken()

      return {
        ...mapFirebaseUser(result.user),
        token
      }

    } catch (error: any) {

      if (error.code === 'auth/invalid-credential' ||
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong/password') {
        throw new Error('Invalid email or password')
      }

      if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many attempts. Try again later')
      }
      throw new Error('Login failed')
    }
  }

  async signOut(): Promise<void> {
    await firebaseSignOut(firebaseAuth)
  }

  async getSession(): Promise<AuthSession | null> {
    const user = firebaseAuth.currentUser

    if (!user) {
      return null
    }
    const token = await user.getIdToken()

    return {
      ...mapFirebaseUser(user),
      token,
    }
  }

  onAuthStateChanged(
    callback: (session: AuthSession | null) => void
  ) {
    return onAuthStateChanged(firebaseAuth, async (user) => {
      if (!user) {
        callback(null)
        return
      }
      const token = await user.getIdToken()
      callback({
        user: {
          id: user.uid,
          email: user.email ?? '',
          displayName: user.displayName ?? user.email?.split('@')[0] ?? 'User'
        },
        token,
      })
    })
  }
}

export const authService = new FirevaseAuthService()