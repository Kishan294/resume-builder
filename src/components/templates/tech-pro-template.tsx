"use client";

import { Mail, Phone, MapPin, Globe, ExternalLink, Github, Linkedin, Cpu } from "lucide-react";

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

interface TechProTemplateProps {
  resume: ResumeData;
}

export function TechProTemplate({ resume }: TechProTemplateProps) {
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
    <div className="w-full h-full p-8 text-sm bg-[#fafafa] font-mono text-[#222] leading-tight print:p-8 print:text-[9pt]">
      {/* Side Bar & Main Grid */}
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="md:w-1/3 bg-[#f0f0f0] p-6 rounded-2xl border border-[#ddd]">
          <h1 className="text-3xl font-black mb-1 text-indigo-700 tracking-tighter uppercase leading-none">
            {personalInfo?.fullName || "Dev Name"}
          </h1>
          <p className="text-xs font-bold text-[#666] mb-8 tracking-widest uppercase border-b border-[#ddd] pb-4">
            Software Engineer
          </p>

          <div className="space-y-6">
            <section>
              <h2 className="text-[10pt] font-black uppercase text-indigo-700 mb-3 flex items-center gap-2">
                <Cpu className="h-4 w-4" /> Stack
              </h2>
              <div className="space-y-3">
                {skills.map((skill, index) => (
                  <div key={index}>
                    <h3 className="text-[8pt] font-bold text-[#888] uppercase mb-1">{skill.category}</h3>
                    <div className="flex flex-wrap gap-1">
                      {skill.items.map((item, i) => (
                        <span key={i} className="text-[7pt] bg-white border border-[#ddd] px-1.5 py-0.5 rounded font-bold">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-[10pt] font-black uppercase text-indigo-700 mb-3">Connect</h2>
              <div className="space-y-2 text-[8pt] font-bold">
                {personalInfo?.github && (
                  <div className="flex items-center gap-2">
                    <Github className="h-3 w-3" />
                    <span className="truncate">{personalInfo.github.replace("https://", "")}</span>
                  </div>
                )}
                {personalInfo?.linkedin && (
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-3 w-3" />
                    <span className="truncate">/in/username</span>
                  </div>
                )}
                {personalInfo?.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{personalInfo.email}</span>
                  </div>
                )}
                {personalInfo?.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    <span>{personalInfo.location}</span>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:w-2/3 space-y-8">
          {/* Summary */}
          {personalInfo?.summary && (
            <section>
              <h2 className="text-[10pt] font-black uppercase mb-4 text-[#444] border-b-2 border-indigo-700 inline-block">01. Overview</h2>
              <p className="text-[10pt] leading-relaxed text-[#444]">
                {personalInfo.summary}
              </p>
            </section>
          )}

          {/* Work */}
          {workExperience.length > 0 && (
            <section>
              <h2 className="text-[10pt] font-black uppercase mb-4 text-[#444] border-b-2 border-indigo-700 inline-block">02. Experience</h2>
              <div className="space-y-6">
                {workExperience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-[#eee] pl-4">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-[11pt] tracking-tight">{exp.position}</h3>
                      <span className="text-[8pt] font-bold text-[#999]">
                        {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                      </span>
                    </div>
                    <div className="text-indigo-600 font-bold text-[9pt] mb-2">{exp.company}</div>
                    <p className="text-[9pt] text-[#555] whitespace-pre-line">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section>
              <h2 className="text-[10pt] font-black uppercase mb-4 text-[#444] border-b-2 border-indigo-700 inline-block">03. Repositories</h2>
              <div className="grid grid-cols-1 gap-4">
                {projects.map((project, index) => (
                  <div key={index} className="p-3 bg-white border border-[#ddd] rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-[10pt]">{project.name}</h3>
                      <div className="flex gap-2 text-indigo-500">
                        {project.github && <Github className="h-3 w-3" />}
                        {project.url && <ExternalLink className="h-3 w-3" />}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="text-[7pt] text-indigo-700 font-bold tracking-tight">#{tech.toLowerCase()}</span>
                      ))}
                    </div>
                    <p className="text-[8pt] text-[#666] leading-tight line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2 className="text-[10pt] font-black uppercase mb-4 text-[#444] border-b-2 border-indigo-700 inline-block">04. Education</h2>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-[9pt]">
                      <span className="font-bold">{edu.degree} in {edu.field}</span>
                      <span className="text-[#999]">{formatDate(edu.startDate)}</span>
                    </div>
                    <div className="text-[8.5pt] text-[#666]">{edu.institution}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
