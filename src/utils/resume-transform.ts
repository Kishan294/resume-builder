import { Skill } from "@/types/resume";
import { v4 as uuidv4 } from "uuid";
import type { Resume } from "@/db/schema";

// Transform skills from new format to database format
export function transformSkillsForDatabase(
  skills: Skill[]
): Array<{ category: string; items: string[] }> {
  const skillsByCategory: { [key: string]: string[] } = {};

  skills.forEach((skill) => {
    const category = skill.category || "General";
    if (!skillsByCategory[category]) {
      skillsByCategory[category] = [];
    }
    skillsByCategory[category].push(`${skill.name} (${skill.level})`);
  });

  return Object.entries(skillsByCategory).map(([category, items]) => ({
    category,
    items,
  }));
}

// Transform skills from database format to new format
export function transformSkillsFromDatabase(
  dbSkills: Array<{ category: string; items: string[] }>
): Skill[] {
  const skills: Skill[] = [];

  dbSkills.forEach((categoryGroup) => {
    categoryGroup.items.forEach((item) => {
      // Parse skill name and level from format "SkillName (Level)"
      const match = item.match(/^(.+?)\s*\(([^)]+)\)$/);
      if (match) {
        const [, name, level] = match;
        skills.push({
          id: uuidv4(),
          name: name.trim(),
          level: level.trim() as Skill["level"],
          category:
            categoryGroup.category === "General"
              ? undefined
              : categoryGroup.category,
        });
      } else {
        // Fallback for items without level
        skills.push({
          id: uuidv4(),
          name: item,
          level: "Intermediate",
          category:
            categoryGroup.category === "General"
              ? undefined
              : categoryGroup.category,
        });
      }
    });
  });

  return skills;
}

// Transform skills from new format to template format (for display)
export function transformSkillsForTemplate(
  skills: Skill[]
): Array<{ category: string; items: string[] }> {
  return transformSkillsForDatabase(skills);
}

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
