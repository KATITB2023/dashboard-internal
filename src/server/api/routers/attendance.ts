import { Prisma } from "@prisma/client";
import { profile } from "console";
import { z } from "zod";
import {
  createTRPCRouter, adminProcedure, mentorProcedure
} from "~/server/api/trpc";


export const attendanceRouter = createTRPCRouter({
  adminGetAllAttendance: adminProcedure
  .input(z.object({
    currentPage: z.number(),
    limitPerPage: z.number(),
  }))
  .query(async ({ ctx, input }) => {
    // Fungsi menerima parameter currentPage. Cari semua baris dari tabel Attendance. Limit pengambilan 10 per halaman, dan lakukan offset data sesuai dengan currentPage.
    // Rumus offset adalah (currentPage - 1) * limitPerPage
    // Ingat PRISMA undefined untuk filter filter diatas
    const currentPage = input.currentPage;
    const limitPerPage = input.limitPerPage;
    const offset = (currentPage - 1) * limitPerPage;

    return await ctx.prisma.attendanceRecord.findMany({
      take: limitPerPage,
      skip: offset,
    });
  }),

  adminGetAttendanceBaseOnDayId: adminProcedure
  .input(z.object({ dayId: z.string().uuid().optional() }))
  .query(async ({ ctx, input }) => {
      // Get attendance based on dayId:
      // Fungsi menerima parameter dayId yang opsional. Apabila dayId tidak ada, maka fetch data attendanceEvent per attendanceDay. Tetapi jika dayId ada, maka fetch sesuai dengan dayId
      const dayId = input.dayId;

      if (dayId) {
        // Fetch data berdasarkan dayId
        return await ctx.prisma.attendanceEvent.findMany({
          where: {
            dayId: dayId,
          },
        });
      } else {
        return await ctx.prisma.attendanceEvent.findMany();
      }
    }),

  adminGetAttendanceDayList: adminProcedure
  .query(async ({ ctx }) => {
    // Get attendance day list
    // Fungsi mengembalikan list dari semua day yang ada di tabel attendanceDay, bertujuan untuk mengisi dropdown filter
      return await ctx.prisma.attendanceDay.findMany();
  }),

  mentorGetAttendace: mentorProcedure
  .input(
      z.object({
          eventId: z.string().uuid().optional(),
          filterBy: z.string().optional(),
          searchQuery: z.string().optional(),
          currentPage: z.number(),
          limitPerPage: z.number(),
          sortBy: z.string().optional(),
      })
  )
  .query(async ({ ctx, input }) => {
      //mencari groupId dari mentor
      const groupId= await ctx.prisma.groupRelation.findFirst({
          select:{
              groupId: true
          },
          where:{
              userId : ctx.session.user.id,
          }
      })
      // mencari kehadiran dari anak didik mentor dan secara default menugurutkan berdasarkan 
      return await ctx.prisma.attendanceRecord.findMany({
          select:{
            student:{
              select:{
                groupRelation:{
                  select:{
                    group:{
                      select:{
                        group:true
                      }
                    }
                  }
                },
                nim:true,
                profile:{
                  select:{
                    name:true,
                  }
                }
              }
            },
            date:true,
            status:true,
            reason:true,
          },
          where: {
              student:{
                  groupRelation:{
                      some:{
                          groupId:groupId?.groupId
                          // group:{
                          //     groupRelation:{
                          //         some:{
                          //             userId:ctx.session.user.id
                          //         }
                          //     }
                          // }
                      }
                  },
                  nim:input.filterBy === "nim" ? input.searchQuery : undefined,
                  profile:{
                      name:input.filterBy === "name" ? input.searchQuery : undefined,
                  }
              },  
              eventId: input.eventId,
              date: input.filterBy === "date" ? input.searchQuery : undefined,
          },
          skip: (input.currentPage - 1) * input.limitPerPage,
          take: input.limitPerPage,
          orderBy:{
            student:{
              nim: 'asc',
              profile:{
                name: input.sortBy === 'name'? 'asc':undefined,
              }
            }, 
            date: input.sortBy === 'date'? 'asc':undefined,
            status: input.sortBy === 'status'? 'asc':undefined,
          }
      });
  }),

  
});
