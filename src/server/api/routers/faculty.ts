import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { mentorAndEOProcedure, createTRPCRouter } from '~/server/api/trpc';

export const facultyRouter = createTRPCRouter({
  getFaculties: mentorAndEOProcedure.query(async ({ ctx }) => {
    try {
      const faculties = await ctx.prisma.profile.findMany({
        distinct: ['faculty'],
        select: {
          faculty: true
        }
      });

      return faculties;
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get faculties'
      });
    }
  })
});
