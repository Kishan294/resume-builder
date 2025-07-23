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
  startDate: string;
  endDate?: string;
  current: boolean;
  url?: string;
  github?: string;
}

export interface Resume {
  id: string;
  title: string;
  template: string;
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;
}
