"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { AuthGuard } from "@/components/auth/auth-guard";
import { ResumeEditor } from "@/components/editor/resume-editor";
import { ResumeHeader } from "@/components/editor/resume-header";

import { toast } from "sonner";
import { Resume } from "@/types/resume";
import { generatePDF, generatePDFViaPrint, triggerBrowserPrint, openCleanPrintWindow, generateSimplePDF } from "@/utils/pdf-generator";
import { shareResume } from "@/utils/share-utils";
import { PDFDebug } from "@/components/debug/pdf-debug";
import { PrintInstructions } from "@/components/editor/print-instructions";
import { PrintPreview } from "@/components/editor/print-preview";
import { PrintReminder } from "@/components/editor/print-reminder";

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [resume, setResume] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  const fetchResume = useCallback(async () => {
    if (!resolvedParams) return;

    try {
      const response = await fetch(`/api/resumes/${resolvedParams.id}`);
      if (response.ok) {
        const data = await response.json();
        setResume(data);
      } else if (response.status === 404) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Failed to fetch resume:", error);
    } finally {
      setIsLoading(false);
    }
  }, [resolvedParams, router]);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth/login");
      return;
    }

    if (session && resolvedParams) {
      fetchResume();
    }
  }, [session, isPending, router, resolvedParams, fetchResume]);

  // Handle auto-download if coming from dashboard
  useEffect(() => {
    if (resume && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('download') === 'true') {
        // Remove the parameter from URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);

        // Trigger download after a short delay to ensure everything is loaded
        setTimeout(() => {
          // First check if element exists
          const element = document.getElementById('resume-preview');
          if (element) {
            console.log('Resume preview element found, triggering download');
            downloadPDF();
          } else {
            console.error('Resume preview element not found');
            toast.error('Resume preview not ready. Please try the download button manually.');
          }
        }, 1500);
      }
    }
  }, [resume]);

  const saveResume = async () => {
    if (!resume || !resolvedParams) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/resumes/${resolvedParams.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resume),
      });

      if (response.ok) {
        const updatedResume = await response.json();
        setResume(updatedResume);
        toast.success("Resume saved successfully!");
      } else {
        toast.error("Failed to save resume");
      }
    } catch (error) {
      console.error("Failed to save resume:", error);
      toast.error("Failed to save resume");
    } finally {
      setIsSaving(false);
    }
  };

  const downloadPDF = async () => {
    if (!resume) return;

    setIsDownloading(true);
    try {
      // Start with the most reliable method - simple CSS-only PDF
      generateSimplePDF('resume-preview', `${resume.title || 'resume'}.pdf`);
      toast.success("Print window opened! This is the most reliable method for PDF generation.");
    } catch (error) {
      console.error("Simple PDF generation failed, trying canvas method:", error);
      try {
        // Try canvas-based approach as fallback
        await generatePDF('resume-preview', `${resume.title || 'resume'}.pdf`);
        toast.success("PDF downloaded successfully!");
      } catch (canvasError) {
        console.error("Canvas PDF generation failed, trying print window method:", canvasError);
        try {
          // Fallback to print window approach
          generatePDFViaPrint('resume-preview', `${resume.title || 'resume'}.pdf`);
          toast.success("PDF download initiated! Please save the file when prompted.");
        } catch (printError) {
          console.error("Print window method also failed, trying clean print window:", printError);
          try {
            // Try clean print window
            openCleanPrintWindow('resume-preview', `${resume.title || 'resume'}.pdf`);
            toast.success("Clean print window opened! Follow the instructions to save as PDF.");
          } catch (cleanPrintError) {
            console.error("Clean print window failed, trying browser print:", cleanPrintError);
            try {
              // Final fallback to browser print
              triggerBrowserPrint();
              toast.success("Print dialog opened! Choose 'Save as PDF' to download.");
            } catch (browserPrintError) {
              console.error("All PDF generation methods failed:", browserPrintError);
              toast.error("Failed to download PDF. Please try using Ctrl+P (Cmd+P on Mac) and select 'Save as PDF'.");
            }
          }
        }
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!resume || !resolvedParams) return;

    setIsSharing(true);
    try {
      const success = await shareResume(resolvedParams.id, resume.title);
      if (success) {
        toast.success("Resume link copied to clipboard!");
      } else {
        toast.error("Failed to share resume");
      }
    } catch (error) {
      console.error("Failed to share resume:", error);
      toast.error("Failed to share resume");
    } finally {
      setIsSharing(false);
    }
  };

  const handleTitleUpdate = (newTitle: string) => {
    if (resume) {
      setResume({ ...resume, title: newTitle });
    }
  };

  if (isPending || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Loading editor...</p>
        </div>
      </div>
    );
  }

  if (!session || !resume) {
    return null;
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <ResumeHeader
          resume={resume}
          onTitleUpdate={handleTitleUpdate}
          onSave={saveResume}
          onDownload={downloadPDF}
          onShare={handleShare}
          onPrint={() => generateSimplePDF('resume-preview', `${resume.title || 'resume'}.pdf`)}
          isSaving={isSaving}
          isDownloading={isDownloading}
          isSharing={isSharing}
        />

        <div className="px-4 py-2 bg-white border-b">
          <PrintInstructions
            onPrint={() => generateSimplePDF('resume-preview', `${resume.title || 'resume'}.pdf`)}
            onDownload={downloadPDF}
          />
        </div>

        {/* Editor Layout */}
        <div className="flex h-[calc(100vh-73px)]">
          {/* Editor Panel */}
          <div className="w-1/2 overflow-y-auto border-r bg-white">
            <ResumeEditor
              resume={resume}
              onUpdate={setResume}
              onSave={saveResume}
            />
          </div>

          {/* Preview Panel */}
          <div className="w-1/2 overflow-y-auto bg-gray-100 p-8">
            <div className="max-w-[8.5in] mx-auto space-y-4">
              <PrintPreview resume={resume} />

              {/* Debug component - remove in production */}
              {process.env.NODE_ENV === 'development' && (
                <PDFDebug elementId="resume-preview" filename={`${resume.title || 'resume'}.pdf`} />
              )}
            </div>
          </div>
        </div>

        {/* Print Reminder - shows when user tries to print */}
        <PrintReminder />
      </div>
    </AuthGuard>
  );
}