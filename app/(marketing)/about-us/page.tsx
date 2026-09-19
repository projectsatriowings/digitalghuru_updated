"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Target,
  Award,
  BookOpen,
  Video,
  MapPin,
  Briefcase,
  IndianRupee,
  ShieldCheck,
  Bot,
  PieChart,
  GraduationCap,
  Globe2,
  Trophy,
  Phone,
  Mail,
  Sparkles,
  Rocket,
  Zap,
  Play,
  ArrowRight,
  Star,
  Users,
  Building2,
  Laptop,
  TrendingUp,
} from "lucide-react";
import HeroSection from "@/components/sections/HeroSection";
import Button from "@/components/ui/Button";

/* ─── Data for Digital Ghuru About Page ─── */

const locations = [
  {
    name: "Anna Nagar Office",
    city: "Chennai",
    address: "45, A Block, 3rd Avenue, Kumaran Nagar, Anna Nagar East, Chennai - 600102.",
    phone: "+91 8825948859",
    email: "contact@digitalghuru.in",
    gradient: "from-brand-blue to-blue-600",
  },
  {
    name: "Ameerpet Office",
    city: "Hyderabad",
    address: "F8, First Floor, Kallu Compound Rd, Pratap Nagar, Nagarjuna Nagar colony, Yella Reddy Guda, Ameerpet, Hyderabad - 500073.",
    phone: "+91 8825948859",
    email: "contact@digitalghuru.in",
    gradient: "from-brand-orange to-orange-600",
  },
  {
    name: "Korattur Office",
    city: "Chennai",
    address: '2nd Floor, No. 1A, "Gurudev Complex", S1, 57th St, Venkatraman Nagar, Korattur, Chennai, Tamil Nadu 600050',
    phone: "+91 8825948859",
    email: "contact@digitalghuru.in",
    gradient: "from-brand-gold to-yellow-500",
  },
];

const founders = [
  {
    name: "John Doe",
    role: "Founder & Chief Mentor",
    bio: "A digital marketing pioneer, educator, and entrepreneur with over 15 years of hands-on experience shaping the digital landscape. Founded Digital Ghuru to bridge the gap between education and execution by simulating a real agency environment inside the classroom.",
    credentials: [
      "Top Social Media Professional in India",
      "Trained 100,000+ professionals",
      "Consultant for Top Tier Brands",
    ],
    socialStats: [
      { platform: "Instagram", count: "500K+" },
      { platform: "YouTube", count: "100K+" },
      { platform: "LinkedIn", count: "50K+" },
    ],
  },
  {
    name: "Jane Smith",
    role: "Co-Founder",
    bio: "A dynamic educator and AI evangelist recognized as one of India's best AI corporate trainers. Leads curriculum innovation and tech integration at Digital Ghuru to ensure programs reflect future-ready skills.",
    credentials: [
      "India's Best AI Corporate Trainer",
      "TEDx Speaker",
      "Conducted International AI Workshops",
    ],
    socialStats: [
      { platform: "Instagram", count: "100K+" },
      { platform: "YouTube", count: "80K+" },
      { platform: "LinkedIn", count: "25K+" },
    ],
  },
];

const milestones = [
  { year: "2018", milestone: "Digital Ghuru started with a vision to revolutionize digital marketing education with the first batch of 50 students." },
  { year: "2019", milestone: "Launched our first-ever online batch, seeing exponential growth in digital marketing enthusiasts across India." },
  { year: "2021", milestone: "Got affiliated with top universities and launched advanced certificate courses. Crossed the 100,000 students mark." },
  { year: "2023", milestone: "Hosted national and international events, expanding our team and launching specialized AI integration courses." },
  { year: "2025", milestone: "Launched India's first-ever 1-Year MBA in Digital Marketing, offering a globally accredited and focused AI-powered curriculum." },
];

const coreValues = [
  { title: "Innovation First", desc: "Embracing AI and next-gen tech in all our curriculums.", icon: Zap, accent: "blue" },
  { title: "Practical Excellence", desc: "Focusing on real execution over textbook theory.", icon: Target, accent: "orange" },
  { title: "Student Success", desc: "Dedicated to holistic mentorship and long-term career growth.", icon: GraduationCap, accent: "gold" },
  { title: "Integrity", desc: "Honest feedback, transparent outcomes, and real expectations.", icon: ShieldCheck, accent: "blue" },
];

