"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Download, Share2, ArrowLeft, Loader2 } from "lucide-react";
import { Resume } from "@/types/resume";
import { ResumePreview } from "@/components/editor/resume-preview";
import { generatePDF } from "@/utils/pdf-generator";
import { copyToClipboard } from "@/utils/share-utils";

export default function PublicResumePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [resume, setResume] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;

    const fetchResume = async () => {
      try {
        const response = await fetch(`/api/resumes/${resolvedParams.id}/public`);
        if (response.ok) {
          const data = await response.json();
          setResume(data);
        } else if (response.status === 404) {
          toast.error("Resume not found or not public");
          router.push("/");
        } else {
          toast.error("Failed to load resume");
        }
      } catch (error) {
        console.error("Failed to fetch resume:", error);
        toast.error("Failed to load resume");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResume();
  }, [resolvedParams, router]);

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
    try {
      await copyToClipboard(window.location.href);
      toast.success("Resume link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Resume Not Found</h1>
          <p className="text-muted-foreground mb-4">
            This resume doesn't exist or is not publicly available.
          </p>
          <Button onClick={() => router.push("/")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{resume.title}</h1>
              <p className="text-sm text-muted-foreground">
                {resume.personalInfo?.fullName}'s Resume
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
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

      {/* Resume Preview */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <ResumePreview resume={resume} />
        </div>
      </main>
    </div>
  );
}