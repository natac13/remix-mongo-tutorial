// app/components/search-bar.tsx

import { Form, useNavigate, useSearchParams, useSubmit } from '@remix-run/react'

export function SearchBar() {
  const navigate = useNavigate()
  let [searchParams] = useSearchParams()
  const submit = useSubmit()

  const clearFilters = () => {
    searchParams.delete('filter')
    navigate('/home')
  }

  return (
    <Form
      method="get"
      onChange={(e) => submit(e.currentTarget)}
      className="flex h-20 w-full items-center justify-end gap-x-4 border-b-4 border-b-blue-900 border-opacity-30 px-10"
    >
      <div
        className={`flex w-1/4 items-center transition-all duration-500   focus-within:w-1/2`}
      >
        <input
          type="text"
          name="filter"
          className="w-full rounded-xl px-3 py-2"
          placeholder="Search..."
        />
        <svg
          className="-ml-8 h-4 w-4 fill-current text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
      </div>

      {searchParams.get('filter') && (
        <button
          onClick={clearFilters}
          className="rounded-xl bg-red-300 px-3 py-2 font-semibold text-blue-600 transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-yellow-400"
        >
          Clear Filters
        </button>
      )}
    </Form>
  )
}
