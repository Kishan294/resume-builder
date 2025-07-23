import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { resumes } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import {
  transformSkillsForDatabase,
  transformSkillsFromDatabase,
} from "@/utils/resume-transform";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resume = await db
      .select()
      .from(resumes)
      .where(and(eq(resumes.id, id), eq(resumes.userId, session.user.id)))
      .limit(1);

    if (resume.length === 0) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const resumeData = resume[0];

    // Transform skills from database format to new format
    const transformedResume = {
      ...resumeData,
      skills: resumeData.skills
        ? transformSkillsFromDatabase(
            resumeData.skills as Array<{ category: string; items: string[] }>
          )
        : [],
    };

    return NextResponse.json(transformedResume);
  } catch (error) {
    console.error("Failed to fetch resume:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Extract only the fields we want to update, excluding id, userId, createdAt
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, userId: __, createdAt: ___, ...updateData } = body;

    // Transform skills to database format if they exist
    if (updateData.skills) {
      updateData.skills = transformSkillsForDatabase(updateData.skills);
    }

    const updatedResume = await db
      .update(resumes)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(and(eq(resumes.id, id), eq(resumes.userId, session.user.id)))
      .returning();

    if (updatedResume.length === 0) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const resumeData = updatedResume[0];

    // Transform skills from database format to new format
    const transformedResume = {
      ...resumeData,
      skills: resumeData.skills
        ? transformSkillsFromDatabase(
            resumeData.skills as Array<{ category: string; items: string[] }>
          )
        : [],
    };

    return NextResponse.json(transformedResume);
  } catch (error) {
    console.error("Failed to update resume:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deletedResume = await db
      .delete(resumes)
      .where(and(eq(resumes.id, id), eq(resumes.userId, session.user.id)))
      .returning();

    if (deletedResume.length === 0) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Failed to delete resume:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
