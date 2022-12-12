import type { LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { requireUserId } from '../utils/auth.server'

// a loader function which required the user to be logged in
export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request)
  return redirect('/home')
}
