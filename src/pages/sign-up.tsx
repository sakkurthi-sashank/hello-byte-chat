import { auth } from '@/config/firebaseConfig'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

export default function SignUp() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleSubmitSignUp = async (data: {
    email: string
    password: string
  }) => {
    await createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        if (userCredential.user) {
          router.push('/')
        } else {
          setError('root', {
            message: 'Invalid email or password',
          })
        }
      })
      .catch((error) => {
        setError('root', {
          message: "User doesn't exist in our database",
        })
      })
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <div className="flex h-fit w-full max-w-md flex-col items-center rounded-md border border-gray-200 bg-white px-8 py-10 shadow-md">
        <div className="w-full max-w-md space-y-6">
          <div>
            <Image
              src="/brand-logo.svg"
              alt="Logo"
              width={140}
              height={100}
              className="object-contain"
            />
          </div>
          <div className="text-start font-inter text-2xl font-semibold text-gray-700">
            Create Your Account
          </div>
          <form
            className="w-full space-y-2"
            onSubmit={handleSubmit(handleSubmitSignUp)}
          >
            <div className="flex w-full flex-col space-y-1 text-gray-100">
              <div className="px-1 font-inter text-sm font-light text-gray-500">
                Email Address
              </div>
              <input
                className="block w-full rounded-full border-0 border-gray-300 py-2 pl-6 pr-20 font-inter text-gray-900 antialiased ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                type="text"
                placeholder="xxxxxxxxxxx@gmail.com"
                key="email"
                {...register('email', {
                  required: true,
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Invalid email address',
                  },
                })}
              />

              {errors.email && (
                <div className="px-2 text-xs text-red-500 antialiased">
                  {errors.email.message}
                </div>
              )}
            </div>
            <div className="flex w-full flex-col space-y-1 text-gray-100">
              <div className="px-1 font-inter text-sm font-light text-gray-500">
                Password
              </div>
              <input
                className="block w-full rounded-full border-0 border-gray-300 py-2 pl-6 pr-20 font-inter text-gray-900 antialiased ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                type="password"
                placeholder="Password"
                key="password"
                {...register('password', {
                  required: true,
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />

              {errors.password && (
                <div className="px-2 text-xs text-red-500 antialiased">
                  {errors.password.message}
                </div>
              )}
            </div>
            <div className="flex w-full justify-center pt-4">
              <button className="font-poppins w-full rounded-md bg-indigo-600 py-2 text-gray-200 antialiased hover:bg-indigo-700">
                Create Account
              </button>
            </div>
          </form>
          <div className="flex w-full items-center">
            <Link
              href="/sign-in"
              className="w-full text-center font-inter text-sm font-light text-gray-500 hover:text-indigo-600"
            >
              Already have an account? Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
