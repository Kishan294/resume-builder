import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { resumes } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { transformSkillsFromDatabase } from "@/utils/resume-transform";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userResumes = await db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, session.user.id));

    // Transform skills for each resume
    const transformedResumes = userResumes.map((resume) => ({
      ...resume,
      skills: resume.skills
        ? transformSkillsFromDatabase(
            resume.skills as Array<{ category: string; items: string[] }>
          )
        : [],
    }));

    return NextResponse.json(transformedResumes);
  } catch (error) {
    console.error("Failed to fetch resumes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, template } = body;

    const { v4: uuidv4 } = await import("uuid");

    const newResume = await db
      .insert(resumes)
      .values({
        id: uuidv4(),
        userId: session.user.id,
        title: title || "Untitled Resume",
        template: template || "modern",
        personalInfo: {
          fullName: "",
          email: "",
          phone: "",
          location: "",
        },
      })
      .returning();

    return NextResponse.json(newResume[0]);
  } catch (error) {
    console.error("Failed to create resume:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
