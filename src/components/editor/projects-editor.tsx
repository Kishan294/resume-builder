"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MonthYearPicker } from "@/components/ui/date-picker";
import { Plus, Trash2, X, FolderOpen, Calendar, ExternalLink } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Project } from "@/types/resume";
import { toast } from "sonner";
import { projectsFormSchema, type ProjectsFormData } from "@/lib/validations";

interface ProjectsEditorProps {
  data: Project[];
  onUpdate: (data: Project[]) => void;
}

export function ProjectsEditor({ data, onUpdate }: ProjectsEditorProps) {
  const [newTechInputs, setNewTechInputs] = useState<{ [key: string]: string }>({});
  const isInitialMount = useRef(true);

  const form = useForm<ProjectsFormData>({
    resolver: zodResolver(projectsFormSchema),
    defaultValues: {
      projects: data.length > 0 ? data : [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "projects",
  });

  // Only update form when data changes from parent (not from internal form changes)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const currentFormData = form.getValues("projects");
    if (JSON.stringify(currentFormData) !== JSON.stringify(data)) {
      form.reset({ projects: data });
    }
  }, [data, form]);

  const addProject = () => {
    const newProject: Project = {
      id: uuidv4(),
      name: "",
      description: "",
      technologies: [],
      startDate: "",
    };
    append(newProject);
    setTimeout(() => onUpdate(form.getValues("projects") as Project[]), 0);
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
    onUpdate(form.getValues("projects") as Project[]);
    setNewTechInputs({ ...newTechInputs, [`project-${projectIndex}`]: "" });
  };

  const removeTechnology = (projectIndex: number, techIndex: number) => {
    const currentTechnologies = form.getValues(`projects.${projectIndex}.technologies`) || [];
    const updatedTechnologies = currentTechnologies.filter((_, index) => index !== techIndex);
    form.setValue(`projects.${projectIndex}.technologies`, updatedTechnologies);
    onUpdate(form.getValues("projects") as Project[]);
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
                          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                          Source Code
                        </a>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      remove(index);
                      setTimeout(() => onUpdate(form.getValues("projects") as Project[]), 0);
                    }}
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
                          onChange={(e) => {
                            field.onChange(e);
                            onUpdate(form.getValues("projects") as Project[]);
                          }}
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
                          onChange={(e) => {
                            field.onChange(e);
                            onUpdate(form.getValues("projects") as Project[]);
                          }}
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
                            onChange={(e) => {
                              field.onChange(e);
                              onUpdate(form.getValues("projects") as Project[]);
                            }}
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
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                          GitHub Repository
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://github.com/username/project"
                            className="transition-all duration-200 focus:ring-2 focus:ring-orange-500/20"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              onUpdate(form.getValues("projects") as Project[]);
                            }}
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
                          <MonthYearPicker
                            date={field.value ? new Date(field.value + "-01") : null}
                            onSelect={(date) => {
                              const monthString = date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` : "";
                              field.onChange(monthString);
                              onUpdate(form.getValues("projects") as Project[]);
                            }}
                            placeholder="Select start date"
                            className="transition-all duration-200 focus:ring-2 focus:ring-orange-500/20"
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
                          <MonthYearPicker
                            date={field.value ? new Date(field.value + "-01") : null}
                            onSelect={(date) => {
                              const monthString = date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` : "";
                              field.onChange(monthString);
                              onUpdate(form.getValues("projects") as Project[]);
                            }}
                            placeholder="Select end date"
                            className="transition-all duration-200 focus:ring-2 focus:ring-orange-500/20"
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
                      value={newTechInputs[`project-${index}`] ?? ""}
                      onChange={(e) => handleTechInputChange(index, e.target.value)}
                      onKeyDown={(e) => handleTechInputKeyPress(index, e)}
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
      )
      }
    </div >
  );
}
