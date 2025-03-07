'use client'

import { FormEvent, useState } from 'react'
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const { currentUser } = useAuth()

  // If user is already logged in, redirect to profile
  if (currentUser) {
    router.push('/user/profile')
  }

  // State to hold user input
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Email/Password Sign In
  async function handleEmailPasswordSignIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/user/profile')
    } catch (error) {
      console.error('Error logging in with email/password', error)
    }
  }

  // Google Sign In
  async function handleGoogleSignIn() {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      router.push('/user/profile')
    } catch (error) {
      console.error('Error logging in with Google', error)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h1>Login Page</h1>

      <form onSubmit={handleEmailPasswordSignIn}>
        <div>
          <label>Email: </label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password: </label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type='submit'>Sign In</button>
      </form>

      <hr />

      <button onClick={handleGoogleSignIn}>Sign in with Google</button>
    </div>
  )
}
