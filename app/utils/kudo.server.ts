import type { Kudo, Prisma } from '@prisma/client'
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

// get filtered kudos
export async function getFilteredKudos(
  userId: string,
  sortFilter: Prisma.KudoOrderByWithRelationInput,
  whereFilter: Prisma.KudoWhereInput
) {
  const kudos = await prisma.kudo.findMany({
    where: {
      // toId: userId,
      ...whereFilter,
    },
    orderBy: sortFilter,
    select: {
      id: true,
      to: {
        select: {
          id: true,
          profile: true,
        },
      },
      author: true,
      authorId: true,
      toId: true,
      color: true,
      message: true,
      createdAt: true,
    },
  })

  return kudos
}
