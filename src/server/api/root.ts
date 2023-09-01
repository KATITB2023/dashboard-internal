import { createTRPCRouter } from '~/server/api/trpc';
import { assignmentRouter } from '~/server/api/routers/assignment';
import { attendanceRouter } from '~/server/api/routers/attendance';
import { groupRouter } from '~/server/api/routers/group';
import { leaderboardRouter } from '~/server/api/routers/leaderboard';
import { cmsRouter } from '~/server/api/routers/cms';
import { csvRouter } from '~/server/api/routers/csv';
import { feedsRouter } from '~/server/api/routers/feeds';
import { facultyRouter } from '~/server/api/routers/faculty';
import { merchRouter } from '~/server/api/routers/merch';
import { unitRouter } from '~/server/api/routers/unit';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  assignment: assignmentRouter,
  attendance: attendanceRouter,
  group: groupRouter,
  leaderboard: leaderboardRouter,
  cms: cmsRouter,
  csv: csvRouter,
  feeds: feedsRouter,
  faculty: facultyRouter,
  merch: merchRouter,
  unit: unitRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
