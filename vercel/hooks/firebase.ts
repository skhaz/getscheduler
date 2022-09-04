import type { User } from 'firebase/auth'
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth } from 'providers/firebase'
import { useEffect, useState } from 'react'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)

  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = () => signInWithPopup(auth, new GoogleAuthProvider()).catch((error) => alert(error.message))

  const logout = () =>
    signOut(auth).then(() => {
      setUser(null)
      setLoading(true)
    })

  return {
    user,
    loading,
    login,
    logout,
  }
}
