import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, adminAndUnitProcedure } from '~/server/api/trpc';
import { REWARD_CONFIG } from '~/utils/reward';

export const unitRouter = createTRPCRouter({
  sentReward: adminAndUnitProcedure
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
