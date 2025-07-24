import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  // Get current session
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),

  // Get current user profile
  getProfile: protectedProcedure.query(({ ctx }) => {
    return ctx.session.user;
  }),
});
