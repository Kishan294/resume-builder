"use client";

import { ModernTemplate } from "@/components/templates/modern-template";
import { ClassicTemplate } from "@/components/templates/classic-template";
import { MinimalTemplate } from "@/components/templates/minimal-template";
import { CreativeTemplate } from "@/components/templates/creative-template";
import { ProfessionalTemplate } from "@/components/templates/professional-template";
import { CompactTemplate } from "@/components/templates/compact-template";
import { ExecutiveTemplate } from "@/components/templates/executive-template";
import { TechProTemplate } from "@/components/templates/tech-pro-template";
import type { Resume } from "@/db/schema";
import { transformResumeForTemplate } from "@/utils/resume-transform";

interface ResumePreviewProps {
  resume: Resume;
  exportMode?: boolean;
}

export function ResumePreview({ resume, exportMode = false }: ResumePreviewProps) {
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
      case "executive":
        return <ExecutiveTemplate resume={transformedResume} />;
      case "tech-pro":
        return <TechProTemplate resume={transformedResume} />;
      case "modern":
      default:
        return <ModernTemplate resume={transformedResume} />;
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:rounded-none">
      <div
        id="resume-preview"
        className={`aspect-[8.5/11] w-full min-h-[800px] relative print:aspect-auto print:min-h-0 print:h-auto print:max-h-none ${exportMode ? 'export-mode print-styles-active' : ''
          }`}
        style={{
          maxWidth: '8.5in',
          minHeight: '11in'
        }}
      >
        <div className="absolute inset-0 overflow-hidden print:relative print:overflow-visible print:inset-auto">
          {renderTemplate()}
        </div>
      </div>

      {/* Apply print styles in export mode */}
      {exportMode && (
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Force print styles to be active in export mode */
            .print-styles-active .print\\:p-6 { padding: 1.5rem !important; }
            .print-styles-active .print\\:p-4 { padding: 1rem !important; }
            .print-styles-active .print\\:p-3 { padding: 0.75rem !important; }
            .print-styles-active .print\\:p-2 { padding: 0.5rem !important; }
            .print-styles-active .print\\:p-0 { padding: 0 !important; }
            .print-styles-active .print\\:text-sm { font-size: 0.875rem !important; line-height: 1.25rem !important; }
            .print-styles-active .print\\:text-xs { font-size: 0.75rem !important; line-height: 1rem !important; }
            .print-styles-active .print\\:text-base { font-size: 1rem !important; line-height: 1.5rem !important; }
            .print-styles-active .print\\:text-lg { font-size: 1.125rem !important; line-height: 1.75rem !important; }
            .print-styles-active .print\\:text-xl { font-size: 1.25rem !important; line-height: 1.75rem !important; }
            .print-styles-active .print\\:text-2xl { font-size: 1.5rem !important; line-height: 2rem !important; }
            .print-styles-active .print\\:pb-1 { padding-bottom: 0.25rem !important; }
            .print-styles-active .print\\:pb-2 { padding-bottom: 0.5rem !important; }
            .print-styles-active .print\\:pb-3 { padding-bottom: 0.75rem !important; }
            .print-styles-active .print\\:pb-4 { padding-bottom: 1rem !important; }
            .print-styles-active .print\\:mb-1 { margin-bottom: 0.25rem !important; }
            .print-styles-active .print\\:mb-2 { margin-bottom: 0.5rem !important; }
            .print-styles-active .print\\:mb-3 { margin-bottom: 0.75rem !important; }
            .print-styles-active .print\\:mb-4 { margin-bottom: 1rem !important; }
            .print-styles-active .print\\:mb-6 { margin-bottom: 1.5rem !important; }
            .print-styles-active .print\\:-mx-4 { margin-left: -1rem !important; margin-right: -1rem !important; }
            .print-styles-active .print\\:-mx-6 { margin-left: -1.5rem !important; margin-right: -1.5rem !important; }
            .print-styles-active .print\\:gap-2 { gap: 0.5rem !important; }
            .print-styles-active .print\\:gap-3 { gap: 0.75rem !important; }
            .print-styles-active .print\\:space-y-1 > * + * { margin-top: 0.25rem !important; }
            .print-styles-active .print\\:space-y-2 > * + * { margin-top: 0.5rem !important; }
            .print-styles-active .print\\:space-y-3 > * + * { margin-top: 0.75rem !important; }
            .print-styles-active .print\\:pl-2 { padding-left: 0.5rem !important; }
            .print-styles-active .print\\:pl-4 { padding-left: 1rem !important; }
            .print-styles-active .print\\:h-auto { height: auto !important; }
            .print-styles-active .print\\:max-h-none { max-height: none !important; }
            .print-styles-active .print\\:overflow-visible { overflow: visible !important; }
            .print-styles-active .print\\:w-16 { width: 4rem !important; }
            .print-styles-active .print\\:h-16 { height: 4rem !important; }
            .print-styles-active .print\\:w-2 { width: 0.5rem !important; }
            .print-styles-active .print\\:h-2 { height: 0.5rem !important; }
            .print-styles-active .print\\:top-1 { top: 0.25rem !important; }
            .print-styles-active .print\\:left-1 { left: 0.25rem !important; }
            .print-styles-active .print\\:top-3 { top: 0.75rem !important; }
          `
        }} />
      )}
    </div>
  );
}
