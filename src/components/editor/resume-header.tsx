"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  Share2,
  Loader2,
  Printer,
  Download,
  MoreVertical,
  Edit2,
  Trash2
} from "lucide-react";
import Link from "next/link";
import { Resume } from "@/types/resume";
import { api } from "@/lib/trpc/client";

interface ResumeHeaderProps {
  resume: Resume;
  onTitleUpdate: (newTitle: string) => void;
  onSave: () => void;
  onDownload: () => void; // Now same as onPrint - both trigger print dialog
  onShare: () => void;
  onPrint: () => void; // Keep for compatibility
  isSaving: boolean;
  isDownloading: boolean;
  isSharing: boolean;
}

export function ResumeHeader({
  resume,
  onTitleUpdate,
  onSave,
  onDownload,
  onShare,
  isSaving,
  isDownloading,
  isSharing,
}: ResumeHeaderProps) {
  const router = useRouter();
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(resume.title || "");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const tablet = /ipad|android(?!.*mobile)/i.test(userAgent);
      const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      setIsMobile(mobile || tablet || (touch && window.innerWidth <= 1024));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const deleteResumeMutation = api.resume.delete.useMutation({
    onSuccess: () => {
      toast.success("Resume deleted successfully!");
      router.push("/dashboard");
    },
    onError: () => {
      toast.error("Failed to delete resume");
    },
    onSettled: () => {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    },
  });

  const updateResumeMutation = api.resume.update.useMutation({
    onSuccess: () => {
      toast.success("Resume title updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update resume title");
      setNewTitle(resume.title);
    },
    onSettled: () => {
      setIsRenaming(false);
    },
  });

  const handleRename = () => {
    if (!newTitle.trim() || newTitle === resume.title) {
      setIsRenaming(false);
      setNewTitle(resume.title);
      return;
    }

    updateResumeMutation.mutate({
      id: resume.id,
      data: { title: newTitle.trim() },
    });

    onTitleUpdate(newTitle.trim());
  };

  const handleDelete = () => {
    setIsDeleting(true);
    deleteResumeMutation.mutate({ id: resume.id });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRename();
    } else if (e.key === "Escape") {
      setIsRenaming(false);
      setNewTitle(resume.title);
    }
  };

  return (
    <header className="bg-white border-b px-2 sm:px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button variant="ghost" size="sm" className="sm:hidden">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>

          {isRenaming ? (
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={handleRename}
              onKeyDown={handleKeyPress}
              className="text-lg sm:text-xl font-semibold border-none p-0 h-auto focus-visible:ring-0 min-w-0"
              autoFocus
            />
          ) : (
            <div className="flex items-center space-x-2 min-w-0">
              <h1 className="text-lg sm:text-xl font-semibold truncate">{resume.title}</h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsRenaming(true)}
                className="h-6 w-6 p-0 flex-shrink-0"
              >
                <Edit2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          {/* Always visible Save button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            disabled={isSaving}
            className="hidden sm:flex"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isSaving ? "Saving..." : "Save"}
          </Button>

          {/* Mobile Save button - icon only */}
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            disabled={isSaving}
            className="sm:hidden"
            title="Save"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
          </Button>

          {/* Desktop buttons - hidden on mobile */}
          <Button
            variant="outline"
            size="sm"
            onClick={onShare}
            disabled={isSharing}
            className="hidden md:flex"
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
            onClick={onDownload}
            disabled={isDownloading}
            className="hidden md:flex"
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : isMobile ? (
              <Download className="h-4 w-4 mr-2" />
            ) : (
              <Printer className="h-4 w-4 mr-2" />
            )}
            {isMobile ? "Download PDF" : "Print / Save PDF"}
          </Button>



          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* Mobile-only actions */}
              <div className="md:hidden">
                <DropdownMenuItem onClick={onShare} disabled={isSharing}>
                  {isSharing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Share2 className="h-4 w-4 mr-2" />
                  )}
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDownload} disabled={isDownloading}>
                  {isDownloading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : isMobile ? (
                    <Download className="h-4 w-4 mr-2" />
                  ) : (
                    <Printer className="h-4 w-4 mr-2" />
                  )}
                  {isMobile ? "Download PDF" : "Print / Save PDF"}
                </DropdownMenuItem>

                <DropdownMenuSeparator />
              </div>

              <DropdownMenuItem onClick={() => setIsRenaming(true)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Rename Resume
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Resume
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Resume</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{resume.title}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              {isDeleting ? "Deleting..." : "Delete Resume"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
