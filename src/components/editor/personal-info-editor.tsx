"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PersonalInfo } from "@/types/resume";

interface PersonalInfoEditorProps {
  data: PersonalInfo;
  onUpdate: (data: PersonalInfo) => void;
}

export function PersonalInfoEditor({ data, onUpdate }: PersonalInfoEditorProps) {
  const handleChange = (field: string, value: string) => {
    onUpdate({
      ...data,
      [field]: value,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Add your basic contact information and professional summary
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={data.fullName || ""}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={data.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="john@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={data.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={data.location || ""}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="New York, NY"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={data.website || ""}
              onChange={(e) => handleChange("website", e.target.value)}
              placeholder="https://johndoe.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={data.linkedin || ""}
              onChange={(e) => handleChange("linkedin", e.target.value)}
              placeholder="https://linkedin.com/in/johndoe"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="github">GitHub</Label>
          <Input
            id="github"
            value={data.github || ""}
            onChange={(e) => handleChange("github", e.target.value)}
            placeholder="https://github.com/johndoe"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="summary">Professional Summary</Label>
          <Textarea
            id="summary"
            value={data.summary || ""}
            onChange={(e) => handleChange("summary", e.target.value)}
            placeholder="Write a brief professional summary highlighting your key skills and experience..."
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
}