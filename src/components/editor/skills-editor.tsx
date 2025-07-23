"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Code, Star } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { Skill } from "@/types/resume";

interface SkillsEditorProps {
  data: Skill[];
  onUpdate: (data: Skill[]) => void;
}

export function SkillsEditor({ data, onUpdate }: SkillsEditorProps) {
  const [newSkillName, setNewSkillName] = useState("");

  const addSkill = () => {
    if (!newSkillName.trim()) return;

    const newSkill: Skill = {
      id: uuidv4(),
      name: newSkillName.trim(),
      level: "Intermediate",
    };
    onUpdate([...data, newSkill]);
    setNewSkillName("");
  };

  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    const updated = data.map((skill) =>
      skill.id === id ? { ...skill, [field]: value } : skill
    );
    onUpdate(updated);
  };

  const removeSkill = (id: string) => {
    onUpdate(data.filter((skill) => skill.id !== id));
  };

  const handleSkillInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const skillLevels = [
    { value: "Beginner", label: "Beginner", stars: 1 },
    { value: "Intermediate", label: "Intermediate", stars: 2 },
    { value: "Advanced", label: "Advanced", stars: 3 },
    { value: "Expert", label: "Expert", stars: 4 },
  ];

  const renderStars = (level: string) => {
    const levelData = skillLevels.find(l => l.value === level);
    const stars = levelData?.stars || 1;
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${i < stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Code className="h-5 w-5" />
            Skills
          </h3>
          <p className="text-sm text-muted-foreground">Add your technical and professional skills</p>
        </div>
        <div className="flex space-x-2">
          <Input
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            onKeyPress={handleSkillInputKeyPress}
            placeholder="Add a skill"
            className="w-48"
          />
          <Button onClick={addSkill} disabled={!newSkillName.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      {data.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No skills added yet</p>
              <Button onClick={addSkill} variant="outline" disabled={!newSkillName.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Skill
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {data.map((skill) => (
            <Card key={skill.id} className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {skill.category || "General"}
                    </Badge>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkill(skill.id)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Skill Name *</Label>
                    <Input
                      value={skill.name}
                      onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
                      placeholder="e.g., JavaScript, React, etc."
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Proficiency Level</Label>
                    <Select
                      value={skill.level}
                      onValueChange={(value) => updateSkill(skill.id, "level", value as Skill['level'])}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {skillLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            <div className="flex items-center gap-2">
                              <span>{level.label}</span>
                              {renderStars(level.value)}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input
                      value={skill.category || ""}
                      onChange={(e) => updateSkill(skill.id, "category", e.target.value)}
                      placeholder="e.g., Programming, Design, etc."
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Level:</span>
                    {renderStars(skill.level)}
                    <span className="text-sm font-medium">{skill.level}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}