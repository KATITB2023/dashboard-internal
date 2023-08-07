import { TRPCError } from '@trpc/server';
import { Status } from '@prisma/client';
import { z } from 'zod';
import { createTRPCRouter, adminProcedure } from '~/server/api/trpc';

export const feedsRouter = createTRPCRouter({
  adminGetFeeds: adminProcedure.query(async ({ ctx }) => {
    // Get list semua feeds
  }),

  adminGetFeed: adminProcedure
    .input(
      z.object({
        feedId: z.number()
      })
    )
    .query(async ({ ctx, input }) => {
      // Get detail feed berdasarkan id feed
    }),

  adminPostFeed: adminProcedure
    .input(
      z.object({
        body: z.string(),
        attachment: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Post feed baru
    }),

  adminDeleteFeed: adminProcedure
    .input(
      z.object({
        feedId: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Delete feed berdasarkan id feed
    }),

  adminEditFeed: adminProcedure
    .input(
      z.object({
        feedId: z.number(),
        body: z.string().optional(),
        attachment: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Edit feed berdasarkan id feed
    })
});
