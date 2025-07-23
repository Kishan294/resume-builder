"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Edit, Share2, Download } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

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

  const createNewResume = async () => {
    try {
      const response = await fetch("/api/resumes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Untitled Resume",
          template: "modern",
        }),
      });

      if (response.ok) {
        const newResume = await response.json();
        router.push(`/editor/${newResume.id}`);
      }
    } catch (error) {
      console.error("Failed to create resume:", error);
    }
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
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={session.user} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
            <p className="text-gray-600 mt-2">Create and manage your professional resumes</p>
          </div>
          <Button onClick={createNewResume} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New Resume</span>
          </Button>
        </div>

        {resumes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No resumes yet</h3>
            <p className="text-gray-600 mb-6">Create your first resume to get started</p>
            <Button onClick={createNewResume} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Create Your First Resume</span>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <Card key={resume.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{resume.title}</CardTitle>
                      <CardDescription>
                        Template: {resume.template} • Updated {new Date(resume.updatedAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    {resume.isPublic && (
                      <Badge variant="secondary">Public</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/editor/${resume.id}`)}
                      className="flex items-center space-x-1"
                    >
                      <Edit className="h-3 w-3" />
                      <span>Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-1"
                    >
                      <Share2 className="h-3 w-3" />
                      <span>Share</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-1"
                    >
                      <Download className="h-3 w-3" />
                      <span>PDF</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}