import React, { cache } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import pool from "@/lib/db";
import { courseMap, CourseData } from "@/lib/courseData";

import UdemyStyleHero from "@/components/sections/course-new/UdemyStyleHero";
import StickyEnrollmentCard from "@/components/sections/course-new/StickyEnrollmentCard";
import CourseOverview from "@/components/sections/course-new/CourseOverview";
import ProgramHighlights from "@/components/sections/course-new/ProgramHighlights";
import WhoShouldJoin from "@/components/sections/course-new/WhoShouldJoin";
import CourseModules from "@/components/sections/course-new/CourseModules";
import ToolsMastered from "@/components/sections/course-new/ToolsMastered";
import CourseFAQs from "@/components/sections/course-new/CourseFAQs";

import ModernLinearCourseLayout from "@/components/sections/course-linear/ModernLinearCourseLayout";

export const dynamic = "force-dynamic";

const getCourseData = cache(async (slug: string): Promise<CourseData | null> => {
  let dbCourse = null;
  try {
    const res = await pool.query(
      `SELECT * FROM courses WHERE slug = $1 AND "isPublished" = true`,
      [slug]
    );
    if (res.rows.length > 0) {
      dbCourse = res.rows[0];
    }
  } catch (error) {
    console.error("DB Error fetching course:", error);
  }

  const staticCourse = courseMap[slug];

  if (!dbCourse && !staticCourse) {
    return null;
  }

  let finalCourse: CourseData;
  
  if (dbCourse && dbCourse.marketing_data && Object.keys(dbCourse.marketing_data).length > 0) {
    finalCourse = {
      ...(staticCourse || {}),
      ...dbCourse.marketing_data,
      title: dbCourse.title,
      description: dbCourse.description || dbCourse.marketing_data.description || staticCourse?.description,
      id: dbCourse.id,
    } as CourseData;

    if (!finalCourse.curriculum || finalCourse.curriculum.length === 0) {
      try {
        const dbMods = await pool.query(
          `SELECT m.id, m.title, 
            COALESCE(json_agg(c.title ORDER BY c.position ASC) FILTER (WHERE c.id IS NOT NULL), '[]') as topics
           FROM modules m
           LEFT JOIN chapters c ON c."moduleId" = m.id
           WHERE m."courseId" = $1
           GROUP BY m.id, m.title, m.position
           ORDER BY m.position ASC`,
          [dbCourse.id]
        );
        if (dbMods.rows.length > 0) {
          finalCourse.curriculum = dbMods.rows.map((r: any) => ({
            module: r.title,
            topics: Array.isArray(r.topics) ? r.topics : (typeof r.topics === 'string' ? JSON.parse(r.topics) : [])
          }));
        }
      } catch (err) {
        console.error("Error fetching curriculum from db:", err);
      }
    }
  } else {
    finalCourse = staticCourse;
  }

  return finalCourse;
});

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const course = await getCourseData(params.slug);

  if (!course) {
    return {
      title: "Course Not Found | Digital Ghuru",
    };
  }

  return {
    title: `${course.title} | Digital Ghuru`,
    description: course.description || "Master digital marketing with Digital Ghuru's premium courses.",
    openGraph: {
      title: `${course.title} | Digital Ghuru`,
      description: course.description || "Master digital marketing with Digital Ghuru's premium courses.",
      type: "website",
      images: [
        {
          url: (course as any).cardImage || "/images/Hero Image.jpeg",
          width: 1200,
          height: 630,
          alt: course.title,
        },
      ],
    },
  };
}

export default async function CoursePage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const finalCourse = await getCourseData(slug);

  if (!finalCourse) {
    return (
      <div className="section-container section-padding text-center">
        <h1 className="heading-lg mb-4 text-[var(--tw-colors-ink-900)]">Course Not Found</h1>
        <p className="body-lg mb-8 text-ink-500">
          The course you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/" className="bg-brand-blue text-white px-6 py-3 rounded-full font-bold">
          Back to Home
        </Link>
      </div>
    );
  }

  // Generate JSON-LD Structured Data for Course
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": finalCourse.title,
    "description": finalCourse.description,
    "provider": {
      "@type": "Organization",
      "name": "Digital Ghuru",
      "sameAs": "https://digitalghuru.in"
    }
  };

  return (
    <>
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Every course uses the unified Modern Linear Layout */}
      <ModernLinearCourseLayout course={finalCourse} />
    </>
  );
}
