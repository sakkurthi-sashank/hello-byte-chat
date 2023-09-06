import React from 'react'
import { UserCard } from './UserCard'

export function FriendsList() {
  return (
    <div className="h-full w-[40rem] border-r border-gray-100 bg-white">
      <div className="h-14 border-b border-gray-100 bg-white"></div>
      <div className="flex w-full flex-col">
        <UserCard />
      </div>
    </div>
  )
}
