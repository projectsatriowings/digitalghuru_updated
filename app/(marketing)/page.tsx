"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Star } from "lucide-react";
import HeroSection from "@/components/sections/HeroSection";
import CourseCard from "@/components/cards/CourseCard";
import StatCard from "@/components/cards/StatCard";
import ComparisonTable from "@/components/sections/ComparisonTable";
import FounderCard from "@/components/cards/FounderCard";
import TestimonialCarousel from "@/components/sections/TestimonialCarousel";
import FAQAccordion from "@/components/sections/FAQAccordion";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useCourseGate } from "@/components/shared/useCourseGate";

// Newly integrated sections
import LogoWall from "@/components/sections/LogoWall";
import DesignedFor from "@/components/sections/DesignedFor";
import AgencyModel from "@/components/sections/AgencyModel";
import ToolsCovered from "@/components/sections/ToolsCovered";
import CertificateSection from "@/components/sections/CertificateSection";
import LeadCaptureForm from "@/components/sections/LeadCaptureForm";
import PhotoGallery from "@/components/sections/PhotoGallery";

/* ─── Mock Data & Branding Configs ─── */

const hiringPartners = [
  { name: "NEWS GHURU", logoUrl: "/partners/NEWS GHURU LOGO PNG.png" },
  { name: "PRS", logoUrl: "/partners/PRS LOGO.png" },
  { name: "Blessence", logoUrl: "/partners/blessence.png" },
  { name: "Brand 03", logoUrl: "/partners/brand03.png" },
  { name: "Brand 1", logoUrl: "/partners/brand1.png" },
  { name: "Dhara", logoUrl: "/partners/dhara.jpeg" },
  { name: "Divine", logoUrl: "/partners/divine.jpeg" },
  { name: "Joyson Trust", logoUrl: "/partners/joysontrust.png" },
  { name: "MCars", logoUrl: "/partners/mcars.png" },
  { name: "Meera Filngs", logoUrl: "/partners/meera filngs.png" },
  { name: "Miniso", logoUrl: "/partners/miniso poster logo.png" },
  { name: "Mithra", logoUrl: "/partners/mithra.jpeg" },
  { name: "MK", logoUrl: "/partners/mk.png" },
  { name: "New Brand 3", logoUrl: "/partners/newbrand3.png" },
  { name: "Sai", logoUrl: "/partners/sai.jpeg" },
  { name: "School", logoUrl: "/partners/school.png" },
  { name: "Sissers", logoUrl: "/partners/sissers.png" },
  { name: "Sivaji Sons", logoUrl: "/partners/sivajisons.png" },
  { name: "UE Logo", logoUrl: "/partners/uelogo.png" },
  { name: "VR Tech", logoUrl: "/partners/vrtech.png" },
];

const galleryImages = [
  { src: "/Gallery Images/IMG-20260831-WA0002.jpg", alt: "Digital Ghuru classroom lecture session" },
  { src: "/Gallery Images/IMG-20260831-WA0003.jpg", alt: "Students learning search engine marketing strategy" },
  { src: "/Gallery Images/IMG-20260831-WA0005.jpg", alt: "Interactive agency-style training session" },
  { src: "/Gallery Images/IMG-20260831-WA0006.jpg", alt: "Practical digital campaign setup presentation" },
  { src: "/Gallery Images/IMG-20260831-WA0007.jpg", alt: "Students pitching digital campaign performance" },
  { src: "/Gallery Images/IMG-20260831-WA0008.jpg", alt: "Collaborative group discussion in progress" },
  { src: "/Gallery Images/IMG-20260831-WA0009.jpg", alt: "Digital marketing workshop on live campaigns" },
  { src: "/Gallery Images/IMG-20260831-WA0010.jpg", alt: "Creative brainstorm session for social media strategy" },
  { src: "/Gallery Images/IMG-20260831-WA0011.jpg", alt: "Students working on search engine optimization tools" },
  { src: "/Gallery Images/IMG-20260831-WA0014.jpg", alt: "Expert mentor explaining digital funnel logic" },
  { src: "/Gallery Images/IMG-20260831-WA0015.jpg", alt: "Mentorship and career counseling discussion" },
  { src: "/Gallery Images/IMG-20260831-WA0016.jpg", alt: "Interactive tech session on generative AI marketing" },
  { src: "/Gallery Images/IMG-20260831-WA0017.jpg", alt: "Alumni sharing placement interview tips" },
  { src: "/Gallery Images/IMG-20260831-WA0020.jpg", alt: "Mentorship guidance for digital campaign launch" },
];

