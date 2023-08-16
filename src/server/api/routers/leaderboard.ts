import { UserRole } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, mentorProcedure } from '~/server/api/trpc';

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
        return {
          data: [],
          metadata: {}
        };
      }

      const data = await ctx.prisma.user.findMany({
        where: {
          role: UserRole.STUDENT,
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
        skip: offset,
        orderBy: [
          {
            profile: {
              point: 'desc'
            }
          },
          {
            profile: {
              name: 'asc'
            }
          }
        ]
      });

      const total = await ctx.prisma.user.count({
        where: {
          role: UserRole.STUDENT,
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
        }
      });

      return {
        data: data,
        metadata: {
          total: total,
          page: input.currentPage,
          lastPage: Math.ceil(total / input.limitPerPage)
        }
      };
    }),

  mentorUpdateLeaderboardScore: mentorProcedure
    .input(z.object({ userId: z.string().uuid(), point: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // TODO: mencari user berdasarkan userid yang diberikan
      // Lakukan update kolom point pada tabel profile sesuai dengan input
      try {
        const data = await ctx.prisma.profile.update({
          where: {
            userId: input.userId
          },
          data: {
            point: input.point
          }
        });

        return {
          message: 'Point updated',
          data
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update point'
        });
      }
    })
});
