"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Plus, Trash2, X, FolderOpen, Calendar, ExternalLink, Github } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { Project } from "@/types/resume";

interface ProjectsEditorProps {
  data: Project[];
  onUpdate: (data: Project[]) => void;
}

export function ProjectsEditor({ data, onUpdate }: ProjectsEditorProps) {
  const [newTechInputs, setNewTechInputs] = useState<{ [key: string]: string }>({});

  const addProject = () => {
    const newProject: Project = {
      id: uuidv4(),
      name: "",
      description: "",
      technologies: [],
      startDate: "",
    };
    onUpdate([...data, newProject]);
  };

  const updateProject = (id: string, field: keyof Project, value: string | string[] | boolean) => {
    const updated = data.map((proj) =>
      proj.id === id ? { ...proj, [field]: value } : proj
    );
    onUpdate(updated);
  };

  const removeProject = (id: string) => {
    onUpdate(data.filter((proj) => proj.id !== id));
  };

  const addTechnology = (projectId: string) => {
    const techText = newTechInputs[projectId]?.trim();
    if (!techText) return;

    const updated = data.map((proj) =>
      proj.id === projectId
        ? { ...proj, technologies: [...proj.technologies, techText] }
        : proj
    );
    onUpdate(updated);
    setNewTechInputs({ ...newTechInputs, [projectId]: "" });
  };

  const removeTechnology = (projectId: string, techIndex: number) => {
    const updated = data.map((proj) =>
      proj.id === projectId
        ? { ...proj, technologies: proj.technologies.filter((_, index) => index !== techIndex) }
        : proj
    );
    onUpdate(updated);
  };

  const handleTechInputChange = (projectId: string, value: string) => {
    setNewTechInputs({ ...newTechInputs, [projectId]: value });
  };

  const handleTechInputKeyPress = (projectId: string, e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTechnology(projectId);
    }
  };

  const formatDateRange = (startDate: string, endDate?: string) => {
    if (!startDate) return "";
    const start = new Date(startDate + "-01").toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    if (!endDate) return start;
    const end = new Date(endDate + "-01").toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    return `${start} - ${end}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Projects
          </h3>
          <p className="text-sm text-muted-foreground">Showcase your personal and professional projects</p>
        </div>
        <Button onClick={addProject}>
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      {data.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No projects added yet</p>
              <Button onClick={addProject} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Project
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        data.map((project, index) => (
          <Card key={project.id} className="transition-all duration-200 hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-base flex items-center gap-2">
                    Project {index + 1}
                  </CardTitle>
                  {project.name && (
                    <p className="text-sm text-muted-foreground mt-1 font-medium">
                      {project.name}
                    </p>
                  )}
                  {project.startDate && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDateRange(project.startDate, project.endDate)}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Live Demo
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        <Github className="h-3 w-3" />
                        Source Code
                      </a>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProject(project.id)}
                  className="text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Project Name *</Label>
                <Input
                  value={project.name}
                  onChange={(e) => updateProject(project.id, "name", e.target.value)}
                  placeholder="My Awesome Project"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea
                  value={project.description}
                  onChange={(e) => updateProject(project.id, "description", e.target.value)}
                  placeholder="• Describe what this project does and your role in it...&#10;• Highlight key features and technologies used&#10;• Mention any challenges overcome or results achieved"
                  rows={3}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {project.description?.length || 0}/500 characters
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Project URL
                  </Label>
                  <Input
                    value={project.url || ""}
                    onChange={(e) => updateProject(project.id, "url", e.target.value)}
                    placeholder="https://myproject.com"
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    GitHub Repository
                  </Label>
                  <Input
                    value={project.github || ""}
                    onChange={(e) => updateProject(project.id, "github", e.target.value)}
                    placeholder="https://github.com/username/project"
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Start Date
                  </Label>
                  <Input
                    type="month"
                    value={project.startDate || ""}
                    onChange={(e) => updateProject(project.id, "startDate", e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    End Date
                  </Label>
                  <Input
                    type="month"
                    value={project.endDate || ""}
                    onChange={(e) => updateProject(project.id, "endDate", e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Technologies Used</Label>
                <div className="flex space-x-2">
                  <Input
                    value={newTechInputs[project.id] || ""}
                    onChange={(e) => handleTechInputChange(project.id, e.target.value)}
                    onKeyPress={(e) => handleTechInputKeyPress(project.id, e)}
                    placeholder="Add a technology and press Enter"
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                  <Button
                    type="button"
                    onClick={() => addTechnology(project.id)}
                    size="sm"
                    disabled={!newTechInputs[project.id]?.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.technologies.map((tech, techIndex) => (
                      <Badge
                        key={techIndex}
                        variant="secondary"
                        className="flex items-center space-x-1 transition-all duration-200 hover:bg-secondary/80"
                      >
                        <span>{tech}</span>
                        <button
                          onClick={() => removeTechnology(project.id, techIndex)}
                          className="ml-1 hover:text-destructive transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}