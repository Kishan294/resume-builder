import type { Resume } from "@/db/schema";

// Transform resume data for templates
export function transformResumeForTemplate(resume: Resume) {
  return {
    ...resume,
    personalInfo: resume.personalInfo || {
      fullName: "",
      email: "",
      phone: "",
      location: "",
    },
    workExperience: resume.workExperience || [],
    education: resume.education || [],
    skills: resume.skills || [],
    projects: resume.projects || [],
  };
}
