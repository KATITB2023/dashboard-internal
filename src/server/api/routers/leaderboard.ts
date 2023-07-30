import { z } from 'zod';
import {
  adminProcedure,
  createTRPCRouter,
  mentorProcedure
} from '~/server/api/trpc';

export const leaderboardRouter = createTRPCRouter({
  mentorGetLeaderboardData: mentorProcedure
    .input(
      z.object({
        currentPage: z.number(),
        limitPerPage: z.number(),
        filterBy: z.string().optional(),
        searchQuery: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const offset = (input.currentPage - 1) * input.limitPerPage;
      const groupRelation = await ctx.prisma.groupRelation.findFirst({
        where: {
          userId: ctx.session.user.id
        }
      });

      if (!groupRelation) {
        return undefined;
      }

      return await ctx.prisma.user.findMany({
        where: {
          role: 'STUDENT',
          groupRelation: {
            every: {
              groupId: groupRelation.groupId
            }
          },
          nim: {
            contains: input.filterBy === 'nim' ? input.searchQuery : ''
          },
          profile: {
            name: {
              contains: input.filterBy === 'name' ? input.searchQuery : ''
            }
          }
        },
        select: {
          id: true,
          nim: true,
          profile: {
            select: {
              name: true,
              point: true
            }
          }
        },
        take: input.limitPerPage,
        skip: offset
      });
    }),

  mentorUpdateLeaderboardScore: mentorProcedure
    .input(z.object({ userId: z.string().uuid(), point: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // TODO: mencari user berdasarkan userid yang diberikan
      // Lakukan update kolom point pada tabel profile sesuai dengan input
      return await ctx.prisma.mentorUpdateLeaderboardScore.update({
        where: {
          userId: input.userId
        },
        data: {
          point: input.point
        }
      })
    })
});
