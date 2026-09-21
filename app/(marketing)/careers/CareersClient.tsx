"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Bot,
  TrendingUp,
  Heart,
  ChevronDown,
  ChevronUp,
  MapPin,
  Briefcase,
  Send,
  CheckCircle2,
} from "lucide-react";
import { submitApplication } from "@/lib/actions/careers";
import HeroSection from "@/components/sections/HeroSection";

const benefits = [
  {
    icon: Bot,
    title: "AI-First Workflows",
    description: "We are an AI-integrated workplace. Master cutting-edge LLMs, prompting frameworks, and automated integrations in your daily tasks.",
    gradient: "from-blue-500/10 to-indigo-500/10",
    border: "group-hover:border-blue-500/30",
    iconColor: "text-blue-600"
  },
  {
    icon: Users,
    title: "Agency Environment",
    description: "Work alongside our active digital agency vertical. Gain access to real-time client accounts, live spends, and campaign briefs.",
    gradient: "from-emerald-500/10 to-teal-500/10",
    border: "group-hover:border-emerald-500/30",
    iconColor: "text-emerald-600"
  },
  {
    icon: TrendingUp,
    title: "Accelerated Growth",
    description: "Double your skillset inside a year. We support you to lead premium courses, publish case studies, and present at industry meetups.",
    gradient: "from-amber-500/10 to-orange-500/10",
    border: "group-hover:border-amber-500/30",
    iconColor: "text-amber-600"
  },
  {
    icon: Heart,
    title: "Employee Well-being",
    description: "Enjoy flexible hybrid setups, monthly performance bonuses, medical insurance benefits, and regular team bonding dinners.",
    gradient: "from-rose-500/10 to-pink-500/10",
    border: "group-hover:border-rose-500/30",
    iconColor: "text-rose-600"
  },
];

