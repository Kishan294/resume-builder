"use client";

import { ModernTemplate } from "@/components/templates/modern-template";
import { ClassicTemplate } from "@/components/templates/classic-template";
import { Resume } from "@/types/resume";
import { transformResumeForTemplate } from "@/utils/resume-transform";

interface ResumePreviewProps {
  resume: Resume;
}

export function ResumePreview({ resume }: ResumePreviewProps) {
  const transformedResume = transformResumeForTemplate(resume);

  const renderTemplate = () => {
    switch (resume.template) {
      case "classic":
        return <ClassicTemplate resume={transformedResume} />;
      case "modern":
      default:
        return <ModernTemplate resume={transformedResume} />;
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="aspect-[8.5/11] w-full">
        {renderTemplate()}
      </div>
    </div>
  );
}