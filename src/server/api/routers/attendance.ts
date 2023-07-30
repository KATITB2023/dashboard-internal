import { TRPCError } from '@trpc/server';
import { Status } from '@prisma/client';
import { z } from 'zod';
import {
  createTRPCRouter,
  mentorProcedure,
  adminProcedure
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
    }),

  adminEditAttendanceEvent: adminProcedure
    .input(
      z.object({
        eventId: z.string().uuid(),
        title: z.string().optional(),
        startTime: z.coerce.date().optional(),
        endTime: z.coerce.date().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const attendanceEvent = await ctx.prisma.attendanceEvent.findUnique({
        where: {
          id: input.eventId
        }
      });

      if (!attendanceEvent) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Attendance event not found'
        });
      }

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
    }),

  adminGetAllAttendance: adminProcedure
    .input(
      z.object({
        currentPage: z.number(),
        limitPerPage: z.number()
      })
    )
    .query(async ({ ctx, input }) => {
      // Fungsi menerima parameter currentPage. Cari semua baris dari tabel Attendance. Limit pengambilan 10 per halaman, dan lakukan offset data sesuai dengan currentPage.
      // Rumus offset adalah (currentPage - 1) * limitPerPage
      // Ingat PRISMA undefined untuk filter filter diatas
      const currentPage = input.currentPage;
      const limitPerPage = input.limitPerPage;
      const offset = (currentPage - 1) * limitPerPage;

      return await ctx.prisma.attendanceRecord.findMany({
        take: limitPerPage,
        skip: offset
      });
    }),

  adminGetAttendanceBaseOnDayId: adminProcedure
    .input(z.object({ dayId: z.string().uuid().optional() }))
    .query(async ({ ctx, input }) => {
      // Get attendance based on dayId:
      // Fungsi menerima parameter dayId yang opsional. Apabila dayId tidak ada, maka fetch data attendanceEvent per attendanceDay. Tetapi jika dayId ada, maka fetch sesuai dengan dayId
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

  adminGetAttendanceDayList: adminProcedure.query(async ({ ctx }) => {
    // Get attendance day list
    // Fungsi mengembalikan list dari semua day yang ada di tabel attendanceDay, bertujuan untuk mengisi dropdown filter
    return await ctx.prisma.attendanceDay.findMany();
  }),

  mentorGetEventList: mentorProcedure.query(async ({ ctx }) => {
    try {
      const attendanceDaysWithEvents = await ctx.prisma.attendanceDay.findMany({
        include: {
          event: true
        }
      });
      return attendanceDaysWithEvents;
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get event list.'
      });
    }
  }),

  mentorEditAttendanceRecord: mentorProcedure
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

      await ctx.prisma.attendanceRecord.update({
        where: {
          id: input.attendanceId
        },
        data: {
          status: input.kehadiran,
          reason: input.kehadiran !== Status.HADIR ? input.reason : undefined
        }
      });
      return {
        message: 'Edit attendance successful'
      };
    })
});
