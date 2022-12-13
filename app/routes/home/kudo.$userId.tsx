import { Color } from '@prisma/client'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useActionData, useLoaderData } from '@remix-run/react'
import * as React from 'react'
import KudoDisplay from '../../components/kudoDisplay'
import Modal from '../../components/modal'
import { SelectBox } from '../../components/selectBox'
import UserAvatar from '../../components/userAvatar'
import { getUser, getUserById, requireUserId } from '../../utils/auth.server'
import { capitalize } from '../../utils/capitalize'
import { createKudo } from '../../utils/kudo.server'

export const loader = async ({ request, params }: LoaderArgs) => {
  const { userId } = params

  // close modal if no user id is provided
  if (typeof userId !== 'string') {
    return redirect('/home')
  }

  const recipient = await getUserById(userId)

  if (!recipient) {
    return redirect('/home')
  }

  const user = await getUser(request)
  return json({ recipient, user })
}

export const action = async ({ request, params }: ActionArgs) => {
  const formData = await request.formData()
  const userId = await requireUserId(request)
  const recipientId = formData.get('recipientId')
  const message = formData.get('message')
  const color = formData.get('color')

  const fields = { recipientId, message, color }

  // check field values are the correct type
  if (
    typeof recipientId !== 'string' ||
    typeof message !== 'string' ||
    typeof color !== 'string'
  ) {
    return json({ error: 'Invalid form data', fields }, { status: 400 })
  }

  // check that the recipient is a valid user
  const recipient = await getUserById(recipientId)
  if (!recipient) {
    return json({ error: 'Invalid recipient', fields }, { status: 400 })
  }

  // check that the user is not sending a kudo to themselves
  if (userId === recipientId) {
    return json(
      { error: 'Cannot send a kudo to yourself', fields },
      { status: 400 }
    )
  }

  // check that the color is valid
  if (!Object.keys(Color ?? {}).includes(color as Color)) {
    return json({ error: 'Invalid color', fields }, { status: 400 })
  }

  // check that the message is not empty
  if (message.trim() === '') {
    return json({ error: 'Message cannot be empty', fields }, { status: 400 })
  }

  // create the kudo
  const kudo = await createKudo({
    message,
    color: color as Color,
    authorId: userId,
    toId: recipientId,
  })

  // redirect to the home page
  return redirect(`/home`)
}

export default function KudoModal() {
  const data = useLoaderData<typeof loader>()
  const [formData, setFormData] = React.useState({
    message: '',
    color: Color.RED,
  })
  const actionData = useActionData<typeof action>()
  const { recipient, user } = data

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    field: string
  ) => {
    setFormData({ ...formData, [field]: e.target.value })
  }

  return (
    <Modal isOpen className="w-2/3 p-10">
      <div className="mb-2 w-full text-center text-xs font-semibold tracking-wide text-red-500">
        {actionData?.error}
      </div>
      <form method="post">
        <input type="hidden" value={recipient?.id} name="recipientId" />
        <div className="flex flex-col gap-y-2 md:flex-row md:gap-y-0">
          <div className="flex flex-col items-center justify-start gap-y-2 pt-6 pr-8 text-center">
            <UserAvatar
              profile={recipient?.profile}
              className="cursor-default justify-center py-4"
              circleClassName="w-16 h-16 text-2xl"
              hideName
            />
            {/* {recipient?.profile?.department && (
              <span className="w-auto rounded-xl bg-gray-300 px-2 py-1 text-blue-300">
                {recipient.profile?.department?.[0].toUpperCase() +
                  recipient.profile?.department?.toLowerCase()?.slice(1)}
              </span>
            )} */}
          </div>
          <div className="flex flex-1 flex-col gap-y-4">
            <textarea
              name="message"
              className="h-40 w-full rounded-xl p-4"
              required
              value={formData.message}
              defaultValue={actionData?.fields?.message || undefined}
              onChange={(e) => handleChange(e, 'message')}
              placeholder={`Say something nice about ${recipient?.profile?.firstName}...`}
            />
            <div className="flex min-w-fit flex-col items-center gap-x-4 md:flex-row md:justify-start">
              <SelectBox
                name="color"
                id="color"
                value={formData.color}
                onChange={(e) => handleChange(e, 'color')}
                label=""
                options={Object.keys(Color ?? {}).map((key) => ({
                  value: key,
                  name: capitalize(key),
                }))}
              />
            </div>
          </div>
        </div>
        <br />
        <p className="font-xs mb-2 font-semibold uppercase text-slate-500">
          Preview
        </p>
        <div className="flex flex-col items-center gap-x-24 gap-y-2 md:flex-row md:gap-y-0">
          <div className="flex-1">
            <KudoDisplay
              profile={recipient?.profile}
              kudo={{
                color: formData.color as Color,
                message: formData.message,
              }}
            />
          </div>
          <button
            type="submit"
            className="h-16 w-1/4 rounded-xl bg-yellow-500 font-semibold text-yellow-900 shadow-md transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-yellow-600 hover:text-gray-800  hover:shadow-xl"
          >
            Send
          </button>
        </div>
      </form>
    </Modal>
  )
}
