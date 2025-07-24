import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/trpc/client";

export function useResumeOperations() {
  const router = useRouter();
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: {
      sharing?: boolean;
      downloading?: boolean;
      deleting?: boolean;
    };
  }>({});

  const utils = api.useUtils();

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
      utils.resume.getAll.invalidate();
    },
    onError: () => {
      toast.error("Failed to delete resume");
    },
  });

  const togglePublicMutation = api.resume.togglePublic.useMutation({
    onSuccess: () => {
      utils.resume.getAll.invalidate();
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

  const shareResume = async (resumeId: string) => {
    setLoadingStates((prev) => ({
      ...prev,
      [resumeId]: { ...prev[resumeId], sharing: true },
    }));

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
      setLoadingStates((prev) => ({
        ...prev,
        [resumeId]: { ...prev[resumeId], sharing: false },
      }));
    }
  };

  const downloadResume = async (resumeId: string) => {
    setLoadingStates((prev) => ({
      ...prev,
      [resumeId]: { ...prev[resumeId], downloading: true },
    }));

    try {
      router.push(`/editor/${resumeId}?download=true`);
      toast.success("Redirecting to editor for PDF download...");
    } catch (error) {
      console.error("Failed to download PDF:", error);
      toast.error("Failed to download PDF");
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        [resumeId]: { ...prev[resumeId], downloading: false },
      }));
    }
  };

  const deleteResume = async (resumeId: string) => {
    setLoadingStates((prev) => ({
      ...prev,
      [resumeId]: { ...prev[resumeId], deleting: true },
    }));

    try {
      await deleteResumeMutation.mutateAsync({ id: resumeId });
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        [resumeId]: { ...prev[resumeId], deleting: false },
      }));
    }
  };

  return {
    createNewResume,
    shareResume,
    downloadResume,
    deleteResume,
    loadingStates,
    isCreating: createResumeMutation.isPending,
  };
}
