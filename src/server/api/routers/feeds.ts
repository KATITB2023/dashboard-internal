import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, adminProcedure } from '~/server/api/trpc';
import { prisma } from '~/server/db';

export const feedsRouter = createTRPCRouter({
  adminGetFeeds: adminProcedure.query(async ({ ctx }) => {
    // Get list semua feeds
    try {
      const feeds = await ctx.prisma.feed.findMany();

      return feeds;
    } catch (err) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get feeds'
      });
    }
  }),

  adminGetFeed: adminProcedure
    .input(
      z.object({
        feedId: z.number()
      })
    )
    .query(async ({ ctx, input }) => {
      // Get detail feed berdasarkan id feed
      try {
        const feed = await ctx.prisma.feed.findFirst({
          where: {
            id: input.feedId
          }
        });

        if (!feed) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Feed does not exist'
          });
        }

        return feed;
      } catch (err) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get feed'
        });
      }
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
      try {
        const postFeed = await ctx.prisma.feed.create({
          data: {
            text: input.body,
            attachmentUrl: input.attachment
          }
        });
        return {
          message: 'Create feed successfully',
          postFeed
        };
      } catch (err) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create the feed'
        });
      }
    }),

  adminDeleteFeed: adminProcedure
    .input(
      z.object({
        feedId: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Delete feed berdasarkan id feed
      const { feedId } = input;
      try {
        await prisma.feed.delete({
          where: { id: feedId }
        });
        return {
          message: 'Feed successfully deleted'
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete feed'
        });
      }
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
      const { feedId, body, attachment } = input;

      try {
        const updatedFeed = await ctx.prisma.feed.update({
          where: { id: feedId },
          data: {
            text: body,
            attachmentUrl: attachment
          }
        });

        return {
          message: 'Feed edited successfully',
          updatedFeed
        };
      } catch (err) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to edit the feed'
        });
      }
    })
});
