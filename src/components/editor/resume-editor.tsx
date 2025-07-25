"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoEditor } from "./personal-info-editor";
import { WorkExperienceEditor } from "./work-experience-editor";
import { EducationEditor } from "./education-editor";
import { SkillsEditor } from "./skills-editor";
import { ProjectsEditor } from "./projects-editor";
import { User, Briefcase, GraduationCap, Code, FolderOpen } from "lucide-react";
import { Resume } from "@/types/resume";
import { validateResumeSection } from "@/lib/validation-utils";
import { ValidationProvider, useValidation } from "@/lib/validation-context";
import {
  personalInfoSchema,
  workExperienceFormSchema,
  educationFormSchema,
  skillsFormSchema,
  projectsFormSchema
} from "@/lib/validations/resume";

interface ResumeEditorProps {
  resume: Resume;
  onUpdate: (resume: Resume) => void;
  onSave: () => void;
  onValidate?: (validateFn: () => boolean) => void;
}

function ResumeEditorContent({ resume, onUpdate, onValidate }: ResumeEditorProps) {
  const [activeTab, setActiveTab] = useState("personal");
  const [validationErrors, setValidationErrors] = useState<Set<string>>(new Set());
  const { setFieldError, clearAllErrors } = useValidation();

  const updateSection = (section: keyof Resume, data: unknown) => {
    const updatedResume = {
      ...resume,
      [section]: data,
    };
    onUpdate(updatedResume);

    // Clear validation errors for this section if data is valid
    setTimeout(() => {
      const newErrors = new Set(validationErrors);

      // Quick validation check for the updated section
      try {
        switch (section) {
          case 'personalInfo':
            if (data) personalInfoSchema.parse(data);
            newErrors.delete('personal');
            break;
          case 'workExperience':
            if (Array.isArray(data) && data.length > 0) {
              workExperienceFormSchema.parse({ experiences: data });
              newErrors.delete('experience');
            }
            break;
          case 'education':
            if (Array.isArray(data) && data.length > 0) {
              educationFormSchema.parse({ educations: data });
              newErrors.delete('education');
            }
            break;
          case 'skills':
            if (Array.isArray(data) && data.length > 0) {
              skillsFormSchema.parse({ skillCategories: data });
              newErrors.delete('skills');
            }
            break;
          case 'projects':
            if (Array.isArray(data) && data.length > 0) {
              projectsFormSchema.parse({ projects: data });
              newErrors.delete('projects');
            }
            break;
        }
        setValidationErrors(newErrors);
      } catch {
        // Keep the error if validation still fails
      }
    }, 100);
  };

  const validateResume = React.useCallback((): boolean => {
    let isValid = true;
    const invalidSections: string[] = [];

    // Clear all field errors before validation
    clearAllErrors();

    // Validate personal info
    if (resume.personalInfo) {
      const personalValid = validateResumeSection(
        resume.personalInfo,
        personalInfoSchema,
        "personal",
        setFieldError
      );
      if (!personalValid) {
        isValid = false;
        invalidSections.push("personal");
      }
    }

    // Validate work experience
    if (resume.workExperience && resume.workExperience.length > 0) {
      const experienceValid = validateResumeSection(
        { experiences: resume.workExperience },
        workExperienceFormSchema,
        "experience",
        setFieldError
      );
      if (!experienceValid) {
        isValid = false;
        invalidSections.push("experience");
      }
    }

    // Validate education
    if (resume.education && resume.education.length > 0) {
      const educationValid = validateResumeSection(
        { educations: resume.education },
        educationFormSchema,
        "education",
        setFieldError
      );
      if (!educationValid) {
        isValid = false;
        invalidSections.push("education");
      }
    }

    // Validate skills
    if (resume.skills && resume.skills.length > 0) {
      const skillsValid = validateResumeSection(
        { skillCategories: resume.skills },
        skillsFormSchema,
        "skills",
        setFieldError
      );
      if (!skillsValid) {
        isValid = false;
        invalidSections.push("skills");
      }
    }

    // Validate projects
    if (resume.projects && resume.projects.length > 0) {
      const projectsValid = validateResumeSection(
        { projects: resume.projects },
        projectsFormSchema,
        "projects",
        setFieldError
      );
      if (!projectsValid) {
        isValid = false;
        invalidSections.push("projects");
      }
    }

    // Update validation errors state
    setValidationErrors(new Set(invalidSections));

    // If validation failed, automatically switch to the first invalid section
    if (!isValid && invalidSections.length > 0) {
      setActiveTab(invalidSections[0]);
    }

    return isValid;
  }, [resume, clearAllErrors, setFieldError]);

  // Expose validation function to parent using ref to avoid setState during render
  const validateResumeRef = React.useRef(validateResume);
  validateResumeRef.current = validateResume;

  React.useEffect(() => {
    if (onValidate) {
      onValidate(() => validateResumeRef.current());
    }
  }, [onValidate]);

  return (
    <div className="p-4 sm:p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-gray-100/50 rounded-lg">
          <TabsTrigger
            value="personal"
            className={`flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all relative ${validationErrors.has("personal") ? "text-red-600" : ""
              }`}
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Personal</span>
            <span className="sm:hidden text-xs">Info</span>
            {validationErrors.has("personal") && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="experience"
            className={`flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all relative ${validationErrors.has("experience") ? "text-red-600" : ""
              }`}
          >
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Experience</span>
            <span className="sm:hidden text-xs">Work</span>
            {validationErrors.has("experience") && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="education"
            className={`flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all relative ${validationErrors.has("education") ? "text-red-600" : ""
              }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Education</span>
            <span className="sm:hidden text-xs">Edu</span>
            {validationErrors.has("education") && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="skills"
            className={`flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all relative ${validationErrors.has("skills") ? "text-red-600" : ""
              }`}
          >
            <Code className="h-4 w-4" />
            <span className="hidden sm:inline">Skills</span>
            <span className="sm:hidden text-xs">Skills</span>
            {validationErrors.has("skills") && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="projects"
            className={`flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all relative ${validationErrors.has("projects") ? "text-red-600" : ""
              }`}
          >
            <FolderOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Projects</span>
            <span className="sm:hidden text-xs">Proj</span>
            {validationErrors.has("projects") && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-6">
          <PersonalInfoEditor
            data={resume.personalInfo || {
              fullName: "",
              email: "",
              phone: "",
              location: "",
            }}
            onUpdate={(data) => updateSection("personalInfo", data)}
          />
        </TabsContent>

        <TabsContent value="experience" className="mt-6">
          <WorkExperienceEditor
            data={resume.workExperience || []}
            onUpdate={(data) => updateSection("workExperience", data)}
          />
        </TabsContent>

        <TabsContent value="education" className="mt-6">
          <EducationEditor
            data={resume.education || []}
            onUpdate={(data) => updateSection("education", data)}
          />
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          <SkillsEditor
            data={resume.skills || []}
            onUpdate={(data) => updateSection("skills", data)}
          />
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <ProjectsEditor
            data={resume.projects || []}
            onUpdate={(data) => updateSection("projects", data)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function ResumeEditor(props: ResumeEditorProps) {
  return (
    <ValidationProvider>
      <ResumeEditorContent {...props} />
    </ValidationProvider>
  );
}
