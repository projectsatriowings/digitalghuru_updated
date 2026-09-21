import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await pool.query(
      `SELECT id, title, slug, description, price, "isPublished", marketing_data 
       FROM courses 
       WHERE "isPublished" = true 
       ORDER BY id ASC`
    );
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error("[COURSES_GET]", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, description, discountedPrice, marketing_data, modules, ...rest } = body;

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    // Build curriculum array from modules for marketing_data
    let curriculumData = marketing_data?.curriculum;
    if (Array.isArray(modules) && modules.length > 0) {
      curriculumData = modules.map((m: any, i: number) => ({
        module: typeof m === "string" ? m : (m.title || `Module ${i + 1}`),
        topics: Array.isArray(m?.lessons) 
          ? m.lessons.map((l: any) => (typeof l === "string" ? l : (l.title || ""))).filter(Boolean)
          : []
      }));
    }

    // Merge any other top-level fields (like format, duration, batchInfo, location, originalPrice, subtitle) into marketing_data
    const finalMarketingData = {
      ...marketing_data,
      ...(curriculumData ? { curriculum: curriculumData } : {}),
      ...rest,
      discountedPrice,
    };

    // Insert course
    const result = await pool.query(
      `INSERT INTO courses (title, description, price, marketing_data, "instructorId") 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [title, description || null, discountedPrice ? parseInt(discountedPrice) : 0, finalMarketingData, parseInt(session.user.id)]
    );

    const courseId = result.rows[0].id;

    // Insert modules and lessons / chapters if any
    if (modules && Array.isArray(modules) && modules.length > 0) {
      for (let i = 0; i < modules.length; i++) {
        const mod = modules[i];
        const modTitle = typeof mod === "string" ? mod : (mod.title || `Module ${i + 1}`);
        const modRes = await pool.query(
          `INSERT INTO modules (title, "courseId", "position", "isPublished") VALUES ($1, $2, $3, $4) RETURNING id`,
          [modTitle, courseId, i, true]
        );
        const moduleId = modRes.rows[0].id;

        // Insert lessons / chapters
        if (mod && Array.isArray(mod.lessons) && mod.lessons.length > 0) {
          for (let j = 0; j < mod.lessons.length; j++) {
            const lesson = mod.lessons[j];
            const lessonTitle = typeof lesson === "string" ? lesson : (lesson.title || `Lesson ${j + 1}`);
            const videoUrl = typeof lesson === "object" ? (lesson.videoUrl || null) : null;
            await pool.query(
              `INSERT INTO chapters (title, "videoUrl", "moduleId", "position", "isPublished") 
               VALUES ($1, $2, $3, $4, $5)`,
              [lessonTitle, videoUrl, moduleId, j, true]
            );
          }
        }
      }
    }

    return NextResponse.json({ course: result.rows[0] });
  } catch (error) {
    console.error("[COURSES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
