"use client";

import { useEffect, useState, useCallback } from "react";
import { ResumeEditor } from "@/components/editor/resume-editor";
import { ResumeHeader } from "@/components/editor/resume-header";

import { toast } from "sonner";
import { api } from "@/lib/trpc/client";
import { useResumeStore } from "@/lib/stores/resume-store";
// import { triggerBrowserPrint } from "@/utils/pdf-generator"; // Removed - using mobile print hook instead
import { PrintInstructions } from "@/components/editor/print-instructions";
import { PrintPreview } from "@/components/editor/print-preview";
import { PrintReminder } from "@/components/editor/print-reminder";
import { useMobilePrint } from "@/hooks/use-mobile-print";

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  const {
    currentResume,
    setCurrentResume,
    updateResume,
    setHasUnsavedChanges,
    resetState
  } = useResumeStore();

  // Use mobile print hook
  const { isDownloading, handleDownload } = useMobilePrint({
    elementId: 'resume-preview',
    filename: `${currentResume?.title || 'resume'}.pdf`
  });

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

  const handlePrint = useCallback(async () => {
    if (!currentResume) return;

    try {
      await handleDownload();
    } catch (error) {
      console.error("Print failed:", error);
    }
  }, [currentResume, handleDownload]);

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
            handlePrint();
          } else {
            toast.error('Resume preview not ready. Please try the print button manually.');
          }
        }, 1500);
      }
    }
  }, [currentResume, handlePrint]);

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
        onDownload={handlePrint}
        onShare={handleShare}
        onPrint={handlePrint}
        isSaving={updateResumeMutation.isPending}
        isDownloading={isDownloading}
        isSharing={isSharing}
      />

      <div className="px-4 py-2 bg-white border-b">
        <PrintInstructions
          onPrint={handlePrint}
          onDownload={handlePrint}
        />
      </div>

      {/* Editor Layout */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-73px)]">
        {/* Editor Panel */}
        <div className="w-full lg:w-1/2 overflow-y-auto border-r lg:border-r border-b lg:border-b-0 bg-white">
          <ResumeEditor
            resume={currentResume}
            onUpdate={updateResume}
            onSave={saveResume}
          />
        </div>

        {/* Preview Panel */}
        <div className="w-full lg:w-1/2 overflow-y-auto bg-gray-100 p-4 lg:p-8">
          <div className="max-w-[8.5in] mx-auto space-y-4">
            <PrintPreview resume={currentResume} />


          </div>
        </div>
      </div>

      {/* Print Reminder - shows when user tries to print */}
      <PrintReminder />
    </div>
  );
}