import { ChatBox } from '@/components/ChatBox'
import { FriendsList } from '@/components/FriendsList'
import React from 'react'

export default function Home() {
  return (
    <div className="flex h-screen w-full">
      <FriendsList />
      <ChatBox />
    </div>
  )
}
