import { storageRouter } from '~/server/api/routers/storage';
import { createTRPCRouter } from '~/server/api/trpc';
import { attendanceRouter } from './routers/attendance';
import { mentorGetAssigmentRouter } from './routers/mentorGetAssignment';
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  storage: storageRouter,
  attendance: attendanceRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
