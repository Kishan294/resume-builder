"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Code, Plus, X, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { skillsFormSchema, type SkillsFormData } from "@/lib/validations";

interface SkillCategory {
  id: string;
  category: string;
  items: string[];
}

interface SkillsEditorProps {
  data: SkillCategory[];
  onUpdate: (data: SkillCategory[]) => void;
}

export function SkillsEditor({ data, onUpdate }: SkillsEditorProps) {
  const [newSkillInputs, setNewSkillInputs] = useState<{ [categoryIndex: string]: string }>({});
  const isInitialMount = useRef(true);

  const form = useForm<SkillsFormData>({
    resolver: zodResolver(skillsFormSchema),
    defaultValues: {
      skillCategories: data.length > 0 ? data : [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "skillCategories",
  });

  // Only update form when data changes from parent (not from internal form changes)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const currentFormData = form.getValues("skillCategories");
    if (JSON.stringify(currentFormData) !== JSON.stringify(data)) {
      form.reset({ skillCategories: data });
    }
  }, [data, form]);

  const addCategory = () => {
    const newCategory: SkillCategory = {
      id: uuidv4(),
      category: "New Category",
      items: [],
    };
    append(newCategory);
    setTimeout(() => onUpdate(form.getValues("skillCategories") as SkillCategory[]), 0);
  };

  const addSkill = (categoryIndex: number) => {
    const skillName = newSkillInputs[`category-${categoryIndex}`]?.trim();
    if (!skillName) return;

    const currentItems = form.getValues(`skillCategories.${categoryIndex}.items`) || [];

    // Check for duplicates
    if (currentItems.includes(skillName)) {
      toast.error("This skill is already added to this category");
      return;
    }

    form.setValue(`skillCategories.${categoryIndex}.items`, [...currentItems, skillName]);
    onUpdate(form.getValues("skillCategories") as SkillCategory[]);

    // Clear the input
    setNewSkillInputs(prev => ({ ...prev, [`category-${categoryIndex}`]: "" }));
  };

  const removeSkill = (categoryIndex: number, skillIndex: number) => {
    const currentItems = form.getValues(`skillCategories.${categoryIndex}.items`) || [];
    const updatedItems = currentItems.filter((_, index) => index !== skillIndex);
    form.setValue(`skillCategories.${categoryIndex}.items`, updatedItems);
    onUpdate(form.getValues("skillCategories") as SkillCategory[]);
  };

  const handleSkillInputChange = (categoryIndex: number, value: string) => {
    setNewSkillInputs(prev => ({ ...prev, [`category-${categoryIndex}`]: value }));
  };

  const handleSkillInputKeyPress = (categoryIndex: number, e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(categoryIndex);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
          <p className="text-muted-foreground">
            Organize your skills by category to showcase your expertise
          </p>
        </div>
        <Button onClick={addCategory} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </Button>
      </div>

      {data.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No skills added yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding a skill category like &quot;Programming Languages&quot; or &quot;Design Tools&quot;
              </p>
              <Button onClick={addCategory} className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Your First Category</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Form {...form}>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <Card key={field.id} className="shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <FormField
                        control={form.control}
                        name={`skillCategories.${index}.category`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                className="text-lg font-semibold border-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                                placeholder="Category name"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  onUpdate(form.getValues("skillCategories") as SkillCategory[]);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        remove(index);
                        setTimeout(() => onUpdate(form.getValues("skillCategories") as SkillCategory[]), 0);
                      }}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Skills List */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {form.watch(`skillCategories.${index}.items`)?.map((skill: string, skillIndex: number) => (
                      <Badge
                        key={skillIndex}
                        variant="secondary"
                        className="flex items-center space-x-1 px-3 py-1"
                      >
                        <span>{skill}</span>
                        <button
                          onClick={() => removeSkill(index, skillIndex)}
                          className="ml-1 hover:text-red-500 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>

                  {/* Add New Skill */}
                  <div className="flex items-center space-x-2">
                    <div className="flex-1">
                      <Input
                        placeholder="Add a skill..."
                        value={newSkillInputs[`category-${index}`] || ""}
                        onChange={(e) => handleSkillInputChange(index, e.target.value)}
                        onKeyDown={(e) => handleSkillInputKeyPress(index, e)}
                      />
                    </div>
                    <Button
                      onClick={() => addSkill(index)}
                      disabled={!newSkillInputs[`category-${index}`]?.trim()}
                      size="sm"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Form>
      )}
    </div>
  );
}