export default function CareersClient({ jobs }: { jobs: any[] }) {
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "speculative",
    bio: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const toggleJob = (id: string) => {
    setExpandedJobId(expandedJobId === id ? null : id);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.name || !formData.email || !formData.phone) {
      setErrorMsg("Please complete all required fields.");
      return;
    }

    setIsSubmitting(true);

    const res = await submitApplication(formData);

    setIsSubmitting(false);
    if (res.success) {
      setIsSuccess(true);
    } else {
      setErrorMsg(res.error || "Something went wrong.");
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <HeroSection
        eyebrow="JOIN THE TEAM"
        title="Build the Future of"
        titleHighlight="Tech & Digital Skills"
        description="Join a cutting-edge institute that bridges the gap between education and industry. Whether you're an expert in digital marketing, full-stack development, or career counseling—scale your expertise alongside top industry leaders."
        imageUrl="/images/careers_hero.jpg" 
        primaryCta={{ label: "Explore Open Openings", href: "#open-roles" }}
        secondaryCta={{ label: "Submit Application", href: "#speculative-form" }}
      />

      {/* Why Join Us */}
      <section className="section-padding bg-white border-b border-ink-200">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="heading-lg mb-4 text-ink-900">
              Why You&apos;ll Love Working Here
            </h2>
            <p className="body-lg max-w-2xl mx-auto text-ink-500">
              We value execution, quick adaptation, and collaborative mentorship. Here are the core benefits of becoming a member of the Digital Ghuru crew:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={idx}
                  className={`group relative overflow-hidden rounded-3xl border border-ink-100 bg-white p-6 shadow-card hover:shadow-card-hover transition-all duration-300 ${benefit.border}`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                  />
                  <div className="relative z-10 flex flex-col items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-white shadow-md flex items-center justify-center shrink-0 border border-ink-100/50 group-hover:scale-110 transition-transform duration-300">
                      <Icon className={`h-6 w-6 ${benefit.iconColor}`} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-heading text-lg font-bold text-ink-900 group-hover:text-brand-blue transition-colors duration-200">
                        {benefit.title}
                      </h3>
                      <p className="text-base text-ink-500 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Roles Section */}
      <section className="section-padding bg-ink-50 border-b border-ink-200" id="open-roles">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="heading-lg mb-4 text-ink-900">
              Active Career Opportunities
            </h2>
            <p className="body-lg max-w-2xl mx-auto text-ink-500">
              Find a role that matches your skills. Click on any opening to view details, responsibilities, and requirements.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {jobs.length === 0 ? (
              <div className="py-12 text-center bg-white rounded-3xl border border-ink-200">
                <p className="text-ink-500">No active job openings at the moment. Feel free to submit an application below!</p>
              </div>
            ) : jobs.map((job) => {
              const isExpanded = expandedJobId === job.id;
              return (
                <div
                  key={job.id}
                  className="bg-white rounded-3xl border border-ink-100 overflow-hidden shadow-card transition-all duration-300"
                >
                  <button
                    onClick={() => toggleJob(job.id)}
                    className="w-full p-6 md:p-8 text-left flex flex-col md:flex-row md:items-center justify-between gap-4 focus:outline-none hover:bg-ink-50/50 transition-colors"
                  >
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold uppercase tracking-wider">
                          {job.department}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-ink-100 text-ink-700 text-xs font-bold uppercase tracking-wider">
                          {job.type}
                        </span>
                      </div>
                      <h3 className="font-heading text-xl md:text-2xl font-bold text-ink-900">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-6 text-base text-ink-500 font-medium">
                        <span className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-ink-400" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-ink-400" />
                          Exp: {job.experience}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 text-brand-blue font-heading font-bold text-sm">
                      <span>{isExpanded ? "Show Less" : "View Details"}</span>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden border-t border-ink-100"
                      >
                        <div className="p-6 md:p-8 bg-ink-50/50 space-y-8">
                          <p className="text-base text-ink-700 leading-relaxed font-medium">
                            {job.description}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                              <h4 className="font-heading text-base font-bold text-ink-900 flex items-center gap-2">
                                <div className="w-1.5 h-6 bg-brand-orange rounded-full" />
                                Key Responsibilities
                              </h4>
                              <ul className="space-y-3">
                                {job.responsibilities.map((resp: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-3">
                                    <div className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-blue shrink-0" />
                                    <span className="text-base text-ink-600 leading-relaxed">{resp}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="space-y-4">
                              <h4 className="font-heading text-base font-bold text-ink-900 flex items-center gap-2">
                                <div className="w-1.5 h-6 bg-brand-orange rounded-full" />
                                Requirements
                              </h4>
                              <ul className="space-y-3">
                                {job.requirements.map((req: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-3">
                                    <div className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-blue shrink-0" />
                                    <span className="text-base text-ink-600 leading-relaxed">{req}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="pt-6 border-t border-ink-200 flex justify-start">
                            <a
                              href="#speculative-form"
                              onClick={(e) => {
                                if (typeof window !== "undefined" && (window as any).lenis) {
                                  e.preventDefault();
                                  (window as any).lenis.scrollTo("#speculative-form", { offset: -80, duration: 1.5 });
                                }
                                setFormData({
                                  ...formData,
                                  category: job.slug,
                                });
                              }}
                              className="px-8 py-3 rounded-xl bg-brand-blue hover:bg-blue-700 text-white font-heading font-bold text-sm shadow-md transition-all duration-200"
                            >
                              Apply For This Role
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hiring Process Roadmap */}
      <section className="section-padding bg-white border-b border-ink-200">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="heading-lg mb-4 text-ink-900">Our Recruitment Funnel</h2>
            <p className="body-lg max-w-2xl mx-auto text-ink-500">
              We respect your time. Our simplified recruitment process focuses on practical talent evaluations and fast communication.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative max-w-5xl mx-auto">
            <div className="hidden lg:block absolute top-[28px] left-[15%] right-[15%] h-0.5 bg-ink-200 -z-10" />

            {[
              { step: "01", label: "Submit Details", desc: "Share your resume, link your portfolio or past agency campaigns." },
              { step: "02", label: "Skills Check", desc: "Show your execution capacity via a short audit task or creative brief." },
              { step: "03", label: "Personal Pitch", desc: "Interact with our lead mentors to verify cultural fit and goals." },
              { step: "04", label: "Offer & Onboard", desc: "Get details, sign agreements, and align with your batch." }
            ].map((process, idx) => (
              <div key={idx} className="flex flex-col items-center text-center space-y-4">
                <div className="h-14 w-14 rounded-full bg-white border-4 border-ink-100 text-[#0d2f62] font-display font-black text-lg flex items-center justify-center shadow-sm relative">
                  <div className="absolute inset-1 rounded-full bg-[#0d2f62]/5" />
                  <span className="relative z-10">{process.step}</span>
                </div>
                <h3 className="font-heading text-lg font-bold text-ink-900">{process.label}</h3>
                <p className="text-base text-ink-500 leading-relaxed px-4">{process.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="section-padding bg-white" id="speculative-form">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl border border-ink-100 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-8 md:p-12">
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.form
                    key="careers-form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="text-center pb-6 border-b border-ink-100">
                      <h3 className="font-heading text-2xl font-bold text-ink-900 mb-2">
                        Submit Your Application
                      </h3>
                      <p className="text-ink-500 text-sm md:text-base leading-relaxed">
                        Don&apos;t find an active opening matching your domain? Submit an application and we will reach out if a role opens.
                      </p>
                    </div>

                    {errorMsg && (
                      <div className="p-4 rounded-xl bg-red-50 text-red-600 text-xs font-semibold border border-red-100">
                        {errorMsg}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-ink-700 uppercase" htmlFor="name">Full Name *</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Full Name"
                          className="w-full px-4 py-3.5 rounded-xl border border-ink-200 text-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors bg-white shadow-sm"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-ink-700 uppercase" htmlFor="email">Email Address *</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Email Address"
                          className="w-full px-4 py-3.5 rounded-xl border border-ink-200 text-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors bg-white shadow-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-ink-700 uppercase" htmlFor="phone">Phone Number *</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Phone Number"
                          className="w-full px-4 py-3.5 rounded-xl border border-ink-200 text-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors bg-white shadow-sm"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-ink-700 uppercase" htmlFor="category">Position of Interest *</label>
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3.5 rounded-xl border border-ink-200 text-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors bg-white shadow-sm font-medium"
                        >
                          {jobs.map((job) => (
                            <option key={job.slug} value={job.slug}>{job.title}</option>
                          ))}
                          <option value="marketing">Performance Marketing</option>
                          <option value="speculative">Other / General Application</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-ink-700 uppercase" htmlFor="bio">
                        Short Cover Pitch (Tell us why you want to join us)
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Briefly describe your experience and accomplishments..."
                        className="w-full px-4 py-3.5 rounded-xl border border-ink-200 text-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors bg-white shadow-sm resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 mt-4 rounded-xl bg-gradient-to-r from-[#FFB800] to-[#FF5C00] text-white font-heading font-bold text-base flex items-center justify-center gap-2 hover:brightness-110 shadow-md shadow-orange-500/20 transition-all duration-200 disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Submitting Application...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          Submit Application
                        </>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="careers-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 space-y-6"
                  >
                    <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto shadow-inner">
                      <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-heading text-2xl font-bold text-ink-900">
                        Application Submitted!
                      </h3>
                      <p className="text-base text-ink-600 max-w-sm mx-auto leading-relaxed">
                        Thank you, <span className="font-bold text-ink-900">{formData.name}</span>. We have successfully registered your application for review.
                      </p>
                    </div>
                    <div className="pt-6 border-t border-ink-100">
                      <button
                        onClick={() => {
                          setIsSuccess(false);
                          setFormData({
                            name: "",
                            email: "",
                            phone: "",
                            category: "speculative",
                            bio: "",
                          });
                        }}
                        className="px-6 py-3 rounded-xl border border-ink-200 text-sm font-bold font-heading text-ink-700 hover:bg-ink-50 hover:text-brand-blue transition-colors shadow-sm"
                      >
                        Submit another application
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
