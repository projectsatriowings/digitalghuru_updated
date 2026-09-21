import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function PATCH(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const courseId = parseInt(params.courseId);

    if (isNaN(courseId)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }

    const { 
      title, 
      slug, 
      description, 
      price, 
      discountedPrice, 
      isPublished, 
      marketing_data, 
      modules, 
      ...rest 
    } = data;

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

    const finalPrice = price !== undefined 
      ? price 
      : (discountedPrice ? parseInt(discountedPrice) : undefined);

    const finalMarketingData = {
      ...(marketing_data || {}),
      ...(curriculumData ? { curriculum: curriculumData } : {}),
      ...rest,
      ...(discountedPrice !== undefined ? { discountedPrice } : {})
    };

    // Sanitize whyDigitalGhuru reasons to remove hardcoded colors so frontend fallbacks work
    if (finalMarketingData.whyDigitalGhuru && Array.isArray(finalMarketingData.whyDigitalGhuru.reasons)) {
      finalMarketingData.whyDigitalGhuru.reasons = finalMarketingData.whyDigitalGhuru.reasons.map((r: any) => {
        const { color, numBg, dotColor, ...restReason } = r;
        return restReason;
      });
    }

    // Update the course
    await pool.query(
      `UPDATE courses SET 
        title = COALESCE($1, title),
        slug = COALESCE($2, slug),
        description = COALESCE($3, description),
        price = COALESCE($4, price),
        "isPublished" = COALESCE($5, "isPublished"),
        marketing_data = COALESCE($6, marketing_data),
        "updatedAt" = NOW()
       WHERE id = $7`,
      [title, slug, description, finalPrice, isPublished, finalMarketingData, courseId]
    );

    // Synchronize modules and lessons / chapters in DB
    if (modules && Array.isArray(modules) && modules.length > 0) {
      const existingModsRes = await pool.query(
        `SELECT id, title, position FROM modules WHERE "courseId" = $1 ORDER BY position ASC`,
        [courseId]
      );
      const existingMods = existingModsRes.rows;

      for (let i = 0; i < modules.length; i++) {
        const mod = modules[i];
        const modTitle = typeof mod === "string" ? mod : (mod.title || `Module ${i + 1}`);
        let moduleId = typeof mod === "object" ? mod.id : undefined;

        if (moduleId) {
          await pool.query(
            `UPDATE modules SET title = $1, position = $2, "updatedAt" = NOW() WHERE id = $3 AND "courseId" = $4`,
            [modTitle, i, moduleId, courseId]
          );
        } else if (existingMods[i]) {
          moduleId = existingMods[i].id;
          await pool.query(
            `UPDATE modules SET title = $1, position = $2, "updatedAt" = NOW() WHERE id = $3`,
            [modTitle, i, moduleId]
          );
        } else {
          const newModRes = await pool.query(
            `INSERT INTO modules (title, "courseId", position, "isPublished") VALUES ($1, $2, $3, $4) RETURNING id`,
            [modTitle, courseId, i, true]
          );
          moduleId = newModRes.rows[0].id;
        }

        // Handle lessons / chapters
        if (mod && Array.isArray(mod.lessons) && moduleId) {
          const existingChapsRes = await pool.query(
            `SELECT id, title, "videoUrl", position FROM chapters WHERE "moduleId" = $1 ORDER BY position ASC`,
            [moduleId]
          );
          const existingChaps = existingChapsRes.rows;

          for (let j = 0; j < mod.lessons.length; j++) {
            const lesson = mod.lessons[j];
            const lessonTitle = typeof lesson === "string" ? lesson : (lesson.title || `Lesson ${j + 1}`);
            const videoUrl = typeof lesson === "object" ? (lesson.videoUrl || null) : null;
            const chapterId = typeof lesson === "object" ? lesson.id : undefined;

            if (chapterId) {
              await pool.query(
                `UPDATE chapters SET title = $1, "videoUrl" = $2, position = $3, "updatedAt" = NOW() WHERE id = $4 AND "moduleId" = $5`,
                [lessonTitle, videoUrl, j, chapterId, moduleId]
              );
            } else if (existingChaps[j]) {
              await pool.query(
                `UPDATE chapters SET title = $1, "videoUrl" = $2, position = $3, "updatedAt" = NOW() WHERE id = $4`,
                [lessonTitle, videoUrl, j, existingChaps[j].id]
              );
            } else {
              await pool.query(
                `INSERT INTO chapters (title, "videoUrl", "moduleId", position, "isPublished") VALUES ($1, $2, $3, $4, true)`,
                [lessonTitle, videoUrl, moduleId, j]
              );
            }
          }
        }
      }
    }

    if (slug) {
      revalidatePath(`/courses/${slug}`);
    }
    revalidatePath("/courses");
    revalidatePath("/");
    revalidatePath("/admin/courses");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const courseId = parseInt(params.courseId);

    if (isNaN(courseId)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }

    // Delete the course (cascades to modules, chapters, etc if DB is configured properly)
    await pool.query(
      `DELETE FROM courses WHERE id = $1`,
      [courseId]
    );

    revalidatePath("/courses");
    revalidatePath("/");
    revalidatePath("/admin/courses");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}
