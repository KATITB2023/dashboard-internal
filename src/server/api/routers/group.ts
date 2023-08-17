import { z } from 'zod';
import {
  adminAndMentorProcedure,
  adminProcedure,
  createTRPCRouter,
  mentorProcedure
} from '~/server/api/trpc';

export const groupRouter = createTRPCRouter({
  adminGetGroupList: adminProcedure.query(async ({ ctx }) => {
    const groups = await ctx.prisma.group.findMany({
      select: {
        id: true,
        group: true
      },
      orderBy: {
        group: 'asc'
      }
    });
    return groups;
  }),

  adminGetGroupData: adminProcedure
    .input(z.object({ groupId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
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
              }
            }
          }
        }
      });

      return group;
    }),

  mentorGetGroupNumber: mentorProcedure.query(async ({ ctx }) => {
    const mentorId = ctx.session.user.id;

    const groupNumber = await ctx.prisma.groupRelation.findFirst({
      where: {
        userId: mentorId
      },
      include: {
        group: {
          select: {
            group: true
          }
        }
      }
    });

    return groupNumber;
  }),

  mentorGetAttendanceData: mentorProcedure
    .input(z.object({ eventId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const mentorId = ctx.session.user.id;

      const groupRelation = await ctx.prisma.groupRelation.findFirst({
        where: {
          userId: mentorId
        }
      });

      if (!groupRelation) {
        return [];
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
                  userId: true,
                  name: true
                }
              },
              attendance: {
                where: {
                  eventId: input.eventId
                },
                select: {
                  id: true,
                  status: true,
                  reason: true
                }
              }
            }
          }
        }
      });

      return group;
    }),

  mentorGetGroupData: mentorProcedure.query(async ({ ctx }) => {
    const mentorId = ctx.session.user.id;

    const groupRelation = await ctx.prisma.groupRelation.findFirst({
      where: {
        userId: mentorId
      }
    });

    if (!groupRelation) {
      return [];
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
            }
          }
        }
      }
    });

    return group;
  }),

  getMenteeAssignment: adminAndMentorProcedure
    .input(z.object({ menteeId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const res = await ctx.prisma.assignmentSubmission.findMany({
        where: {
          studentId: input.menteeId
        },
        include: {
          assignment: {
            select: {
              title: true
            }
          }
        }
      });

      return res;
    }),

  getMenteeAttendance: adminAndMentorProcedure
    .input(z.object({ menteeId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const res = await ctx.prisma.attendanceRecord.findMany({
        where: {
          studentId: input.menteeId
        },
        include: {
          event: {
            select: {
              title: true
            }
          }
        }
      });

      return res;
    })
});
