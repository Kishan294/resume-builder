import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { resumes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { transformSkillsFromDatabase } from "@/utils/resume-transform";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const resume = await db
      .select()
      .from(resumes)
      .where(eq(resumes.id, id))
      .limit(1);

    if (resume.length === 0) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const resumeData = resume[0];

    // Check if resume is public (you might want to add an isPublic field to your schema)
    // For now, we'll assume all resumes can be viewed publicly
    // if (!resumeData.isPublic) {
    //   return NextResponse.json({ error: "Resume is not public" }, { status: 403 });
    // }

    // Transform skills from database format to new format
    const transformedResume = {
      ...resumeData,
      skills: resumeData.skills
        ? transformSkillsFromDatabase(
            resumeData.skills as Array<{ category: string; items: string[] }>
          )
        : [],
    };

    // Remove sensitive information
    const publicResume = {
      id: transformedResume.id,
      title: transformedResume.title,
      template: transformedResume.template,
      personalInfo: transformedResume.personalInfo,
      workExperience: transformedResume.workExperience,
      education: transformedResume.education,
      skills: transformedResume.skills,
      projects: transformedResume.projects,
      updatedAt: transformedResume.updatedAt,
    };

    return NextResponse.json(publicResume);
  } catch (error) {
    console.error("Failed to fetch public resume:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
