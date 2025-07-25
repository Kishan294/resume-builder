"use client";

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

interface MinimalTemplateProps {
  resume: ResumeData;
}

export function MinimalTemplate({ resume }: MinimalTemplateProps) {
  const { personalInfo, workExperience = [], education = [], skills = [], projects = [] } = resume;

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
    <div className="w-full h-full p-6 text-sm bg-white print:p-6 print:text-sm print:h-auto print:max-h-none print:overflow-visible">
      {/* Header - Minimal centered design */}
      <div className="text-center mb-6 print:mb-6">
        <h1 className="text-2xl font-light text-gray-900 mb-2 print:text-2xl print:mb-2 tracking-wide">
          {personalInfo?.fullName || "Your Name"}
        </h1>

        <div className="text-gray-600 space-y-1">
          <div className="flex justify-center items-center space-x-4 text-sm">
            {personalInfo?.email && <span>{personalInfo.email}</span>}
            {personalInfo?.phone && <span>•</span>}
            {personalInfo?.phone && <span>{personalInfo.phone}</span>}
            {personalInfo?.location && <span>•</span>}
            {personalInfo?.location && <span>{personalInfo.location}</span>}
          </div>
          <div className="flex justify-center items-center space-x-4 text-sm">
            {personalInfo?.website && <span>{personalInfo.website}</span>}
            {personalInfo?.linkedin && personalInfo?.website && <span>•</span>}
            {personalInfo?.linkedin && <span>LinkedIn</span>}
            {personalInfo?.github && (personalInfo?.linkedin || personalInfo?.website) && <span>•</span>}
            {personalInfo?.github && <span>GitHub</span>}
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      {personalInfo?.summary && (
        <div className="mb-6 print:mb-3">
          <p className="text-gray-700 leading-relaxed text-center italic border-l-2 border-gray-300 pl-4">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <div className="mb-6 print:mb-3">
          <h2 className="text-base font-light text-gray-900 mb-4 print:mb-2 uppercase tracking-widest">
            Experience
          </h2>
          <div className="space-y-4 print:space-y-2">
            {workExperience.map((exp, index) => (
              <div key={index} className="border-l-2 border-gray-200 pl-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-medium text-gray-900">{exp.position}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                  </div>
                  <div className="text-right text-gray-500 text-xs">
                    <p>{formatDateRange(exp.startDate, exp.endDate, exp.current)}</p>
                    {exp.location && <p>{exp.location}</p>}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6 print:mb-3">
          <h2 className="text-base font-light text-gray-900 mb-4 print:mb-2 uppercase tracking-widest">
            Education
          </h2>
          <div className="space-y-3 print:space-y-2">
            {education.map((edu, index) => (
              <div key={index} className="border-l-2 border-gray-200 pl-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {edu.degree} in {edu.field}
                    </h3>
                    <p className="text-gray-600">{edu.institution}</p>
                    {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
                  </div>
                  <p className="text-gray-500 text-xs">
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
        <div className="mb-6 print:mb-3">
          <h2 className="text-base font-light text-gray-900 mb-4 print:mb-2 uppercase tracking-widest">
            Skills
          </h2>
          <div className="grid grid-cols-1 gap-2">
            {skills.map((skillCategory, index) => (
              <div key={index} className="flex">
                <span className="font-medium text-gray-900 w-24 flex-shrink-0">{skillCategory.category}:</span>
                <span className="text-gray-700">{skillCategory.items.join(" • ")}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-6 print:mb-3">
          <h2 className="text-base font-light text-gray-900 mb-4 print:mb-2 uppercase tracking-widest">
            Projects
          </h2>
          <div className="space-y-4 print:space-y-2">
            {projects.map((project, index) => (
              <div key={index} className="border-l-2 border-gray-200 pl-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-medium text-gray-900">{project.name}</h3>
                    {project.technologies.length > 0 && (
                      <p className="text-sm text-gray-500">
                        {project.technologies.join(" • ")}
                      </p>
                    )}
                  </div>
                  {(project.startDate || project.endDate) && (
                    <p className="text-gray-500 text-xs">
                      {formatDateRange(project.startDate || "", project.endDate)}
                    </p>
                  )}
                </div>
                <p className="text-gray-700 leading-relaxed text-sm mb-1">{project.description}</p>
                <div className="flex gap-4 text-xs text-gray-500">
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
