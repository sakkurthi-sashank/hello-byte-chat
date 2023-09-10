import { User } from 'firebase/auth'
import { createContext } from 'react'

export const userContext = createContext<User | null>(null)
export const userSelectedFriendIdContext = createContext<{
  userSelectedFriendId: string | null
  setUserSelectedFriendId: (id: string | null) => void
}>({
  userSelectedFriendId: null,
  setUserSelectedFriendId: () => {},
})

interface UserData {
  email: string
  displayName: string
  photoURL: string
}

export const userSelectedFriendDataContex = createContext<{
  userSelectedFriendData: UserData | null
  setUserSelectedFriendData: (data: UserData | null) => void
}>({
  userSelectedFriendData: null,
  setUserSelectedFriendData: () => {},
})
