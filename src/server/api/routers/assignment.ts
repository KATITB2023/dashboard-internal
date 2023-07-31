import { AssignmentType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import {
  createTRPCRouter,
  adminProcedure,
  mentorProcedure
} from '~/server/api/trpc';

export const assignmentRouter = createTRPCRouter({
  mentorGetAssignment: mentorProcedure
    .input(
      z.object({
        filterBy: z.string().optional(),
        searchQuery: z.string().optional(),
        currentPage: z.number(),
        limitPerPage: z.number()
      })
    )
    .query(async ({ ctx, input }) => {
      const mentorId = ctx.session.user.id;

      // 1. Cari userId student yang punya userId mentor
      // Cari GroupRelation si mentorId
      const groupRelationId = await ctx.prisma.groupRelation.findFirst({
        where: {
          userId: mentorId
        },
        select: {
          id: true
        }
      });

      const students = await ctx.prisma.groupRelation.findMany({
        where: {
          groupId: groupRelationId?.id
        },
        select: {
          userId: true
        }
      });

      const studentIds = students.map((student) => student.userId);

      // Step 2: Cari semua baris dari tabel AssignmentSubmission dengan userId student yang didapatkan. Limit pengambilan sesuai limitPerPage, dan lakukan offset data sesuai dengan currentPage. Rumus offset adalah (currentPage - 1) * limitPerPage
      let assignments = await ctx.prisma.assignmentSubmission.findMany({
        where: {
          studentId: {
            in: studentIds
          }
        },
        skip: (input.currentPage - 1) * input.limitPerPage,
        take: input.limitPerPage
      });

      // Step 3: Apabila filterBy dan searchQuery ada, lakukan filter nomor 4 sesuai dengan filter dan query yang diminta. Kolom yang mungkin untuk di filter adalah Tugas, NIM, Nama.
      if (input.filterBy && input.searchQuery) {
        let where = {};

        switch (input.filterBy) {
          case 'Tugas':
            where = {
              task: {
                contains: input.searchQuery,
                mode: 'insensitive'
              }
            };
            break;
          case 'NIM':
            where = {
              student: {
                nim: {
                  contains: input.searchQuery
                }
              }
            };
            break;
          case 'Nama':
            where = {
              student: {
                name: {
                  contains: input.searchQuery,
                  mode: 'insensitive'
                }
              }
            };
            break;
          default:
            break;
        }

        assignments = await ctx.prisma.assignmentSubmission.findMany({
          where: {
            AND: [
              {
                studentId: {
                  in: studentIds
                }
              },
              where
            ]
          },
          skip: (input.currentPage - 1) * input.limitPerPage,
          take: input.limitPerPage
        });
      }
      return assignments;
    }),

  adminGetAssignment: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.assignment.findMany();
  }),

  adminAddNewAssignment: adminProcedure
    .input(
      z.object({
        title: z.string(),
        type: z.nativeEnum(AssignmentType),
        filePath: z.string(),
        description: z.string(),
        startTime: z.string().datetime(),
        endTime: z.string().datetime()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const [assignment, users] = await Promise.all([
          ctx.prisma.assignment.create({
            data: {
              title: input.title,
              type: input.type,
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
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create a new assignment'
        });
      }
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

      try {
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

        return {
          message: 'Assignment updated successfully',
          updatedAssignment
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to edit the assignment'
        });
      }
    }),

  adminDeleteAssignment: adminProcedure
    .input(
      z.object({
        assignmentId: z.string().uuid()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.assignment.delete({
          where: { id: input.assignmentId }
        });

        return {
          message: 'Assignment deleted successfully'
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete the assignment'
        });
      }
    }),

  mentorGetAssignmentTitleList: mentorProcedure.query(async ({ ctx }) => {
    // TODO: isi logic disini
  }),

  mentorSetAssignmentScore: mentorProcedure
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
    })
});
