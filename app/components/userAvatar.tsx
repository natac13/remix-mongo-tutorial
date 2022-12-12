import type { Profile } from '@prisma/client'
import * as React from 'react'

export interface UserAvatarProps {
  profile: Profile
  className?: string
  onClick?: () => void
}

// capitalize the first letter of a string
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Display the user avatar and their email
 * @param props UserAvatarProps
 * @returns jsx
 */
export default function UserAvatar(props: UserAvatarProps) {
  const { profile, className, onClick } = props

  return (
    <div className="flex w-auto items-center px-2">
      <div
        className={`flex h-10 w-10 items-center justify-center  ${className} cursor-pointer rounded-full bg-gray-100`}
        onClick={onClick}
      >
        <h2 className="text-xl font-extrabold text-blue-900">
          {profile.firstName.charAt(0).toUpperCase()}
          {profile.lastName.charAt(0).toUpperCase()}
        </h2>
      </div>
      <header className="flex-1">
        <h3 className="text-center text-sm font-semibold text-gray-300">
          {capitalize(profile.firstName)} {capitalize(profile.lastName)}
        </h3>
      </header>
    </div>
  )
}
