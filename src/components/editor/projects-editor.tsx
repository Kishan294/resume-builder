"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Trash2, X, FolderOpen, Calendar, ExternalLink, Github } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Project } from "@/types/resume";
import { toast } from "sonner";

const projectSchema = z.object({
  id: z.string(),
  name: z.string()
    .min(1, "Project name is required")
    .min(2, "Project name must be at least 2 characters")
    .max(100, "Project name must be less than 100 characters"),
  description: z.string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be 500 characters or less"),
  technologies: z.array(z.string())
    .min(1, "Please add at least one technology"),
  url: z.string()
    .optional()
    .refine((val) => !val || val === "" || z.string().url().safeParse(val).success, "Please enter a valid URL"),
  github: z.string()
    .optional()
    .refine((val) => !val || val === "" || z.string().url().safeParse(val).success, "Please enter a valid GitHub URL")
    .refine((val) => !val || val === "" || val.includes("github.com"), "Please enter a valid GitHub URL"),
  startDate: z.string()
    .optional()
    .refine((val) => !val || /^\d{4}-\d{2}$/.test(val), "Please select a valid start date"),
  endDate: z.string()
    .optional()
    .refine((val) => !val || /^\d{4}-\d{2}$/.test(val), "Please select a valid end date"),
}).refine((data) => {
  if (data.startDate && data.endDate && data.startDate > data.endDate) {
    return false;
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

const projectsFormSchema = z.object({
  projects: z.array(projectSchema),
});

interface ProjectsEditorProps {
  data: Project[];
  onUpdate: (data: Project[]) => void;
}

export function ProjectsEditor({ data, onUpdate }: ProjectsEditorProps) {
  const [newTechInputs, setNewTechInputs] = useState<{ [key: string]: string }>({});

  const form = useForm<z.infer<typeof projectsFormSchema>>({
    resolver: zodResolver(projectsFormSchema),
    defaultValues: {
      projects: data.length > 0 ? data : [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "projects",
  });

  // Update form when data changes
  useEffect(() => {
    form.reset({
      projects: data.length > 0 ? data : [],
    });
  }, [data, form]);

  // Watch form changes and update parent
  useEffect(() => {
    const subscription = form.watch((values) => {
      if (values.projects) {
        onUpdate(values.projects as Project[]);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onUpdate]);

  const addProject = () => {
    const newProject: Project = {
      id: uuidv4(),
      name: "",
      description: "",
      technologies: [],
      startDate: "",
    };
    append(newProject);
  };

  const addTechnology = (projectIndex: number) => {
    const techText = newTechInputs[`project-${projectIndex}`]?.trim();
    if (!techText) return;

    const currentTechnologies = form.getValues(`projects.${projectIndex}.technologies`) || [];

    // Check for duplicates
    if (currentTechnologies.includes(techText)) {
      toast.error("This technology is already added to this project");
      return;
    }

    form.setValue(`projects.${projectIndex}.technologies`, [...currentTechnologies, techText]);
    setNewTechInputs({ ...newTechInputs, [`project-${projectIndex}`]: "" });
  };

  const removeTechnology = (projectIndex: number, techIndex: number) => {
    const currentTechnologies = form.getValues(`projects.${projectIndex}.technologies`) || [];
    const updatedTechnologies = currentTechnologies.filter((_, index) => index !== techIndex);
    form.setValue(`projects.${projectIndex}.technologies`, updatedTechnologies);
  };

  const handleTechInputChange = (projectIndex: number, value: string) => {
    setNewTechInputs({ ...newTechInputs, [`project-${projectIndex}`]: value });
  };

  const handleTechInputKeyPress = (projectIndex: number, e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTechnology(projectIndex);
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
        <Form {...form}>
          {fields.map((field, index) => (
            <Card key={field.id} className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      Project {index + 1}
                    </CardTitle>
                    {form.watch(`projects.${index}.name`) && (
                      <p className="text-sm text-muted-foreground mt-1 font-medium">
                        {form.watch(`projects.${index}.name`)}
                      </p>
                    )}
                    {form.watch(`projects.${index}.startDate`) && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDateRange(
                          form.watch(`projects.${index}.startDate`) || "",
                          form.watch(`projects.${index}.endDate`) || ""
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      {form.watch(`projects.${index}.url`) && (
                        <a
                          href={form.watch(`projects.${index}.url`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-orange-500 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Live Demo
                        </a>
                      )}
                      {form.watch(`projects.${index}.github`) && (
                        <a
                          href={form.watch(`projects.${index}.github`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-orange-500 hover:underline flex items-center gap-1"
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
                    onClick={() => remove(index)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name={`projects.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="My Awesome Project"
                          className="transition-all duration-200 focus:ring-2 focus:ring-orange-500/20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`projects.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="• Describe what this project does and your role in it...&#10;• Highlight key features and technologies used&#10;• Mention any challenges overcome or results achieved"
                          rows={3}
                          className="transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <div className="text-xs text-muted-foreground">
                        {field.value?.length || 0}/500 characters
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`projects.${index}.url`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <ExternalLink className="h-4 w-4" />
                          Project URL
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://myproject.com"
                            className="transition-all duration-200 focus:ring-2 focus:ring-orange-500/20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`projects.${index}.github`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Github className="h-4 w-4" />
                          GitHub Repository
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://github.com/username/project"
                            className="transition-all duration-200 focus:ring-2 focus:ring-orange-500/20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`projects.${index}.startDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Start Date
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="month"
                            className="transition-all duration-200 focus:ring-2 focus:ring-orange-500/20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`projects.${index}.endDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          End Date
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="month"
                            className="transition-all duration-200 focus:ring-2 focus:ring-orange-500/20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormLabel>Technologies Used</FormLabel>
                  <div className="flex space-x-2">
                    <Input
                      value={newTechInputs[`project-${index}`] || ""}
                      onChange={(e) => handleTechInputChange(index, e.target.value)}
                      onKeyPress={(e) => handleTechInputKeyPress(index, e)}
                      placeholder="Add a technology and press Enter"
                      className="transition-all duration-200 focus:ring-2 focus:ring-orange-500/20"
                    />
                    <Button
                      type="button"
                      onClick={() => addTechnology(index)}
                      size="sm"
                      disabled={!newTechInputs[`project-${index}`]?.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {form.watch(`projects.${index}.technologies`)?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {form.watch(`projects.${index}.technologies`).map((tech: string, techIndex: number) => (
                        <Badge
                          key={techIndex}
                          variant="secondary"
                          className="flex items-center space-x-1 transition-all duration-200 hover:bg-secondary/80"
                        >
                          <span>{tech}</span>
                          <button
                            onClick={() => removeTechnology(index, techIndex)}
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
          ))}
        </Form>
      )}
    </div>
  );
}
