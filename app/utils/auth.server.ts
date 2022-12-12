import { createCookieSessionStorage, json, redirect } from '@remix-run/node'
import prisma from './prisma.server'
import bcrypt from 'bcrypt'

interface RegisterForm {
  email: string
  password: string
  firstName: string
  lastName: string
}

export async function register(form: RegisterForm) {
  // check if the user already exists
  const user = await prisma.user.findUnique({
    select: { id: true },
    where: {
      email: form.email,
    },
  })

  if (user) {
    return json({ error: 'User already exists' }, { status: 400 })
  }

  // create user
  const newUser = await createUser(form)
  // if no user was created, return an error
  if (!newUser) {
    return json(
      {
        error: 'Error creating user',
        fields: {
          email: form?.email,
          firstName: form?.firstName,
          lastName: form?.lastName,
          password: form?.password,
        },
      },
      { status: 500 }
    )
  }

  return createUserSession(newUser.id, '/')
}

export async function login(email: string, password: string) {
  // check if the user exists
  const user = await prisma.user.findUnique({
    select: { id: true, email: true, password: true },
    where: {
      email,
    },
  })

  if (!user) {
    return json({ error: 'User not found' }, { status: 401 })
  }

  // check if the password is correct
  const passwordCorrect = await bcrypt.compare(password, user.password)

  if (!passwordCorrect) {
    return json({ error: 'Password is incorrect' }, { status: 401 })
  }

  // return the user
  return createUserSession(user.id, '/')
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function createUser(form: RegisterForm) {
  const user = await prisma.user.create({
    data: {
      email: form.email,
      password: await hashPassword(form.password),
      profile: {
        firstName: form.firstName,
        lastName: form.lastName,
      },
    },
  })

  return { id: user.id, email: user.email }
}

const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set')
}

const storage = createCookieSessionStorage({
  cookie: {
    name: '__kudo-session',
    secrets: [sessionSecret],
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
    maxAge: 60 * 60 * 8,
    secure: process.env.NODE_ENV === 'production',
  },
})

export async function getUserSession(request: Request) {
  const session = await storage.getSession(request.headers.get('Cookie'))
  return session
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request)
  const userId = session.get('userId')
  if (!userId || typeof userId !== 'string') {
    return null
  }
  return userId
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const userId = await getUserId(request)
  if (!userId) {
    const searchParams = new URLSearchParams({ redirectTo })
    throw redirect(`/login?${searchParams.toString()}`)
  }
  return userId
}

export async function getUser(request: Request) {
  const userId = await getUserId(request)
  if (typeof userId !== 'string') {
    return null
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, profile: true },
    })
    return user
  } catch {
    throw logout(request)
  }
}

export async function logout(request: Request) {
  const session = await getUserSession(request)
  return redirect('/login', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  })
}

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession()
  session.set('userId', userId)
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  })
}

export async function getOtherUsers(userId: string) {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, profile: true },
    where: {
      id: { not: userId },
    },
    orderBy: {
      profile: {
        firstName: 'asc',
      },
    },
  })
  return users
}
