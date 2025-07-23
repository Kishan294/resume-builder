"use client";

import { Mail, Phone, MapPin, Globe, ExternalLink } from "lucide-react";

interface ResumeData {
  personalInfo: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
    linkedin?: string;
    github?: string;
    summary?: string;
  };
  workExperience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string;
    location?: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    gpa?: string;
    description?: string;
  }>;
  skills: Array<{
    category: string;
    items: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    github?: string;
    startDate?: string;
    endDate?: string;
  }>;
}

interface ModernTemplateProps {
  resume: ResumeData;
}

export function ModernTemplate({ resume }: ModernTemplateProps) {
  const { personalInfo, workExperience, education, skills, projects } = resume;

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString + "-01");
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  const formatDateRange = (startDate: string, endDate?: string, current?: boolean) => {
    const start = formatDate(startDate);
    if (current) return `${start} - Present`;
    if (endDate) return `${start} - ${formatDate(endDate)}`;
    return start;
  };

  return (
    <div className="w-full h-full p-8 text-sm bg-white">
      {/* Header */}
      <div className="border-b-2 border-primary pb-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {personalInfo?.fullName || "Your Name"}
        </h1>

        <div className="flex flex-wrap gap-4 text-gray-600">
          {personalInfo?.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo?.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo?.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo?.website && (
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span>{personalInfo.website}</span>
            </div>
          )}
          {personalInfo?.linkedin && (
            <div className="flex items-center gap-1">
              <ExternalLink className="h-4 w-4" />
              <span>LinkedIn</span>
            </div>
          )}
          {personalInfo?.github && (
            <div className="flex items-center gap-1">
              <ExternalLink className="h-4 w-4" />
              <span>GitHub</span>
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {personalInfo?.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-primary mb-3 border-b border-gray-200 pb-1">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-primary mb-3 border-b border-gray-200 pb-1">
            Work Experience
          </h2>
          <div className="space-y-4">
            {workExperience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-primary font-medium">{exp.company}</p>
                  </div>
                  <div className="text-right text-gray-600">
                    <p>{formatDateRange(exp.startDate, exp.endDate, exp.current)}</p>
                    {exp.location && <p className="text-sm">{exp.location}</p>}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-primary mb-3 border-b border-gray-200 pb-1">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {edu.degree} in {edu.field}
                    </h3>
                    <p className="text-primary font-medium">{edu.institution}</p>
                    {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                  </div>
                  <p className="text-gray-600">
                    {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                  </p>
                </div>
                {edu.description && (
                  <p className="text-gray-700 text-sm leading-relaxed">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-primary mb-3 border-b border-gray-200 pb-1">
            Skills
          </h2>
          <div className="space-y-2">
            {skills.map((skillCategory, index) => (
              <div key={index}>
                <span className="font-medium text-gray-900">{skillCategory.category}: </span>
                <span className="text-gray-700">{skillCategory.items.join(", ")}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-primary mb-3 border-b border-gray-200 pb-1">
            Projects
          </h2>
          <div className="space-y-4">
            {projects.map((project, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-semibold text-gray-900">{project.name}</h3>
                    {project.technologies.length > 0 && (
                      <p className="text-sm text-primary">
                        {project.technologies.join(", ")}
                      </p>
                    )}
                  </div>
                  {(project.startDate || project.endDate) && (
                    <p className="text-gray-600 text-sm">
                      {formatDateRange(project.startDate || "", project.endDate)}
                    </p>
                  )}
                </div>
                <p className="text-gray-700 leading-relaxed mb-1">{project.description}</p>
                <div className="flex gap-4 text-sm text-gray-600">
                  {project.url && <span>Live: {project.url}</span>}
                  {project.github && <span>Code: {project.github}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}