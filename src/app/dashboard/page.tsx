"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { FileText, Plus, Loader2 } from "lucide-react";
import { api } from "@/lib/trpc/client";
import { TemplateSelector } from "@/components/dashboard/template-selector";
import { ResumeCard } from "@/components/dashboard/resume-card";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: { sharing?: boolean; downloading?: boolean; deleting?: boolean } }>({});

  const { data: resumes, isLoading, refetch } = api.resume.getAll.useQuery();
  const createResumeMutation = api.resume.create.useMutation({
    onSuccess: (newResume) => {
      router.push(`/editor/${newResume.id}`);
    },
    onError: () => {
      toast.error("Failed to create resume");
    },
  });

  const deleteResumeMutation = api.resume.delete.useMutation({
    onSuccess: () => {
      toast.success("Resume deleted successfully");
      refetch();
    },
    onError: () => {
      toast.error("Failed to delete resume");
    },
  });

  const togglePublicMutation = api.resume.togglePublic.useMutation({
    onSuccess: () => {
      refetch();
    },
    onError: () => {
      toast.error("Failed to update resume visibility");
    },
  });

  const createNewResume = async (template: string = "modern") => {
    createResumeMutation.mutate({
      title: "Untitled Resume",
      template,
    });
  };

  const handleShare = async (resumeId: string) => {
    setLoadingStates(prev => ({ ...prev, [resumeId]: { ...prev[resumeId], sharing: true } }));
    try {
      const result = await togglePublicMutation.mutateAsync({ id: resumeId });
      if (result.isPublic && result.publicSlug) {
        const shareUrl = `${window.location.origin}/resume/${result.publicSlug}`;
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Resume link copied to clipboard!");
      } else {
        toast.success("Resume is now private");
      }
    } catch (error) {
      console.error("Failed to share resume:", error);
      toast.error("Failed to share resume");
    } finally {
      setLoadingStates(prev => ({ ...prev, [resumeId]: { ...prev[resumeId], sharing: false } }));
    }
  };

  const handleDownloadPDF = async (resumeId: string) => {
    setLoadingStates(prev => ({ ...prev, [resumeId]: { ...prev[resumeId], downloading: true } }));
    try {
      router.push(`/editor/${resumeId}?download=true`);
      toast.success("Redirecting to editor for PDF download...");
    } catch (error) {
      console.error("Failed to download PDF:", error);
      toast.error("Failed to download PDF");
    } finally {
      setLoadingStates(prev => ({ ...prev, [resumeId]: { ...prev[resumeId], downloading: false } }));
    }
  };

  const handleResumeDelete = async (resumeId: string) => {
    setLoadingStates(prev => ({ ...prev, [resumeId]: { ...prev[resumeId], deleting: true } }));

    try {
      await deleteResumeMutation.mutateAsync({ id: resumeId });
    } finally {
      setLoadingStates(prev => ({ ...prev, [resumeId]: { ...prev[resumeId], deleting: false } }));
    }
  };

  const handleResumeUpdate = () => {
    // Refetch the data when a resume is updated
    refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-indigo-600 mx-auto mb-4 animate-spin" />
          <p className="text-slate-500 font-medium">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="container-responsive py-12 sm:py-16">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            My Portfolio
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Manage your professional career narratives</p>
        </div>
        <TemplateSelector onCreateResume={createNewResume}>
          <Button
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all duration-300 px-8 py-6 text-base font-bold rounded-xl"
            disabled={createResumeMutation.isPending}
          >
            <Plus className="h-5 w-5" />
            <span>{createResumeMutation.isPending ? "Configuring..." : "Create New Resume"}</span>
          </Button>
        </TemplateSelector>
      </div>

      {!resumes || resumes.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-200 bg-white/50 backdrop-blur-sm rounded-[32px] overflow-hidden">
          <CardContent className="pt-6">
            <div className="text-center py-24 px-6">
              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full"></div>
                <FileText className="h-24 w-24 text-indigo-500 relative z-10 mx-auto animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">No resumes crafted yet</h3>
              <p className="text-slate-500 mb-10 max-w-md mx-auto leading-relaxed">
                Every great career story starts with a single page. 
                Choose a professional template and let&apos;s build your future today.
              </p>
              <TemplateSelector onCreateResume={createNewResume}>
                <Button
                  size="lg"
                  className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg px-8 py-4 h-auto font-bold rounded-xl"
                  disabled={createResumeMutation.isPending}
                >
                  <Plus className="h-5 w-5" />
                  <span>{createResumeMutation.isPending ? "Creating..." : "Build Your First Resume"}</span>
                </Button>
              </TemplateSelector>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {resumes.map((resume) => (
            <ResumeCard
              key={resume.id}
              resume={resume}
              onShare={handleShare}
              onDownload={handleDownloadPDF}
              onUpdate={handleResumeUpdate}
              onDelete={handleResumeDelete}
              loadingStates={loadingStates[resume.id] || {}}
            />
          ))}
        </div>
      )}
    </main>
  );
}
