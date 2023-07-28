import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import {
  createTRPCRouter,
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
        submissionId: z.string().uuid(),
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
      const [assignment, users] = await Promise.all([
        ctx.prisma.assignment.create({
          data: {
            title: input.title,
            filePath: input.filePath,
            description: input.description,
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
          await ctx.prisma.assignmentSubmission.create({
            data: {
              studentId: user.id,
              assignmentId: assignment.id
            }
          });
        })
      );
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
      // Update the assignment in the database
      const updatedAssignment = await ctx.prisma.assignment.update({
        where: { id: assignmentId },
        data: {
          title: title,
          filePath: filePath,
          description: description,
          startTime: startTime,
          endTime: endTime
        }
      });

      return updatedAssignment;
    })
});
