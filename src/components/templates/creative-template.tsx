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

interface CreativeTemplateProps {
  resume: ResumeData;
}

export function CreativeTemplate({ resume }: CreativeTemplateProps) {
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
    <div className="w-full h-full bg-white print:p-0 print:text-sm print:h-auto print:max-h-none print:overflow-visible">
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-1/3 bg-gradient-to-b from-purple-600 to-blue-600 text-white p-6 print:p-4">
          {/* Profile Section */}
          <div className="mb-6 print:mb-3">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4 print:w-16 print:h-16 print:mb-2">
              <span className="text-2xl font-bold print:text-lg">
                {personalInfo?.fullName?.split(' ').map(n => n[0]).join('') || 'YN'}
              </span>
            </div>
            <h1 className="text-xl font-bold mb-2 print:text-lg print:mb-1">
              {personalInfo?.fullName || "Your Name"}
            </h1>
          </div>

          {/* Contact Info */}
          <div className="mb-6 print:mb-3">
            <h2 className="text-sm font-semibold mb-3 print:mb-2 uppercase tracking-wide border-b border-white/30 pb-1">
              Contact
            </h2>
            <div className="space-y-2 print:space-y-1 text-sm">
              {personalInfo?.email && (
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-white/20 rounded flex-shrink-0"></span>
                  <span className="text-xs">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo?.phone && (
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-white/20 rounded flex-shrink-0"></span>
                  <span className="text-xs">{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo?.location && (
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-white/20 rounded flex-shrink-0"></span>
                  <span className="text-xs">{personalInfo.location}</span>
                </div>
              )}
              {personalInfo?.website && (
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-white/20 rounded flex-shrink-0"></span>
                  <span className="text-xs">{personalInfo.website}</span>
                </div>
              )}
              {personalInfo?.linkedin && (
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-white/20 rounded flex-shrink-0"></span>
                  <span className="text-xs">LinkedIn</span>
                </div>
              )}
              {personalInfo?.github && (
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-white/20 rounded flex-shrink-0"></span>
                  <span className="text-xs">GitHub</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-6 print:mb-3">
              <h2 className="text-sm font-semibold mb-3 print:mb-2 uppercase tracking-wide border-b border-white/30 pb-1">
                Skills
              </h2>
              <div className="space-y-3 print:space-y-2">
                {skills.map((skillCategory, index) => (
                  <div key={index}>
                    <h3 className="text-xs font-medium mb-1 text-white/90">{skillCategory.category}</h3>
                    <div className="flex flex-wrap gap-1">
                      {skillCategory.items.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="bg-white/20 text-xs px-2 py-1 rounded text-white"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="mb-6 print:mb-3">
              <h2 className="text-sm font-semibold mb-3 print:mb-2 uppercase tracking-wide border-b border-white/30 pb-1">
                Education
              </h2>
              <div className="space-y-3 print:space-y-2">
                {education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="text-xs font-medium text-white">
                      {edu.degree}
                    </h3>
                    <p className="text-xs text-white/80">{edu.field}</p>
                    <p className="text-xs text-white/70">{edu.institution}</p>
                    <p className="text-xs text-white/60">
                      {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                    </p>
                    {edu.gpa && <p className="text-xs text-white/60">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="w-2/3 p-6 print:p-3">
          {/* Professional Summary */}
          {personalInfo?.summary && (
            <div className="mb-6 print:mb-3">
              <h2 className="text-lg font-bold text-gray-900 mb-3 print:mb-2 print:text-base">
                Professional Summary
              </h2>
              <div className="bg-gray-50 p-4 print:p-2 rounded-lg border-l-4 border-purple-500">
                <p className="text-gray-700 leading-relaxed text-sm">{personalInfo.summary}</p>
              </div>
            </div>
          )}

          {/* Work Experience */}
          {workExperience.length > 0 && (
            <div className="mb-6 print:mb-3">
              <h2 className="text-lg font-bold text-gray-900 mb-4 print:mb-2 print:text-base">
                Work Experience
              </h2>
              <div className="space-y-4 print:space-y-2">
                {workExperience.map((exp, index) => (
                  <div key={index} className="relative pl-6 print:pl-4">
                    <div className="absolute left-0 top-2 w-3 h-3 bg-purple-500 rounded-full print:w-2 print:h-2 print:top-1"></div>
                    <div className="absolute left-1.5 top-5 w-0.5 h-full bg-purple-200 print:left-1 print:top-3"></div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4 print:p-2 shadow-sm">
                      <div className="flex justify-between items-start mb-2 print:mb-1">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-base print:text-sm">{exp.position}</h3>
                          <p className="text-purple-600 font-medium">{exp.company}</p>
                        </div>
                        <div className="text-right text-gray-500 text-sm print:text-xs">
                          <p>{formatDateRange(exp.startDate, exp.endDate, exp.current)}</p>
                          {exp.location && <p>{exp.location}</p>}
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed text-sm">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div className="mb-6 print:mb-3">
              <h2 className="text-lg font-bold text-gray-900 mb-4 print:mb-2 print:text-base">
                Projects
              </h2>
              <div className="grid gap-4 print:gap-2">
                {projects.map((project, index) => (
                  <div key={index} className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 print:p-2">
                    <div className="flex justify-between items-start mb-2 print:mb-1">
                      <div>
                        <h3 className="font-semibold text-gray-900">{project.name}</h3>
                        {project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {project.technologies.map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {(project.startDate || project.endDate) && (
                        <p className="text-gray-500 text-sm print:text-xs">
                          {formatDateRange(project.startDate || "", project.endDate)}
                        </p>
                      )}
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm mb-2">{project.description}</p>
                    <div className="flex gap-4 text-sm text-purple-600">
                      {project.url && <span>🔗 Live Demo</span>}
                      {project.github && <span>📁 Source Code</span>}
                    </div>
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
