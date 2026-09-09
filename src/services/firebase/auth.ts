import type { AuthSession, LoginCredentials } from '@/features/auth/types'
import { signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged, type User } from 'firebase/auth'
import { firebaseAuth, firestoreDb } from './config'
import { doc, getDoc } from 'firebase/firestore'

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

    throw new Error('Local authentication is not available')

  }

  async signOut(): Promise<void> {
    this.session = null
  }

  async getSession(): Promise<AuthSession | null> {
    return this.session
  }
}

async function mapFirebaseUser(user: User): Promise<AuthSession> {
  const userRef = doc(firestoreDb, 'users', user.uid)

  const userSnapshot = await getDoc(userRef)

  if (!userSnapshot.exists()) {
    throw new Error('User profile not found')
  }

  const profile = userSnapshot.data()

  if (!profile.role || !profile.organizationId) {
    throw new Error('User profile is incomplete')
  }

  return {
    user: {
      id: user.uid,
      email: user.email ?? '',
      displayName: user.displayName ?? user.email?.split('@')[0] ?? 'User',
      role: profile.role,
      organizationId: profile.organizationId,
      branchId: profile.branchId
    },
    token: ''
  }

}

/** Active auth implementation — replace with Firebase when ready. */
export const authService1: AuthService = new LocalAuthService()

export class FirebaseAuthService implements AuthService {
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
      const session = await mapFirebaseUser(result.user)

      return {
        ...session,
        token
      }

    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'User profile not found') {
        await firebaseSignOut(firebaseAuth)
        throw error
      }

      if (error instanceof Error && error.message === 'User profile is incomplete') {
        await firebaseSignOut(firebaseAuth)
        throw error
      }

      const firebaseError = error as { code?: string }

      if (firebaseError.code === 'auth/invalid-credential' ||
        firebaseError.code === 'auth/user-not-found' ||
        firebaseError.code === 'auth/wrong-password'
      ) {
        throw new Error('Invalid email or password')
      }

      if (firebaseError.code === 'auth/too-many-requests') {
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
    const session =await mapFirebaseUser(user)

    return {
      ...session,
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

      try {
        const token = await user.getIdToken()
        const session = await mapFirebaseUser(user)

        callback({
          ...session,
          token
        })

      } catch (error) {
        console.error('Failed to load user profile', error)
        callback(null)
      }
    })
  }
}

export const authService = new FirebaseAuthService()