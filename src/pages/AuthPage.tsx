import { doc, setDoc } from 'firebase/firestore'
import { useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { FcGoogle } from 'react-icons/fc'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../libs/firebase'

export function AuthPage() {
  const [signInWithGoogle, _user, _loading, _error] = useSignInWithGoogle(auth)
  const navigate = useNavigate()

  return (
    <div className="flex h-screen items-center justify-center">
      <div>
        <button
          onClick={() =>
            signInWithGoogle().then((user) => {
              if (user?.user) {
                setDoc(doc(db, 'users', user.user.uid), {
                  email: user.user.email,
                  displayName: user.user.displayName,
                  photoURL: user.user.photoURL,
                }).then(() => {
                  navigate('/')
                })
              }
            })
          }
          className="flex h-fit w-fit cursor-pointer items-center space-x-2 rounded-md border border-gray-300 bg-white px-8 py-2 font-medium shadow-md"
        >
          <div className="flex items-center space-x-2">
            <FcGoogle className="text-2xl" />
            <span className="font-inter text-base font-medium text-gray-800">
              Sign in with Google
            </span>
          </div>
        </button>
      </div>
    </div>
  )
}
