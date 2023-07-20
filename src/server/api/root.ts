import { exampleRouter } from "~/server/api/routers/example";
import { storageRouter } from "~/server/api/routers/storage";
import { createTRPCRouter } from "~/server/api/trpc";
import { adminGetAttendanceRouter } from "./routers/adminGetAttendance";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  storage: storageRouter,
  adminGetAttendance: adminGetAttendanceRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
