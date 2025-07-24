import { createCallerFactory, createTRPCRouter } from "./trpc";
import { resumeRouter } from "./routers/resume";
import { authRouter } from "./routers/auth";

export const appRouter = createTRPCRouter({
  resume: resumeRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
