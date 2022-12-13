import type { Profile } from '@prisma/client'
import { capitalize } from '../utils/capitalize'

export interface UserAvatarProps {
  profile: Profile
  className?: string
  onClick?: () => void
  hideName?: boolean
  circleClassName?: string
}

/**
 * Display the user avatar and their email
 * @param props UserAvatarProps
 * @returns jsx
 */
export default function UserAvatar(props: UserAvatarProps) {
  const {
    profile,
    className,
    circleClassName,
    onClick,
    hideName = false,
  } = props

  return (
    <div
      className={`mx-2 flex w-auto items-center gap-2 rounded-md bg-slate-800 p-2 ${className}`}
    >
      <div
        className={`flex h-7 w-7 ${
          onClick ? `cursor-pointer` : ``
        } items-center justify-center rounded-full bg-yellow-100 text-sm text-yellow-700 shadow-lg  ${circleClassName}`}
        onClick={onClick}
      >
        <h2 className="font-bold uppercase">
          {profile.firstName.charAt(0)}
          {profile.lastName.charAt(0)}
        </h2>
      </div>
      {!hideName ? (
        <header className="">
          <h3 className="text-center text-sm font-semibold text-gray-300">
            {capitalize(profile.firstName)} {capitalize(profile.lastName)}
          </h3>
        </header>
      ) : null}
    </div>
  )
}
