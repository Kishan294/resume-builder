"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, X } from "lucide-react";
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
      current: false,
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Projects</h3>
          <p className="text-sm text-gray-600">Showcase your personal and professional projects</p>
        </div>
        <Button onClick={addProject} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Project</span>
        </Button>
      </div>

      {data.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No projects added yet</p>
              <Button onClick={addProject} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Project
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        data.map((project, index) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Project {index + 1}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProject(project.id)}
                  className="text-red-600 hover:text-red-700"
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
                />
              </div>

              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea
                  value={project.description}
                  onChange={(e) => updateProject(project.id, "description", e.target.value)}
                  placeholder="Describe what this project does and your role in it..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Project URL</Label>
                  <Input
                    value={project.url || ""}
                    onChange={(e) => updateProject(project.id, "url", e.target.value)}
                    placeholder="https://myproject.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>GitHub Repository</Label>
                  <Input
                    value={project.github || ""}
                    onChange={(e) => updateProject(project.id, "github", e.target.value)}
                    placeholder="https://github.com/username/project"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    value={project.startDate || ""}
                    onChange={(e) => updateProject(project.id, "startDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={project.endDate || ""}
                    onChange={(e) => updateProject(project.id, "endDate", e.target.value)}
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
                  />
                  <Button
                    type="button"
                    onClick={() => addTechnology(project.id)}
                    size="sm"
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
                        className="flex items-center space-x-1"
                      >
                        <span>{tech}</span>
                        <button
                          onClick={() => removeTechnology(project.id, techIndex)}
                          className="ml-1 hover:text-red-600"
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