import type { LoaderFunction } from '@remix-run/node'
import { requireUserId } from '../utils/auth.server'

// a loader function which required the user to be logged in
export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request)
  return null
}

export default function Index() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-green-100">
      <div className="rounded-md bg-slate-50 p-4 shadow-lg">
        <h1>Welcome to Remix</h1>
        <ul>
          <li>
            <a
              target="_blank"
              href="https://remix.run/tutorials/blog"
              rel="noreferrer"
            >
              15m Quickstart Blog Tutorial
            </a>
          </li>
          <li>
            <a
              target="_blank"
              href="https://remix.run/tutorials/jokes"
              rel="noreferrer"
            >
              Deep Dive Jokes App Tutorial
            </a>
          </li>
          <li>
            <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
              Remix Docs
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}
