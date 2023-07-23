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
  protectedProcedure
} from '~/server/api/trpc';
import { prisma } from '~/server/db';

export const eventRouter = createTRPCRouter({
  getEventList: mentorProcedure.query(async ({ ctx }) => {
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

  editAttendance: mentorProcedure
    .input(
      z.object({
        attendanceId: z.string().uuid(),
        status: z.nativeEnum(Status),
        reason: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { attendanceId, status, reason } = input;
      try {
        const existingAttendance = await ctx.prisma.attendanceRecord.findUnique(
          {
            where: { id: attendanceId }
          }
        );

        if (!existingAttendance) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Attendance tidak ditemukan.'
          });
        }

        // Kalau status kehadiran adalah TIDAK_HADIR dan reason ada, maka tambahin reason
        if (status === Status.TIDAK_HADIR && reason) {
          await ctx.prisma.attendanceRecord.update({
            where: { id: attendanceId },
            data: { status, reason }
          });
        } else {
          // Kalau status selain TIDAK_HADIR, update status aja
          await ctx.prisma.attendanceRecord.update({
            where: { id: attendanceId },
            data: { status }
          });
        }

        return {
          message: 'Edit attendance berhasil'
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal untuk mengedit attendance.'
        });
      }
    })
});
