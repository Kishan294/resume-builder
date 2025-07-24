"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { FileText, Plus } from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
          <p className="text-muted-foreground mt-2">Create and manage your professional resumes</p>
        </div>
        <TemplateSelector onCreateResume={createNewResume}>
          <Button
            className="flex items-center space-x-2 shadow-md hover:shadow-lg transition-shadow"
            disabled={createResumeMutation.isPending}
          >
            <Plus className="h-4 w-4" />
            <span>{createResumeMutation.isPending ? "Creating..." : "New Resume"}</span>
          </Button>
        </TemplateSelector>
      </div>

      {!resumes || resumes.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="pt-6">
            <div className="text-center py-16">
              <FileText className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No resumes yet</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Create your first professional resume with our easy-to-use builder. Choose from modern templates and get started in minutes.
              </p>
              <TemplateSelector onCreateResume={createNewResume}>
                <Button
                  size="lg"
                  className="flex items-center space-x-2 shadow-md"
                  disabled={createResumeMutation.isPending}
                >
                  <Plus className="h-5 w-5" />
                  <span>{createResumeMutation.isPending ? "Creating..." : "Create Your First Resume"}</span>
                </Button>
              </TemplateSelector>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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