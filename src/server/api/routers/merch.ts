import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, adminAndEOProcedure } from '~/server/api/trpc';

export const merchRouter = createTRPCRouter({
  addNewMerch: adminAndEOProcedure
    .input(
      z.object({
        name: z.string(),
        price: z.number(),
        stock: z.number(),
        image: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.merchandise.create({
          data: {
            name: input.name,
            price: input.price,
            stock: input.stock,
            image: input.image
          }
        });

        return {
          message: 'Merch created successfully'
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create merch'
        });
      }
    }),

  editMerch: adminAndEOProcedure
    .input(
      z.object({
        merchId: z.string().uuid(),
        name: z.string().optional(),
        price: z.number().optional(),
        stock: z.number().optional(),
        image: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.stock && input.stock <= 0)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Stock cannot be empty'
        });

      try {
        const updatedMerch = await ctx.prisma.merchandise.update({
          where: {
            id: input.merchId
          },
          data: {
            name: input.name,
            price: input.price,
            stock: input.stock,
            image: input.image
          }
        });

        return {
          message: 'Merch updated successfully',
          updatedMerch
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update merch'
        });
      }
    }),

  deleteMerch: adminAndEOProcedure
    .input(z.object({ merchId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.merchandise.delete({
          where: {
            id: input.merchId
          }
        });

        return {
          message: 'Merch deleted successfully'
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete merch'
        });
      }
    }),

  publishMerch: adminAndEOProcedure
    .input(z.object({ merchId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.merchandise.update({
          where: {
            id: input.merchId
          },
          data: {
            isPublished: true
          }
        });

        return {
          message: 'Merch published'
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to publish merch'
        });
      }
    }),

  editMerchStock: adminAndEOProcedure
    .input(z.object({ merchId: z.string().uuid(), stock: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (input.stock && input.stock <= 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Stock cannot be empty'
        });
      }

      try {
        await ctx.prisma.merchandise.update({
          where: {
            id: input.merchId
          },
          data: {
            stock: input.stock
          }
        });

        return {
          message: 'Stock updated'
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to edit stock'
        });
      }
    }),

  getMerchRequest: adminAndEOProcedure
    .input(z.object({ nim: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.merchandiseRequest.findMany({
        where: {
          student: {
            nim: {
              contains: input.nim
            }
          }
        },
        include: {
          student: true,
          merch: true
        }
      });
    }),

  approveMerchRequest: adminAndEOProcedure
    .input(z.object({ requestId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.merchandiseRequest.update({
          where: {
            id: input.requestId
          },
          data: {
            isApproved: true
          }
        });

        return {
          message: 'Merch request approved'
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Faield to approve merch request'
        });
      }
    })
});
