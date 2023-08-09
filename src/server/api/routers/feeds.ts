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
      const { feedId } = input;
      try {
        const feed = await prisma.feed.findUnique({
          where: { id: feedId }
        });

        if (!feed) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'BAD_REQUEST'
          });
        }

        await prisma.feed.delete({
          where: { id: feedId }
        });
        
        return feed;
      } catch (error) {
        console.error('Error dalam menghapus feed:', error);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'BAD_REQUEST'
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
