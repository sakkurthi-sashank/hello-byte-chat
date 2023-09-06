import React from 'react'
import { MessageBox } from './MessageBox'

export function ChatBox() {
  return (
    <div className="flex h-screen w-full flex-col">
      <div className="h-14 border-b border-gray-100 bg-white"></div>
      <div className="background-pattern flex h-[calc(100%-3.5rem)] w-full flex-col">
        <div className="h-full w-full"></div>
        <MessageBox />
      </div>
    </div>
  )
}
