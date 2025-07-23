"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Palette, Zap } from "lucide-react";

interface TemplateSelectorProps {
  onCreateResume: (template: string) => void;
  children?: React.ReactNode;
}

const templates = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean and contemporary design perfect for tech and creative roles",
    icon: Zap,
    color: "bg-blue-500",
    popular: true,
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional format ideal for corporate and professional positions",
    icon: FileText,
    color: "bg-gray-500",
    popular: false,
  },
  {
    id: "creative",
    name: "Creative",
    description: "Bold and artistic layout for designers and creative professionals",
    icon: Palette,
    color: "bg-purple-500",
    popular: false,
    comingSoon: true,
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
          <DialogTitle>Choose a Template</DialogTitle>
          <DialogDescription>
            Select a template that best fits your industry and personal style
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-4 py-4">
          {templates.map((template) => {
            const IconComponent = template.icon;
            return (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${selectedTemplate === template.id
                    ? "ring-2 ring-primary shadow-md"
                    : "hover:ring-1 hover:ring-gray-300"
                  } ${template.comingSoon ? "opacity-60" : ""}`}
                onClick={() => !template.comingSoon && setSelectedTemplate(template.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${template.color} text-white`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="flex gap-1">
                      {template.popular && (
                        <Badge variant="secondary" className="text-xs">
                          Popular
                        </Badge>
                      )}
                      {template.comingSoon && (
                        <Badge variant="outline" className="text-xs">
                          Coming Soon
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {template.description}
                  </CardDescription>

                  {/* Template Preview Placeholder */}
                  <div className="mt-4 h-32 bg-gray-100 rounded-md flex items-center justify-center">
                    <div className="text-center">
                      <IconComponent className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Preview</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            You can change the template later in the editor
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateResume}>
              Create Resume
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}