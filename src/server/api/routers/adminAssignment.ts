import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { createTRPCRouter, adminProcedure, publicProcedure } from '~/server/api/trpc';

export const adminAssignmentRouter = createTRPCRouter({
  getAssignment: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.assignment.findMany();
  }),

  addNewAssignment: adminProcedure
    .input(
      z.object({
        title: z.string(),
        filePath: z.string(),
        description: z.string(),
        startTime: z.string().datetime(),
        endTime: z.string().datetime()
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.assignment.create({
        data: {
          title: input.title,
          filePath: input.filePath,
          description: input.description,
          startTime: input.startTime,
          endTime: input.endTime
        }
      });
    }),

  editAssignment: adminProcedure
    .input(
      z.object({
        assignmentId: z.string().uuid(), // assignmentId is required
        title: z.string().optional(),
        filePath: z.string().optional(),
        description: z.string().optional(),
        startTime: z.string().datetime().optional(),
        endTime: z.string().datetime().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { assignmentId, title, filePath, description, startTime, endTime } =
        input;

      // Check if the assignment exists in the database
      const assignment = await ctx.prisma.assignment.findUnique({
        where: { id: assignmentId }
      });

      if (!assignment) {
        throw new Error('Assignment not found');
      }

      // Prepare the update data with only defined properties (skip undefined)
      const updateData = {
        title: title !== undefined ? title : assignment.title,
        filePath: filePath !== undefined ? filePath : assignment.filePath,
        description:
          description !== undefined ? description : assignment.description,
        startTime: startTime !== undefined ? startTime : assignment.startTime,
        endTime: endTime !== undefined ? endTime : assignment.endTime
      };

      // Update the assignment in the database
      const updatedAssignment = await ctx.prisma.assignment.update({
        where: { id: assignmentId },
        data: updateData
      });

      return updatedAssignment;
    })
});
