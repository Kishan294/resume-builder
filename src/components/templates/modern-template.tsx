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
  const { personalInfo, workExperience = [], education = [], skills = [], projects = [] } = resume;

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString + "-01");
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  const formatDateRange = (startDate: string, endDate?: string, current?: boolean) => {
    const start = formatDate(startDate);
    if (current) return `${start} — Present`;
    if (endDate) return `${start} — ${formatDate(endDate)}`;
    return start;
  };

  return (
    <div className="w-full h-full p-8 text-sm bg-white font-sans text-slate-800 leading-relaxed print:p-8 print:text-[10pt]">
      {/* Header Section */}
      <div className="flex flex-col mb-8 border-b-2 border-slate-100 pb-6">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          {personalInfo?.fullName || "Full Name"}
        </h1>
        
        <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-slate-600 font-medium">
          {personalInfo?.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-indigo-500" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo?.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-indigo-500" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo?.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-indigo-500" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo?.linkedin && (
            <div className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-indigo-500" />
              <span>LinkedIn</span>
            </div>
          )}
          {personalInfo?.github && (
            <div className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-indigo-500" />
              <span>GitHub</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {personalInfo?.summary && (
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 mb-3">
            Professional Profile
          </h2>
          <p className="text-slate-700 text-[10.5pt] leading-relaxed italic border-l-4 border-indigo-50 pl-4 py-1">
            {personalInfo.summary}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        {/* Experience Section */}
        {workExperience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 mb-5 flex items-center gap-3">
              Experience
              <div className="h-px bg-slate-100 flex-1"></div>
            </h2>
            <div className="space-y-6">
              {workExperience.map((exp, index) => (
                <div key={index} className="relative">
                  <div className="flex justify-between items-baseline mb-1.5">
                    <h3 className="font-bold text-slate-900 text-lg">
                      {exp.position}
                    </h3>
                    <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded">
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-indigo-600 text-sm">{exp.company}</span>
                    <span className="text-xs text-slate-400 italic">{exp.location}</span>
                  </div>
                  <p className="text-slate-600 text-[10pt] whitespace-pre-line leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education & Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 mb-5 flex items-center gap-3">
                Education
                <div className="h-px bg-slate-100 flex-1"></div>
              </h2>
              <div className="space-y-5">
                {education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-bold text-slate-900 leading-tight mb-1">
                      {edu.degree}
                    </h3>
                    <p className="text-indigo-600 font-semibold text-xs mb-1">
                      {edu.institution}, {edu.field}
                    </p>
                    <div className="flex justify-between text-[9pt] text-slate-500">
                      <span>{formatDateRange(edu.startDate, edu.endDate, edu.current)}</span>
                      {edu.gpa && <span>GPA: {edu.gpa}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 mb-5 flex items-center gap-3">
                Expertise
                <div className="h-px bg-slate-100 flex-1"></div>
              </h2>
              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <div key={index}>
                    <h4 className="text-[10pt] font-bold text-slate-800 mb-1">{skill.category}</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {skill.items.map((item, i) => (
                        <span key={i} className="text-[9pt] bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Projects */}
        {projects.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 mb-5 flex items-center gap-3">
              Projects
              <div className="h-px bg-slate-100 flex-1"></div>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <div key={index} className="p-4 bg-slate-50/50 rounded-lg border border-slate-100">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900 leading-tight">
                      {project.name}
                    </h3>
                    {(project.url || project.github) && (
                      <div className="flex gap-2">
                        {project.url && <ExternalLink className="h-3 w-3 text-indigo-500" />}
                        {project.github && <Globe className="h-3 w-3 text-indigo-500" />}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {project.technologies.slice(0, 3).map((tech, i) => (
                      <span key={i} className="text-[8pt] text-indigo-600 font-bold uppercase tracking-wider">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="text-slate-600 text-[9pt] line-clamp-2">
                    {project.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
