"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoEditor } from "./personal-info-editor";
import { WorkExperienceEditor } from "./work-experience-editor";
import { EducationEditor } from "./education-editor";
import { SkillsEditor } from "./skills-editor";
import { ProjectsEditor } from "./projects-editor";
import { User, Briefcase, GraduationCap, Code, FolderOpen } from "lucide-react";
import { Resume } from "@/types/resume";

interface ResumeEditorProps {
  resume: Resume;
  onUpdate: (resume: Resume) => void;
  onSave: () => void;
}

export function ResumeEditor({ resume, onUpdate }: ResumeEditorProps) {
  const [activeTab, setActiveTab] = useState("personal");

  const updateSection = (section: keyof Resume, data: unknown) => {
    const updatedResume = {
      ...resume,
      [section]: data,
    };
    onUpdate(updatedResume);
  };

  return (
    <div className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Personal</span>
          </TabsTrigger>
          <TabsTrigger value="experience" className="flex items-center space-x-2">
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Experience</span>
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center space-x-2">
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Education</span>
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center space-x-2">
            <Code className="h-4 w-4" />
            <span className="hidden sm:inline">Skills</span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center space-x-2">
            <FolderOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Projects</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-6">
          <PersonalInfoEditor
            data={resume.personalInfo || {}}
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