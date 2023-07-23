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
      kehadiran: z.nativeEnum(Status),
      reason: z.string().optional()
    })
  )
  .mutation(async ({ ctx, input }) => {
    const attendance = await ctx.prisma.attendanceRecord.update({
      where: {
        id: input.attendanceId
      },
      data: {
        status: input.kehadiran
      }
    });

    if (input.kehadiran !== Status.HADIR && !input.reason) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Please provide a reason"
      });
    }

    await ctx.prisma.attendanceRecord.update({
      where: {
        id: input.attendanceId,
      },
      data: {
        status: input.kehadiran,
        reason: input.kehadiran !== Status.HADIR ? input.reason : undefined,
      },
    });
    return {
      message: "Edit attendance successful"
    };
  })
});
