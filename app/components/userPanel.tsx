import type { User } from '@prisma/client'
import { useNavigate } from '@remix-run/react'
import * as React from 'react'
import UserAvatar from './userAvatar'

interface UserPanelProps {
  users: User[]
}

export default function UserPanel(props: UserPanelProps) {
  const { users } = props
  const navigate = useNavigate()
  return (
    <div className="flex w-1/6 flex-col bg-gray-200">
      <div className="flex items-center justify-center bg-blue-300 py-2 text-center">
        <h2 className="text-xl font-semibold text-blue-900">My Team</h2>
      </div>
      <div className="flex flex-1 flex-col gap-y-10 overflow-y-auto bg-gray-700 py-4 text-gray-100">
        {users?.map((user) => (
          <UserAvatar
            key={user.id}
            profile={user.profile}
            onClick={() => {
              navigate(`/home/kudo/${user.id}`)
            }}
          />
        ))}
      </div>
      <div className="bg-gray-800 p-6 text-center">
        <form method="post" action="/logout">
          <button
            type="submit"
            className="rounded-lg bg-yellow-600 px-3 py-2 font-semibold text-gray-800  transition duration-300 ease-in-out hover:bg-yellow-700"
          >
            Sign Out
          </button>
        </form>
      </div>
    </div>
  )
}
