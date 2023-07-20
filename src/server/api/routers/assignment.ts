import { Prisma } from '@prisma/client';
import { z } from 'zod';
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
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
        throw new Error('Submission not found');
      }

      const updatedSubmission = await ctx.prisma.$transaction(async (tx) => {
        return await tx.assignmentSubmission.update({
          where: { id: submissionId },
          data: { score }
        });
      });

      return updatedSubmission;
    })
});
