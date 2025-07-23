import { boolean, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

export const resumes = pgTable("resumes", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  template: text("template").default("modern"),
  isPublic: boolean("isPublic").default(false),
  publicSlug: text("publicSlug").unique(),
  personalInfo: jsonb("personal_info").$type<{
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    github?: string;
    summary?: string;
  }>(),
  workExperience: jsonb("work_experience")
    .$type<
      Array<{
        id: string;
        company: string;
        position: string;
        startDate: string;
        endDate?: string;
        current: boolean;
        description: string;
        location?: string;
      }>
    >()
    .default([]),
  education: jsonb("education")
    .$type<
      Array<{
        id: string;
        institution: string;
        degree: string;
        field: string;
        startDate: string;
        endDate?: string;
        current: boolean;
        gpa?: string;
        description?: string;
      }>
    >()
    .default([]),
  skills: jsonb("skills")
    .$type<
      Array<{
        id: string;
        category: string;
        items: string[];
      }>
    >()
    .default([]),
  projects: jsonb("projects")
    .$type<
      Array<{
        id: string;
        name: string;
        description: string;
        technologies: string[];
        url?: string;
        github?: string;
        startDate?: string;
        endDate?: string;
      }>
    >()
    .default([]),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type User = typeof user.$inferSelect;
export type Resume = typeof resumes.$inferSelect;
export type NewResume = typeof resumes.$inferInsert;
