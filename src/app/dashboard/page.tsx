"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { FileText, Plus } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { TemplateSelector } from "@/components/dashboard/template-selector";
import { ResumeCard } from "@/components/dashboard/resume-card";
import { shareResume } from "@/utils/share-utils";

interface Resume {
  id: string;
  title: string;
  template: string;
  isPublic: boolean;
  updatedAt: string;
}

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: { sharing?: boolean; downloading?: boolean } }>({});

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth/login");
      return;
    }

    if (session) {
      // Fetch user's resumes
      fetchResumes();
    }
  }, [session, isPending, router]);

  const fetchResumes = async () => {
    try {
      const response = await fetch("/api/resumes");
      if (response.ok) {
        const data = await response.json();
        setResumes(data);
      }
    } catch (error) {
      console.error("Failed to fetch resumes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewResume = async (template: string = "modern") => {
    try {
      const response = await fetch("/api/resumes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Untitled Resume",
          template,
        }),
      });

      if (response.ok) {
        const newResume = await response.json();
        router.push(`/editor/${newResume.id}`);
      } else {
        toast.error("Failed to create resume");
      }
    } catch (error) {
      console.error("Failed to create resume:", error);
      toast.error("Failed to create resume");
    }
  };

  const handleShare = async (resumeId: string, title: string) => {
    setLoadingStates(prev => ({ ...prev, [resumeId]: { ...prev[resumeId], sharing: true } }));
    try {
      const success = await shareResume(resumeId, title);
      if (success) {
        toast.success("Resume link copied to clipboard!");
      } else {
        toast.error("Failed to share resume");
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
      // Redirect to editor with a download flag
      router.push(`/editor/${resumeId}?download=true`);
      toast.success("Redirecting to editor for PDF download...");
    } catch (error) {
      console.error("Failed to download PDF:", error);
      toast.error("Failed to download PDF");
    } finally {
      setLoadingStates(prev => ({ ...prev, [resumeId]: { ...prev[resumeId], downloading: false } }));
    }
  };

  const handleResumeUpdate = (updatedResume: Resume) => {
    setResumes(prev => prev.map(resume =>
      resume.id === updatedResume.id ? updatedResume : resume
    ));
  };

  const handleResumeDelete = (resumeId: string) => {
    setResumes(prev => prev.filter(resume => resume.id !== resumeId));
  };

  if (isPending || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DashboardHeader user={session.user} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
            <p className="text-muted-foreground mt-2">Create and manage your professional resumes</p>
          </div>
          <TemplateSelector onCreateResume={createNewResume}>
            <Button className="flex items-center space-x-2 shadow-md hover:shadow-lg transition-shadow">
              <Plus className="h-4 w-4" />
              <span>New Resume</span>
            </Button>
          </TemplateSelector>
        </div>

        {resumes.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="pt-6">
              <div className="text-center py-16">
                <FileText className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No resumes yet</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Create your first professional resume with our easy-to-use builder. Choose from modern templates and get started in minutes.
                </p>
                <TemplateSelector onCreateResume={createNewResume}>
                  <Button size="lg" className="flex items-center space-x-2 shadow-md">
                    <Plus className="h-5 w-5" />
                    <span>Create Your First Resume</span>
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
    </div>
  );
}