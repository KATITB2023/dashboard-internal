import { z } from 'zod';
import {
  adminProcedure,
  createTRPCRouter,
  mentorProcedure
} from '~/server/api/trpc';

export const groupRouter = createTRPCRouter({
  adminGetGroupList: adminProcedure.query(async ({ ctx }) => {
    // TODO: isi logic disini
    const groups = await ctx.prisma.group.findMany({
      select: {
        id: true,
        group: true
      }
    });
    return groups;
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
              nim: true,
              role: true,
              profile: {
                select: {
                  name: true,
                  faculty: true,
                  campus: true,
                  image: true
                }
              },
              submission: {
                select: {
                  id: true,
                  filePath: true,
                  assignment: {
                    select: {
                      type: true,
                      title: true
                    }
                  }
                }
              },
              attendance: {
                select: {
                  id: true,
                  date: true,
                  status: true,
                  event: {
                    select: {
                      title: true
                    }
                  }
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
      return {};
    }

    const group = await ctx.prisma.groupRelation.findMany({
      where: {
        groupId: groupRelation.groupId
      },
      include: {
        group: {
          select: {
            group: true
          }
        },
        user: {
          select: {
            nim: true,
            role: true,
            profile: {
              select: {
                name: true,
                faculty: true,
                campus: true,
                image: true
              }
            },
            submission: {
              select: {
                id: true,
                filePath: true,
                assignment: {
                  select: {
                    type: true,
                    title: true
                  }
                }
              }
            },
            attendance: {
              select: {
                id: true,
                date: true,
                status: true,
                event: {
                  select: {
                    title: true
                  }
                }
              }
            }
          }
        }
      }
    });

    return group;
  })
});
