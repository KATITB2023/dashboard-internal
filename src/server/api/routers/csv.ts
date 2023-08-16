import { z } from 'zod';
import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';

export const csvRouter = createTRPCRouter({
  adminGetCSVAssignment: adminProcedure
    .input(z.object({ assignmentId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      if (!input.assignmentId) return [];
      return await ctx.prisma.assignment.findMany({
        where: {
          id: input.assignmentId
        },
        include: {
          submission: {
            select: {
              filePath: true,
              score: true,
              createdAt: true,
              student: {
                select: {
                  nim: true,
                  profile: {
                    select: {
                      name: true,
                      faculty: true,
                      campus: true
                    }
                  },
                  groupRelation: {
                    select: {
                      group: {
                        select: {
                          group: true
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });
    }),

  adminGetCSVAttendance: adminProcedure
    .input(z.object({ dayId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      if (!input.dayId) return [];
      return await ctx.prisma.attendanceDay.findMany({
        where: {
          id: input.dayId
        },
        include: {
          event: {
            select: {
              title: true,
              startTime: true,
              endTime: true,
              record: {
                select: {
                  date: true,
                  status: true,
                  reason: true,
                  student: {
                    select: {
                      nim: true,
                      profile: {
                        select: {
                          name: true,
                          faculty: true,
                          campus: true
                        }
                      },
                      groupRelation: {
                        select: {
                          group: {
                            select: {
                              group: true
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });
    })
});
