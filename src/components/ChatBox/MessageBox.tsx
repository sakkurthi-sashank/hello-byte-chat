import React from 'react'

export function MessageBox() {
  return (
    <div className="flex h-20 w-full items-center justify-between space-x-2 border-t border-gray-100 bg-gray-50 px-4">
      <input
        className="block w-full rounded-full border-0 border-gray-300 py-2.5 pl-6 pr-20 font-inter text-gray-900 antialiased ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        placeholder="Type your message here..."
      />
      <button className="flex items-center justify-center rounded-full p-3 text-indigo-600 hover:bg-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
          />
        </svg>
      </button>
    </div>
  )
}
