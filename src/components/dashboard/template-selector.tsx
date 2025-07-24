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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${selectedTemplate === template.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
                }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              {selectedTemplate === template.id && (
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}

              <div className="h-24 bg-gray-100 rounded mb-3 flex items-center justify-center">
                <span className="text-gray-500 text-sm">{template.name}</span>
              </div>

              <h3 className="font-medium text-sm">{template.name}</h3>
              <p className="text-xs text-gray-600 mt-1">{template.description}</p>
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