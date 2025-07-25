"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Trash2, Briefcase, Calendar, MapPin } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { WorkExperience } from "@/types/resume";
import { workExperienceFormSchema, type WorkExperienceFormData } from "@/lib/validations";

interface WorkExperienceEditorProps {
  data: WorkExperience[];
  onUpdate: (data: WorkExperience[]) => void;
}

export function WorkExperienceEditor({ data, onUpdate }: WorkExperienceEditorProps) {
  const form = useForm<WorkExperienceFormData>({
    resolver: zodResolver(workExperienceFormSchema),
    defaultValues: {
      experiences: data.length > 0 ? data : [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "experiences",
  });

  // Update form when data changes
  useEffect(() => {
    form.reset({
      experiences: data.length > 0 ? data : [],
    });
  }, [data, form]);

  // Watch form changes and update parent
  useEffect(() => {
    const subscription = form.watch((values) => {
      if (values.experiences) {
        onUpdate(values.experiences as WorkExperience[]);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onUpdate]);

  const addExperience = () => {
    const newExperience: WorkExperience = {
      id: uuidv4(),
      company: "",
      position: "",
      startDate: "",
      current: false,
      description: "",
    };
    append(newExperience);
  };

  const formatDateRange = (startDate: string, endDate?: string, current?: boolean) => {
    if (!startDate) return "";
    const start = new Date(startDate + "-01").toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    if (current) return `${start} - Present`;
    if (!endDate) return start;
    const end = new Date(endDate + "-01").toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    return `${start} - ${end}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Work Experience
          </h3>
          <p className="text-sm text-muted-foreground">Add your professional experience</p>
        </div>
        <Button onClick={addExperience}>
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {data.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No work experience added yet</p>
              <Button onClick={addExperience} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Experience
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
                      Experience {index + 1}
                      {form.watch(`experiences.${index}.current`) && (
                        <Badge variant="secondary" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </CardTitle>
                    {form.watch(`experiences.${index}.company`) && form.watch(`experiences.${index}.position`) && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {form.watch(`experiences.${index}.position`)} at {form.watch(`experiences.${index}.company`)}
                      </p>
                    )}
                    {form.watch(`experiences.${index}.startDate`) && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDateRange(
                          form.watch(`experiences.${index}.startDate`) || "",
                          form.watch(`experiences.${index}.endDate`) || "",
                          form.watch(`experiences.${index}.current`)
                        )}
                      </div>
                    )}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`experiences.${index}.company`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Company Name"
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
                    name={`experiences.${index}.position`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Job Title"
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
                    name={`experiences.${index}.startDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Start Date *
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
                    name={`experiences.${index}.endDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          End Date
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="month"
                            disabled={form.watch(`experiences.${index}.current`)}
                            className="transition-all duration-200 focus:ring-2 focus:ring-orange-500/20"
                            {...field}
                          />
                        </FormControl>
                        <FormField
                          control={form.control}
                          name={`experiences.${index}.current`}
                          render={({ field: currentField }) => (
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={currentField.value}
                                onCheckedChange={(checked) => {
                                  currentField.onChange(checked);
                                  if (checked) {
                                    form.setValue(`experiences.${index}.endDate`, "");
                                  }
                                }}
                              />
                              <FormLabel className="text-sm">
                                I currently work here
                              </FormLabel>
                            </div>
                          )}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name={`experiences.${index}.location`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Location
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="City, State"
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
                  name={`experiences.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="• Describe your key responsibilities and achievements&#10;• Use bullet points for better readability&#10;• Include quantifiable results when possible"
                          rows={4}
                          className="transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <div className="text-xs text-muted-foreground">
                        {field.value?.length || 0}/1000 characters
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          ))}
        </Form>
      )}
    </div>
  );
}
