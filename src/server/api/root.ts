import { exampleRouter } from "~/server/api/routers/example";
import { storageRouter } from "~/server/api/routers/storage";
import { assignmentRouter } from "~/server/api/routers/assignment";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  storage: storageRouter,
  assignment: assignmentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
