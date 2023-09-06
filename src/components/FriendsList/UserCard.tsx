import Image from 'next/image'
import React from 'react'

export function UserCard() {
  return (
    <div className="flex h-16 w-full cursor-pointer items-center space-x-3 border-b border-gray-100 px-3 hover:bg-gray-50">
      <Image
        src={'https://bit.ly/code-beast'}
        alt="Picture of the author"
        width={40}
        height={40}
        className="rounded-full"
      />
      <div className="flex h-full flex-col justify-center">
        <p className="text-sm font-semibold">Sakkurthi Sashank</p>
        <p className="w-fit text-xs text-gray-700">
          Hey there! I am using WhatsApp
        </p>
      </div>
    </div>
  )
}
