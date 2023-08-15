import { TRPCError } from '@trpc/server';
import { type AttendanceDay, Status } from '@prisma/client';
import { z } from 'zod';
import {
  createTRPCRouter,
  mentorProcedure,
  adminProcedure,
  protectedProcedure,
  adminAndMentorProcedure
} from '~/server/api/trpc';

export const attendanceRouter = createTRPCRouter({
  adminAddAttendanceDay: adminProcedure
    .input(
      z.object({
        name: z.string(),
        time: z.coerce.date()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const attendanceDay = await ctx.prisma.attendanceDay.create({
          data: {
            name: input.name,
            time: input.time
          }
        });

        return {
          message: 'Attendance day added successfully',
          attendanceDay
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create a new attendance day'
        });
      }
    }),

  adminEditAttendanceDay: adminProcedure
    .input(
      z.object({
        dayId: z.string().uuid(),
        name: z.string().optional(),
        time: z.coerce.date().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const attendanceDay = await ctx.prisma.attendanceDay.update({
          where: {
            id: input.dayId
          },
          data: {
            name: input.name,
            time: input.time
          }
        });

        return {
          message: 'Attendance day updated successfully',
          attendanceDay
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to edit the attendance day'
        });
      }
    }),

  adminDeleteAttendanceDay: adminProcedure
    .input(
      z.object({
        dayId: z.string().uuid()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.attendanceDay.delete({
          where: {
            id: input.dayId
          }
        });

        return {
          message: 'Attendance day deleted successfully'
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete the attendance day'
        });
      }
    }),

  adminAddAttendanceEvent: adminProcedure
    .input(
      z.object({
        dayId: z.string().uuid(),
        title: z.string(),
        startTime: z.coerce.date(),
        endTime: z.coerce.date()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const attendanceDay = await ctx.prisma.attendanceDay.findUnique({
        where: {
          id: input.dayId
        }
      });

      if (!attendanceDay) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Attendance day not found'
        });
      }

      if (
        attendanceDay.time.getDate() !== input.startTime.getDate() ||
        attendanceDay.time.getDate() !== input.endTime.getDate()
      ) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Event date must match the selected day'
        });
      }

      try {
        const [attendanceEvent, users] = await Promise.all([
          ctx.prisma.attendanceEvent.create({
            data: {
              day: {
                connect: {
                  id: attendanceDay.id
                }
              },
              title: input.title,
              startTime: input.startTime,
              endTime: input.endTime
            }
          }),
          ctx.prisma.user.findMany({
            where: {
              role: 'STUDENT'
            },
            select: {
              id: true
            }
          })
        ]);

        await Promise.all(
          users.map(async (user) => {
            await ctx.prisma.attendanceRecord.create({
              data: {
                date: new Date(),
                studentId: user.id,
                eventId: attendanceEvent.id
              }
            });
          })
        );

        return {
          message: 'Attendance event added successfully',
          attendanceEvent
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create a new attendance event'
        });
      }
    }),

  adminEditAttendanceEvent: protectedProcedure
    .input(
      z.object({
        eventId: z.string().uuid(),
        title: z.string().optional(),
        startTime: z.coerce.date().optional(),
        endTime: z.coerce.date().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const updatedAttendanceEvent = await ctx.prisma.attendanceEvent.update({
          where: {
            id: input.eventId
          },
          data: {
            title: input.title,
            startTime: input.startTime,
            endTime: input.endTime
          }
        });

        return {
          message: 'Attendance event updated successfully',
          updatedAttendanceEvent
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to edit the attendance event'
        });
      }
    }),

  adminDeleteAttendanceEvent: adminProcedure
    .input(
      z.object({
        eventId: z.string().uuid()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const attendanceEvent = await ctx.prisma.attendanceEvent.delete({
          where: {
            id: input.eventId
          }
        });

        return {
          message: 'Attendance event deleted successfully',
          attendanceEvent
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete the attendance event'
        });
      }
    }),

  adminGetAttendanceRecord: adminProcedure
    .input(
      z.object({
        dayId: z.string().uuid().optional(),
        currentPage: z.number(),
        limitPerPage: z.number(),
        filterBy: z.string().optional(),
        searchQuery: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const currentPage = input.currentPage;
      const limitPerPage = input.limitPerPage;
      const offset = (currentPage - 1) * limitPerPage;

      const data = await ctx.prisma.attendanceRecord.findMany({
        where: {
          event: {
            dayId: input.dayId
          },
          student: {
            nim: {
              contains: input.filterBy === 'nim' ? input.searchQuery : '',
              mode: 'insensitive'
            },
            profile: {
              name: {
                contains: input.filterBy === 'name' ? input.searchQuery : '',
                mode: 'insensitive'
              }
            },
            groupRelation: {
              every: {
                group: {
                  group:
                    input.filterBy === 'group'
                      ? input.searchQuery
                        ? parseInt(input.searchQuery)
                        : undefined
                      : undefined
                }
              }
            }
          },
          status:
            input.filterBy === 'status'
              ? (input.searchQuery as unknown as Status)
              : undefined
        },
        select: {
          id: true,
          date: true,
          status: true,
          reason: true,
          student: {
            select: {
              nim: true,
              mentor: {
                select: {
                  mentor: {
                    select: {
                      profile: {
                        select: {
                          name: true
                        }
                      }
                    }
                  }
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
              },
              profile: {
                select: {
                  name: true
                }
              }
            }
          }
        },
        take: limitPerPage,
        skip: offset
      });

      const total = await ctx.prisma.attendanceRecord.count({
        where: {
          event: {
            dayId: input.dayId
          },
          student: {
            nim: {
              contains: input.filterBy === 'nim' ? input.searchQuery : '',
              mode: 'insensitive'
            },
            profile: {
              name: {
                contains: input.filterBy === 'name' ? input.searchQuery : '',
                mode: 'insensitive'
              }
            },
            groupRelation: {
              every: {
                group: {
                  group:
                    input.filterBy === 'group'
                      ? input.searchQuery
                        ? parseInt(input.searchQuery)
                        : undefined
                      : undefined
                }
              }
            }
          },
          status:
            input.filterBy === 'status'
              ? (input.searchQuery as unknown as Status)
              : undefined
        }
      });

      return {
        data: data,
        metadata: {
          total: total,
          page: currentPage,
          lastPage: Math.ceil(total / limitPerPage)
        }
      };
    }),

  adminGetAttendanceBaseOnDayId: adminProcedure
    .input(z.object({ dayId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const dayId = input.dayId;

      if (dayId) {
        // Fetch data berdasarkan dayId
        return await ctx.prisma.attendanceEvent.findMany({
          where: {
            dayId: dayId
          }
        });
      } else {
        return await ctx.prisma.attendanceEvent.findMany();
      }
    }),

  getAttendanceDayList: protectedProcedure.query(async ({ ctx }) => {
    if ((await ctx.prisma.attendanceDay.count()) === 0) {
      return [] as AttendanceDay[];
    }
    return await ctx.prisma.attendanceDay.findMany({
      orderBy: {
        time: 'desc'
      }
    });
  }),

  mentorGetAttendance: mentorProcedure
    .input(
      z.object({
        dayId: z.string().uuid().optional(),
        filterBy: z.string().optional(),
        searchQuery: z.string().optional(),
        currentPage: z.number(),
        limitPerPage: z.number(),
        sortBy: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      //mencari groupId dari mentor
      const groupId = await ctx.prisma.groupRelation.findFirst({
        select: {
          groupId: true
        },
        where: {
          userId: ctx.session.user.id
        }
      });

      if (!groupId) {
        return {
          data: [],
          metadata: {}
        };
      }

      // mencari kehadiran dari anak didik mentor dan secara default menugurutkan berdasarkan
      const data = await ctx.prisma.attendanceRecord.findMany({
        select: {
          student: {
            select: {
              groupRelation: {
                select: {
                  group: {
                    select: {
                      group: true
                    }
                  }
                }
              },
              nim: true,
              profile: {
                select: {
                  name: true
                }
              }
            }
          },
          id: true,
          date: true,
          status: true,
          reason: true
        },
        where: {
          student: {
            groupRelation: {
              some: {
                groupId: groupId.groupId
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
          event: {
            dayId: input.dayId
          },
          date: input.filterBy === 'date' ? input.searchQuery : undefined
        },
        skip: (input.currentPage - 1) * input.limitPerPage,
        take: input.limitPerPage,
        orderBy: {
          student: {
            profile: {
              name: input.sortBy === 'name' ? 'asc' : undefined
            }
          },
          date: input.sortBy === 'date' ? 'asc' : undefined,
          status: input.sortBy === 'status' ? 'asc' : undefined
        }
      });

      const total = await ctx.prisma.attendanceRecord.count({
        where: {
          student: {
            groupRelation: {
              some: {
                groupId: groupId.groupId
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
          event: {
            dayId: input.dayId
          },
          date: input.filterBy === 'date' ? input.searchQuery : undefined
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

  adminGetAttendanceEventList: adminProcedure
    .input(z.object({ dayId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.attendanceEvent.findMany({
        where: { dayId: input.dayId }
      });
    }),

  mentorGetEventList: mentorProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.attendanceDay.findMany({
      include: {
        event: true
      },
      orderBy: {
        time: 'desc'
      }
    });
  }),

  editAttendanceRecord: adminAndMentorProcedure
    .input(
      z.object({
        attendanceId: z.string().uuid(),
        kehadiran: z.nativeEnum(Status),
        reason: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.kehadiran !== Status.HADIR && !input.reason) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Please provide a reason'
        });
      }

      try {
        const attendanceRecord = await ctx.prisma.attendanceRecord.update({
          where: {
            id: input.attendanceId
          },
          data: {
            status: input.kehadiran,
            reason: input.kehadiran !== Status.HADIR ? input.reason : undefined
          }
        });
        return {
          message: 'Edit attendance successful',
          attendanceRecord
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to edit the attendance record'
        });
      }
    })
});
