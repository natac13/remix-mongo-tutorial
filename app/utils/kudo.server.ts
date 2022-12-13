import type { Kudo } from '@prisma/client'
import prisma from './prisma.server'

export type CreateKudoInput = Pick<
  Kudo,
  'authorId' | 'color' | 'message' | 'toId'
>

// create a new kudo
export async function createKudo(input: CreateKudoInput) {
  const kudo = await prisma.kudo.create({
    data: {
      authorId: input.authorId,
      color: input.color,
      message: input.message,
      toId: input.toId,
    },
  })

  return kudo
}
