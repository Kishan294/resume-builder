export const APP_CONFIG = {
  name: "Resume Builder",
  description: "Create professional resumes with ease",
  version: "1.0.0",
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  EDITOR: "/editor",
  RESUME: "/resume",
} as const;

export const RESUME_TEMPLATES = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean and contemporary design",
    preview: "/templates/modern-preview.png",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional professional layout",
    preview: "/templates/classic-preview.png",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Stand out with unique styling",
    preview: "/templates/creative-preview.png",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and elegant design",
    preview: "/templates/minimal-preview.png",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Corporate-friendly format",
    preview: "/templates/professional-preview.png",
  },
  {
    id: "compact",
    name: "Compact",
    description: "Maximize content in limited space",
    preview: "/templates/compact-preview.png",
  },
] as const;

export const SKILL_LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
] as const;

export const QUERY_KEYS = {
  RESUMES: "resumes",
  RESUME: "resume",
  USER: "user",
  SESSION: "session",
} as const;

export const LOCAL_STORAGE_KEYS = {
  THEME: "theme",
  DRAFT_RESUME: "draft-resume",
  USER_PREFERENCES: "user-preferences",
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED: "This field is required",
  EMAIL: "Please enter a valid email address",
  MIN_LENGTH: (min: number) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max: number) => `Must be no more than ${max} characters`,
} as const;
