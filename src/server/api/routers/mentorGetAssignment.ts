import { Prisma, PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { createTRPCRouter, mentorProcedure } from '~/server/api/trpc';

const prisma = new PrismaClient();

export const mentorGetAssigmentRouter = createTRPCRouter({
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
      const mentorId = ctx.session.user.id;

      // 1. Cari userId student yang punya userId mentor
      // Cari GroupRelation si mentorId
      const groupRelationId = await prisma.groupRelation.findFirst({
        where: {
          userId: mentorId
        },
        select: {
          id: true
        }
      });

      const students = await prisma.groupRelation.findMany({
        where: {
          groupId: groupRelationId?.id
        },
        select: {
          userId: true
        }
      });

      const studentIds = students.map((student) => student.userId);

      // Step 2: Cari semua baris dari tabel AssignmentSubmission dengan userId student yang didapatkan. Limit pengambilan sesuai limitPerPage, dan lakukan offset data sesuai dengan currentPage. Rumus offset adalah (currentPage - 1) * limitPerPage
      let assignments = await prisma.assignmentSubmission.findMany({
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
                  contains: input.searchQuery
                }
              }
            };
            break;
          default:
            break;
        }

        assignments = await prisma.assignmentSubmission.findMany({
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
    })
});
