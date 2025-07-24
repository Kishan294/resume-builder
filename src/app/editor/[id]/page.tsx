"use client";

import { useEffect, useState, useCallback } from "react";
import { ResumeEditor } from "@/components/editor/resume-editor";
import { ResumeHeader } from "@/components/editor/resume-header";
import { toast } from "sonner";
import { api } from "@/lib/trpc/client";
import { useResumeStore } from "@/lib/stores/resume-store";
import { generatePDF, generatePDFViaPrint, triggerBrowserPrint, openCleanPrintWindow, generateSimplePDF } from "@/utils/pdf-generator";
import { PDFDebug } from "@/components/debug/pdf-debug";
import { PrintInstructions } from "@/components/editor/print-instructions";
import { PrintPreview } from "@/components/editor/print-preview";
import { PrintReminder } from "@/components/editor/print-reminder";

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const {
    currentResume,
    setCurrentResume,
    updateResume,
    setHasUnsavedChanges,
    resetState
  } = useResumeStore();

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  const { data: resume, isLoading, error } = api.resume.getById.useQuery(
    { id: resolvedParams?.id ?? "" },
    { enabled: !!resolvedParams?.id }
  );

  // Set current resume when data is loaded
  useEffect(() => {
    if (resume) {
      setCurrentResume(resume);
    }
  }, [resume, setCurrentResume]);

  const updateResumeMutation = api.resume.update.useMutation({
    onSuccess: () => {
      setHasUnsavedChanges(false);
      toast.success("Resume saved successfully!");
    },
    onError: () => {
      toast.error("Failed to save resume");
    },
  });

  const togglePublicMutation = api.resume.togglePublic.useMutation({
    onSuccess: (updatedResume) => {
      if (updatedResume.isPublic && updatedResume.publicSlug) {
        const shareUrl = `${window.location.origin}/resume/${updatedResume.publicSlug}`;
        navigator.clipboard.writeText(shareUrl);
        toast.success("Resume link copied to clipboard!");
      } else {
        toast.success("Resume is now private");
      }
    },
    onError: () => {
      toast.error("Failed to share resume");
    },
  });

  const saveResume = async () => {
    if (!currentResume || !resolvedParams) return;

    updateResumeMutation.mutate({
      id: resolvedParams.id,
      data: {
        title: currentResume.title,
        template: currentResume.template,
        personalInfo: currentResume.personalInfo || undefined,
        workExperience: currentResume.workExperience || [],
        education: currentResume.education || [],
        skills: currentResume.skills || [],
        projects: currentResume.projects || [],
      },
    });
  };

  const downloadPDF = useCallback(async () => {
    if (!currentResume) return;

    setIsDownloading(true);
    try {
      generateSimplePDF('resume-preview');
      toast.success("Print window opened! This is the most reliable method for PDF generation.");
    } catch (error) {
      console.error("Simple PDF generation failed, trying canvas method:", error);
      try {
        await generatePDF('resume-preview', `${currentResume.title || 'resume'}.pdf`);
        toast.success("PDF downloaded successfully!");
      } catch (canvasError) {
        console.error("Canvas PDF generation failed, trying print window method:", canvasError);
        try {
          generatePDFViaPrint('resume-preview', `${currentResume.title || 'resume'}.pdf`);
          toast.success("PDF download initiated! Please save the file when prompted.");
        } catch (printError) {
          console.error("Print window method also failed, trying clean print window:", printError);
          try {
            openCleanPrintWindow('resume-preview');
            toast.success("Clean print window opened! Follow the instructions to save as PDF.");
          } catch (cleanPrintError) {
            console.error("Clean print window failed, trying browser print:", cleanPrintError);
            try {
              triggerBrowserPrint();
              toast.success("Print dialog opened! Choose &apos;Save as PDF&apos; to download.");
            } catch (browserPrintError) {
              console.error("All PDF generation methods failed:", browserPrintError);
              toast.error("Failed to download PDF. Please try using Ctrl+P (Cmd+P on Mac) and select &apos;Save as PDF&apos;.");
            }
          }
        }
      }
    } finally {
      setIsDownloading(false);
    }
  }, [currentResume]);

  // Handle auto-download if coming from dashboard
  useEffect(() => {
    if (currentResume && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('download') === 'true') {
        // Remove the parameter from URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);

        // Trigger download after a short delay to ensure everything is loaded
        setTimeout(() => {
          const element = document.getElementById('resume-preview');
          if (element) {
            downloadPDF();
          } else {
            toast.error('Resume preview not ready. Please try the download button manually.');
          }
        }, 1500);
      }
    }
  }, [currentResume, downloadPDF]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      resetState();
    };
  }, [resetState]);

  const handleShare = async () => {
    if (!currentResume || !resolvedParams) return;

    setIsSharing(true);
    try {
      await togglePublicMutation.mutateAsync({ id: resolvedParams.id });
    } finally {
      setIsSharing(false);
    }
  };

  const handleTitleUpdate = (newTitle: string) => {
    if (currentResume) {
      updateResume({ title: newTitle });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Loading editor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Resume not found</p>
        </div>
      </div>
    );
  }

  if (!currentResume) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ResumeHeader
        resume={currentResume}
        onTitleUpdate={handleTitleUpdate}
        onSave={saveResume}
        onDownload={downloadPDF}
        onShare={handleShare}
        onPrint={() => generateSimplePDF('resume-preview')}
        isSaving={updateResumeMutation.isPending}
        isDownloading={isDownloading}
        isSharing={isSharing}
      />

      <div className="px-4 py-2 bg-white border-b">
        <PrintInstructions
          onPrint={() => generateSimplePDF('resume-preview')}
          onDownload={downloadPDF}
        />
      </div>

      {/* Editor Layout */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Editor Panel */}
        <div className="w-1/2 overflow-y-auto border-r bg-white">
          <ResumeEditor
            resume={currentResume}
            onUpdate={updateResume}
            onSave={saveResume}
          />
        </div>

        {/* Preview Panel */}
        <div className="w-1/2 overflow-y-auto bg-gray-100 p-8">
          <div className="max-w-[8.5in] mx-auto space-y-4">
            <PrintPreview resume={currentResume} />

            {/* Debug component - remove in production */}
            {process.env.NODE_ENV === 'development' && (
              <PDFDebug elementId="resume-preview" />
            )}
          </div>
        </div>
      </div>

      {/* Print Reminder - shows when user tries to print */}
      <PrintReminder />
    </div>
  );
}