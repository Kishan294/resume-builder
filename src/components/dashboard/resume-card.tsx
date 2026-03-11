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
import type { Resume } from "@/db/schema";
import { api } from "@/lib/trpc/client";

interface ResumeCardProps {
  resume: Resume;
  onShare: (resumeId: string, title: string) => void;
  onDownload: (resumeId: string) => void;
  onUpdate: (updatedResume: Resume) => void;
  onDelete: (resumeId: string) => void;
  loadingStates: { sharing?: boolean; downloading?: boolean; deleting?: boolean };
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
  const [newTitle, setNewTitle] = useState(resume.title || "");
  const isDeleting = loadingStates.deleting || false;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const updateResumeMutation = api.resume.update.useMutation({
    onSuccess: (updatedResume) => {
      onUpdate(updatedResume);
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
  };

  const handleDelete = () => {
    onDelete(resume.id);
    setShowDeleteDialog(false);
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
      <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group border-slate-200 overflow-hidden bg-white">
        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {isRenaming ? (
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onBlur={handleRename}
                  onKeyDown={handleKeyPress}
                  className="text-lg font-bold border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500/10 p-1 h-auto mb-1"
                  autoFocus
                />
              ) : (
                <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {resume.title}
                </CardTitle>
              )}
              <CardDescription className="flex items-center gap-3 mt-2">
                <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100 text-[10px] uppercase tracking-wider font-bold">
                  {resume.template}
                </Badge>
                <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  {resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric' }) : "Recently"}
                </span>
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {resume.isPublic && (
                <Badge variant="outline" className="flex items-center gap-1.5 border-emerald-200 bg-emerald-50 text-emerald-700 px-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-bold">LIVE</span>
                </Badge>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-full">
                    <MoreVertical className="h-4 w-4 text-slate-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 p-1 shadow-lg border-slate-200">
                  <DropdownMenuItem onClick={() => setIsRenaming(true)} className="rounded-md focus:bg-indigo-50 focus:text-indigo-700">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-red-600 focus:bg-red-50 focus:text-red-700 rounded-md"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 pb-6">
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => router.push(`/editor/${resume.id}`)}
              className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-semibold h-9 rounded-lg"
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShare(resume.id, resume.title)}
              disabled={loadingStates.sharing}
              className="flex items-center justify-center gap-1.5 border-slate-200 hover:bg-slate-50 text-slate-600 h-9 rounded-lg font-medium"
            >
              {loadingStates.sharing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Share2 className="h-3.5 w-3.5" />
              )}
              <span>Share</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownload(resume.id)}
              disabled={loadingStates.downloading}
              className="flex items-center justify-center gap-1.5 border-slate-200 hover:bg-slate-50 text-slate-600 h-9 rounded-lg font-medium"
            >
              {loadingStates.downloading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
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
