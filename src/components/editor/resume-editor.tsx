"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoEditor } from "./personal-info-editor";
import { WorkExperienceEditor } from "./work-experience-editor";
import { EducationEditor } from "./education-editor";
import { SkillsEditor } from "./skills-editor";
import { ProjectsEditor } from "./projects-editor";
import { FormErrorBoundary } from "@/components/error/form-error-boundary";
import { User, Briefcase, GraduationCap, Code, FolderOpen } from "lucide-react";
import { Resume } from "@/types/resume";


interface ResumeEditorProps {
  resume: Resume;
  onUpdate: (resume: Resume) => void;
  onSave: () => void;
  onValidate?: (validateFn: () => boolean) => void;
}

function ResumeEditorContent({ resume, onUpdate }: ResumeEditorProps) {
  const [activeTab, setActiveTab] = useState("personal");

  const updateSection = (section: keyof Resume, data: unknown) => {
    const updatedResume = {
      ...resume,
      [section]: data,
    };
    onUpdate(updatedResume);
  };



  return (
    <div className="p-4 sm:p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-gray-100/50 rounded-lg">
          <TabsTrigger
            value="personal"
            className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all relative"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Personal</span>
            <span className="sm:hidden text-xs">Info</span>
          </TabsTrigger>
          <TabsTrigger
            value="experience"
            className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all relative"
          >
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Experience</span>
            <span className="sm:hidden text-xs">Work</span>
          </TabsTrigger>
          <TabsTrigger
            value="education"
            className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all relative"
          >
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Education</span>
            <span className="sm:hidden text-xs">Edu</span>
          </TabsTrigger>
          <TabsTrigger
            value="skills"
            className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all relative"
          >
            <Code className="h-4 w-4" />
            <span className="hidden sm:inline">Skills</span>
            <span className="sm:hidden text-xs">Skills</span>
          </TabsTrigger>
          <TabsTrigger
            value="projects"
            className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all relative"
          >
            <FolderOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Projects</span>
            <span className="sm:hidden text-xs">Proj</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-6">
          <FormErrorBoundary>
            <PersonalInfoEditor
              data={resume.personalInfo || {
                fullName: "",
                email: "",
                phone: "",
                location: "",
              }}
              onUpdate={(data) => updateSection("personalInfo", data)}
            />
          </FormErrorBoundary>
        </TabsContent>

        <TabsContent value="experience" className="mt-6">
          <FormErrorBoundary>
            <WorkExperienceEditor
              data={resume.workExperience || []}
              onUpdate={(data) => updateSection("workExperience", data)}
            />
          </FormErrorBoundary>
        </TabsContent>

        <TabsContent value="education" className="mt-6">
          <FormErrorBoundary>
            <EducationEditor
              data={resume.education || []}
              onUpdate={(data) => updateSection("education", data)}
            />
          </FormErrorBoundary>
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          <FormErrorBoundary>
            <SkillsEditor
              data={resume.skills || []}
              onUpdate={(data) => updateSection("skills", data)}
            />
          </FormErrorBoundary>
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <FormErrorBoundary>
            <ProjectsEditor
              data={resume.projects || []}
              onUpdate={(data) => updateSection("projects", data)}
            />
          </FormErrorBoundary>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function ResumeEditor(props: ResumeEditorProps) {
  return <ResumeEditorContent {...props} />;
}
