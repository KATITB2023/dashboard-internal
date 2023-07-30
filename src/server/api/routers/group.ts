import { z } from 'zod';
import {
  adminProcedure,
  createTRPCRouter,
  mentorProcedure
} from '~/server/api/trpc';

export const groupRouter = createTRPCRouter({
  adminGetGroupList: adminProcedure.query(async ({ ctx }) => {
    // TODO: isi logic disini
  }),

  adminGetGroupData: adminProcedure
    .input(z.object({ groupId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      // TODO: isi logic disini
    }),

  mentorGetGroupData: mentorProcedure.query(async ({ ctx }) => {
    // TODO: isi logic disini
  }),

  mentorEditGroupName: mentorProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const groupRelation = await ctx.prisma.groupRelation.findFirst({
        where: {
          userId: ctx.session.user.id
        }
      });

      if (!groupRelation || !groupRelation.groupId) {
        return undefined;
      }

      const updatedGroupName = await ctx.prisma.group.update({
        where: {
          id: groupRelation.groupId
        },
        data: {
          name: input.name
        }
      });
      return updatedGroupName;
    })

});