const methodologies = [
  { step: "01", title: "Foundation & Strategy", desc: "Master the fundamentals of digital marketing strategy, consumer psychology, and market research before touching any tools." },
  { step: "02", title: "Live Agency Projects", desc: "Work on real client briefs with actual budgets. Experience the pressure and thrill of a true agency environment." },
  { step: "03", title: "AI Tool Integration", desc: "Learn to scale your output using advanced AI tools like ChatGPT, Midjourney, and automated workflow builders." },
  { step: "04", title: "Placement & Portfolio", desc: "Build a robust portfolio of live campaigns and prepare for interviews with our dedicated placement cell." },
];

const programs = [
  {
    title: "1-Year MBA in Digital Marketing with AI",
    desc: "Combines branding, automation, and strategy with cutting-edge AI tools. Learn to run real campaigns and lead marketing in the AI era.",
    icon: Rocket,
    accent: "blue",
  },
  {
    title: "Best AI-Powered Digital Marketing Course",
    desc: "Agency-style learning, placement support, and real brand campaigns, transforming you into an AI-powered marketer.",
    icon: Building2,
    accent: "orange",
  },
  {
    title: "Best AI-Powered Digital Marketing Course",
    desc: "State-of-the-art Main Campus, ideal for career switchers looking to build a freelancing portfolio with AI-first skills.",
    icon: Laptop,
    accent: "gold",
  },
  {
    title: "Best Online MBA in Digital Marketing",
    desc: "Full access to expert mentorship, global curriculum, and placement support. Learn strategy, content, and analytics remotely.",
    icon: Globe2,
    accent: "blue",
  },
  {
    title: "Post Graduate Program in Digital Marketing",
    desc: "50+ tools, weekly evaluations, live internships, and mentorship from top trainers. AI-driven PG program for future-ready marketers.",
    icon: GraduationCap,
    accent: "orange",
  },
];

const whyChooseUs = [
  { title: "Agency-Style Learning", desc: "Real-world environments that mirror top agencies.", icon: Briefcase, accent: "blue" },
  { title: "Future-Ready AI", desc: "Curriculum powered by AI & Automation.", icon: Bot, accent: "blue" },
  { title: "Live Client Projects", desc: "Real budgets, real brands, real results.", icon: PieChart, accent: "orange" },
  { title: "100% Placement", desc: "Dedicated career placement assistance.", icon: GraduationCap, accent: "gold" },
];

const statsData = [
  { value: "500+", label: "Students Trained", description: "Across workshops, online & offline programs", icon: Users, accent: "blue" },
  { value: "500+", label: "Students Placed", description: "In top agencies & corporate roles", icon: TrendingUp, accent: "orange" },
];

/* ─── Shared section header ─── */
function SectionHeader({
  eyebrow,
  title,
  description,
  light = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  light?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="text-center max-w-4xl mx-auto mb-20"
    >
      <span className={`inline-block text-xs font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full mb-6 ${
        light ? "bg-white/10 text-white/80" : "bg-brand-blue/8 text-brand-blue"
      }`}>
        {eyebrow}
      </span>
      <h2 className={`text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight leading-[1.1] mb-6 ${
        light ? "text-white" : "text-ink-900"
      }`}>
        {title}
      </h2>
      {description && (
        <p className={`text-lg md:text-xl leading-relaxed max-w-2xl mx-auto ${
          light ? "text-white/70" : "text-ink-500"
        }`}>
          {description}
        </p>
      )}
    </motion.div>
  );
}

/* ─── Accent color map ─── */
function accentClasses(accent: string) {
  const map: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    blue: { bg: "bg-brand-blue/8", border: "border-brand-blue/15", text: "text-brand-blue", glow: "from-brand-blue/10" },
    orange: { bg: "bg-brand-orange/8", border: "border-brand-orange/15", text: "text-brand-orange", glow: "from-brand-orange/10" },
    gold: { bg: "bg-brand-gold/8", border: "border-brand-gold/15", text: "text-brand-gold", glow: "from-brand-gold/10" },
  };
  return map[accent] || map.blue;
}

