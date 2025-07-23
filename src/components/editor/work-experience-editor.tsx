"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { WorkExperience } from "@/types/resume";

interface WorkExperienceEditorProps {
  data: WorkExperience[];
  onUpdate: (data: WorkExperience[]) => void;
}

export function WorkExperienceEditor({ data, onUpdate }: WorkExperienceEditorProps) {
  const addExperience = () => {
    const newExperience: WorkExperience = {
      id: uuidv4(),
      company: "",
      position: "",
      startDate: "",
      current: false,
      description: "",
    };
    onUpdate([...data, newExperience]);
  };

  const updateExperience = (id: string, field: keyof WorkExperience, value: string | boolean) => {
    const updated = data.map((exp) =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    onUpdate(updated);
  };

  const removeExperience = (id: string) => {
    onUpdate(data.filter((exp) => exp.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Work Experience</h3>
          <p className="text-sm text-gray-600">Add your professional experience</p>
        </div>
        <Button onClick={addExperience} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Experience</span>
        </Button>
      </div>

      {data.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No work experience added yet</p>
              <Button onClick={addExperience} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Experience
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        data.map((experience, index) => (
          <Card key={experience.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Experience {index + 1}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExperience(experience.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company *</Label>
                  <Input
                    value={experience.company}
                    onChange={(e) => updateExperience(experience.id, "company", e.target.value)}
                    placeholder="Company Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Position *</Label>
                  <Input
                    value={experience.position}
                    onChange={(e) => updateExperience(experience.id, "position", e.target.value)}
                    placeholder="Job Title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Input
                    type="month"
                    value={experience.startDate}
                    onChange={(e) => updateExperience(experience.id, "startDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={experience.endDate || ""}
                    onChange={(e) => updateExperience(experience.id, "endDate", e.target.value)}
                    disabled={experience.current}
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`current-${experience.id}`}
                      checked={experience.current}
                      onChange={(e) => {
                        updateExperience(experience.id, "current", e.target.checked);
                        if (e.target.checked) {
                          updateExperience(experience.id, "endDate", "");
                        }
                      }}
                    />
                    <Label htmlFor={`current-${experience.id}`} className="text-sm">
                      I currently work here
                    </Label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={experience.location || ""}
                  onChange={(e) => updateExperience(experience.id, "location", e.target.value)}
                  placeholder="City, State"
                />
              </div>
              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea
                  value={experience.description}
                  onChange={(e) => updateExperience(experience.id, "description", e.target.value)}
                  placeholder="Describe your responsibilities and achievements..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}