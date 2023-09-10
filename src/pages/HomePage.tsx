import { Loader } from '@mantine/core'
import { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../components/MainLayout'
import {
  userContext,
  userSelectedFriendDataContex,
  userSelectedFriendIdContext,
} from '../context/context'
import { auth } from '../libs/firebase'

export const HomePage = () => {
  const [user, loading, error] = useAuthState(auth)
  const [userSelectedFriendId, setUserSelectedFriendId] = useState<
    string | null
  >(null)
  const [userSelectedFriendData, setUserSelectedFriendData] = useState<{
    email: string
    displayName: string
    photoURL: string
  } | null>(null)

  const navigate = useNavigate()

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader variant="bars" />
      </div>
    )

  if (error) return <div>Error: {error.message}</div>

  if (!user) {
    navigate('/auth')
  }

  return (
    <userContext.Provider value={user!}>
      <userSelectedFriendIdContext.Provider
        value={{
          userSelectedFriendId,
          setUserSelectedFriendId,
        }}
      >
        <userSelectedFriendDataContex.Provider
          value={{
            userSelectedFriendData,
            setUserSelectedFriendData,
          }}
        >
          <MainLayout />
        </userSelectedFriendDataContex.Provider>
      </userSelectedFriendIdContext.Provider>
    </userContext.Provider>
  )
}