const initialCourses = [
  {
    format: "Classroom + Online",
    duration: "3 to 6 Months",
    title: "AI-Powered Digital Marketing Course",
    blurb:
      "Master digital marketing combined with AI tools like ChatGPT and Midjourney. 12 comprehensive modules covering SEO, SEM, Social Media, Ads, Automation, and more.",
    originalPrice: "—",
    discountedPrice: "Contact Us",
    cardImage: "",
    ctaHref: "/courses/ai-powered-digital-marketing",
  },
  {
    format: "Classroom + Online",
    duration: "4 to 6 Months",
    title: "React JS Full Stack Development Course",
    blurb:
      "Build modern web applications with React.js frontend, Node.js backend, databases, and deployment. Become a job-ready full-stack developer.",
    originalPrice: "—",
    discountedPrice: "Contact Us",
    cardImage: "",
    ctaHref: "/courses/react-js-full-stack-development",
  },
];

const stats = [
  { value: 500, suffix: "+", label: "Students Trained", color: "blue" as const },
  { value: 95, suffix: "%", label: "Placement Rate", color: "gold" as const },
  { value: 50, suffix: "+", label: "Industry Partners", color: "orange" as const },
  { value: 6, suffix: "+", label: "Years of Excellence", color: "blue" as const },
];

const comparisonRows = [
  { feature: "Live project training", us: true, others: false },
  { feature: "AI-integrated curriculum", us: true, others: false },
  { feature: "Dedicated placement support", us: true, others: false },
  { feature: "Industry expert mentors", us: true, others: true },
  { feature: "Dual certification", us: true, others: false },
  { feature: "Small batch sizes (<30)", us: true, others: false },
  { feature: "Lifetime access to resources", us: true, others: true },
  { feature: "Agency-style campaign training", us: true, others: false },
];

const mentors = [
  {
    name: "Mr. Bala",
    role: "Digital Marketing Trainer",
    photoUrl: "/resources/Bala Sir.jpeg",
    bio: "Specializes in search engine optimization and analytics. Brings over a decade of experience driving online growth for top-tier brands through data-driven campaigns.",
  },
  {
    name: "Mr. Prakash",
    role: "Digital Marketing Trainer",
    photoUrl: "/resources/Prakash Sir.jpeg",
    bio: "An expert in paid advertising and social media strategy. Passionate about teaching advanced scaling techniques and maximizing return on ad spend.",
  },
  {
    name: "Mr. Soorya",
    role: "Graphic Designer and Video Editing Trainer",
    photoUrl: "/resources/Soorya Sir.jpeg",
    bio: "A creative visionary skilled in visual storytelling. Equips students with the tools to craft compelling visual assets and engaging video content.",
  },
  {
    name: "Mr. Soundarajan",
    role: "Web Developer Trainer",
    photoUrl: "/resources/Soundharajan Sir.jpeg",
    bio: "A full-stack developer with extensive experience building robust web applications. Focuses on bridging the gap between technical execution and marketing goals.",
  },
];

const testimonials = [
  {
    quote: "The hands-on practice with live ad budgets made all the difference. I felt completely ready for my first agency role.",
    name: "Arjun Reddy",
    role: "Performance Marketer",
  },
  {
    quote: "The mentors actually work in the industry, so we learned current AI strategies rather than outdated textbook theories.",
    name: "Priya Sharma",
    role: "Social Media Executive",
  },
  {
    quote: "Switching careers was intimidating, but the step-by-step guidance and portfolio building helped me land a job within two months of graduating.",
    name: "Mohammed Tariq",
    role: "SEO Analyst",
  },
  {
    quote: "I loved the agency-style environment. Working on real client briefs during the course gave me the exact experience interviewers were looking for.",
    name: "Sneha Patel",
    role: "Digital Strategist",
  },
];

