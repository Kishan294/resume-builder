"use client";

import { Mail, Phone, MapPin, ExternalLink, Linkedin } from "lucide-react";

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

interface ExecutiveTemplateProps {
  resume: ResumeData;
}

export function ExecutiveTemplate({ resume }: ExecutiveTemplateProps) {
  const { personalInfo, workExperience = [], education = [], skills = [], projects = [] } = resume;

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString + "-01");
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  };

  const formatDateRange = (startDate: string, endDate?: string, current?: boolean) => {
    const start = formatDate(startDate);
    if (current) return `${start.toUpperCase()} — PRESENT`;
    if (endDate) return `${start.toUpperCase()} — ${formatDate(endDate).toUpperCase()}`;
    return start.toUpperCase();
  };

  return (
    <div className="w-full h-full p-12 text-sm bg-white font-serif text-slate-900 leading-relaxed print:p-12 print:text-[11pt]">
      {/* Header - Centered & Authoritative */}
      <header className="text-center mb-10 pb-8 border-b border-slate-900">
        <h1 className="text-4xl font-bold uppercase tracking-[0.15em] mb-4 text-slate-950">
          {personalInfo?.fullName || "Full Name"}
        </h1>
        
        <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 text-[9pt] font-sans font-bold uppercase tracking-widest text-slate-600">
          {personalInfo?.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo?.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="h-3 w-3" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo?.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="h-3 w-3" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo?.linkedin && (
            <div className="flex items-center gap-1.5">
              <Linkedin className="h-3 w-3" />
              <span>LINKEDIN</span>
            </div>
          )}
        </div>
      </header>

      {/* Summary - High Impact */}
      {personalInfo?.summary && (
        <section className="mb-10">
          <p className="text-lg text-slate-800 leading-snug font-medium max-w-4xl mx-auto text-justify">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Experience - The Core */}
      {workExperience.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-bold uppercase tracking-[0.3em] border-b border-slate-200 pb-2 mb-6 text-slate-950">
            Professional Experience
          </h2>
          <div className="space-y-8">
            {workExperience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-lg font-bold text-slate-950 capitalize italic">
                    {exp.position}
                  </h3>
                  <span className="text-[9pt] font-sans font-extrabold text-slate-500 tracking-tighter">
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline mb-3">
                  <span className="font-sans font-bold text-slate-700 uppercase tracking-wider text-xs">
                    {exp.company}
                  </span>
                  <span className="text-[9pt] text-slate-400 italic font-sans">{exp.location}</span>
                </div>
                <div className="text-slate-700 text-[10.5pt] whitespace-pre-line leading-relaxed pl-4 border-l border-slate-100">
                  {exp.description}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills & Education Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] border-b border-slate-200 pb-2 mb-6 text-slate-950">
              Education
            </h2>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <div key={index}>
                  <h3 className="font-bold text-slate-950 text-base mb-1">
                    {edu.degree}
                  </h3>
                  <p className="font-sans font-bold text-slate-600 uppercase tracking-widest text-[8pt] mb-2">
                    {edu.institution} | {edu.field}
                  </p>
                  <div className="flex justify-between font-sans text-[8pt] font-bold text-slate-400">
                    <span>{formatDateRange(edu.startDate, edu.endDate, edu.current)}</span>
                    {edu.gpa && <span>GPA: {edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Core Competencies */}
        {skills.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] border-b border-slate-200 pb-2 mb-6 text-slate-950">
              Core Competencies
            </h2>
            <div className="grid grid-cols-1 gap-4 font-sans">
              {skills.map((skill, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <span className="text-[8pt] font-black uppercase tracking-widest text-slate-400 mt-1 min-w-[80px]">
                    {skill.category}
                  </span>
                  <p className="text-[9.5pt] text-slate-700 font-medium">
                    {skill.items.join(" • ")}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Projects - Optional but professional */}
      {projects.length > 0 && (
        <section className="mt-12">
          <h2 className="text-sm font-bold uppercase tracking-[0.3em] border-b border-slate-200 pb-2 mb-6 text-slate-950">
            Selected Board & Advisory Work
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {projects.map((project, index) => (
              <div key={index} className="flex flex-col gap-1">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-slate-900">{project.name}</h3>
                  <div className="flex gap-2">
                    {project.url && <ExternalLink className="h-3 w-3 text-slate-400" />}
                  </div>
                </div>
                <p className="text-slate-600 text-[10pt] italic">
                  {project.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
