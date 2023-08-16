import { mentorAndEOProcedure, createTRPCRouter } from '~/server/api/trpc';

export const facultyRouter = createTRPCRouter({
  getFaculties: mentorAndEOProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.profile.findMany({
      distinct: ['faculty'],
      select: {
        faculty: true
      }
    });
  })
});
