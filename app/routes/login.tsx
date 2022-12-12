import React from 'react'
import Layout from '~/components/layout'
import FormField from '~/components/formField'
import { Form, useActionData, useTransition } from '@remix-run/react'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  validateEmail,
  validateName,
  validatePassword,
} from '../utils/validators.server'
import { getUser, login, register } from '../utils/auth.server'
import invariant from 'tiny-invariant'

const styles = {
  button:
    'bg-yellow-500 text-white p-2 rounded-md text-gray-800 disabled:opacity-50',
  form: 'flex flex-col gap-4 rounded-md p-4 bg-slate-50 container shadow-lg max-w-xs sm:max-w-md',
}

export const loader: LoaderFunction = async ({ request }) => {
  return (await getUser(request)) ? redirect('/') : null
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const action = formData.get('_action')
  const email = formData.get('email')
  const password = formData.get('password')
  let firstName = formData.get('firstName')
  let lastName = formData.get('lastName')
  const fields = { email, password, firstName, lastName }

  invariant(action === 'login' || action === 'register', 'Invalid form data')

  // check for unknown actions
  if (action !== 'login' && action !== 'register') {
    return json({ error: 'Invalid form data', fields }, { status: 400 })
  }

  // check for missing fields
  if (typeof email !== 'string' || typeof password !== 'string') {
    return json({ error: 'Invalid form data', fields }, { status: 400 })
  }

  // if the action is register, check for missing fields
  if (action === 'register') {
    if (typeof firstName !== 'string' || typeof lastName !== 'string') {
      return json({ error: 'Invalid form data', fields }, { status: 400 })
    }
  }

  // check for validation errors
  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
    ...(action === 'register' && {
      firstName: validateName((firstName || '') as string),
      lastName: validateName((lastName || '') as string),
    }),
  }

  // if there are errors, return them
  if (Object.values(errors).some((error) => error)) {
    return json(
      {
        errors,
        fields,
        form: action,
      },
      { status: 400 }
    )
  }

  switch (action) {
    case 'login': {
      return await login(email, password)
    }
    case 'register': {
      invariant(typeof firstName === 'string', 'First name is not a string')
      invariant(typeof lastName === 'string', 'Last name is not a string')
      return await register({ email, password, firstName, lastName })
    }
    default: {
      return json({ error: 'Invalid form data', fields }, { status: 400 })
    }
  }
}

// This is the login page
// Which should render a form with a email and password fields
export default function LoginPage() {
  // login form action
  const [action, setAction] = React.useState<'login' | 'register'>('login')
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  })

  const actionData = useActionData()

  const state = useTransition()
  const isSubmitting = state.state === 'submitting'

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    setFormData((form) => ({
      ...form,
      [fieldName]: event.target.value,
    }))
  }

  return (
    <Layout>
      <div className="flex h-full flex-col items-center justify-center gap-6">
        <h1 className="text-5xl font-extrabold text-yellow-700">
          Welcome to Kudos!
        </h1>
        <h2 className="font-semibold uppercase text-gray-500">
          {action === 'login'
            ? 'Login to get started'
            : 'Register to get started'}
        </h2>
        <Form method="post" className={styles.form}>
          <div className="w-full text-center text-xs font-semibold tracking-wide text-red-500">
            {actionData?.error}
          </div>
          <FormField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange(e, 'email')}
            error={actionData?.errors?.email}
            defaultValue={actionData?.fields?.email}
          />
          <FormField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange(e, 'password')}
            error={actionData?.errors?.password}
            defaultValue={actionData?.fields?.password}
          />
          {action === 'register' && (
            <>
              <FormField
                label="First Name"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange(e, 'firstName')}
                error={actionData?.errors?.firstName}
                defaultValue={actionData?.fields?.firstName}
              />
              <FormField
                label="Last Name"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange(e, 'lastName')}
                error={actionData?.errors?.lastName}
                defaultValue={actionData?.fields?.lastName}
              />
            </>
          )}
          <button
            type="submit"
            name="_action" // must have underscore
            value={action}
            className={styles.button}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Submitting...'
              : action === 'login'
              ? 'Login'
              : 'Register'}
          </button>
          {action === 'login' ? (
            <p className="text-center text-gray-500">
              Don't have an account?{' '}
              <button
                type="button"
                className="font-semibold text-yellow-500"
                onClick={() => setAction('register')}
              >
                Register
              </button>
            </p>
          ) : (
            <p className="text-center text-gray-500">
              Already have an account?{' '}
              <button
                type="button"
                className="font-semibold text-yellow-500"
                onClick={() => setAction('login')}
              >
                Login
              </button>
            </p>
          )}
        </Form>
      </div>
    </Layout>
  )
}
