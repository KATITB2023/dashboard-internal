import { Prisma } from '@prisma/client';
import { TRPCError } from "@trpc/server";
import { z } from 'zod';
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
  mentorProcedure
} from '~/server/api/trpc';

export const assignmentRouter = createTRPCRouter({
  getAssignment: mentorProcedure
    .input(
      z.object({
        filterBy: z.string().optional(),
        searchQuery: z.string().optional(),
        currentPage: z.number(),
        limitPerPage: z.number()
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.assignment.findMany({
        where: {
          title: {
            contains: input.searchQuery
          }
        },
        skip: (input.currentPage - 1) * input.limitPerPage,
        take: input.limitPerPage
      });
    }),

  setAssignmentScore: mentorProcedure
    .input(
      z.object({
        submissionId: z.string(),
        score: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { submissionId, score } = input;

      const submission = await ctx.prisma.assignmentSubmission.findUnique({
        where: { id: submissionId }
      });

      if (!submission) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Submission not found'
        });
      }

      const updatedSubmission = await ctx.prisma.$transaction(async (tx) => {
        return await tx.assignmentSubmission.update({
          where: { id: submissionId },
          data: { score }
        });
      });

      return updatedSubmission;
    }),

    adminGetAssignment: adminProcedure.query(async ({ ctx }) => {
      return await ctx.prisma.assignment.findMany();
    }),
  
    adminAddNewAssignment: adminProcedure
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
  
    adminEditAssignment: adminProcedure
      .input(
        z.object({
          assignmentId: z.string().uuid(),
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
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Assignment not found'
          });
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
