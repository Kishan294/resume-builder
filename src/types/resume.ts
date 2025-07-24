export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  location?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  gpa?: string;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  category?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
  startDate?: string;
  endDate?: string;
}

export interface ResumeData {
  id: string;
  title: string;
  template: string;
  personalInfo: PersonalInfo | null;
  workExperience: WorkExperience[] | null;
  education: Education[] | null;
  skills: { id: string; category: string; items: string[] }[] | null;
  projects: Project[] | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  userId?: string;
  isPublic?: boolean;
  publicSlug?: string | null;
}

// For backward compatibility
export type Resume = ResumeData;
