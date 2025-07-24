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

interface CompactTemplateProps {
  resume: ResumeData;
}

export function CompactTemplate({ resume }: CompactTemplateProps) {
  const { personalInfo, workExperience = [], education = [], skills = [], projects = [] } = resume;

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString + "-01");
    return date.toLocaleDateString("en-US", { year: "2-digit", month: "short" });
  };

  const formatDateRange = (startDate: string, endDate?: string, current?: boolean) => {
    const start = formatDate(startDate);
    if (current) return `${start} - Now`;
    if (endDate) return `${start} - ${formatDate(endDate)}`;
    return start;
  };

  return (
    <div className="w-full h-full p-6 text-xs bg-white print:p-6 print:text-xs print:h-auto print:max-h-none print:overflow-visible leading-tight">
      {/* Header - Compact */}
      <div className="mb-4 print:mb-4">
        <h1 className="text-xl font-bold text-gray-900 mb-1 print:text-xl print:mb-1">
          {personalInfo?.fullName || "Your Name"}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-gray-600 text-xs">
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span>•</span>}
          {personalInfo?.phone && <span>{personalInfo.phone}</span>}
          {personalInfo?.location && <span>•</span>}
          {personalInfo?.location && <span>{personalInfo.location}</span>}
          {personalInfo?.website && <span>•</span>}
          {personalInfo?.website && <span>{personalInfo.website}</span>}
          {personalInfo?.linkedin && <span>•</span>}
          {personalInfo?.linkedin && <span>LinkedIn</span>}
          {personalInfo?.github && <span>•</span>}
          {personalInfo?.github && <span>GitHub</span>}
        </div>
      </div>

      {/* Professional Summary - Compact */}
      {personalInfo?.summary && (
        <div className="mb-4 print:mb-2">
          <h2 className="text-sm font-bold text-gray-900 mb-1 uppercase">Summary</h2>
          <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      {/* Two Column Layout for maximum space efficiency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 print:gap-2">
        {/* Left Column */}
        <div className="space-y-4 print:space-y-2">
          {/* Work Experience - Compact */}
          {workExperience.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-2 print:mb-1 uppercase border-b border-gray-300 pb-1">
                Experience
              </h2>
              <div className="space-y-3 print:space-y-1">
                {workExperience.map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 leading-tight">{exp.position}</h3>
                        <p className="text-gray-700 font-medium">{exp.company}</p>
                      </div>
                      <div className="text-right text-gray-600 text-xs ml-2">
                        <p>{formatDateRange(exp.startDate, exp.endDate, exp.current)}</p>
                        {exp.location && <p>{exp.location}</p>}
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-xs">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects - Compact */}
          {projects.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-2 print:mb-1 uppercase border-b border-gray-300 pb-1">
                Projects
              </h2>
              <div className="space-y-2 print:space-y-1">
                {projects.map((project, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-gray-900 flex-1">{project.name}</h3>
                      {(project.startDate || project.endDate) && (
                        <p className="text-gray-600 text-xs ml-2">
                          {formatDateRange(project.startDate || "", project.endDate)}
                        </p>
                      )}
                    </div>
                    {project.technologies.length > 0 && (
                      <p className="text-gray-600 text-xs mb-1">
                        <span className="font-medium">Tech:</span> {project.technologies.join(", ")}
                      </p>
                    )}
                    <p className="text-gray-700 leading-relaxed text-xs mb-1">{project.description}</p>
                    <div className="flex gap-3 text-xs text-gray-600">
                      {project.url && <span>🔗 {project.url}</span>}
                      {project.github && <span>📁 {project.github}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4 print:space-y-2">
          {/* Skills - Compact */}
          {skills.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-2 print:mb-1 uppercase border-b border-gray-300 pb-1">
                Skills
              </h2>
              <div className="space-y-2 print:space-y-1">
                {skills.map((skillCategory, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-900 text-xs mb-1">{skillCategory.category}</h3>
                    <p className="text-gray-700 text-xs leading-relaxed">
                      {skillCategory.items.join(" • ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education - Compact */}
          {education.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-2 print:mb-1 uppercase border-b border-gray-300 pb-1">
                Education
              </h2>
              <div className="space-y-2 print:space-y-1">
                {education.map((edu, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-xs leading-tight">
                          {edu.degree} in {edu.field}
                        </h3>
                        <p className="text-gray-700 text-xs">{edu.institution}</p>
                      </div>
                      <div className="text-right text-gray-600 text-xs ml-2">
                        <p>{formatDateRange(edu.startDate, edu.endDate, edu.current)}</p>
                        {edu.gpa && <p>GPA: {edu.gpa}</p>}
                      </div>
                    </div>
                    {edu.description && (
                      <p className="text-gray-700 text-xs leading-relaxed">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info Section for compact layout */}
          <div className="bg-gray-50 p-3 print:p-2 rounded border">
            <h2 className="text-sm font-bold text-gray-900 mb-2 print:mb-1 uppercase">
              Quick Facts
            </h2>
            <div className="space-y-1 text-xs text-gray-700">
              <p>• Available for immediate start</p>
              <p>• Open to remote opportunities</p>
              <p>• Strong communication skills</p>
              <p>• Team player with leadership experience</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}