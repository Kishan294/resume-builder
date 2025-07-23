"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Education</h3>
          <p className="text-sm text-gray-600">Add your educational background</p>
        </div>
        <Button onClick={addEducation} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Education</span>
        </Button>
      </div>

      {data.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No education added yet</p>
              <Button onClick={addEducation} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Your Education
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        data.map((education, index) => (
          <Card key={education.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Education {index + 1}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEducation(education.id)}
                  className="text-red-600 hover:text-red-700"
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
                  />
                </div>
                <div className="space-y-2">
                  <Label>Degree *</Label>
                  <Input
                    value={education.degree}
                    onChange={(e) => updateEducation(education.id, "degree", e.target.value)}
                    placeholder="Bachelor's, Master's, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Field of Study *</Label>
                  <Input
                    value={education.field}
                    onChange={(e) => updateEducation(education.id, "field", e.target.value)}
                    placeholder="Computer Science, Business, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label>GPA</Label>
                  <Input
                    value={education.gpa || ""}
                    onChange={(e) => updateEducation(education.id, "gpa", e.target.value)}
                    placeholder="3.8/4.0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Input
                    type="month"
                    value={education.startDate}
                    onChange={(e) => updateEducation(education.id, "startDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={education.endDate || ""}
                    onChange={(e) => updateEducation(education.id, "endDate", e.target.value)}
                    disabled={education.current}
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`current-${education.id}`}
                      checked={education.current}
                      onChange={(e) => {
                        updateEducation(education.id, "current", e.target.checked);
                        if (e.target.checked) {
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
                  placeholder="Relevant coursework, achievements, activities..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}