import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  adminProcedure,
} from "~/server/api/trpc";

export const attendanceRouter = createTRPCRouter({
  addAttendanceDay: adminProcedure
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
        message: "Attendance day added successfully",
        attendanceDay
      };
    }),

  addAttendanceEvent: adminProcedure
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
          code: "BAD_REQUEST",
          message: "Attendance day not found"
        });
      }

      const attendanceEvent = await ctx.prisma.attendanceEvent.create({
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
      });

      return {
        message: "Attendance event added successfully",
        attendanceEvent
      };
    }),

  editAttendanceEvent: adminProcedure
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
          code: "BAD_REQUEST",
          message: "Attendance event not found"
        });
      }

      const dataToUpdate: any = {};

      if (input.title) {
        dataToUpdate.title = input.title;
      }

      if (input.startTime) {
        dataToUpdate.startTime = input.startTime;
      }

      if (input.endTime) {
        dataToUpdate.endTime = input.endTime;
      }

      const updatedAttendanceEvent = await ctx.prisma.attendanceEvent.update({
        where: {
          id: input.eventId
        },
        data: dataToUpdate
      });

      return {
        message: "Attendance event updated successfully",
        attendanceEvent: updatedAttendanceEvent
      };
    })
});    
