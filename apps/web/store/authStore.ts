import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Cookies from 'js-cookie'

interface User {
  id: string
  name: string
  email: string
  tokenBalance: number
}

interface AuthState {
  user: User | null
  token: string | null
  login: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => {
        set({ user, token })
        Cookies.set('skillswap_token', token, { expires: 7, secure: true, sameSite: 'strict' })
      },
      logout: () => {
        set({ user: null, token: null })
        Cookies.remove('skillswap_token')
      },
    }),
    {
      name: 'skillswap-auth',
    }
  )
)