export default function AboutUsPage() {
  return (
    <>
      {/* ─── Hero Section ─── */}
      <HeroSection
        eyebrow="ABOUT DIGITAL GHURU"
        title="India's Leading Agency-Style"
        titleHighlight="AI-Powered Digital Marketing Institute"
        description="With over 500+ students trained, Digital Ghuru is an award-winning AI-powered digital marketing institute shaping the future of marketing talent across India."
        primaryCta={{ label: "View Our Courses", href: "/#course-grid" }}
        imageUrl="/images/about-hero.jpg"
      />

      {/* ━━━ VISION & MISSION ━━━ */}
      <section className="relative overflow-hidden bg-white">
        {/* Ambient mesh */}
        <div className="pointer-events-none absolute top-20 left-0 w-[800px] h-[500px] bg-brand-blue/4 rounded-full blur-[140px]" />
        <div className="pointer-events-none absolute bottom-20 right-0 w-[600px] h-[400px] bg-brand-orange/4 rounded-full blur-[120px]" />

        {/* ── Vision Block ── */}
        <div className="relative z-10 border-b border-ink-100/60">
          <div className="section-container section-padding">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
              {/* Left — Decorative & Label */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-4"
              >
                {/* Large decorative number */}
                <div className="font-heading text-[120px] md:text-[160px] font-black leading-none text-brand-blue/[0.06] select-none -mb-8 md:-mb-12">01</div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-1 w-12 rounded-full bg-gradient-to-r from-brand-blue to-blue-400" />
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-brand-blue">Vision</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-heading font-black text-ink-900 tracking-tight leading-[1.05]">
                  Our Vision
                </h2>
              </motion.div>

              {/* Right — Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-8"
              >
                <div className="lg:max-w-2xl">
                  <p className="text-xl md:text-2xl text-ink-700 leading-[1.7] font-medium mb-8">
                    To become the world&apos;s most advanced digital marketing institute, empowering learners globally to lead in the AI-powered marketing era.
                  </p>
                  <p className="text-lg text-ink-500 leading-[1.8]">
                    We aim to be the benchmark for the best AI-Powered digital marketing course, delivering transformational education through real-world, agency-style learning and future-ready AI integration.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── Mission Block ── */}
        <div className="relative z-10">
          <div className="section-container section-padding">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
              {/* Left — Decorative & Label */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-4"
              >
                <div className="font-heading text-[120px] md:text-[160px] font-black leading-none text-brand-orange/[0.06] select-none -mb-8 md:-mb-12">02</div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-1 w-12 rounded-full bg-gradient-to-r from-brand-orange to-orange-400" />
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-brand-orange">Mission</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-heading font-black text-ink-900 tracking-tight leading-[1.05]">
                  Our Mission
                </h2>
              </motion.div>

              {/* Right — Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-8"
              >
                <div className="lg:max-w-2xl">
                  <p className="text-xl md:text-2xl text-ink-700 leading-[1.7] font-medium mb-10">
                    To transform the future of marketing education through innovation, AI, and execution.
                  </p>

                  {/* Mission pillars */}
                  <div className="space-y-6">
                    {[
                      { icon: Sparkles, title: "AI-First Education", text: "Delivering the best MBA in digital marketing with AI integration." },
                      { icon: Zap, title: "Future-Proof Careers", text: "Offering the best AI courses in digital marketing to future-proof careers." },
                      { icon: Rocket, title: "Agency-Style Training", text: "Fostering a high-performance culture through agency-style training, live projects, and mentorship." },
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: 0.3 + idx * 0.1 }}
                          className="group flex gap-5 p-5 rounded-2xl hover:bg-ink-50/80 transition-colors duration-300"
                        >
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-brand-orange/15 to-brand-orange/5 border border-brand-orange/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                            <Icon className="h-5 w-5 text-brand-orange" />
                          </div>
                          <div>
                            <h4 className="font-heading font-bold text-ink-900 mb-1">{item.title}</h4>
                            <p className="text-ink-500 leading-relaxed">{item.text}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ CORE VALUES ━━━ */}
      <section className="section-padding bg-ink-50 relative overflow-hidden">
        <div className="section-container relative z-10">
          <SectionHeader
            eyebrow="Our Principles"
            title="Core Values"
            description="The driving forces behind every program, mentorship session, and campaign we build."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              const ac = accentClasses(val.accent);
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative bg-white rounded-[2rem] p-8 border border-ink-100 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-400 overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${ac.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full`} />
                  
                  <div className="relative z-10">
                    <div className={`h-14 w-14 rounded-2xl ${ac.bg} ${ac.border} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-6 w-6 ${ac.text}`} />
                    </div>
                    <h3 className="text-xl font-bold font-heading text-ink-900 mb-3">{val.title}</h3>
                    <p className="text-ink-600 leading-relaxed">{val.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ━━━ TEACHING METHODOLOGY ━━━ */}
      <section className="section-padding bg-white relative overflow-hidden">
        <div className="section-container relative z-10">
          <SectionHeader
            eyebrow="Process"
            title="Our Teaching Methodology"
            description="A proven, step-by-step approach transforming beginners into highly capable AI-powered marketers."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {methodologies.map((method, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative group"
              >
                {/* Connector line for desktop */}
                {idx !== methodologies.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-full h-[2px] bg-gradient-to-r from-brand-orange/30 to-transparent z-0" />
                )}
                
                <div className="relative z-10 flex flex-col items-start">
                  <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-brand-orange to-orange-600 flex items-center justify-center text-white font-heading text-3xl font-black mb-6 shadow-xl shadow-brand-orange/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    {method.step}
                  </div>
                  <h3 className="text-xl font-bold font-heading text-ink-900 mb-3">{method.title}</h3>
                  <p className="text-ink-500 leading-relaxed">{method.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ THE ECOSYSTEM ━━━ */}
      <section className="section-padding bg-ink-900 relative overflow-hidden">
        <div className="pointer-events-none absolute top-1/2 right-0 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="section-container relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full bg-white/10 text-white/80 mb-6">
                The Environment
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-white tracking-tight leading-[1.1] mb-6">
                The Digital Ghuru Ecosystem
              </h2>
              <p className="text-lg text-white/70 leading-relaxed mb-8">
                More than just classrooms, we provide a holistic environment designed for accelerated growth, networking, and continuous learning.
              </p>
              
              <ul className="space-y-6">
                {[
                  { icon: Laptop, text: "Access to Premium Tools & Software (Semrush, Midjourney, etc.)" },
                  { icon: Users, text: "Dedicated Mentorship Pods for personalized guidance" },
                  { icon: Building2, text: "Direct Exposure to Hiring Partners & Agency Founders" },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-4 text-white">
                    <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                      <item.icon className="h-5 w-5 text-brand-gold" />
                    </div>
                    <span className="font-medium text-lg">{item.text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative aspect-square md:aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10"
            >
              <img src="/images/Hero Image.jpeg" alt="Digital Ghuru Ecosystem" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-transparent to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ━━━ PROGRAMS ━━━ */}
      <section className="section-padding bg-ink-50 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 -right-40 w-[500px] h-[500px] bg-brand-blue/4 rounded-full blur-[100px]" />

        <div className="section-container">
          <SectionHeader
            eyebrow="Programs"
            title="Top Digital Marketing Programs"
            description="Imbibing the digital culture and creating talented resources in Digital Marketing, Analytics, and Research."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program, idx) => {
              const Icon = program.icon;
              const ac = accentClasses(program.accent);
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className={`group relative rounded-3xl p-8 bg-white border border-ink-100/80 shadow-[0_2px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-400 overflow-hidden ${
                    idx === 0 ? "md:col-span-2 lg:col-span-2 md:flex md:items-start md:gap-8" : ""
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${ac.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400`} />

                  <div className="relative z-10">
                    <div className={`h-14 w-14 rounded-2xl ${ac.bg} ${ac.border} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-6 w-6 ${ac.text}`} />
                    </div>
                  </div>
                  <div className="relative z-10 flex-1">
                    <h3 className="text-xl font-bold font-heading text-ink-900 mb-3">{program.title}</h3>
                    <p className="text-ink-600 leading-relaxed">{program.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ━━━ WHY CHOOSE US ━━━ */}
      <section className="section-padding bg-white relative overflow-hidden">
        <div className="pointer-events-none absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-gold/4 rounded-full blur-[120px]" />

        <div className="section-container relative z-10">
          <SectionHeader
            eyebrow="Why Choose Us"
            title="What Sets Digital Ghuru Apart"
            description="Practical, agency-style learning and AI integration to keep our students ahead of the curve."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyChooseUs.map((feature, idx) => {
              const Icon = feature.icon;
              const ac = accentClasses(feature.accent);
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.45, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="group rounded-2xl p-7 bg-ink-50/60 border border-ink-100/50 hover:bg-white hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${ac.glow} to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300`} />

                  <div className="relative z-10">
                    <div className={`h-12 w-12 rounded-xl ${ac.bg} ${ac.border} border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-5 w-5 ${ac.text}`} />
                    </div>
                    <h3 className="text-lg font-bold font-heading text-ink-900 mb-1.5">{feature.title}</h3>
                    <p className="text-base text-ink-500 leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ━━━ STATS ━━━ */}
      <section className="relative overflow-hidden">
        {/* Dark-to-light gradient background */}
        <div className="absolute inset-0 bg-[#006FFF]" />
        {/* Mesh orbs */}
        <div className="pointer-events-none absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-[10%] w-[350px] h-[350px] bg-brand-blue/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-[10%] w-[300px] h-[300px] bg-brand-orange/8 rounded-full blur-[80px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-brand-gold/6 rounded-full blur-[60px]" />
        </div>

        <div className="section-container relative z-10 section-padding">
          {/* Section intro — left-aligned editorial style */}
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-end mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5"
            >
              <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full bg-white/10 text-white/90 mb-6">Impact</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-white tracking-tight leading-[1.1]">
                Already Transforming Careers
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-7"
            >
              <p className="text-lg text-white/90 leading-relaxed lg:max-w-xl">
                Digital Ghuru has successfully trained and placed students through workshops, offline classes, and our AI-powered post-graduate programs.
              </p>
            </motion.div>
          </div>

          {/* Stat cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {statsData.map((stat, idx) => {
              const Icon = stat.icon;
              const ac = accentClasses(stat.accent);
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.12 }}
                  className="group relative rounded-3xl p-8 sm:p-10 bg-white shadow-xl hover:-translate-y-2 transition-all duration-400"
                >
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${ac.glow} to-transparent border ${ac.border}`}>
                        <Icon className={`h-6 w-6 ${ac.text}`} />
                      </div>
                    </div>
                    <div className={`font-heading text-5xl sm:text-6xl font-black ${ac.text} mb-2 tracking-tight`}>
                      {stat.value}
                    </div>
                    <h3 className="text-xl font-bold text-ink-900 mb-2">{stat.label}</h3>
                    <p className="text-ink-600 leading-relaxed">{stat.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ━━━ CAMPUSES ━━━ */}
      <section className="section-padding bg-white relative overflow-hidden">
        <div className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/3 rounded-full blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-orange/3 rounded-full blur-[100px]" />

        <div className="section-container relative z-10">
          <SectionHeader
            eyebrow="Locations"
            title="Our Campuses"
            description="Award-winning Digital Marketing Institute — located across multiple cities."
          />

          <div className="space-y-8 max-w-5xl mx-auto">
            {locations.map((loc, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                className="group relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-ink-50/80 to-white border border-ink-100/60 hover:shadow-[0_16px_60px_rgba(0,0,0,0.07)] transition-all duration-500"
              >
                {/* Large city watermark */}
                <div className="absolute top-4 right-6 font-heading text-[80px] md:text-[120px] font-black leading-none text-ink-900/[0.03] select-none pointer-events-none">
                  {loc.city}
                </div>

                <div className="relative z-10 p-8 sm:p-10 md:p-12">
                  <div className="flex flex-col md:flex-row md:items-start gap-8">
                    {/* Left — Icon + Name */}
                    <div className="md:w-1/3">
                      <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${loc.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-heading font-black text-ink-900 tracking-tight mb-1">
                        {loc.name}
                      </h3>
                      <span className="text-sm text-ink-400 font-semibold uppercase tracking-wider">{loc.city}</span>
                    </div>

                    {/* Right — Details */}
                    <div className="md:w-2/3 md:pt-2">
                      <p className="text-ink-600 leading-[1.8] text-lg mb-8">
                        {loc.address}
                      </p>

                      {/* Contact chips */}
                      <div className="flex flex-wrap gap-3">
                        <a
                          href={`tel:${loc.phone}`}
                          className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-ink-900/[0.04] hover:bg-brand-blue/10 border border-transparent hover:border-brand-blue/20 text-sm font-medium text-ink-700 hover:text-brand-blue transition-all duration-300"
                        >
                          <Phone className="h-4 w-4" />
                          {loc.phone}
                        </a>
                        <a
                          href={`mailto:${loc.email}`}
                          className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-ink-900/[0.04] hover:bg-brand-blue/10 border border-transparent hover:border-brand-blue/20 text-sm font-medium text-ink-700 hover:text-brand-blue transition-all duration-300"
                        >
                          <Mail className="h-4 w-4" />
                          {loc.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* ━━━ RECOGNITIONS ━━━ */}
      <section className="section-padding relative overflow-hidden bg-gradient-to-br from-brand-blue via-blue-600 to-brand-blue">
        <div className="pointer-events-none absolute top-0 right-1/4 w-[400px] h-[400px] bg-white/5 rounded-full blur-[80px]" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-brand-gold/10 rounded-full blur-[60px]" />

        <div className="section-container text-center relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="h-20 w-20 mx-auto mb-8 rounded-3xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
              <Award className="h-10 w-10 text-brand-gold" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-white tracking-tight mb-6 leading-tight">
              Pioneering AI-Powered<br />Marketing Education
            </h2>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-2xl mx-auto mb-10">
              Digital Ghuru stands at the forefront of digital marketing education in India. We are transforming careers through our innovative agency-style training, live client projects, and a cutting-edge AI-integrated curriculum.
            </p>
            <Button href="/careers" variant="primary" size="lg">
              <span className="flex items-center gap-2">
                Join the Revolution <ArrowRight className="h-5 w-5" />
              </span>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
