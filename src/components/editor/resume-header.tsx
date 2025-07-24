"use client";

import { useState } from "react";
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
  Download,
  Share2,
  Loader2,
  Printer,
  MoreVertical,
  Edit2,
  Trash2
} from "lucide-react";
import Link from "next/link";
import { Resume } from "@/types/resume";

interface ResumeHeaderProps {
  resume: Resume;
  onTitleUpdate: (newTitle: string) => void;
  onSave: () => void;
  onDownload: () => void;
  onShare: () => void;
  onPrint: () => void;
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
  onPrint,
  isSaving,
  isDownloading,
  isSharing,
}: ResumeHeaderProps) {
  const router = useRouter();
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(resume.title);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleRename = async () => {
    if (!newTitle.trim() || newTitle === resume.title) {
      setIsRenaming(false);
      setNewTitle(resume.title);
      return;
    }

    try {
      const response = await fetch(`/api/resumes/${resume.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...resume,
          title: newTitle.trim(),
        }),
      });

      if (response.ok) {
        onTitleUpdate(newTitle.trim());
        toast.success("Resume title updated successfully!");
      } else {
        toast.error("Failed to update resume title");
        setNewTitle(resume.title);
      }
    } catch (error) {
      console.error("Failed to update resume title:", error);
      toast.error("Failed to update resume title");
      setNewTitle(resume.title);
    } finally {
      setIsRenaming(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/resumes/${resume.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Resume deleted successfully!");
        router.push("/dashboard");
      } else {
        toast.error("Failed to delete resume");
      }
    } catch (error) {
      console.error("Failed to delete resume:", error);
      toast.error("Failed to delete resume");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
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
    <header className="bg-white border-b px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          {isRenaming ? (
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={handleRename}
              onKeyDown={handleKeyPress}
              className="text-xl font-semibold border-none p-0 h-auto focus-visible:ring-0"
              autoFocus
            />
          ) : (
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-semibold">{resume.title}</h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsRenaming(true)}
                className="h-6 w-6 p-0"
              >
                <Edit2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
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
            onClick={onShare}
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
            onClick={onDownload}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Download PDF
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onPrint}
            title="Open simple print window (most reliable)"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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