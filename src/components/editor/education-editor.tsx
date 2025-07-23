"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, GraduationCap, Calendar, Award } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Education } from "@/types/resume";

interface EducationEditorProps {
  data: Education[];
  onUpdate: (data: Education[]) => void;
}

export function EducationEditor({ data, onUpdate }: EducationEditorProps) {
  const addEducation = () => {
    const newEducation: Education = {
      id: uuidv4(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      current: false,
    };
    onUpdate([...data, newEducation]);
  };

  const updateEducation = (id: string, field: keyof Education, value: string | boolean) => {
    const updated = data.map((edu) =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    onUpdate(updated);
  };

  const removeEducation = (id: string) => {
    onUpdate(data.filter((edu) => edu.id !== id));
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
        data.map((education, index) => (
          <Card key={education.id} className="transition-all duration-200 hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-base flex items-center gap-2">
                    Education {index + 1}
                    {education.current && (
                      <Badge variant="secondary" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </CardTitle>
                  {education.degree && education.field && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {education.degree} in {education.field}
                    </p>
                  )}
                  {education.institution && (
                    <p className="text-sm text-muted-foreground">
                      {education.institution}
                    </p>
                  )}
                  {education.startDate && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDateRange(education.startDate, education.endDate, education.current)}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEducation(education.id)}
                  className="text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Institution *</Label>
                  <Input
                    value={education.institution}
                    onChange={(e) => updateEducation(education.id, "institution", e.target.value)}
                    placeholder="University Name"
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Degree *</Label>
                  <Input
                    value={education.degree}
                    onChange={(e) => updateEducation(education.id, "degree", e.target.value)}
                    placeholder="Bachelor's, Master's, etc."
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Field of Study *</Label>
                  <Input
                    value={education.field}
                    onChange={(e) => updateEducation(education.id, "field", e.target.value)}
                    placeholder="Computer Science, Business, etc."
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    GPA
                  </Label>
                  <Input
                    value={education.gpa || ""}
                    onChange={(e) => updateEducation(education.id, "gpa", e.target.value)}
                    placeholder="3.8/4.0"
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Start Date *
                  </Label>
                  <Input
                    type="month"
                    value={education.startDate}
                    onChange={(e) => updateEducation(education.id, "startDate", e.target.value)}
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
                    value={education.endDate || ""}
                    onChange={(e) => updateEducation(education.id, "endDate", e.target.value)}
                    disabled={education.current}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`current-${education.id}`}
                      checked={education.current}
                      onCheckedChange={(checked) => {
                        updateEducation(education.id, "current", checked as boolean);
                        if (checked) {
                          updateEducation(education.id, "endDate", "");
                        }
                      }}
                    />
                    <Label htmlFor={`current-${education.id}`} className="text-sm">
                      Currently studying
                    </Label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={education.description || ""}
                  onChange={(e) => updateEducation(education.id, "description", e.target.value)}
                  placeholder="• Relevant coursework, achievements, activities...&#10;• Academic honors or awards&#10;• Thesis or capstone project details"
                  rows={3}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {education.description?.length || 0}/500 characters
                </p>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}