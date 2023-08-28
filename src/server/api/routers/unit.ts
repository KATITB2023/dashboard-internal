import { z } from 'zod';
import { createTRPCRouter, adminAndUnitProcedure } from '~/server/api/trpc';
import { REWARD_CONFIG } from '~/utils/reward';

export const unitRouter = createTRPCRouter({
  sentReward: adminAndUnitProcedure
    .input(
      z.object({
        unitId: z.string().uuid(),
        reward: z.nativeEnum(REWARD_CONFIG)
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.$transaction(async (tx) => {
        await tx.unitReward.create({
          data: {
            unitId: input.unitId,
            studentId: ctx.session.user.id,
            reward: input.reward
          }
        });

        await tx.profile.update({
          where: {
            userId: ctx.session.user.id
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
