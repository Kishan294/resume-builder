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
    name: "Modern",
    description: "Clean design for tech roles",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Executive style for corporate",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Bold design for creatives",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and clean",
  },
  {
    id: "compact",
    name: "Compact",
    description: "More content per page",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional format",
  },
];

export function TemplateSelector({ onCreateResume, children }: TemplateSelectorProps) {
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
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Choose a Template</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`relative group cursor-pointer transition-all hover:shadow-lg ${selectedTemplate === template.id ? "ring-2 ring-orange-500" : ""
                }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              {selectedTemplate === template.id && (
                <div className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full p-1.5 z-10 shadow-lg">
                  <Check className="h-3 w-3" />
                </div>
              )}

              {/* Template Preview */}
              <div className="mb-3 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                <TemplatePreview
                  templateId={template.id}
                  isSelected={selectedTemplate === template.id}
                />
              </div>

              {/* Template Info */}
              <div className="px-1">
                <h3 className="font-semibold text-sm text-gray-900">{template.name}</h3>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{template.description}</p>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateResume}>
            Create Resume
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
