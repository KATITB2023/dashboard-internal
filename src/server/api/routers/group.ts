import { z } from 'zod';
import {
  adminProcedure,
  createTRPCRouter,
  mentorProcedure
} from '~/server/api/trpc';

export const groupRouter = createTRPCRouter({
  adminGetGroupList: adminProcedure.query(async ({ ctx }) => {
    // TODO: isi logic disini
  }),

  adminGetGroupData: adminProcedure
    .input(z.object({ groupId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      // TODO: isi logic disini
    }),

  mentorGetGroupData: mentorProcedure.query(async ({ ctx }) => {
    // TODO: isi logic disini
  }),

  mentorEditGroupName: mentorProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx }) => {
      // TODO: isi logic disini
    })
});