const faqs = [
  {
    question: "What is the duration of the AI-powered AI-Powered digital marketing course?",
    answer: "Our courses range from 4 weeks (short-term intensive) to 6 months (advanced program). The most popular classroom course is 4 months, and the online course is 3 months. Each format includes hands-on projects, mentor sessions, and placement preparation.",
  },
  {
    question: "Do you provide placement support?",
    answer: "Yes, we provide 100% placement support with a dedicated placement cell. Our team works with 50+ industry partners to ensure every student gets interview opportunities. We also provide resume building, mock interviews, and LinkedIn profile optimization as part of the placement preparation.",
  },
  {
    question: "What certifications will I receive?",
    answer: "Upon successful completion, you receive a Digital Ghuru certification. Additionally, we prepare you for Google Ads, Google Analytics, Meta Blueprint, and HubSpot certifications — all included in the course fee.",
  },
  {
    question: "Are there any prerequisites to join?",
    answer: "No specific prerequisites are required. Our courses are designed for beginners as well as professionals looking to upskill. Basic computer literacy and a willingness to learn are all you need.",
  },
  {
    question: "What is the fee structure and are EMI options available?",
    answer: "We offer flexible payment options including one-time payment (with early bird discounts), and EMI options through select banking partners. Contact our admissions team for the latest fee structure and available offers.",
  },
  {
    question: "Can I attend a demo class before enrolling?",
    answer: "Absolutely! We offer free demo classes every week. You can experience our teaching methodology, meet our mentors, and understand the course curriculum before making a decision. Book a free demo through our contact page.",
  },
];

