import { z } from "zod";

// Personal information validation schema
export const personalInfoSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email({ message: "Please enter a valid email address" })
    .max(100, "Email must be less than 100 characters"),
  phone: z
    .string()
    .refine(
      (val) => !val || val.length >= 10,
      "Phone number must be at least 10 digits"
    )
    .refine(
      (val) =>
        !val || /^[\+]?[1-9][\d]{0,15}$/.test(val.replace(/[\s\-\(\)]/g, "")),
      "Please enter a valid phone number"
    ),
  location: z.string().max(100, "Location must be less than 100 characters"),
  website: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        val === "" ||
        z.string().url({ message: "Please enter a valid URL" }).safeParse(val)
          .success,
      "Please enter a valid URL"
    ),
  linkedin: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        val === "" ||
        z.url({ message: "Please enter a valid LinkedIn URL" }).safeParse(val)
          .success,
      "Please enter a valid LinkedIn URL"
    )
    .refine(
      (val) => !val || val === "" || val.includes("linkedin.com"),
      "Please enter a valid LinkedIn URL"
    ),
  github: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        val === "" ||
        z.url({ message: "Please enter a valid GitHub URL" }).safeParse(val)
          .success,
      "Please enter a valid GitHub URL"
    )
    .refine(
      (val) => !val || val === "" || val.includes("github.com"),
      "Please enter a valid GitHub URL"
    ),
  summary: z
    .string()
    .max(500, "Summary must be 500 characters or less")
    .optional(),
});

// Work experience validation schema
export const workExperienceSchema = z
  .object({
    id: z.string(),
    company: z
      .string()
      .min(1, "Company name is required")
      .min(2, "Company name must be at least 2 characters")
      .max(100, "Company name must be less than 100 characters"),
    position: z
      .string()
      .min(1, "Position is required")
      .min(2, "Position must be at least 2 characters")
      .max(100, "Position must be less than 100 characters"),
    startDate: z
      .string()
      .min(1, "Start date is required")
      .regex(/^\d{4}-\d{2}$/, "Please select a valid start date"),
    endDate: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^\d{4}-\d{2}$/.test(val),
        "Please select a valid end date"
      ),
    current: z.boolean(),
    description: z
      .string()
      .min(1, "Description is required")
      .min(10, "Description must be at least 10 characters")
      .max(1000, "Description must be 1000 characters or less"),
    location: z
      .string()
      .max(100, "Location must be less than 100 characters")
      .optional(),
  })
  .refine(
    (data) => {
      if (!data.current && !data.endDate) {
        return false;
      }
      if (data.current && data.endDate) {
        return false;
      }
      if (data.startDate && data.endDate && data.startDate > data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "Please provide a valid date range",
      path: ["endDate"],
    }
  );

// Education validation schema
export const educationSchema = z
  .object({
    id: z.string(),
    institution: z
      .string()
      .min(1, "Institution is required")
      .min(2, "Institution name must be at least 2 characters")
      .max(100, "Institution name must be less than 100 characters"),
    degree: z
      .string()
      .min(1, "Degree is required")
      .min(2, "Degree must be at least 2 characters")
      .max(100, "Degree must be less than 100 characters"),
    field: z
      .string()
      .min(1, "Field of study is required")
      .min(2, "Field of study must be at least 2 characters")
      .max(100, "Field of study must be less than 100 characters"),
    startDate: z
      .string()
      .min(1, "Start date is required")
      .regex(/^\d{4}-\d{2}$/, "Please select a valid start date"),
    endDate: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^\d{4}-\d{2}$/.test(val),
        "Please select a valid end date"
      ),
    current: z.boolean(),
    gpa: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^\d+(\.\d+)?\/\d+(\.\d+)?$|^\d+(\.\d+)?$/.test(val),
        "Please enter a valid GPA (e.g., 3.8 or 3.8/4.0)"
      ),
    description: z
      .string()
      .max(500, "Description must be 500 characters or less")
      .optional(),
  })
  .refine(
    (data) => {
      if (!data.current && !data.endDate) {
        return false;
      }
      if (data.current && data.endDate) {
        return false;
      }
      if (data.startDate && data.endDate && data.startDate > data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "Please provide a valid date range",
      path: ["endDate"],
    }
  );

// Skills validation schema
export const skillCategorySchema = z.object({
  id: z.string(),
  category: z
    .string()
    .min(1, "Category name is required")
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name must be less than 50 characters"),
  items: z
    .array(z.string().min(1, "Skill name cannot be empty"))
    .min(1, "Please add at least one skill to this category"),
});

// Projects validation schema
export const projectSchema = z
  .object({
    id: z.string(),
    name: z
      .string()
      .min(1, "Project name is required")
      .min(2, "Project name must be at least 2 characters")
      .max(100, "Project name must be less than 100 characters"),
    description: z
      .string()
      .min(1, "Description is required")
      .min(10, "Description must be at least 10 characters")
      .max(500, "Description must be 500 characters or less"),
    technologies: z
      .array(z.string())
      .min(1, "Please add at least one technology"),
    url: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val ||
          val === "" ||
          z.url({ message: "Please enter a valid URL" }).safeParse(val).success,
        "Please enter a valid URL"
      ),
    github: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val ||
          val === "" ||
          z.url({ message: "Please enter a valid GitHub URL" }).safeParse(val)
            .success,
        "Please enter a valid GitHub URL"
      )
      .refine(
        (val) => !val || val === "" || val.includes("github.com"),
        "Please enter a valid GitHub URL"
      ),
    startDate: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^\d{4}-\d{2}$/.test(val),
        "Please select a valid start date"
      ),
    endDate: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^\d{4}-\d{2}$/.test(val),
        "Please select a valid end date"
      ),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate && data.startDate > data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

// Form schemas for arrays
export const workExperienceFormSchema = z.object({
  experiences: z.array(workExperienceSchema),
});

export const educationFormSchema = z.object({
  educations: z.array(educationSchema),
});

export const skillsFormSchema = z.object({
  skillCategories: z.array(skillCategorySchema),
});

export const projectsFormSchema = z.object({
  projects: z.array(projectSchema),
});

// Complete resume schema
export const resumeSchema = z.object({
  title: z.string(),
  template: z.string().default("modern"),
  personalInfo: personalInfoSchema.optional(),
  workExperience: z.array(workExperienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  skills: z.array(skillCategorySchema).default([]),
  projects: z.array(projectSchema).default([]),
});

// Type exports
export type PersonalInfoData = z.infer<typeof personalInfoSchema>;
export type WorkExperienceData = z.infer<typeof workExperienceSchema>;
export type EducationData = z.infer<typeof educationSchema>;
export type SkillCategoryData = z.infer<typeof skillCategorySchema>;
export type ProjectData = z.infer<typeof projectSchema>;
export type ResumeData = z.infer<typeof resumeSchema>;

export type WorkExperienceFormData = z.infer<typeof workExperienceFormSchema>;
export type EducationFormData = z.infer<typeof educationFormSchema>;
export type SkillsFormData = z.infer<typeof skillsFormSchema>;
export type ProjectsFormData = z.infer<typeof projectsFormSchema>;
