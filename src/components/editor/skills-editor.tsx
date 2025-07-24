"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Code, Plus, X, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

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
  const [newSkillInputs, setNewSkillInputs] = useState<{ [categoryId: string]: string }>({});

  const addCategory = () => {
    const newCategory: SkillCategory = {
      id: uuidv4(),
      category: "New Category",
      items: [],
    };
    onUpdate([...data, newCategory]);
  };

  const updateCategory = (categoryId: string, newCategoryName: string) => {
    const updatedData = data.map(category =>
      category.id === categoryId
        ? { ...category, category: newCategoryName }
        : category
    );
    onUpdate(updatedData);
  };

  const deleteCategory = (categoryId: string) => {
    const updatedData = data.filter(category => category.id !== categoryId);
    onUpdate(updatedData);
  };

  const addSkill = (categoryId: string) => {
    const skillName = newSkillInputs[categoryId]?.trim();
    if (!skillName) return;

    const updatedData = data.map(category =>
      category.id === categoryId
        ? { ...category, items: [...category.items, skillName] }
        : category
    );
    onUpdate(updatedData);

    // Clear the input
    setNewSkillInputs(prev => ({ ...prev, [categoryId]: "" }));
  };

  const removeSkill = (categoryId: string, skillIndex: number) => {
    const updatedData = data.map(category =>
      category.id === categoryId
        ? { ...category, items: category.items.filter((_, index) => index !== skillIndex) }
        : category
    );
    onUpdate(updatedData);
  };

  const handleSkillInputChange = (categoryId: string, value: string) => {
    setNewSkillInputs(prev => ({ ...prev, [categoryId]: value }));
  };

  const handleSkillInputKeyPress = (categoryId: string, e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(categoryId);
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
        <div className="space-y-4">
          {data.map((category) => (
            <Card key={category.id} className="shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Input
                      value={category.category}
                      onChange={(e) => updateCategory(category.id, e.target.value)}
                      className="text-lg font-semibold border-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                      placeholder="Category name"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteCategory(category.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {/* Skills List */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {category.items.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center space-x-1 px-3 py-1"
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => removeSkill(category.id, index)}
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
                      value={newSkillInputs[category.id] || ""}
                      onChange={(e) => handleSkillInputChange(category.id, e.target.value)}
                      onKeyPress={(e) => handleSkillInputKeyPress(category.id, e)}
                    />
                  </div>
                  <Button
                    onClick={() => addSkill(category.id)}
                    disabled={!newSkillInputs[category.id]?.trim()}
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
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