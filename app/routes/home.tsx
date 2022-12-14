import type { Prisma } from '@prisma/client'
import type { LoaderArgs, LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import React from 'react'
import KudoDisplay from '../components/kudoDisplay'
import Layout from '../components/layout'
import { SearchBar } from '../components/searchBar'
import UserPanel from '../components/userPanel'
import { getOtherUsers, requireUserId } from '../utils/auth.server'
import { getFilteredKudos } from '../utils/kudo.server'

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request)
  const otherUsers = await getOtherUsers(userId)

  const url = new URL(request.url)
  const sort = url.searchParams.get('sort')
  const filter = url.searchParams.get('filter')

  // 2
  let sortOptions: Prisma.KudoOrderByWithRelationInput = {}
  if (sort) {
    if (sort === 'date') {
      sortOptions = { createdAt: 'desc' }
    }
    if (sort === 'sender') {
      sortOptions = { author: { profile: { firstName: 'asc' } } }
    }
  }

  // 3
  let textFilter: Prisma.KudoWhereInput = {}
  if (filter) {
    textFilter = {
      OR: [
        { message: { mode: 'insensitive', contains: filter } },
        {
          to: {
            OR: [
              {
                profile: {
                  is: { firstName: { mode: 'insensitive', contains: filter } },
                },
              },
              {
                profile: {
                  is: { lastName: { mode: 'insensitive', contains: filter } },
                },
              },
            ],
          },
        },
      ],
    }
  }

  console.log(JSON.stringify(textFilter))
  const kudos = await getFilteredKudos(
    userId,
    {
      createdAt: 'desc',
      ...sortOptions,
    },
    {
      ...textFilter,
    }
  )
  return json(
    { otherUsers, kudos },
    { headers: { 'cache-control': 'no-store' } }
  )
}

export default function HomePage() {
  const data = useLoaderData<typeof loader>()
  const users = data.otherUsers

  return (
    <Layout>
      <Outlet />
      <div className="flex h-full w-full">
        <UserPanel users={users} />
        <div className="flex h-full w-4/6 flex-col">
          <SearchBar />
          <div className="flex flex-1 flex-col">
            <div className="flex w-full flex-col items-stretch justify-items-stretch gap-y-4 p-10">
              {data.kudos.map((kudo) => (
                <KudoDisplay
                  key={kudo.id}
                  profile={kudo.to.profile}
                  kudo={kudo}
                />
              ))}
            </div>
          </div>
        </div>
        <aside className="w-1/6 bg-slate-700"></aside>
      </div>
    </Layout>
  )
}
