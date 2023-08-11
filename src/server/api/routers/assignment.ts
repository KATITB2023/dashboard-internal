import { AssignmentType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import {
  createTRPCRouter,
  adminProcedure,
  mentorProcedure,
  protectedProcedure,
  mentorAndEOProcedure,
  publicProcedure
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
      const currentPage = input.currentPage;
      const limitPerPage = input.limitPerPage;
      const offset = (currentPage - 1) * limitPerPage;

      if (input.filterBy && input.searchQuery) {
        let where = {};

        switch (input.filterBy) {
          case 'Tugas':
            where = {
              assignment: {
                title: {
                  contains: input.filterBy === 'Tugas' ? input.searchQuery : '',
                  mode: 'insensitive'
                }
              }
            };
            break;
          case 'NIM':
            where = {
              student: {
                nim: {
                  contains: input.filterBy === 'NIM' ? input.searchQuery : ''
                }
              }
            };
            break;
          case 'Nama':
            where = {
              student: {
                profile: {
                  name: {
                    contains:
                      input.filterBy === 'Nama' ? input.searchQuery : '',
                    mode: 'insensitive'
                  }
                }
              }
            };
            break;
          default:
            break;
        }

        const filteredData = await ctx.prisma.assignmentSubmission.findMany({
          where: {
            AND: [
              {
                student: {
                  student: {
                    some: {
                      mentorId: ctx.session.user.id
                    }
                  }
                }
              },
              where
            ]
          },
          skip: offset,
          take: limitPerPage,
          include: {
            assignment: {
              select: {
                id: true,
                type: true,
                title: true,
                endTime: true
              }
            },
            student: {
              select: {
                id: true,
                nim: true,
                profile: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        });

        const total = await ctx.prisma.assignmentSubmission.count({
          where: {
            AND: [
              {
                student: {
                  student: {
                    some: {
                      mentorId: ctx.session.user.id
                    }
                  }
                }
              },
              where
            ]
          }
        });

        return {
          data: filteredData,
          metadata: {
            total: total,
            page: input.currentPage,
            lastPage: Math.ceil(total / input.limitPerPage)
          }
        };
      }

      const data = await ctx.prisma.assignmentSubmission.findMany({
        where: {
          student: {
            student: {
              some: {
                mentorId: ctx.session.user.id
              }
            }
          }
        },
        skip: offset,
        take: limitPerPage,
        include: {
          assignment: {
            select: {
              id: true,
              type: true,
              title: true,
              endTime: true
            }
          },
          student: {
            select: {
              id: true,
              nim: true,
              profile: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      });

      const total = await ctx.prisma.assignmentSubmission.count({
        where: {
          student: {
            student: {
              some: {
                mentorId: ctx.session.user.id
              }
            }
          }
        }
      });

      return {
        data: data,
        metadata: {
          total: total,
          page: input.currentPage,
          lastPage: Math.ceil(total / input.limitPerPage)
        }
      };
    }),

  adminGetAssignment: adminProcedure
    .input(z.object({ currentPage: z.number() }))
    .query(async ({ ctx, input }) => {
      const offset = (input.currentPage - 1) * 5;
      const data = await ctx.prisma.assignment.findMany({
        include: {
          submission: {
            select: {
              id: true,
              filePath: true,
              score: true,
              student: {
                select: {
                  nim: true,
                  profile: {
                    select: {
                      name: true,
                      faculty: true,
                      campus: true
                    }
                  }
                }
              }
            }
          }
        },
        skip: offset,
        take: 5,
        orderBy: {
          startTime: 'desc'
        }
      });

      const total = await ctx.prisma.assignment.count();

      return {
        data: data,
        metadata: {
          total: total,
          page: input.currentPage,
          lastPage: Math.ceil(total / 5)
        }
      };
    }),

  mentorAndEOGetAssignment: mentorAndEOProcedure
    .input(
      z.object({
        filterBy: z.string().optional(),
        searchQuery: z.string().optional(),
        currentPage: z.number(),
        limitPerPage: z.number(),
        isEO: z.boolean()
      })
    )
    .query(async ({ ctx, input }) => {
      const currentPage = input.currentPage;
      const limitPerPage = input.limitPerPage;
      const offset = (currentPage - 1) * limitPerPage;

      const filterAssignmentType = input.isEO
        ? {
            assignment: {
              OR: [
                {
                  type: AssignmentType.DAILY_QUEST
                },
                {
                  type: AssignmentType.SIDE_QUEST
                }
              ]
            }
          }
        : {};

      const filterByMentor = !input.isEO
        ? {
            student: {
              student: {
                some: {
                  mentorId: ctx.session.user.id
                }
              }
            }
          }
        : {};

      const filteredData = await ctx.prisma.assignmentSubmission.findMany({
        where: {
          AND: [
            {
              assignment: {
                title: {
                  contains: input.filterBy === 'Tugas' ? input.searchQuery : '',
                  mode: 'insensitive'
                }
              }
            },
            {
              student: {
                nim: {
                  contains: input.filterBy === 'NIM' ? input.searchQuery : ''
                }
              }
            },
            {
              student: {
                profile: {
                  name: {
                    contains:
                      input.filterBy === 'Nama' ? input.searchQuery : '',
                    mode: 'insensitive'
                  }
                }
              }
            },
            filterAssignmentType,
            filterByMentor
          ]
        },
        skip: offset,
        take: limitPerPage,
        include: {
          assignment: {
            select: {
              id: true,
              type: true,
              title: true,
              endTime: true
            }
          },
          student: {
            select: {
              id: true,
              nim: true,
              profile: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      });

      const total = await ctx.prisma.assignmentSubmission.count({
        where: {
          AND: [
            {
              assignment: {
                title: {
                  contains: input.filterBy === 'Tugas' ? input.searchQuery : '',
                  mode: 'insensitive'
                }
              }
            },
            {
              student: {
                nim: {
                  contains: input.filterBy === 'NIM' ? input.searchQuery : ''
                }
              }
            },
            {
              student: {
                profile: {
                  name: {
                    contains:
                      input.filterBy === 'Nama' ? input.searchQuery : '',
                    mode: 'insensitive'
                  }
                }
              }
            },
            filterAssignmentType,
            filterByMentor
          ]
        }
      });

      return {
        data: filteredData,
        metadata: {
          total: total,
          page: input.currentPage,
          lastPage: Math.ceil(total / input.limitPerPage)
        }
      };
    }),

  adminAddNewAssignment: adminProcedure
    .input(
      z.object({
        title: z.string(),
        type: z.nativeEnum(AssignmentType),
        filePath: z.string().optional(),
        description: z.string().optional(),
        startTime: z.coerce.date(),
        endTime: z.coerce.date()
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.startTime > input.endTime) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'End time cannot be earlier than start time'
        });
      }

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
            },
            where: {
              role: 'STUDENT'
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

        return {
          message: 'Assignment added successfully'
        };
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
        type: z.nativeEnum(AssignmentType).optional(),
        filePath: z.string().optional(),
        description: z.string().optional(),
        startTime: z.coerce.date().optional(),
        endTime: z.coerce.date().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {
        assignmentId,
        title,
        type,
        filePath,
        description,
        startTime,
        endTime
      } = input;

      try {
        // Prepare the update data with only defined properties (skip undefined)
        // Update the assignment in the database
        const updatedAssignment = await ctx.prisma.assignment.update({
          where: { id: assignmentId },
          data: {
            title: title,
            type: type,
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

  mentorGetAssignmentTitleList: protectedProcedure.query(async ({ ctx }) => {
    const assignments = await ctx.prisma.assignment.findMany({
      select: {
        id: true,
        title: true
      }
    });

    return assignments;
  }),

  mentorSetAssignmentScore: mentorAndEOProcedure
    .input(
      z.object({
        submissionId: z.string().uuid(),
        score: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { submissionId, score } = input;

      try {
        const updatedSubmission = await ctx.prisma.$transaction(async (tx) => {
          return await tx.assignmentSubmission.update({
            where: { id: submissionId },
            data: { score }
          });
        });

        await ctx.prisma.$transaction(async (tx) => {
          return await tx.profile.update({
            where: { userId: updatedSubmission.studentId },
            data: { point: { increment: score } }
          });
        });

        return {
          message: 'Score updated successfully'
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update the score'
        });
      }
    })
});
