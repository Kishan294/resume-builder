"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download, ArrowLeft } from "lucide-react";
import { api } from "@/lib/trpc/client";
import { PrintPreview } from "@/components/editor/print-preview";
import { generateSimplePDF } from "@/utils/pdf-generator";
import { toast } from "sonner";
import Link from "next/link";
import { Container } from "@/components/common/container";

export default function PublicResumePage({ params }: { params: Promise<{ slug: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ slug: string } | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  const { data: resume, isLoading, error } = api.resume.getPublic.useQuery(
    { slug: resolvedParams?.slug ?? "" },
    { enabled: !!resolvedParams?.slug }
  );

  const handleDownload = async () => {
    if (!resume) return;

    setIsDownloading(true);
    try {
      generateSimplePDF();
      toast.success("Print window opened! Choose &apos;Save as PDF&apos; to download.");
    } catch (error) {
      console.error("Failed to download PDF:", error);
      toast.error("Failed to download PDF. Please try using Ctrl+P (Cmd+P on Mac) and select &apos;Save as PDF&apos;.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
          <p>Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Resume Not Found</h3>
              <p className="text-muted-foreground mb-6">
                This resume may have been made private or doesn&apos;t exist.
              </p>
              <Link href="/">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-20">
        <Container size="wide" className="py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-indigo-600">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-slate-900">{resume.title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="bg-indigo-600 hover:bg-indigo-700 rounded-xl"
              >
                <Download className="h-4 w-4 mr-2" />
                <span>{isDownloading ? "Preparing..." : "Download"}</span>
              </Button>
              <Link href="/">
                <Button variant="outline" className="rounded-xl border-slate-200">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Create Your Own</span>
                  <span className="sm:hidden">Create</span>
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </header>

      {/* Resume Preview */}
      <main className="py-12">
        <Container>
          <div className="max-w-[8.5in] mx-auto shadow-2xl shadow-slate-200 rounded-sm overflow-hidden bg-white">
            <PrintPreview resume={resume} />
          </div>
        </Container>
      </main>
    </div>
  );
}