import * as React from 'react'
import { GiAngelWings } from 'react-icons/gi'

import { Color } from '@prisma/client'
import type { Kudo, Profile } from '@prisma/client'
import UserAvatar from './userAvatar'
import { capitalize } from '../utils/capitalize'

export interface KudoDisplayProps {
  kudo: Pick<Kudo, 'message' | 'color'>
  profile: Profile
}

const colorMap = {
  [Color.RED]: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-700',
  },
  [Color.BLUE]: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-700',
  },
  [Color.GREEN]: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-700',
  },
  [Color.YELLOW]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    border: 'border-yellow-700',
  },
  [Color.PURPLE]: {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    border: 'border-purple-700',
  },
  [Color.BROWN]: {
    bg: 'bg-teal-100',
    text: 'text-teal-700',
    border: 'border-teal-700',
  },
}

const avatarColorMap = {
  [Color.RED]: {
    base: 'bg-red-700',
    circleClassName: 'bg-red-100 text-red-700',
  },
  [Color.BLUE]: {
    base: 'bg-blue-700',
    circleClassName: 'bg-blue-100 text-blue-700',
  },
  [Color.GREEN]: {
    base: 'bg-green-700',
    circleClassName: 'bg-green-100 text-green-700',
  },
  [Color.YELLOW]: {
    base: 'bg-yellow-700',
    circleClassName: 'bg-yellow-100 text-yellow-700',
  },
  [Color.PURPLE]: {
    base: 'bg-purple-700',
    circleClassName: 'bg-purple-100 text-purple-700',
  },
  [Color.BROWN]: {
    base: 'bg-teal-700',
    circleClassName: 'bg-teal-100 text-teal-700',
  },
}

export default function KudoDisplay({ kudo, profile }: KudoDisplayProps) {
  const color = kudo.color?.toLowerCase()
  const selectedColor = colorMap[color?.toUpperCase() as Color] || colorMap.RED
  const selectedColorClasses = Object.values(selectedColor).join(' ')
  const avatarColor =
    avatarColorMap[color?.toUpperCase() as Color] || avatarColorMap.RED
  console.log({ mes: kudo.message })
  return (
    <div
      className={`flex h-24 w-full items-center justify-between rounded-md border-2 border-solid py-4 px-2 ${selectedColorClasses}`}
    >
      <UserAvatar
        profile={profile}
        hideName
        className={`w-max ${avatarColor.base}`}
        circleClassName={avatarColor.circleClassName}
      />
      <div className="flex h-auto min-h-full flex-1 flex-col items-start justify-start">
        <h3 className="text-xs font-semibold uppercase">{`${capitalize(
          profile?.firstName
        )} ${capitalize(profile.lastName)}`}</h3>
        {/* replace new line with breaking space */}
        <p className="whitespace-pre-line text-sm">{kudo?.message}</p>
      </div>
      <div>
        <GiAngelWings />
      </div>
    </div>
  )
}
