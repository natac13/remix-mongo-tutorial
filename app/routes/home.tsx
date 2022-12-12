import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import React from 'react'
import Layout from '../components/layout'
import UserPanel from '../components/userPanel'
import { getOtherUsers, requireUserId } from '../utils/auth.server'

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request)
  const otherUsers = await getOtherUsers(userId)
  return json({ otherUsers }, { headers: { 'cache-control': 'no-store' } })
}

export default function HomePage() {
  const data = useLoaderData<typeof loader>()
  const users = data.otherUsers

  return (
    <Layout>
      <div className="flex h-full w-full">
        <UserPanel users={users} />
      </div>
    </Layout>
  )
}
