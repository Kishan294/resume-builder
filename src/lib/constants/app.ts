export const APP_CONFIG = {
  name: "ProfilCraft",
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
    name: "Modern Pro",
    description: "Clean Indigo accents with bold typography",
    preview: "/templates/modern-preview.png",
  },
  {
    id: "executive",
    name: "Executive Elite",
    description: "High-end serif design for senior lead positions",
    preview: "/templates/executive-preview.png",
  },
  {
    id: "tech-pro",
    name: "Developer Core",
    description: "Technical mono-spaced layout for software engineers",
    preview: "/templates/tech-pro-preview.png",
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
    name: "Minimalist",
    description: "Ultra-clean and simple design",
    preview: "/templates/minimal-preview.png",
  },
  {
    id: "professional",
    name: "Corporate",
    description: "Corporate-friendly standard format",
    preview: "/templates/professional-preview.png",
  },
  {
    id: "compact",
    name: "Condensed",
    description: "Maximize content in tight spaces",
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
