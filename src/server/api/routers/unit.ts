import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, unitProcedure } from '~/server/api/trpc';
import { REWARD_CONFIG } from '~/utils/reward';

export const unitRouter = createTRPCRouter({
  getAllVisit: unitProcedure.query(async ({ ctx }) => {
    const unit = await ctx.prisma.unitProfile.findUnique({
      where: {
        userId: ctx.session.user.id
      },
      select: {
        userId: true
      }
    });

    if (!unit) return [];

    const visits = await ctx.prisma.unitVisit.findMany({
      where: {
        unitId: unit.userId
      },
      include: {
        student: true
      }
    });

    return visits;
  }),

  sentReward: unitProcedure
    .input(
      z.object({
        studentId: z.string().uuid(),
        reward: z.nativeEnum(REWARD_CONFIG)
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.$transaction(async (tx) => {
        const unit = await tx.unitProfile.findUnique({
          where: {
            userId: ctx.session.user.id
          },
          select: {
            userId: true
          }
        });

        if (!unit)
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Unit not found'
          });

        await tx.unitReward.create({
          data: {
            unitId: unit.userId,
            studentId: input.studentId,
            reward: input.reward
          }
        });

        await tx.profile.update({
          where: {
            userId: input.studentId
          },
          data: {
            coin: {
              increment: input.reward
            }
          }
        });
      });

      return {
        message: `Reward success. You give ${input.reward} coins`,
        reward: input.reward
      };
    })
});
