"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Check } from "lucide-react";
import { TemplatePreview } from "./template-preview";

interface TemplateSelectorProps {
  onCreateResume: (template: string) => void;
  children?: React.ReactNode;
}

const templates = [
  {
    id: "modern",
    name: "Modern Pro",
    description: "Clean Indigo accents with bold typography",
    tag: "Popular",
  },
  {
    id: "executive",
    name: "Executive Elite",
    description: "Serif design for senior roles",
    tag: "New",
  },
  {
    id: "tech-pro",
    name: "Developer Core",
    description: "Monospace layout for engineers",
    tag: "New",
  },
  {
    id: "professional",
    name: "Corporate",
    description: "Corporate-friendly standard format",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional professional layout",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Bold design for creatives",
  },
  {
    id: "minimal",
    name: "Minimalist",
    description: "Ultra-clean and simple",
  },
  {
    id: "compact",
    name: "Condensed",
    description: "Maximum content per page",
  },
];

export function TemplateSelector({
  onCreateResume,
  children,
}: TemplateSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");

  const handleCreateResume = () => {
    onCreateResume(selectedTemplate);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New Resume</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl rounded-2xl border-slate-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">
            Choose a Template
          </DialogTitle>
          <p className="text-sm text-slate-500 mt-1">
            Select a template to start building your resume
          </p>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`relative group cursor-pointer rounded-xl transition-all duration-200 border-2 p-1 ${
                selectedTemplate === template.id
                  ? "border-indigo-500 shadow-lg shadow-indigo-100 bg-indigo-50/30"
                  : "border-transparent hover:border-slate-200"
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              {selectedTemplate === template.id && (
                <div className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white rounded-full p-1 z-10 shadow-md">
                  <Check className="h-3 w-3" />
                </div>
              )}

              {"tag" in template && template.tag && (
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      template.tag === "New"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-indigo-100 text-indigo-700"
                    }`}
                  >
                    {template.tag}
                  </span>
                </div>
              )}

              {/* Template Preview */}
              <div className="mb-2 rounded-lg overflow-hidden">
                <TemplatePreview
                  templateId={template.id}
                  isSelected={selectedTemplate === template.id}
                />
              </div>

              {/* Template Info */}
              <div className="px-1 pb-1">
                <h3 className="font-semibold text-sm text-slate-900">
                  {template.name}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  {template.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateResume}
            className="bg-indigo-600 hover:bg-indigo-700 rounded-lg px-6 font-semibold"
          >
            Create Resume
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
