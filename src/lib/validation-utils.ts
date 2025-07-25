import { ZodError } from "zod";
import { toast } from "sonner";

export interface ValidationError {
  field: string;
  message: string;
  section: string;
  index?: number;
}

export function formatValidationErrors(
  error: ZodError,
  sectionName: string
): ValidationError[] {
  const errors: ValidationError[] = [];

  error.issues.forEach((err) => {
    const path = err.path;
    let field = "";
    let index: number | undefined;

    if (path.length > 0) {
      // Handle array fields like "experiences.0.company"
      if (path.length >= 2 && typeof path[1] === "number") {
        index = path[1];
        field = path[2] as string;
      } else {
        field = path[path.length - 1] as string;
      }

      errors.push({
        field: formatFieldName(field),
        message: err.message,
        section: sectionName,
        index,
      });
    }
  });

  return errors;
}

function formatFieldName(field: string): string {
  const fieldMap: Record<string, string> = {
    fullName: "Full Name",
    email: "Email",
    phone: "Phone",
    location: "Location",
    website: "Website",
    linkedin: "LinkedIn",
    github: "GitHub",
    summary: "Summary",
    company: "Company",
    position: "Position",
    startDate: "Start Date",
    endDate: "End Date",
    description: "Description",
    institution: "Institution",
    degree: "Degree",
    field: "Field of Study",
    gpa: "GPA",
    category: "Category Name",
    items: "Skills",
    name: "Project Name",
    technologies: "Technologies",
    url: "Project URL",
  };

  return fieldMap[field] || field;
}

export function showValidationErrors(errors: ValidationError[]) {
  if (errors.length === 0) return;

  // Group errors by section and index
  const groupedErrors: Record<string, ValidationError[]> = {};

  errors.forEach((error) => {
    const key =
      error.index !== undefined
        ? `${error.section}-${error.index}`
        : error.section;

    if (!groupedErrors[key]) {
      groupedErrors[key] = [];
    }
    groupedErrors[key].push(error);
  });

  // Show toast for each group
  Object.entries(groupedErrors).forEach(([key, groupErrors]) => {
    const [section, indexStr] = key.split("-");
    const index = indexStr ? parseInt(indexStr) : undefined;

    const sectionName = formatSectionName(section);
    const itemNumber = index !== undefined ? ` #${index + 1}` : "";

    const errorMessages = groupErrors
      .map((err) => `• ${err.field}: ${err.message}`)
      .join("\n");

    toast.error(`${sectionName}${itemNumber} - Missing Required Fields`, {
      description: errorMessages,
      duration: 10000,
      action: {
        label: "Fix Now",
        onClick: () => {
          // This will be handled by the tab switching in resume editor
        },
      },
    });
  });
}

function getFieldPath(error: ValidationError): string {
  const fieldKey = error.field.toLowerCase().replace(/\s+/g, "");

  // Map field names to actual form field names
  const fieldMapping: Record<string, string> = {
    fullname: "fullName",
    fieldofstudy: "field",
    categoryname: "category",
    projectname: "name",
    projecturl: "url",
    startdate: "startDate",
    enddate: "endDate",
  };

  const mappedField = fieldMapping[fieldKey] || fieldKey;

  return error.index !== undefined
    ? `${error.section}.${error.index}.${mappedField}`
    : `${error.section}.${mappedField}`;
}

export function getValidationSummary(errors: ValidationError[]): string {
  if (errors.length === 0) return "";

  const groupedErrors: Record<string, ValidationError[]> = {};

  errors.forEach((error) => {
    const key = error.section;
    if (!groupedErrors[key]) {
      groupedErrors[key] = [];
    }
    groupedErrors[key].push(error);
  });

  const summaries = Object.entries(groupedErrors).map(
    ([section, sectionErrors]) => {
      const sectionName = formatSectionName(section);
      const fieldCount = sectionErrors.length;
      return `${sectionName}: ${fieldCount} field${fieldCount > 1 ? "s" : ""}`;
    }
  );

  return `Please fix the following required fields: ${summaries.join(", ")}`;
}

function formatSectionName(section: string): string {
  const sectionMap: Record<string, string> = {
    personal: "Personal Information",
    experience: "Work Experience",
    education: "Education",
    skills: "Skills",
    projects: "Projects",
  };

  return sectionMap[section] || section;
}

export function validateResumeSection(
  data: any,
  schema: any,
  sectionName: string,
  setFieldError?: (fieldPath: string) => void
): boolean {
  try {
    schema.parse(data);
    return true;
  } catch (error) {
    if (error instanceof ZodError) {
      const validationErrors = formatValidationErrors(error, sectionName);

      // Set field errors for highlighting
      if (setFieldError) {
        validationErrors.forEach((error) => {
          const fieldPath = getFieldPath(error);
          setFieldError(fieldPath);
        });
      }

      showValidationErrors(validationErrors);
    }
    return false;
  }
}

export function validateResumeSectionSilent(
  data: any,
  schema: any,
  sectionName: string
): ValidationError[] {
  try {
    schema.parse(data);
    return [];
  } catch (error) {
    if (error instanceof ZodError) {
      return formatValidationErrors(error, sectionName);
    }
    return [];
  }
}
