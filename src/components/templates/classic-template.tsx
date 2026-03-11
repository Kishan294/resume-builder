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

interface ClassicTemplateProps {
  resume: ResumeData;
}

export function ClassicTemplate({ resume }: ClassicTemplateProps) {
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
    <div className="w-full h-full p-8 text-sm bg-white font-serif print:p-4 print:text-xs print:h-auto print:max-h-none print:overflow-visible">
      {/* Header */}
      <div className="text-center border-b-2 border-indigo-600 pb-4 mb-6 print:pb-2 print:mb-3">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 uppercase tracking-wide print:text-xl print:mb-1">
          {personalInfo?.fullName || "Your Name"}
        </h1>

        <div className="text-gray-700 space-y-1">
          {personalInfo?.email && <div>{personalInfo.email}</div>}
          <div className="flex justify-center gap-4">
            {personalInfo?.phone && <span>{personalInfo.phone}</span>}
            {personalInfo?.location && <span>{personalInfo.location}</span>}
          </div>
          <div className="flex justify-center gap-4">
            {personalInfo?.website && <span>{personalInfo.website}</span>}
            {personalInfo?.linkedin && <span>LinkedIn Profile</span>}
            {personalInfo?.github && <span>GitHub Profile</span>}
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      {personalInfo?.summary && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-indigo-700 mb-2 uppercase tracking-wide border-b border-indigo-600">
            Objective
          </h2>
          <p className="text-gray-800 leading-relaxed text-justify">{personalInfo.summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-indigo-700 mb-2 uppercase tracking-wide border-b border-indigo-600">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {workExperience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-gray-900">{exp.position}</h3>
                    <p className="font-semibold text-indigo-700">{exp.company}</p>
                  </div>
                  <div className="text-right text-gray-700">
                    <p>{formatDateRange(exp.startDate, exp.endDate, exp.current)}</p>
                    {exp.location && <p className="text-sm">{exp.location}</p>}
                  </div>
                </div>
                <p className="text-gray-800 leading-relaxed text-justify">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-indigo-700 mb-2 uppercase tracking-wide border-b border-indigo-600">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {edu.degree} in {edu.field}
                    </h3>
                    <p className="font-semibold text-indigo-700">{edu.institution}</p>
                    {edu.gpa && <p className="text-sm text-gray-700">GPA: {edu.gpa}</p>}
                  </div>
                  <p className="text-gray-700">
                    {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                  </p>
                </div>
                {edu.description && (
                  <p className="text-gray-800 text-sm leading-relaxed text-justify">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-indigo-700 mb-2 uppercase tracking-wide border-b border-indigo-600">
            Technical Skills
          </h2>
          <div className="space-y-1">
            {skills.map((skillCategory, index) => (
              <div key={index}>
                <span className="font-bold text-gray-900">{skillCategory.category}: </span>
                <span className="text-gray-800">{skillCategory.items.join(", ")}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-indigo-700 mb-2 uppercase tracking-wide border-b border-indigo-600">
            Projects
          </h2>
          <div className="space-y-4">
            {projects.map((project, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-gray-900">{project.name}</h3>
                    {project.technologies.length > 0 && (
                      <p className="text-sm text-gray-700 italic">
                        Technologies: {project.technologies.join(", ")}
                      </p>
                    )}
                  </div>
                  {(project.startDate || project.endDate) && (
                    <p className="text-gray-700 text-sm">
                      {formatDateRange(project.startDate || "", project.endDate)}
                    </p>
                  )}
                </div>
                <p className="text-gray-800 leading-relaxed text-justify mb-1">{project.description}</p>
                <div className="flex gap-4 text-sm text-gray-700">
                  {project.url && <span>URL: {project.url}</span>}
                  {project.github && <span>Repository: {project.github}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
