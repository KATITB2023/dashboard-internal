import { assignmentRouter } from '~/server/api/routers/assignment';
import { createTRPCRouter } from '~/server/api/trpc';
import { attendanceRouter } from '~/server/api/routers/attendance';
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  assignment: assignmentRouter,
  attendance: attendanceRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
