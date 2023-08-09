/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure
} from '~/server/api/trpc';
import GhostContentAPI from '@tryghost/content-api';
// @ts-ignore
import GhostAdminAPI from '@tryghost/admin-api';
import { env } from '~/env.mjs';

const contentApi = new GhostContentAPI({
  url: 'https://blog.oskmitb.com',
  key: env.GHOST_CONTENT_API,
  version: 'v5.0'
});

const adminApi = new GhostAdminAPI({
  url: 'https://blog.oskmitb.com',
  key: env.GHOST_ADMIN_API,
  version: 'v5.0'
});

export const cmsRouter = createTRPCRouter({
  adminGetArticlesList: publicProcedure
    .input(
      z.object({
        searchQuery: z.string().optional(),
        currentPage: z.number(),
        limitPerPage: z.number()
      })
    )
    .query(async ({ input }) => {
      const data = await contentApi.posts.browse({
        limit: input.limitPerPage,
        page: input.currentPage,
        fields: [
          'id',
          'slug',
          'title',
          'html',
          'reading_time',
          'feature_image'
        ],
        filter: input.searchQuery ? `title:~'${input.searchQuery}'` : undefined
      });

      return { data, meta: data.meta };
    }),

  adminGetArticlesById: adminProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return await contentApi.posts.read(
        { slug: input.slug },
        {
          fields: ['id', 'slug', 'title', 'html', 'feature_image']
        }
      );
    }),

  adminAddNewArticle: publicProcedure
    .input(
      z.object({
        title: z.string(),
        body: z.string(),
        featureImage: z.string()
      })
    )
    .mutation(async ({ input }) => {
      try {
        await adminApi.posts.add(
          {
            title: input.title,
            html: input.body,
            feature_image: input.featureImage,
            status: 'published'
          },
          { source: 'html' }
        );

        return {
          message: 'Article added successfully'
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create a new article'
        });
      }
    }),

  adminEditArticle: adminProcedure
    .input(
      z.object({
        articleId: z.string(),
        title: z.string().optional(),
        body: z.string().optional(),
        featureImage: z.string().optional()
      })
    )
    .mutation(async ({ input }) => {
      try {
        const data = await contentApi.posts.read(
          { id: input.articleId },
          {
            fields: [
              'id',
              'slug',
              'title',
              'html',
              'updated_at',
              'feature_image'
            ]
          }
        );

        if (!data) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Cannot find article'
          });
        }

        let slug = data.slug;
        if (input.title) {
          slug = input.title.toLowerCase().split(' ').join('-');
        }

        await adminApi.posts.edit(
          {
            id: input.articleId,
            title: input.title ? input.title : data.title,
            slug: slug,
            html: input.body ? input.body : data.html,
            feature_image: input.featureImage
              ? input.featureImage
              : data.feature_image,
            updated_at: data.updated_at
          },
          { source: 'html' }
        );

        return {
          message: 'Article updated successfully'
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to edit the article'
        });
      }
    }),

  adminDeleteArticle: publicProcedure
    .input(z.object({ articleId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await adminApi.posts.delete({ id: input.articleId });

        return {
          message: 'Article deleted successfully'
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete the article'
        });
      }
    })
});
