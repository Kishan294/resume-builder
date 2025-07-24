"use client";

import { ModernTemplate } from "@/components/templates/modern-template";
import { ClassicTemplate } from "@/components/templates/classic-template";
import { MinimalTemplate } from "@/components/templates/minimal-template";
import { CreativeTemplate } from "@/components/templates/creative-template";
import { ProfessionalTemplate } from "@/components/templates/professional-template";
import { CompactTemplate } from "@/components/templates/compact-template";
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
      case "minimal":
        return <MinimalTemplate resume={transformedResume} />;
      case "creative":
        return <CreativeTemplate resume={transformedResume} />;
      case "professional":
        return <ProfessionalTemplate resume={transformedResume} />;
      case "compact":
        return <CompactTemplate resume={transformedResume} />;
      case "modern":
      default:
        return <ModernTemplate resume={transformedResume} />;
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:rounded-none">
      <div
        id="resume-preview"
        className="aspect-[8.5/11] w-full min-h-[800px] relative print:aspect-auto print:min-h-0 print:h-auto print:max-h-none"
        style={{
          maxWidth: '8.5in',
          minHeight: '11in'
        }}
      >
        <div className="absolute inset-0 overflow-hidden print:relative print:overflow-visible print:inset-auto">
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
}