import { Loader } from '@mantine/core'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../components/MainLayout'
import { userContext } from '../context/userContext'
import { auth } from '../libs/firebase'

export const HomePage = () => {
  const [user, loading, error] = useAuthState(auth)
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
      <MainLayout></MainLayout>
    </userContext.Provider>
  )
}
