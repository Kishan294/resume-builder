"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MonthYearPicker } from "@/components/ui/date-picker";

import { Plus, Trash2, GraduationCap, Calendar, Award } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Education } from "@/types/resume";
import { educationFormSchema, type EducationFormData } from "@/lib/validations";

interface EducationEditorProps {
  data: Education[];
  onUpdate: (data: Education[]) => void;
}

export function EducationEditor({ data, onUpdate }: EducationEditorProps) {
  const isInitialMount = useRef(true);

  const form = useForm<EducationFormData>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: {
      educations: data.length > 0 ? data : [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "educations",
  });

  // Only update form when data changes from parent (not from internal form changes)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const currentFormData = form.getValues("educations");
    if (JSON.stringify(currentFormData) !== JSON.stringify(data)) {
      form.reset({ educations: data.length > 0 ? data : [] });
    }
  }, [data, form]);

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
    // Immediately update parent with new data
    const updatedEducations = [...form.getValues("educations"), newEducation];
    onUpdate(updatedEducations as Education[]);
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
                      {field.current && (
                        <Badge variant="secondary" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </CardTitle>
                    {field.degree && field.field && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {field.degree} in {field.field}
                      </p>
                    )}
                    {field.institution && (
                      <p className="text-sm text-muted-foreground">
                        {field.institution}
                      </p>
                    )}
                    {field.startDate && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDateRange(
                          field.startDate || "",
                          field.endDate || "",
                          field.current
                        )}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      remove(index);
                      // Update parent with remaining data
                      const currentEducations = form.getValues("educations");
                      const updatedEducations = currentEducations.filter((_, i) => i !== index);
                      onUpdate(updatedEducations as Education[]);
                    }}
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
                            onChange={(e) => {
                              field.onChange(e);
                              onUpdate(form.getValues("educations") as Education[]);
                            }}
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
                            onChange={(e) => {
                              field.onChange(e);
                              onUpdate(form.getValues("educations") as Education[]);
                            }}
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
                            onChange={(e) => {
                              field.onChange(e);
                              onUpdate(form.getValues("educations") as Education[]);
                            }}
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
                            onChange={(e) => {
                              field.onChange(e);
                              onUpdate(form.getValues("educations") as Education[]);
                            }}
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
                          <MonthYearPicker
                            date={field.value ? new Date(field.value + "-01") : null}
                            onSelect={(date) => {
                              const monthString = date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` : "";
                              field.onChange(monthString);
                              onUpdate(form.getValues("educations") as Education[]);
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
                    name={`educations.${index}.endDate`}
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
                              onUpdate(form.getValues("educations") as Education[]);
                            }}
                            placeholder="Select end date"
                            disabled={form.getValues(`educations.${index}.current`)}
                            className="transition-all duration-200 focus:ring-2 focus:ring-orange-500/20"
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
                                  onUpdate(form.getValues("educations") as Education[]);
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
                          onChange={(e) => {
                            field.onChange(e);
                            onUpdate(form.getValues("educations") as Education[]);
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
              </CardContent>
            </Card>
          ))}
        </Form>
      )}
    </div>
  );
}
