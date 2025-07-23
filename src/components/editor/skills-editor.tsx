"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Skills</h3>
          <p className="text-sm text-gray-600">Add your technical and professional skills</p>
        </div>
        <div className="flex space-x-2">
          <Input
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            onKeyPress={handleSkillInputKeyPress}
            placeholder="Add a skill"
            className="w-48"
          />
          <Button onClick={addSkill} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </Button>
        </div>
      </div>

      {data.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No skills added yet</p>
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
            <Card key={skill.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Skill Name</Label>
                      <Input
                        value={skill.name}
                        onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
                        placeholder="e.g., JavaScript, React, etc."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Level</Label>
                      <select
                        value={skill.level}
                        onChange={(e) => updateSkill(skill.id, "level", e.target.value as Skill['level'])}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Category (Optional)</Label>
                      <Input
                        value={skill.category || ""}
                        onChange={(e) => updateSkill(skill.id, "category", e.target.value)}
                        placeholder="e.g., Programming, Design, etc."
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkill(skill.id)}
                    className="text-red-600 hover:text-red-700 ml-4"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}