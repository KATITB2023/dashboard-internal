import { TRPCError } from '@trpc/server';
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
      const group = await ctx.prisma.groupRelation.findMany({
        where: {
          groupId: input.groupId
        },
        include: {
          user: {
            select: {
              id: true,
              nim: true,
              profile: {
                select: {
                  name: true,
                  faculty: true,
                  campus: true
                }
              },
              submission: {
                select: {
                  id: true,
                  filePath: true
                }
              },
              attendance: {
                select: {
                  id: true,
                  date: true,
                  status: true
                }
              }
            }
          }
        }
      });

      return group;
    }),

  mentorGetGroupData: mentorProcedure.query(async ({ ctx }) => {
    // TODO: isi logic disini
    const mentorId = ctx.session.user.id;

    const groupRelation = await ctx.prisma.groupRelation.findFirst({
      where: {
        userId: mentorId
      }
    });

    if (!groupRelation) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Group not found'
      });
    }

    const group = await ctx.prisma.groupRelation.findMany({
      where: {
        groupId: groupRelation.groupId
      },
      include: {
        user: {
          select: {
            id: true,
            nim: true,
            profile: {
              select: {
                name: true,
                faculty: true,
                campus: true
              }
            },
            submission: {
              select: {
                id: true,
                filePath: true
              }
            },
            attendance: {
              select: {
                id: true,
                date: true,
                status: true
              }
            }
          }
        }
      }
    });

    return group;
  }),

  mentorEditGroupName: mentorProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx }) => {
      // TODO: isi logic disini
    })
});
