import { User } from 'firebase/auth'
import { createContext } from 'react'

export const userContext = createContext<User | null>(null)
