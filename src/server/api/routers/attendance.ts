import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  adminProcedure
} from "~/server/api/trpc";

export const attendanceRouter = createTRPCRouter({
  // 1. Add new attendance day
  addNewAttendanceDay: adminProcedure
    .input(
      z.object({
        name: z.string(),
        time: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newDay = await ctx.prisma.attendanceDay.create({
        data: {
          name: input.name,
          time: input.time
        }
      });

      return {
        message: "New attendance day added",
        day: newDay
      };
    }),

  // 2. Add new attendance event
  addNewAttendanceEvent: adminProcedure
    .input(
      z.object({
        dayId: z.string().uuid(),
        title: z.string(),
        startTime: z.string(),
        endTime: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const day = await ctx.prisma.attendanceDay.findUnique({
        where: {
          id: input.dayId
        }
      });

      if (!day) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Attendance day not found"
        });
      }

      const newEvent = await ctx.prisma.attendanceEvent.create({
        data: {
          dayId: input.dayId,
          title: input.title,
          startTime: input.startTime,
          endTime: input.endTime
        }
      });

      return {
        message: "New attendance event added",
        event: newEvent
      };
    }),

  // 3. Edit attendance event
  editAttendanceEvent: adminProcedure
    .input(
      z.object({
        eventId: z.string().uuid(),
        title: z.string().optional(),
        startTime: z.string().optional(),
        endTime: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const event = await ctx.prisma.attendanceEvent.findUnique({
        where: {
          id: input.eventId
        }
      });

      if (!event) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Attendance event not found"
        });
      }

      const updatedEvent = await ctx.prisma.attendanceEvent.update({
        where: {
          id: input.eventId
        },
        data: {
          title: input.title || event.title,
          startTime: input.startTime || event.startTime,
          endTime: input.endTime || event.endTime
        }
      });

      return {
        message: "Attendance event updated",
        event: updatedEvent
      };
    })
});