const staggerContainer: any = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const fadeUpItem: any = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function HomePage() {
  const router = useRouter();
  const { triggerAction, GateModalComponent } = useCourseGate("Digital Ghuru Courses");
  const [courseList, setCourseList] = useState<typeof initialCourses>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => {
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const dbCourses = data.map((c: any) => {
            const mData = c.marketing_data || {};
            return {
              title: c.title || mData.title || "Course Title",
              blurb: c.description || mData.description || "",
              format: mData.format || "Classroom + Online",
              duration: mData.duration || "3 to 6 Months",
              brochureUrl: mData.brochureUrl || "",
              discountedPrice: String(
                mData.discountedPrice ||
                (c.price ? `₹${Number(c.price).toLocaleString()}` : "Contact Us")),
              originalPrice: String(mData.originalPrice || "—"),
              cardImage: mData.cardImage || c.cardImage || mData.thumbnail || "",
              ctaHref: c.slug ? `/courses/${c.slug}` : `/courses/${c.id}`,
            };
          });
          setCourseList(dbCourses);
        } else {
          setCourseList(initialCourses);
        }
      })
      .catch(() => {
        setCourseList(initialCourses);
      })
      .finally(() => setCoursesLoading(false));
  }, []);

  const handleViewDetails = (href: string) => {
    triggerAction(() => {
      router.push(href);
    });
  };

  const getBrochureUrl = (title?: string) => {
    if (!title) return null;
    const t = title.toLowerCase();
    if (t.includes('marketing')) return '/Courses/AI Powered Digital Marketing Course.pdf';
    if (t.includes('react') || t.includes('stack')) return '/Courses/React JS Full Stack Development.pdf';
    if (t.includes('data science')) return '/Courses/Data Science with AI Course.pdf';
    if (t.includes('design') || t.includes('video')) return '/Courses/Creative Design and video editing course.pdf';
    return null;
  };

  const handleDownloadBrochure = (title: string) => {
    triggerAction(() => {
      const url = getBrochureUrl(title);
      if (!url) {
        alert("Brochure not available for this course yet.");
        return;
      }
      const link = document.createElement("a");
      link.href = url;
      link.download = url.split('/').pop() || "Brochure.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <>
      {/* ─── 1. Hero Section ─── */}
      <HeroSection
        trustBadges={[
          { label: "100% Placement Support" },
          { label: "Google Certified" },
          { label: "AI-Integrated" },
        ]}
        eyebrow="AI Powered Education Institute"
        title=""
        titleHighlight="AI Career Transformation Academy"
        description="Future-proof your career at India's premier AI-integrated digital marketing academy. Master advanced strategies, automate campaigns with AI tools, and train in a live agency-style environment designed to get you hired."
        imageUrl="/images/Hero Image.jpeg"
        primaryCta={{ label: "Explore Courses", href: "#course-grid" }}
        secondaryCta={{ label: "Book Free Demo", href: "#inquiry-form" }}
      />

      {/* ─── 2. Logo Wall (Hiring Partners) ─── */}
      <LogoWall
        eyebrow="PLACEMENT PARTNERS"
        title="Our Alumni Work at Leading Agencies & Brands"
        logos={hiringPartners}
      />

      {/* ─── 3. Stats Strip ─── */}
      <section className="bg-white border-y border-ink-100">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-ink-100">
            {stats.map((stat, idx) => (
              <StatCard key={idx} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. Designed For Section ─── */}
      <DesignedFor />

      {/* ─── 5. Agency-Style Model Section ─── */}
      <AgencyModel />

      {/* ─── 6. Course Grid ─── */}
      <section className="section-padding bg-white" id="course-grid">
        <div className="section-container">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">OUR COURSES</p>
            <h2 className="heading-lg mb-4 text-ink-900">
              Industry-Leading AI-Powered Digital Marketing Programs
            </h2>
            <p className="body-lg max-w-2xl mx-auto text-ink-500">
              Choose from our range of carefully crafted programs designed to match your career goals and learning style.
            </p>
          </div>

          {coursesLoading ? (
            /* ── Loading Skeleton ── */
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-2xl border border-ink-100 overflow-hidden">
                  <div className="aspect-[16/9] bg-slate-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-slate-100 rounded w-full" />
                    <div className="h-4 bg-slate-100 rounded w-2/3" />
                    <div className="h-8 bg-slate-200 rounded w-1/3 mt-4" />
                    <div className="h-10 bg-slate-200 rounded w-full mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className={`grid gap-8 ${
                courseList.length === 1
                  ? "grid-cols-1 max-w-md mx-auto"
                  : courseList.length === 2
                  ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
                  : courseList.length === 3
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              }`}
            >
              {courseList.map((course, idx) => (
                <motion.div key={course.ctaHref || idx} variants={fadeUpItem}>
                  <CourseCard
                    {...course}
                    onViewDetails={handleViewDetails}
                    onDownloadBrochure={handleDownloadBrochure}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ─── 7. Tools Covered Section ─── */}
      <ToolsCovered />

      {/* ─── 8. Comparison Table ─── */}
      <ComparisonTable rows={comparisonRows} />

      {/* ─── 9. Certificate Showcase Section ─── */}
      <CertificateSection />

      {/* ─── 10. Founder / Trainer Highlight ─── */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">MEET THE MENTOR</p>
            <h2 className="heading-lg mb-4 text-ink-900 font-bold">Learn From the Best</h2>
            <p className="body-lg max-w-2xl mx-auto text-ink-500">
              Our mentors are seasoned industry professionals who bring real-world experience into every session.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mentors.map((mentor, idx) => (
              <FounderCard key={idx} {...mentor} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── 11. Campus Photo Gallery ─── */}
      <PhotoGallery
        eyebrow="CAMPUS GALLERY"
        title="Explore Life at Digital Ghuru"
        images={galleryImages}
      />

      {/* ─── 12. Testimonials ─── */}
      <TestimonialCarousel testimonials={testimonials} />

      {/* ─── 13. Success Story Highlight ─── */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="eyebrow mb-3">SUCCESS STORIES</p>
              <h2 className="heading-lg mb-6 text-ink-900 font-bold">
                Our Alumni Are Making Waves in the Industry
              </h2>
              <p className="body-lg mb-6 text-ink-500">
                From fresh graduates to career switchers, our students have gone on to work with leading brands, agencies, and startups across India and beyond.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "Graduates placed at top digital agencies",
                  "Alumni running successful freelance businesses",
                  "Students earning promotions within months",
                  "Career switchers landing their first marketing role",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-ink-700 text-base md:text-lg">{item}</span>
                  </div>
                ))}
              </div>

            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-card border border-ink-100">
                <img
                  src="/resources/Image 2.png"
                  alt="Success Story"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 14. Lead Capture Form ─── */}
      <LeadCaptureForm />

      {/* ─── 15. FAQ ─── */}
      <FAQAccordion items={faqs} />
      <GateModalComponent />
    </>
  );
}
