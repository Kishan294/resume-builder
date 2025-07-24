"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Edit,
  Share2,
  Download,
  Loader2,
  Calendar,
  Eye,
  MoreVertical,
  Edit2,
  Trash2
} from "lucide-react";

interface Resume {
  id: string;
  title: string;
  template: string;
  isPublic: boolean;
  updatedAt: string;
}

interface ResumeCardProps {
  resume: Resume;
  onShare: (resumeId: string, title: string) => void;
  onDownload: (resumeId: string) => void;
  onUpdate: (updatedResume: Resume) => void;
  onDelete: (resumeId: string) => void;
  loadingStates: { sharing?: boolean; downloading?: boolean };
}

export function ResumeCard({
  resume,
  onShare,
  onDownload,
  onUpdate,
  onDelete,
  loadingStates,
}: ResumeCardProps) {
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
          title: newTitle.trim(),
        }),
      });

      if (response.ok) {
        const updatedResume = await response.json();
        onUpdate(updatedResume);
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
        onDelete(resume.id);
        toast.success("Resume deleted successfully!");
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
    <>
      <Card className="hover:shadow-lg transition-all duration-200 group">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {isRenaming ? (
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onBlur={handleRename}
                  onKeyDown={handleKeyPress}
                  className="text-lg font-semibold border-none p-0 h-auto focus-visible:ring-0 mb-1"
                  autoFocus
                />
              ) : (
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {resume.title}
                </CardTitle>
              )}
              <CardDescription className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {resume.template}
                </Badge>
                <span className="flex items-center gap-1 text-xs">
                  <Calendar className="h-3 w-3" />
                  {new Date(resume.updatedAt).toLocaleDateString()}
                </span>
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {resume.isPublic && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  Public
                </Badge>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreVertical className="h-3 w-3" />
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
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/editor/${resume.id}`)}
              className="flex items-center space-x-1 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Edit className="h-3 w-3" />
              <span>Edit</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShare(resume.id, resume.title)}
              disabled={loadingStates.sharing}
              className="flex items-center space-x-1"
            >
              {loadingStates.sharing ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Share2 className="h-3 w-3" />
              )}
              <span>Share</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownload(resume.id)}
              disabled={loadingStates.downloading}
              className="flex items-center space-x-1"
            >
              {loadingStates.downloading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Download className="h-3 w-3" />
              )}
              <span>PDF</span>
            </Button>
          </div>
        </CardContent>
      </Card>

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
    </>
  );
}