import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, unitProcedure } from '~/server/api/trpc';
import { REWARD_CONFIG } from '~/utils/reward';

export const unitRouter = createTRPCRouter({
  getUnitProfile: unitProcedure.query(async ({ ctx }) => {
    const unit = await ctx.prisma.unitProfile.findUnique({
      where: {
        userId: ctx.session.user.id
      }
    });

    if (!unit) return null;

    return unit;
  }),

  getAllVisitCount: unitProcedure.query(async ({ ctx }) => {
    const unit = await ctx.prisma.unitProfile.findUnique({
      where: {
        userId: ctx.session.user.id
      },
      select: {
        userId: true
      }
    });

    if (!unit) return 0;

    const total = await ctx.prisma.unitVisit.count({
      where: {
        unitId: unit.userId
      }
    });

    return total;
  }),

  getAllVisit: unitProcedure
    .input(
      z.object({
        page: z.number(),
        limit: z.number(),
        search: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const unit = await ctx.prisma.unitProfile.findUnique({
        where: {
          userId: ctx.session.user.id
        },
        select: {
          userId: true
        }
      });

      if (!unit)
        return {
          data: [],
          metadata: {
            total: 0,
            lastPage: 0
          }
        };

      const offset = (input.page - 1) * input.limit;
      const visits = await ctx.prisma.unitVisit.findMany({
        where: {
          unitId: unit.userId,
          OR: [
            {
              student: {
                nim: {
                  contains: input.search,
                  mode: 'insensitive'
                }
              }
            },
            {
              student: {
                profile: {
                  name: {
                    contains: input.search,
                    mode: 'insensitive'
                  }
                }
              }
            }
          ]
        },
        include: {
          student: {
            select: {
              nim: true,
              profile: {
                select: {
                  name: true
                }
              }
            }
          }
        },
        take: input.limit,
        skip: offset,
        orderBy: [
          {
            createdAt: 'desc'
          }
        ]
      });

      const total = await ctx.prisma.unitVisit.count({
        where: {
          unitId: unit.userId
        }
      });

      return {
        data: visits,
        metadata: {
          total,
          lastPage: Math.ceil(total / input.limit)
        }
      };
    }),

  getStudent: unitProcedure
    .input(
      z.object({
        id: z.string().uuid()
      })
    )
    .query(async ({ ctx, input }) => {
      const student = await ctx.prisma.user.findUnique({
        where: {
          id: input.id
        },
        select: {
          nim: true,
          profile: {
            select: {
              name: true
            }
          }
        }
      });

      if (!student) return null;

      return student;
    }),

  sentReward: unitProcedure
    .input(
      z.object({
        studentId: z.string().uuid(),
        reward: z.nativeEnum(REWARD_CONFIG)
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.$transaction(async (tx) => {
        const unit = await tx.unitProfile.findUnique({
          where: {
            userId: ctx.session.user.id
          },
          select: {
            userId: true
          }
        });

        if (!unit)
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Unit not found'
          });

        await tx.unitReward.create({
          data: {
            unitId: unit.userId,
            studentId: input.studentId,
            reward: input.reward
          }
        });

        await tx.profile.update({
          where: {
            userId: input.studentId
          },
          data: {
            coin: {
              increment: input.reward
            }
          }
        });
      });

      return {
        message: `Reward success. You give ${input.reward} coins`,
        reward: input.reward
      };
    })
});
