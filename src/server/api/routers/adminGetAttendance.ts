import { Prisma } from "@prisma/client";
import { z } from "zod";
import {
  createTRPCRouter, adminProcedure
} from "~/server/api/trpc";


export const adminGetAttendanceRouter = createTRPCRouter({
  getAllAttendance: adminProcedure
  .query(async ({ ctx }) => {
    // Fungsi menerima parameter currentPage. Cari semua baris dari tabel Attendance. Limit pengambilan 10 per halaman, dan lakukan offset data sesuai dengan currentPage.
    // Rumus offset adalah (currentPage - 1) * limitPerPage
    // Ingat PRISMA undefined untuk filter filter diatas
    const currentPage = 1; // 1 sebagai default
    const limitPerPage = 10;
    const offset = (currentPage - 1) * limitPerPage;

    return await ctx.prisma.attendanceRecord.findMany({
      take: limitPerPage,
      skip: offset,
    });
  }),

  getAttendanceBaseOnDayId: adminProcedure
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

  getAttendanceDayList: adminProcedure
  .query(async ({ ctx }) => {
    // Get attendance day list
    // Fungsi mengembalikan list dari semua day yang ada di tabel attendanceDay, bertujuan untuk mengisi dropdown filter
      return await ctx.prisma.attendanceDay.findMany();
  }),
});
