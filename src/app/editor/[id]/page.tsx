"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { ResumeEditor } from "@/components/editor/resume-editor";
import { ResumePreview } from "@/components/editor/resume-preview";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, Save, Download, Share2, Loader2 } from "lucide-react";
import Link from "next/link";
import { Resume } from "@/types/resume";
import { generatePDF } from "@/utils/pdf-generator";
import { shareResume, copyToClipboard } from "@/utils/share-utils";

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
      await generatePDF('resume-preview', `${resume.title || 'resume'}.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Failed to download PDF:", error);
      toast.error("Failed to download PDF");
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">{resume.title}</h1>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={saveResume}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              disabled={isSharing}
            >
              {isSharing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Share2 className="h-4 w-4 mr-2" />
              )}
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadPDF}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Download PDF
            </Button>
          </div>
        </div>
      </header>

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
          <div className="max-w-[8.5in] mx-auto">
            <ResumePreview resume={resume} />
          </div>
        </div>
      </div>
    </div>
  );
}