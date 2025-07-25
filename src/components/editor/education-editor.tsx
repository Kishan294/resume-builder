"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Trash2, GraduationCap, Calendar, Award } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Education } from "@/types/resume";

const educationSchema = z.object({
  id: z.string(),
  institution: z.string()
    .min(1, "Institution is required")
    .min(2, "Institution name must be at least 2 characters")
    .max(100, "Institution name must be less than 100 characters"),
  degree: z.string()
    .min(1, "Degree is required")
    .min(2, "Degree must be at least 2 characters")
    .max(100, "Degree must be less than 100 characters"),
  field: z.string()
    .min(1, "Field of study is required")
    .min(2, "Field of study must be at least 2 characters")
    .max(100, "Field of study must be less than 100 characters"),
  startDate: z.string()
    .min(1, "Start date is required")
    .regex(/^\d{4}-\d{2}$/, "Please select a valid start date"),
  endDate: z.string()
    .optional()
    .refine((val) => !val || /^\d{4}-\d{2}$/.test(val), "Please select a valid end date"),
  current: z.boolean(),
  gpa: z.string()
    .optional()
    .refine((val) => !val || /^\d+(\.\d+)?\/\d+(\.\d+)?$|^\d+(\.\d+)?$/.test(val), "Please enter a valid GPA (e.g., 3.8 or 3.8/4.0)"),
  description: z.string()
    .max(500, "Description must be 500 characters or less")
    .optional(),
}).refine((data) => {
  if (!data.current && !data.endDate) {
    return false;
  }
  if (data.current && data.endDate) {
    return false;
  }
  if (data.startDate && data.endDate && data.startDate > data.endDate) {
    return false;
  }
  return true;
}, {
  message: "Please provide a valid date range",
  path: ["endDate"],
});

const educationFormSchema = z.object({
  educations: z.array(educationSchema),
});

interface EducationEditorProps {
  data: Education[];
  onUpdate: (data: Education[]) => void;
}

export function EducationEditor({ data, onUpdate }: EducationEditorProps) {
  const form = useForm<z.infer<typeof educationFormSchema>>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: {
      educations: data.length > 0 ? data : [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "educations",
  });

  // Update form when data changes
  useEffect(() => {
    form.reset({
      educations: data.length > 0 ? data : [],
    });
  }, [data, form]);

  // Watch form changes and update parent
  useEffect(() => {
    const subscription = form.watch((values) => {
      if (values.educations) {
        onUpdate(values.educations as Education[]);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onUpdate]);

  const addEducation = () => {
    const newEducation: Education = {
      id: uuidv4(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      current: false,
    };
    append(newEducation);
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
            <GraduationCap className="h-5 w-5" />
            Education
          </h3>
          <p className="text-sm text-muted-foreground">Add your educational background</p>
        </div>
        <Button onClick={addEducation}>
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>

      {data.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No education added yet</p>
              <Button onClick={addEducation} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Your Education
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
                      Education {index + 1}
                      {form.watch(`educations.${index}.current`) && (
                        <Badge variant="secondary" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </CardTitle>
                    {form.watch(`educations.${index}.degree`) && form.watch(`educations.${index}.field`) && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {form.watch(`educations.${index}.degree`)} in {form.watch(`educations.${index}.field`)}
                      </p>
                    )}
                    {form.watch(`educations.${index}.institution`) && (
                      <p className="text-sm text-muted-foreground">
                        {form.watch(`educations.${index}.institution`)}
                      </p>
                    )}
                    {form.watch(`educations.${index}.startDate`) && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDateRange(
                          form.watch(`educations.${index}.startDate`) || "",
                          form.watch(`educations.${index}.endDate`) || "",
                          form.watch(`educations.${index}.current`)
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
                    name={`educations.${index}.institution`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institution *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="University Name"
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
                    name={`educations.${index}.degree`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Degree *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Bachelor's, Master's, etc."
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
                    name={`educations.${index}.field`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Field of Study *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Computer Science, Business, etc."
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
                    name={`educations.${index}.gpa`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          GPA
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="3.8/4.0"
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
                    name={`educations.${index}.startDate`}
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
                    name={`educations.${index}.endDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          End Date
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="month"
                            disabled={form.watch(`educations.${index}.current`)}
                            className="transition-all duration-200 focus:ring-2 focus:ring-orange-500/20"
                            {...field}
                          />
                        </FormControl>
                        <FormField
                          control={form.control}
                          name={`educations.${index}.current`}
                          render={({ field: currentField }) => (
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={currentField.value}
                                onCheckedChange={(checked) => {
                                  currentField.onChange(checked);
                                  if (checked) {
                                    form.setValue(`educations.${index}.endDate`, "");
                                  }
                                }}
                              />
                              <FormLabel className="text-sm">
                                Currently studying
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
                  name={`educations.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="• Relevant coursework, achievements, activities...&#10;• Academic honors or awards&#10;• Thesis or capstone project details"
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
              </CardContent>
            </Card>
          ))}
        </Form>
      )}
    </div>
  );
}
