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

interface ProfessionalTemplateProps {
  resume: ResumeData;
}

export function ProfessionalTemplate({ resume }: ProfessionalTemplateProps) {
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
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 print:p-4 -mx-6 print:-mx-6 mb-4 print:mb-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-2 print:text-2xl print:mb-2">
            {personalInfo?.fullName || "Your Name"}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2 text-gray-300">
            <div className="space-y-1">
              {personalInfo?.email && (
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-gray-700 rounded"></span>
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo?.phone && (
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-gray-700 rounded"></span>
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo?.location && (
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-gray-700 rounded"></span>
                  <span>{personalInfo.location}</span>
                </div>
              )}
            </div>
            <div className="space-y-1">
              {personalInfo?.website && (
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-gray-700 rounded"></span>
                  <span>{personalInfo.website}</span>
                </div>
              )}
              {personalInfo?.linkedin && (
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-gray-700 rounded"></span>
                  <span>LinkedIn Profile</span>
                </div>
              )}
              {personalInfo?.github && (
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-gray-700 rounded"></span>
                  <span>GitHub Profile</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      {personalInfo?.summary && (
        <div className="mb-6 print:mb-3">
          <h2 className="text-lg font-bold text-gray-900 mb-3 print:mb-2 print:text-base uppercase tracking-wide border-b-2 border-gray-900 pb-1">
            Executive Summary
          </h2>
          <div className="bg-gray-50 border-l-4 border-gray-900 p-4 print:p-2">
            <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:gap-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6 print:space-y-3">
          {/* Work Experience */}
          {workExperience.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 print:mb-2 print:text-base uppercase tracking-wide border-b-2 border-gray-900 pb-1">
                Professional Experience
              </h2>
              <div className="space-y-4 print:space-y-2">
                {workExperience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-gray-300 pl-4 print:pl-2">
                    <div className="flex justify-between items-start mb-2 print:mb-1">
                      <div>
                        <h3 className="text-base font-bold text-gray-900 print:text-sm">{exp.position}</h3>
                        <p className="text-gray-700 font-semibold">{exp.company}</p>
                        {exp.location && <p className="text-gray-600 text-sm">{exp.location}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-gray-600 font-medium text-sm">
                          {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 p-3 print:p-2 rounded">
                      <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 print:mb-2 print:text-base uppercase tracking-wide border-b-2 border-gray-900 pb-1">
                Key Projects
              </h2>
              <div className="space-y-4 print:space-y-2">
                {projects.map((project, index) => (
                  <div key={index} className="border border-gray-300 rounded p-4 print:p-2">
                    <div className="flex justify-between items-start mb-2 print:mb-1">
                      <div>
                        <h3 className="font-bold text-gray-900">{project.name}</h3>
                        {project.technologies.length > 0 && (
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Technologies:</span> {project.technologies.join(", ")}
                          </p>
                        )}
                      </div>
                      {(project.startDate || project.endDate) && (
                        <p className="text-gray-600 text-sm">
                          {formatDateRange(project.startDate || "", project.endDate)}
                        </p>
                      )}
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-2">{project.description}</p>
                    <div className="flex gap-4 text-sm">
                      {project.url && (
                        <span className="text-gray-600">
                          <span className="font-medium">Live:</span> {project.url}
                        </span>
                      )}
                      {project.github && (
                        <span className="text-gray-600">
                          <span className="font-medium">Code:</span> {project.github}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6 print:space-y-3">
          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 print:mb-2 print:text-base uppercase tracking-wide border-b-2 border-gray-900 pb-1">
                Core Competencies
              </h2>
              <div className="space-y-4 print:space-y-2">
                {skills.map((skillCategory, index) => (
                  <div key={index} className="bg-gray-50 p-3 print:p-2 rounded border">
                    <h3 className="font-bold text-gray-900 mb-2 print:mb-1 text-sm uppercase">
                      {skillCategory.category}
                    </h3>
                    <div className="space-y-1">
                      {skillCategory.items.map((skill, skillIndex) => (
                        <div key={skillIndex} className="flex items-center">
                          <div className="w-2 h-2 bg-gray-900 rounded-full mr-2 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 print:mb-2 print:text-base uppercase tracking-wide border-b-2 border-gray-900 pb-1">
                Education
              </h2>
              <div className="space-y-4 print:space-y-2">
                {education.map((edu, index) => (
                  <div key={index} className="bg-gray-50 p-3 print:p-2 rounded border">
                    <h3 className="font-bold text-gray-900 text-sm">
                      {edu.degree}
                    </h3>
                    <p className="text-gray-700 font-medium text-sm">{edu.field}</p>
                    <p className="text-gray-600 text-sm">{edu.institution}</p>
                    <p className="text-gray-500 text-xs">
                      {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                    </p>
                    {edu.gpa && (
                      <p className="text-gray-600 text-xs mt-1">GPA: {edu.gpa}</p>
                    )}
                    {edu.description && (
                      <p className="text-gray-700 text-xs mt-2 leading-relaxed">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}