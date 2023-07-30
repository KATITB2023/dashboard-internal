import { TRPCError } from '@trpc/server';
import {
  PrismaClient,
  AttendanceDay,
  AttendanceEvent,
  AttendanceRecord,
  Status
} from '@prisma/client';
import { z } from 'zod';
import {
  createTRPCRouter,
  mentorProcedure,
  publicProcedure,
  protectedProcedure,
  adminProcedure
} from '~/server/api/trpc';
import { prisma } from '~/server/db';

export const attendanceRouter = createTRPCRouter({
  getEventList: publicProcedure.query(async ({ ctx }) => {
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
  editAttendance: publicProcedure
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
    }),

  adminGetAllAttendance: publicProcedure
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

  adminGetAttendanceBaseOnDayId: publicProcedure
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

  adminGetAttendanceDayList: publicProcedure.query(async ({ ctx }) => {
    // Get attendance day list
    // Fungsi mengembalikan list dari semua day yang ada di tabel attendanceDay, bertujuan untuk mengisi dropdown filter
    return await ctx.prisma.attendanceDay.findMany();
  })
});
