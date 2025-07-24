import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { resumes } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { v4 as uuidv4 } from "uuid";

const personalInfoSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  location: z.string(),
  website: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  summary: z.string().optional(),
});

const workExperienceSchema = z.object({
  id: z.string(),
  company: z.string(),
  position: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean(),
  description: z.string(),
  location: z.string().optional(),
});

const educationSchema = z.object({
  id: z.string(),
  institution: z.string(),
  degree: z.string(),
  field: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean(),
  gpa: z.string().optional(),
  description: z.string().optional(),
});

const skillSchema = z.object({
  id: z.string(),
  category: z.string(),
  items: z.array(z.string()),
});

const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  technologies: z.array(z.string()),
  url: z.string().optional(),
  github: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

const resumeSchema = z.object({
  title: z.string(),
  template: z.string().default("modern"),
  personalInfo: personalInfoSchema.optional(),
  workExperience: z.array(workExperienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  skills: z.array(skillSchema).default([]),
  projects: z.array(projectSchema).default([]),
});

export const resumeRouter = createTRPCRouter({
  // Get all user's resumes
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, ctx.session.user.id))
      .orderBy(resumes.updatedAt);
  }),

  // Get single resume by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const resume = await ctx.db
        .select()
        .from(resumes)
        .where(
          and(eq(resumes.id, input.id), eq(resumes.userId, ctx.session.user.id))
        )
        .limit(1);

      if (!resume[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Resume not found",
        });
      }

      return resume[0];
    }),

  // Get public resume by slug
  getPublic: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const resume = await ctx.db
        .select()
        .from(resumes)
        .where(
          and(eq(resumes.publicSlug, input.slug), eq(resumes.isPublic, true))
        )
        .limit(1);

      if (!resume[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Resume not found",
        });
      }

      return resume[0];
    }),

  // Create new resume
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        template: z.string().default("modern"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const id = uuidv4();

      const newResume = await ctx.db
        .insert(resumes)
        .values({
          id,
          userId: ctx.session.user.id,
          title: input.title,
          template: input.template,
          personalInfo: null,
          workExperience: [],
          education: [],
          skills: [],
          projects: [],
        })
        .returning();

      return newResume[0];
    }),

  // Update resume
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: resumeSchema.partial(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingResume = await ctx.db
        .select()
        .from(resumes)
        .where(
          and(eq(resumes.id, input.id), eq(resumes.userId, ctx.session.user.id))
        )
        .limit(1);

      if (!existingResume[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Resume not found",
        });
      }

      const updatedResume = await ctx.db
        .update(resumes)
        .set({
          ...input.data,
          updatedAt: new Date(),
        })
        .where(eq(resumes.id, input.id))
        .returning();

      return updatedResume[0];
    }),

  // Delete resume
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingResume = await ctx.db
        .select()
        .from(resumes)
        .where(
          and(eq(resumes.id, input.id), eq(resumes.userId, ctx.session.user.id))
        )
        .limit(1);

      if (!existingResume[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Resume not found",
        });
      }

      await ctx.db.delete(resumes).where(eq(resumes.id, input.id));

      return { success: true };
    }),

  // Toggle public status and generate/remove slug
  togglePublic: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingResume = await ctx.db
        .select()
        .from(resumes)
        .where(
          and(eq(resumes.id, input.id), eq(resumes.userId, ctx.session.user.id))
        )
        .limit(1);

      if (!existingResume[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Resume not found",
        });
      }

      const isPublic = !existingResume[0].isPublic;
      const publicSlug = isPublic ? uuidv4() : null;

      const updatedResume = await ctx.db
        .update(resumes)
        .set({
          isPublic,
          publicSlug,
          updatedAt: new Date(),
        })
        .where(eq(resumes.id, input.id))
        .returning();

      return updatedResume[0];
    }),
});
