"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, ChevronRight, ChevronLeft, Save, Loader2, Target, CheckCircle, Search, Laptop2, Users, FileText, Layers, Star, Video, PlayCircle, Link as LinkIcon, BookOpen, Upload, Image as ImageIcon, X, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import IconPickerDropdown from "@/components/ui/IconPickerDropdown";
import { useToast } from "@/components/ui/Toast";

interface CourseWizardProps {
  initialData?: any;
  onComplete: (data: any) => void;
  isSaving?: boolean;
  isEditMode?: boolean;
}

const STEPS = [
  "Basic Details",
  "Course Overview",
  "Designed To Help",
  "Numbered Features",
  "Why Digital Ghuru",
  "Target Audience",
  "Top Highlights",
  "Tools Mastered",
  "Modules",
  "FAQs"
];

const DEFAULT_TOOL_ICONS: Record<string, string> = {
  "ChatGPT": "/tools/openai.svg",
  "OpenAI": "/tools/openai.svg",
  "Midjourney": "/tools/midjourney.svg",
  "Canva": "/tools/canva.svg",
  "WordPress": "/tools/wordpress.svg",
  "Google Ads": "/tools/googleads.svg",
  "Meta Ads": "/tools/meta.svg",
  "Meta": "/tools/meta.svg",
  "Zapier": "/tools/zapier.svg",
  "Google Analytics": "/tools/googleanalytics.svg",
  "SEMrush": "/tools/semrush.svg",
  "Mailchimp": "/tools/mailchimp.svg",
  "Hootsuite": "/tools/hootsuite.svg",
  "Anthropic": "/tools/anthropic.svg",
  "Claude": "/tools/anthropic.svg",
  "React": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
  "Node.js": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
  "Express": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg",
  "MongoDB": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg",
  "HTML5": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
  "CSS3": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
  "JavaScript": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
  "Git": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg",
  "GitHub": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg",
  "Postman": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg",
  "VS Code": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg",
  "Tailwind CSS": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
  "Redux": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redux/redux-original.svg"
};

function getToolIcon(name: string): string {
  if (!name) return "/tools/openai.svg";
  const trimmed = name.trim();
  if (DEFAULT_TOOL_ICONS[trimmed]) return DEFAULT_TOOL_ICONS[trimmed];
  for (const [key, val] of Object.entries(DEFAULT_TOOL_ICONS)) {
    if (key.toLowerCase() === trimmed.toLowerCase()) return val;
  }
  return "/tools/openai.svg";
}

function normalizeWizardData(initialData?: any) {
  if (!initialData) {
    const starterTools = [
      { name: "ChatGPT", iconUrl: "/tools/openai.svg" },
      { name: "Canva", iconUrl: "/tools/canva.svg" },
      { name: "Google Ads", iconUrl: "/tools/googleads.svg" },
      { name: "Meta Ads", iconUrl: "/tools/meta.svg" }
    ];
    return {
      title: "",
      slug: "",
      subtitle: "",
      description: "",
      duration: "",
      format: "",
      originalPrice: "",
      discountedPrice: "",
      batchInfo: "",
      location: "",
      isPublished: false,
      marketing_data: {
        highlightsData: [],
        designedToHelp: { title: "This course is designed to help you", description: "", benefits: [] },
        numberedFeatures: { title: "", description: "", features: [] },
        whyDigitalGhuru: { title: "", reasons: [] },
        whoIsThisForData: [],
        categorizedToolsData: [
          {
            category: "Core Tools & Technologies",
            title: "Core Tools & Technologies",
            description: "Master essential industry tools and platforms.",
            bgClass: "bg-white",
            textClass: "text-[#0d2f62]",
            tools: starterTools,
            items: starterTools
          }
        ],
        tools: ["ChatGPT", "Canva", "Google Ads", "Meta Ads"],
        faqs: [],
        overviewDescription: [],
        overviewLearnings: []
      },
      modules: [
        {
          title: "Module 1: Audience Research & Strategy",
          lessons: [
            { title: "Understand the digital ecosystem and customer journey", videoUrl: "" },
            { title: "Learn core marketing concepts and strategies", videoUrl: "" }
          ]
        },
        {
          title: "Module 2: Practical Implementation",
          lessons: [
            { title: "Setup and walkthrough of essential tools", videoUrl: "" },
            { title: "Hands-on project and campaign building", videoUrl: "" }
          ]
        }
      ]
    };
  }

  const mData = initialData.marketing_data || {};

  // Clean overviewDescription in case it contains React nodes from courseData fallback
  const rawOverviewDesc = mData.overviewDescription || initialData.overviewDescription || [];
  const cleanOverviewDesc = Array.isArray(rawOverviewDesc)
    ? rawOverviewDesc.map((item: any) => {
        if (typeof item === "string") return item;
        if (item?.props?.children) {
          if (Array.isArray(item.props.children)) {
            return item.props.children.map((c: any) => (typeof c === "string" ? c : (c?.props?.children || ""))).join("");
          }
          return String(item.props.children);
        }
        return String(item || "");
      })
    : [];

  const rawLearnings = mData.overviewLearnings || initialData.overviewLearnings || [];
  const cleanLearnings = Array.isArray(rawLearnings)
    ? rawLearnings.map((item: any) => (typeof item === "string" ? item : String(item || "")))
    : [];

  // Parse modules and lessons from DB initialModules/initialChapters, mData.curriculum, or initialData.modules
  let initialModulesList: any[] = [];
  if (Array.isArray(initialData?.initialModules) && initialData.initialModules.length > 0) {
    const chaps = Array.isArray(initialData.initialChapters) ? initialData.initialChapters : [];
    initialModulesList = initialData.initialModules.map((mod: any, i: number) => {
      const modChaps = chaps.filter((c: any) => c.moduleId === mod.id);
      return {
        id: mod.id,
        title: mod.title || `Module ${i + 1}`,
        lessons: modChaps.length > 0
          ? modChaps.map((ch: any) => ({
              id: ch.id,
              title: ch.title || "",
              videoUrl: ch.videoUrl || ""
            }))
          : [{ title: `Lesson 1: Introduction`, videoUrl: "" }]
      };
    });
  } else if (Array.isArray(mData?.curriculum) && mData.curriculum.length > 0) {
    initialModulesList = mData.curriculum.map((c: any, i: number) => ({
      title: c.module || `Module ${i + 1}`,
      lessons: Array.isArray(c.topics) && c.topics.length > 0
        ? c.topics.map((t: any, j: number) => ({
            title: typeof t === "string" ? t : (t?.title || `Lesson ${j + 1}`),
            videoUrl: typeof t === "object" ? (t?.videoUrl || "") : ""
          }))
        : [{ title: `Lesson 1: Introduction`, videoUrl: "" }]
    }));
  } else if (Array.isArray(initialData?.modules) && initialData.modules.length > 0) {
    initialModulesList = initialData.modules.map((m: any, i: number) => {
      if (typeof m === "string") {
        return {
          title: m,
          lessons: [{ title: `Lesson 1: Introduction to ${m}`, videoUrl: "" }]
        };
      }
      return {
        id: m.id,
        title: m.title || `Module ${i + 1}`,
        lessons: Array.isArray(m.lessons) && m.lessons.length > 0
          ? m.lessons.map((l: any) => ({
              id: l.id,
              title: typeof l === "string" ? l : (l?.title || ""),
              videoUrl: typeof l === "object" ? (l?.videoUrl || "") : ""
            }))
          : [{ title: "Lesson 1: Introduction", videoUrl: "" }]
      };
    });
  } else {
    initialModulesList = [
      {
        title: "Module 1: Audience Research & Strategy",
        lessons: [
          { title: "Understand the digital ecosystem and customer journey", videoUrl: "" },
          { title: "Learn core marketing concepts and strategies", videoUrl: "" }
        ]
      },
      {
        title: "Module 2: Practical Implementation",
        lessons: [
          { title: "Setup and walkthrough of essential tools", videoUrl: "" },
          { title: "Hands-on project and campaign building", videoUrl: "" }
        ]
      }
    ];
  }

  const rawAudiences = mData.whoIsThisForData || initialData.whoIsThisForData || mData.whoIsThisFor || [];
    const cleanAudiences = Array.isArray(rawAudiences) && rawAudiences.length > 0
      ? rawAudiences.map((aud: any) => ({
          role: aud.role || aud.title || "",
          title: aud.title || aud.role || "",
          desc: aud.desc || aud.description || "",
          description: aud.description || aud.desc || "",
          iconName: aud.iconName || "User",
          points: Array.isArray(aud.points)
            ? aud.points.map((p: any) => (typeof p === "string" ? p : String(p || "")))
            : []
        }))
      : [
          {
            role: "Entrepreneurs",
            title: "Entrepreneurs",
            desc: "An all-inclusive program designed to empower your entrepreneurial journey in the digital world.",
            description: "An all-inclusive program designed to empower your entrepreneurial journey in the digital world.",
            iconName: "TrendingUp",
            points: ["Build a strong online presence", "Generate quality leads and sales", "Stay ahead using modern strategies"]
          },
          {
            role: "Professionals",
            title: "Professionals",
            desc: "A career-focused program to help you upgrade your skills and grow in your field.",
            description: "A career-focused program to help you upgrade your skills and grow in your field.",
            iconName: "Briefcase",
            points: ["Learn in-demand practical skills", "Transition into high-growth roles", "Enhance career opportunities"]
          },
          {
            role: "Students",
            title: "Students",
            desc: "A complete beginner-friendly program to kickstart your professional career.",
            description: "A complete beginner-friendly program to kickstart your professional career.",
            iconName: "GraduationCap",
            points: ["Gain practical, job-ready skills", "Work on real-time projects and portfolio", "Prepare for interviews and placement"]
          },
          {
            role: "Freelancers",
            title: "Freelancers",
            desc: "A growth-oriented program to help you scale your freelancing career.",
            description: "A growth-oriented program to help you scale your freelancing career.",
            iconName: "Laptop",
            points: ["Expand your service offerings", "Attract high-paying global clients", "Build consistent income streams"]
          }
        ];

  // Normalize tools and categorizedToolsData
  const rawCategorizedTools = mData.categorizedToolsData || initialData.categorizedToolsData;
  const rawFlatTools = mData.tools || initialData.tools;

  let cleanCategorizedTools: any[] = [];
  let cleanFlatTools: string[] = [];

  if (Array.isArray(rawCategorizedTools) && rawCategorizedTools.length > 0) {
    cleanCategorizedTools = rawCategorizedTools.map((group: any) => {
      const categoryName = (group.category || group.title || "Core Tools").replace(/\n/g, " ").trim();
      const rawItems = group.tools || group.items || [];
      const normalizedItems = rawItems.map((item: any) => {
        if (typeof item === "string") {
          return { name: item, iconUrl: getToolIcon(item) };
        }
        let itemName = item.name || "";
        if (!itemName && item.iconUrl) {
          const filePart = item.iconUrl.split("/").pop() || "";
          const namePart = filePart.replace(/[-_](original|wordmark)?\.[^/.]+$/, "").replace(/\.[^/.]+$/, "");
          itemName = namePart ? namePart.toUpperCase() : "Tool";
        }
        return {
          name: itemName || "Tool",
          iconUrl: item.iconUrl || getToolIcon(itemName)
        };
      });

      return {
        category: categoryName,
        title: categoryName,
        description: group.description || "Master essential industry tools and platforms.",
        bgClass: group.bgClass || "bg-white",
        textClass: group.textClass || "text-[#0d2f62]",
        tools: normalizedItems,
        items: normalizedItems
      };
    });

    cleanFlatTools = Array.isArray(rawFlatTools) && rawFlatTools.length > 0
      ? rawFlatTools
      : cleanCategorizedTools.flatMap((g: any) => (g.tools || []).map((t: any) => t.name).filter(Boolean));
  } else if (Array.isArray(rawFlatTools) && rawFlatTools.length > 0) {
    const toolItems = rawFlatTools.map((t: any) => {
      const toolName = typeof t === "string" ? t : (t.name || "Tool");
      const iconUrl = typeof t === "object" && t.iconUrl ? t.iconUrl : getToolIcon(toolName);
      return { name: toolName, iconUrl };
    });

    cleanCategorizedTools = [
      {
        category: "Core Industry Tools",
        title: "Core Industry Tools",
        description: "Master essential industry-standard tools and platforms.",
        bgClass: "bg-white",
        textClass: "text-[#0d2f62]",
        tools: toolItems,
        items: toolItems
      }
    ];
    cleanFlatTools = toolItems.map((t: any) => t.name);
  } else {
    const defaultStarter = [
      { name: "ChatGPT", iconUrl: "/tools/openai.svg" },
      { name: "Canva", iconUrl: "/tools/canva.svg" },
      { name: "Google Ads", iconUrl: "/tools/googleads.svg" },
      { name: "Meta Ads", iconUrl: "/tools/meta.svg" }
    ];
    cleanCategorizedTools = [
      {
        category: "Core Industry Tools",
        title: "Core Industry Tools",
        description: "Master essential industry-standard tools and platforms.",
        bgClass: "bg-white",
        textClass: "text-[#0d2f62]",
        tools: defaultStarter,
        items: defaultStarter
      }
    ];
    cleanFlatTools = ["ChatGPT", "Canva", "Google Ads", "Meta Ads"];
  }

    const cardImage = initialData.cardImage || mData.cardImage || initialData.thumbnail || mData.thumbnail || "";
    const bannerImage = initialData.bannerImage || mData.bannerImage || initialData.heroImage || mData.heroImage || "";
    const brochureUrl = initialData.brochureUrl || mData.brochureUrl || "";

    return {
      title: initialData.title || mData.title || "",
      slug: initialData.slug || mData.slug || "",
      subtitle: initialData.subtitle || mData.subtitle || "",
      description: initialData.description || mData.description || "",
      duration: initialData.duration || mData.duration || "",
      format: initialData.format || mData.format || "",
      originalPrice: initialData.originalPrice || mData.originalPrice || "",
      discountedPrice: initialData.discountedPrice || mData.discountedPrice || initialData.price || "",
      batchInfo: initialData.batchInfo || mData.batchInfo || "",
      location: initialData.location || mData.location || "",
      isPublished: initialData.isPublished ?? false,
      cardImage,
      bannerImage,
      brochureUrl,
      marketing_data: {
        cardImage,
        bannerImage,
        brochureUrl,
        highlightsData: mData.highlightsData || initialData.highlightsData || [],
        designedToHelp: mData.designedToHelp || initialData.designedToHelp || { title: "This course is designed to help you", description: "", benefits: [] },
        numberedFeatures: mData.numberedFeatures || initialData.numberedFeatures || { title: "", description: "", features: [] },
        whyDigitalGhuru: mData.whyDigitalGhuru || initialData.whyDigitalGhuru || { title: "", reasons: [] },
        whoIsThisForData: cleanAudiences,
        categorizedToolsData: cleanCategorizedTools,
        tools: cleanFlatTools,
        faqs: mData.faqs || initialData.faqs || [],
        overviewDescription: cleanOverviewDesc,
        overviewLearnings: cleanLearnings
      },
      modules: initialModulesList
    };
}

export default function CourseWizard({ 
  initialData, 
  onComplete, 
  isSaving = false, 
  isEditMode = false 
}: CourseWizardProps) {
  const toast = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<any>(() => normalizeWizardData(initialData));
  const [uploadingCard, setUploadingCard] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingBrochure, setUploadingBrochure] = useState(false);
  const cardFileInputRef = useRef<HTMLInputElement | null>(null);
  const bannerFileInputRef = useRef<HTMLInputElement | null>(null);
  const brochureFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (file: File, type: "card" | "banner" | "brochure") => {
    const isCard = type === "card";
    const isBanner = type === "banner";
    const isBrochure = type === "brochure";
    if (isCard) setUploadingCard(true);
    else if (isBanner) setUploadingBanner(true);
    else if (isBrochure) setUploadingBrochure(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "courses");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });

      const json = await res.json();
      if (res.ok && json.url) {
        if (isCard) {
          setData((prev: any) => ({
            ...prev,
            cardImage: json.url,
            marketing_data: { ...prev.marketing_data, cardImage: json.url }
          }));
          toast.success("Card Image Uploaded", "Course card thumbnail has been updated.");
        } else if (isBanner) {
          setData((prev: any) => ({
            ...prev,
            bannerImage: json.url,
            marketing_data: { ...prev.marketing_data, bannerImage: json.url }
          }));
          toast.success("Banner Image Uploaded", "Course detail banner image has been updated.");
        } else if (isBrochure) {
          setData((prev: any) => ({
            ...prev,
            brochureUrl: json.url,
            marketing_data: { ...prev.marketing_data, brochureUrl: json.url }
          }));
          toast.success("Brochure Uploaded", "Course brochure has been updated.");
        }
      } else {
        toast.error("Upload Failed", json.error || "Could not upload image. Please try again.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Upload Failed", "Network or server error during upload.");
    } finally {
      if (isCard) setUploadingCard(false);
      else if (isBanner) setUploadingBanner(false);
      else if (isBrochure) setUploadingBrochure(false);
    }
  };

  const updateMarketing = (key: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      marketing_data: {
        ...prev.marketing_data,
        [key]: value
      }
    }));
  };

  const mData = data.marketing_data;

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(s => s + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  };

  const handleSubmit = () => {
    // Keep marketing_data.curriculum synchronized with modules and lessons
    const curriculum = (data.modules || []).map((m: any, idx: number) => ({
      module: m.title || `Module ${idx + 1}`,
      topics: (m.lessons || []).map((l: any) => (typeof l === "string" ? l : l.title || "")).filter(Boolean)
    }));

    const FEATURE_PALETTES = [
      { gradient: "from-blue-500/10 to-indigo-500/10", border: "group-hover:border-blue-500/30", iconColor: "text-blue-600", dotColor: "bg-blue-500" },
      { gradient: "from-emerald-500/10 to-teal-500/10", border: "group-hover:border-emerald-500/30", iconColor: "text-emerald-600", dotColor: "bg-emerald-500" },
      { gradient: "from-amber-500/10 to-orange-500/10", border: "group-hover:border-amber-500/30", iconColor: "text-amber-600", dotColor: "bg-amber-500" },
      { gradient: "from-rose-500/10 to-pink-500/10", border: "group-hover:border-rose-500/30", iconColor: "text-rose-600", dotColor: "bg-rose-500" },
      { gradient: "from-purple-500/10 to-fuchsia-500/10", border: "group-hover:border-purple-500/30", iconColor: "text-purple-600", dotColor: "bg-purple-500" },
      { gradient: "from-cyan-500/10 to-blue-500/10", border: "group-hover:border-cyan-500/30", iconColor: "text-cyan-600", dotColor: "bg-cyan-500" }
    ];

    const cleanFeatures = (data.marketing_data?.numberedFeatures?.features || []).map((f: any, i: number) => {
      const p = FEATURE_PALETTES[i % FEATURE_PALETTES.length];
      return {
        ...f,
        gradient: f.gradient || p.gradient,
        border: f.border || p.border,
        iconColor: f.iconColor || p.iconColor
      };
    });

    const cleanAudiences = (data.marketing_data?.whoIsThisForData || []).map((a: any, i: number) => {
      const p = FEATURE_PALETTES[i % FEATURE_PALETTES.length];
      return {
        ...a,
        gradient: a.gradient || p.gradient,
        border: a.border || p.border,
        iconColor: a.iconColor || p.iconColor,
        dotColor: a.dotColor || p.dotColor
      };
    });

    const cleanHighlights = (data.marketing_data?.highlightsData || []).map((h: any, i: number) => {
      const p = FEATURE_PALETTES[i % FEATURE_PALETTES.length];
      return {
        ...h,
        gradient: h.gradient || p.gradient,
        border: h.border || p.border,
        iconColor: h.iconColor || p.iconColor
      };
    });

    const cleanBenefits = (data.marketing_data?.designedToHelp?.benefits || []).map((b: any, i: number) => {
      const p = FEATURE_PALETTES[i % FEATURE_PALETTES.length];
      return {
        ...b,
        gradient: b.gradient || p.gradient,
        border: b.border || p.border,
        iconColor: b.iconColor || p.iconColor
      };
    });

    const cleanToolsGroups = (data.marketing_data?.categorizedToolsData || []).map((group: any) => {
      const categoryName = group.category || group.title || "Tools";
      const toolsList = (group.tools || group.items || []).map((t: any) => ({
        name: t.name || "",
        iconUrl: t.iconUrl || getToolIcon(t.name)
      }));
      return {
        ...group,
        category: categoryName,
        title: categoryName,
        tools: toolsList,
        items: toolsList
      };
    });

    const flatToolNames: string[] = [];
    cleanToolsGroups.forEach((g: any) => {
      (g.tools || []).forEach((t: any) => {
        if (t.name && !flatToolNames.includes(t.name)) {
          flatToolNames.push(t.name);
        }
      });
    });

    const cardImage = data.cardImage || data.marketing_data?.cardImage || "";
    const bannerImage = data.bannerImage || data.marketing_data?.bannerImage || "";

    const payload = {
      ...data,
      cardImage,
      bannerImage,
      marketing_data: {
        ...data.marketing_data,
        cardImage,
        bannerImage,
        curriculum,
        highlightsData: cleanHighlights,
        designedToHelp: {
          ...(data.marketing_data?.designedToHelp || {}),
          benefits: cleanBenefits
        },
        numberedFeatures: {
          ...(data.marketing_data?.numberedFeatures || {}),
          features: cleanFeatures
        },
        whoIsThisForData: cleanAudiences,
        categorizedToolsData: cleanToolsGroups,
        tools: flatToolNames.length > 0 ? flatToolNames : (data.marketing_data?.tools || [])
      }
    };
    onComplete(payload);
  };

  return (
    <div className="w-full space-y-6">
      {/* Stepper Header */}
      <div className="bg-white p-5 rounded-2xl border border-ink-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-heading font-bold bg-brand-blue/10 text-brand-blue uppercase tracking-wider">
              Step {currentStep + 1} of {STEPS.length}
            </span>
            {isEditMode && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-heading font-semibold bg-emerald-50 text-emerald-600">
                Course Management Mode
              </span>
            )}
          </div>
          <h2 className="font-display text-xl font-bold text-ink-900">{STEPS[currentStep]}</h2>
        </div>

        {/* Quick Save button in Edit Mode at top */}
        {isEditMode && (
          <Button variant="primary" onClick={handleSubmit} disabled={isSaving || !data.title} className="shadow-sm">
            {isSaving ? (
              <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Saving...</>
            ) : (
              <><Save className="h-4 w-4 mr-1.5" /> Save Changes</>
            )}
          </Button>
        )}
      </div>

      {/* Interactive Step Navigation Bar */}
      <div className="bg-white p-2.5 rounded-2xl border border-ink-100 shadow-sm overflow-x-auto">
        <div className="flex gap-2 min-w-max 2xl:min-w-0 2xl:flex-wrap">
          {STEPS.map((stepName, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentStep(i)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-heading font-semibold transition-all flex items-center gap-2 ${
                i === currentStep
                  ? 'bg-brand-blue text-white shadow-sm'
                  : i < currentStep
                  ? 'bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20'
                  : 'bg-ink-50 text-ink-600 hover:bg-ink-100'
              }`}
              title={`Jump to ${stepName}`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                i === currentStep ? 'bg-white/25 text-white' : 'bg-ink-200 text-ink-700'
              }`}>
                {i + 1}
              </span>
              <span>{stepName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Content */}
      <div className="bg-white rounded-3xl border border-ink-100 shadow-card p-6 md:p-8 min-h-[400px]">
        
        {/* STEP 0: Basic Details */}
        {currentStep === 0 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-heading text-sm font-semibold text-ink-900 mb-2">Course Title <span className="text-red-500">*</span></label>
                <input type="text" value={data.title} onChange={e => setData({...data, title: e.target.value})} placeholder="e.g. Advanced AI Marketing" className="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-brand-blue outline-none" required />
              </div>
              <div>
                <label className="block font-heading text-sm font-semibold text-ink-900 mb-2">URL Slug</label>
                <input type="text" value={data.slug} onChange={e => setData({...data, slug: e.target.value})} placeholder="e.g. advanced-ai-marketing" className="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-brand-blue outline-none" />
              </div>
            </div>
            <div>
              <label className="block font-heading text-sm font-semibold text-ink-900 mb-2">Subtitle</label>
              <input type="text" value={data.subtitle} onChange={e => setData({...data, subtitle: e.target.value})} placeholder="e.g. Learn how to 10x your marketing using AI" className="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-brand-blue outline-none" />
            </div>
            <div>
              <label className="block font-heading text-sm font-semibold text-ink-900 mb-2">Short Description</label>
              <textarea value={data.description} onChange={e => setData({...data, description: e.target.value})} rows={3} placeholder="A brief summary for the course card..." className="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-brand-blue outline-none" />
            </div>

            {/* ── Course Images & Visual Banners ── */}
            <div className="p-6 rounded-2xl border border-ink-200 bg-ink-50/50 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-ink-200 pb-4">
                <div>
                  <h3 className="font-heading text-base font-bold text-ink-900 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-brand-blue" />
                    Course Card & Detail Banner Images
                  </h3>
                  <p className="text-xs text-ink-500 mt-0.5">
                    Upload image files directly from your computer or paste image URLs. If left empty, high-tech branded placeholders are displayed automatically.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. Course Card Image (Thumbnail) */}
                <div className="bg-white p-5 rounded-2xl border border-ink-100 shadow-sm flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-heading text-sm font-bold text-ink-900 flex items-center gap-1.5">
                        Course Card Image (16:9)
                      </label>
                      <span className="text-[11px] font-semibold text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded-full">
                        800 × 450 px
                      </span>
                    </div>
                    <p className="text-xs text-ink-500 mb-3">
                      Shown on course listing grids and catalog cards across the website.
                    </p>

                    {/* Preview Box */}
                    <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-ink-200 bg-slate-950 mb-3 group/preview">
                      {data.cardImage ? (
                        <>
                          <img src={data.cardImage} alt="Card Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setData({ ...data, cardImage: "", marketing_data: { ...data.marketing_data, cardImage: "" } })}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600/90 text-white hover:bg-red-700 shadow-sm transition-all"
                            title="Remove image and reset to placeholder"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold">
                            Live Card Image
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-gradient-to-br from-slate-950 via-brand-dark to-blue-950">
                          <ImageIcon className="w-8 h-8 text-blue-300 mb-1.5" />
                          <span className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                            Card Placeholder Active
                          </span>
                          <span className="text-[10px] text-ink-300 mt-0.5">
                            Upload an image to replace this placeholder
                          </span>
                        </div>
                      )}
                    </div>

                    {/* URL Input */}
                    <input
                      type="text"
                      value={data.cardImage || ""}
                      onChange={e => setData({ ...data, cardImage: e.target.value, marketing_data: { ...data.marketing_data, cardImage: e.target.value } })}
                      placeholder="Paste image URL (e.g. /uploads/courses/... or https://...)"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-ink-200 focus:border-brand-blue outline-none"
                    />
                  </div>

                  {/* Upload Button */}
                  <div>
                    <input
                      type="file"
                      ref={cardFileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, "card");
                        e.target.value = "";
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={uploadingCard}
                      onClick={() => cardFileInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 border-dashed border-ink-300 hover:border-brand-blue hover:text-brand-blue"
                    >
                      {uploadingCard ? (
                        <><Loader2 className="w-4 h-4 animate-spin text-brand-blue" /> Uploading Card Image...</>
                      ) : (
                        <><Upload className="w-4 h-4" /> Upload Card Image from Computer</>
                      )}
                    </Button>
                  </div>
                </div>

                {/* 2. Course Detail Banner Image (Hero Banner) */}
                <div className="bg-white p-5 rounded-2xl border border-ink-100 shadow-sm flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-heading text-sm font-bold text-ink-900 flex items-center gap-1.5">
                        Course Detail Banner Image
                      </label>
                      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        1920 × 600 px
                      </span>
                    </div>
                    <p className="text-xs text-ink-500 mb-3">
                      Shown across the top header banner on the course detail landing page.
                    </p>

                    {/* Preview Box */}
                    <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-ink-200 bg-slate-950 mb-3 group/preview">
                      {data.bannerImage ? (
                        <>
                          <img src={data.bannerImage} alt="Banner Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setData({ ...data, bannerImage: "", marketing_data: { ...data.marketing_data, bannerImage: "" } })}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600/90 text-white hover:bg-red-700 shadow-sm transition-all"
                            title="Remove banner and reset to placeholder"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold">
                            Live Banner Image
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-gradient-to-br from-slate-950 via-brand-dark to-indigo-950">
                          <ImageIcon className="w-8 h-8 text-emerald-300 mb-1.5" />
                          <span className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                            Banner Placeholder Active
                          </span>
                          <span className="text-[10px] text-ink-300 mt-0.5">
                            Upload a banner to replace this placeholder
                          </span>
                        </div>
                      )}
                    </div>

                    {/* URL Input */}
                    <input
                      type="text"
                      value={data.bannerImage || ""}
                      onChange={e => setData({ ...data, bannerImage: e.target.value, marketing_data: { ...data.marketing_data, bannerImage: e.target.value } })}
                      placeholder="Paste banner URL (e.g. /uploads/courses/... or https://...)"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-ink-200 focus:border-brand-blue outline-none"
                    />
                  </div>

                  {/* Upload Button */}
                  <div>
                    <input
                      type="file"
                      ref={bannerFileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, "banner");
                        e.target.value = "";
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={uploadingBanner}
                      onClick={() => bannerFileInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 border-dashed border-ink-300 hover:border-brand-blue hover:text-brand-blue"
                    >
                      {uploadingBanner ? (
                        <><Loader2 className="w-4 h-4 animate-spin text-brand-blue" /> Uploading Banner Image...</>
                      ) : (
                        <><Upload className="w-4 h-4" /> Upload Banner from Computer</>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-ink-100 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-heading text-sm font-bold text-ink-900 flex items-center gap-1.5">
                      Course Brochure (PDF)
                    </label>
                  </div>
                  <p className="text-xs text-ink-500 mb-3">
                    Upload the course syllabus or brochure in PDF format.
                  </p>

                  <input
                    type="text"
                    value={data.brochureUrl || ""}
                    onChange={e => setData({ ...data, brochureUrl: e.target.value, marketing_data: { ...data.marketing_data, brochureUrl: e.target.value } })}
                    placeholder="Paste brochure URL (e.g. /uploads/courses/brochure.pdf)"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-ink-200 focus:border-brand-blue outline-none mb-3"
                  />
                </div>

                <div>
                  <input
                    type="file"
                    ref={brochureFileInputRef}
                    accept="application/pdf"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, "brochure");
                      e.target.value = "";
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploadingBrochure}
                    onClick={() => brochureFileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 border-dashed border-ink-300 hover:border-brand-blue hover:text-brand-blue"
                  >
                    {uploadingBrochure ? (
                      <><Loader2 className="w-4 h-4 animate-spin text-brand-blue" /> Uploading Brochure...</>
                    ) : (
                      <><Upload className="w-4 h-4" /> Upload Brochure PDF</>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-ink-50 rounded-xl border border-ink-100">
              <input
                type="checkbox"
                id="isPublishedWizard"
                checked={data.isPublished}
                onChange={e => setData({ ...data, isPublished: e.target.checked })}
                className="w-5 h-5 rounded border-ink-300 text-brand-blue focus:ring-brand-blue cursor-pointer"
              />
              <label htmlFor="isPublishedWizard" className="font-heading font-semibold text-ink-900 text-sm cursor-pointer select-none">
                Publish Course (Make visible on public website)
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-heading text-sm font-semibold text-ink-900 mb-2">Duration</label>
                <input type="text" value={data.duration} onChange={e => setData({...data, duration: e.target.value})} placeholder="e.g. 12 Weeks" className="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-brand-blue outline-none" />
              </div>
              <div>
                <label className="block font-heading text-sm font-semibold text-ink-900 mb-2">Format</label>
                <input type="text" value={data.format} onChange={e => setData({...data, format: e.target.value})} placeholder="e.g. Live Online" className="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-brand-blue outline-none" />
              </div>
              <div>
                <label className="block font-heading text-sm font-semibold text-ink-900 mb-2">Location</label>
                <input type="text" value={data.location} onChange={e => setData({...data, location: e.target.value})} placeholder="e.g. Chennai / Zoom" className="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-brand-blue outline-none" />
              </div>
              <div>
                <label className="block font-heading text-sm font-semibold text-ink-900 mb-2">Batch Info</label>
                <input type="text" value={data.batchInfo} onChange={e => setData({...data, batchInfo: e.target.value})} placeholder="e.g. Next batch starts Mon 15th" className="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-brand-blue outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-heading text-sm font-semibold text-ink-900 mb-2">Original Price (₹)</label>
                <input type="text" value={data.originalPrice} onChange={e => setData({...data, originalPrice: e.target.value})} placeholder="e.g. 50000" className="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-brand-blue outline-none" />
              </div>
              <div>
                <label className="block font-heading text-sm font-semibold text-ink-900 mb-2">Discounted / Active Price (₹)</label>
                <input type="text" value={data.discountedPrice} onChange={e => setData({...data, discountedPrice: e.target.value})} placeholder="e.g. 25000" className="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-brand-blue outline-none" />
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-ink-50 rounded-xl border border-ink-100 mt-6">
              <input
                type="checkbox"
                id="showCareerFeaturesWizard"
                checked={mData.showCareerFeatures !== false}
                onChange={e => updateMarketing("showCareerFeatures", e.target.checked)}
                className="w-5 h-5 rounded border-ink-300 text-brand-blue focus:ring-brand-blue cursor-pointer"
              />
              <label htmlFor="showCareerFeaturesWizard" className="font-heading font-semibold text-ink-900 text-sm cursor-pointer select-none">
                Show Career & Placement Sections (AI Profile Building, Internships, Placement Support)
              </label>
            </div>
          </div>
        )}

        {/* STEP 1: Course Overview */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-4">
              <h4 className="font-heading text-sm font-semibold text-ink-900">Overview Description (Paragraphs)</h4>
              {(mData.overviewDescription || []).map((para: string, index: number) => (
                <div key={index} className="flex gap-4 p-4 border border-ink-100 rounded-xl bg-ink-50">
                  <div className="flex-1">
                    <textarea 
                      value={para}
                      onChange={e => {
                        const newDesc = [...mData.overviewDescription];
                        newDesc[index] = e.target.value;
                        updateMarketing("overviewDescription", newDesc);
                      }}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border border-ink-200 outline-none text-sm font-body"
                    />
                  </div>
                  <button onClick={() => {
                    const newDesc = [...mData.overviewDescription];
                    newDesc.splice(index, 1);
                    updateMarketing("overviewDescription", newDesc);
                  }} className="text-ink-400 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <Button variant="outline" onClick={() => updateMarketing("overviewDescription", [...mData.overviewDescription, "New paragraph..."])} className="w-full border-dashed">
                <Plus className="h-4 w-4 mr-2" /> Add Paragraph
              </Button>
            </div>

            <div className="space-y-4 pt-6 border-t border-ink-100">
              <h4 className="font-heading text-sm font-semibold text-ink-900">What You Will Learn (Bullet points)</h4>
              {(mData.overviewLearnings || []).map((learning: string, index: number) => (
                <div key={index} className="flex gap-4 p-4 border border-ink-100 rounded-xl bg-ink-50">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      value={learning}
                      onChange={e => {
                        const newLearnings = [...mData.overviewLearnings];
                        newLearnings[index] = e.target.value;
                        updateMarketing("overviewLearnings", newLearnings);
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-ink-200 outline-none text-sm font-body"
                    />
                  </div>
                  <button onClick={() => {
                    const newLearnings = [...mData.overviewLearnings];
                    newLearnings.splice(index, 1);
                    updateMarketing("overviewLearnings", newLearnings);
                  }} className="text-ink-400 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <Button variant="outline" onClick={() => updateMarketing("overviewLearnings", [...mData.overviewLearnings, "New learning point..."])} className="w-full border-dashed">
                <Plus className="h-4 w-4 mr-2" /> Add Learning Point
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Top Highlights */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <p className="text-ink-500 text-sm">Add the 4 main highlight cards that appear immediately below the hero section.</p>
            {(mData.highlightsData || []).map((highlight: any, index: number) => (
              <div key={index} className="flex gap-4 p-4 border border-ink-100 rounded-xl bg-ink-50">
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-ink-900 mb-1">Title</label>
                      <input type="text" value={highlight.title} onChange={e => {
                        const newHighlights = [...mData.highlightsData];
                        newHighlights[index].title = e.target.value;
                        updateMarketing("highlightsData", newHighlights);
                      }} className="w-full px-3 py-2 text-sm rounded-lg border border-ink-200 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-900 mb-1">Icon</label>
                      <IconPickerDropdown value={highlight.iconName || 'Star'} onChange={val => {
                        const newHighlights = [...mData.highlightsData];
                        newHighlights[index].iconName = val;
                        updateMarketing("highlightsData", newHighlights);
                      }} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-900 mb-1">Description</label>
                    <textarea value={highlight.description} onChange={e => {
                      const newHighlights = [...mData.highlightsData];
                      newHighlights[index].description = e.target.value;
                      updateMarketing("highlightsData", newHighlights);
                    }} rows={2} className="w-full px-3 py-2 text-sm rounded-lg border border-ink-200 outline-none" />
                  </div>
                </div>
                <button onClick={() => {
                  const newHighlights = [...mData.highlightsData];
                  newHighlights.splice(index, 1);
                  updateMarketing("highlightsData", newHighlights);
                }} className="text-ink-400 hover:text-red-500 self-start mt-6">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <Button variant="outline" onClick={() => updateMarketing("highlightsData", [...mData.highlightsData, { title: "New Highlight", description: "Description here", iconName: "Star" }])} className="w-full border-dashed">
              <Plus className="h-4 w-4 mr-2" /> Add Highlight
            </Button>
          </div>
        )}

        {/* STEP 3: Designed To Help */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <p className="text-ink-500 text-sm">The 2x2 grid of benefits showing how this course helps the user.</p>
            <div>
              <label className="block text-xs font-semibold text-ink-900 mb-1">Section Title</label>
              <input type="text" value={mData.designedToHelp.title} onChange={e => updateMarketing("designedToHelp", { ...mData.designedToHelp, title: e.target.value })} className="w-full px-3 py-2 text-sm rounded-lg border border-ink-200 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-900 mb-1">Section Description</label>
              <textarea value={mData.designedToHelp.description} onChange={e => updateMarketing("designedToHelp", { ...mData.designedToHelp, description: e.target.value })} rows={2} className="w-full px-3 py-2 text-sm rounded-lg border border-ink-200 outline-none" />
            </div>
            <div className="space-y-4 pt-4 border-t border-ink-100">
              <h4 className="font-heading text-sm font-semibold text-ink-900">Benefits Grid</h4>
              {(mData.designedToHelp.benefits || []).map((benefit: any, index: number) => (
                <div key={index} className="flex gap-4 p-4 border border-ink-100 rounded-xl bg-ink-50">
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-ink-900 mb-1">Title</label>
                        <input type="text" value={benefit.title} onChange={e => {
                          const newBenefits = [...mData.designedToHelp.benefits];
                          newBenefits[index].title = e.target.value;
                          updateMarketing("designedToHelp", { ...mData.designedToHelp, benefits: newBenefits });
                        }} className="w-full px-3 py-2 text-sm rounded-lg border border-ink-200 outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-ink-900 mb-1">Icon</label>
                        <IconPickerDropdown value={benefit.iconName || 'CheckCircle'} onChange={val => {
                          const newBenefits = [...mData.designedToHelp.benefits];
                          newBenefits[index].iconName = val;
                          updateMarketing("designedToHelp", { ...mData.designedToHelp, benefits: newBenefits });
                        }} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-900 mb-1">Description</label>
                      <textarea value={benefit.description} onChange={e => {
                        const newBenefits = [...mData.designedToHelp.benefits];
                        newBenefits[index].description = e.target.value;
                        updateMarketing("designedToHelp", { ...mData.designedToHelp, benefits: newBenefits });
                      }} rows={2} className="w-full px-3 py-2 text-sm rounded-lg border border-ink-200 outline-none" />
                    </div>
                  </div>
                  <button onClick={() => {
                    const newBenefits = [...mData.designedToHelp.benefits];
                    newBenefits.splice(index, 1);
                    updateMarketing("designedToHelp", { ...mData.designedToHelp, benefits: newBenefits });
                  }} className="text-ink-400 hover:text-red-500 self-start mt-6">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <Button variant="outline" onClick={() => updateMarketing("designedToHelp", { ...mData.designedToHelp, benefits: [...(mData.designedToHelp.benefits || []), { title: "New Benefit", description: "Desc", iconName: "CheckCircle" }] })} className="w-full border-dashed">
                <Plus className="h-4 w-4 mr-2" /> Add Benefit
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: Numbered Features */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <p className="text-ink-500 text-sm">4 numbered cards displaying features or trends (e.g. Rise of AI).</p>
            <div>
              <label className="block text-xs font-semibold text-ink-900 mb-1">Section Title</label>
              <input type="text" value={mData.numberedFeatures.title} onChange={e => updateMarketing("numberedFeatures", { ...mData.numberedFeatures, title: e.target.value })} className="w-full px-3 py-2 text-sm rounded-lg border border-ink-200 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-900 mb-1">Section Description</label>
              <textarea value={mData.numberedFeatures.description} onChange={e => updateMarketing("numberedFeatures", { ...mData.numberedFeatures, description: e.target.value })} rows={2} className="w-full px-3 py-2 text-sm rounded-lg border border-ink-200 outline-none" />
            </div>
            <div className="space-y-4 pt-4 border-t border-ink-100">
              <h4 className="font-heading text-sm font-semibold text-ink-900">Features</h4>
              {(mData.numberedFeatures.features || []).map((feature: any, index: number) => (
                <div key={index} className="flex gap-4 p-4 border border-ink-100 rounded-xl bg-ink-50">
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-3">
                        <label className="block text-xs font-semibold text-ink-900 mb-1">Number</label>
                        <input type="text" value={feature.num} onChange={e => {
                          const newFeatures = [...mData.numberedFeatures.features];
                          newFeatures[index].num = e.target.value;
                          updateMarketing("numberedFeatures", { ...mData.numberedFeatures, features: newFeatures });
                        }} className="w-full px-3 py-2 text-sm rounded-lg border border-ink-200 outline-none" />
                      </div>
                      <div className="col-span-5">
                        <label className="block text-xs font-semibold text-ink-900 mb-1">Title</label>
                        <input type="text" value={feature.title} onChange={e => {
                          const newFeatures = [...mData.numberedFeatures.features];
                          newFeatures[index].title = e.target.value;
                          updateMarketing("numberedFeatures", { ...mData.numberedFeatures, features: newFeatures });
                        }} className="w-full px-3 py-2 text-sm rounded-lg border border-ink-200 outline-none" />
                      </div>
                      <div className="col-span-4">
                        <label className="block text-xs font-semibold text-ink-900 mb-1">Icon</label>
                        <IconPickerDropdown value={feature.iconName || 'CheckCircle'} onChange={val => {
                          const newFeatures = [...mData.numberedFeatures.features];
                          newFeatures[index].iconName = val;
                          updateMarketing("numberedFeatures", { ...mData.numberedFeatures, features: newFeatures });
                        }} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-900 mb-1">Description</label>
                      <textarea value={feature.description} onChange={e => {
                        const newFeatures = [...mData.numberedFeatures.features];
                        newFeatures[index].description = e.target.value;
                        updateMarketing("numberedFeatures", { ...mData.numberedFeatures, features: newFeatures });
                      }} rows={2} className="w-full px-3 py-2 text-sm rounded-lg border border-ink-200 outline-none" />
                    </div>
                  </div>
                  <button onClick={() => {
                    const newFeatures = [...mData.numberedFeatures.features];
                    newFeatures.splice(index, 1);
                    updateMarketing("numberedFeatures", { ...mData.numberedFeatures, features: newFeatures });
                  }} className="text-ink-400 hover:text-red-500 self-start mt-6">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <Button variant="outline" onClick={() => updateMarketing("numberedFeatures", { ...mData.numberedFeatures, features: [...(mData.numberedFeatures.features || []), { num: "0" + ((mData.numberedFeatures.features?.length || 0) + 1), title: "New Feature", description: "Desc", iconName: "CheckCircle" }] })} className="w-full border-dashed">
                <Plus className="h-4 w-4 mr-2" /> Add Feature
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5: Why Digital Ghuru */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <p className="text-ink-500 text-sm">Tree-style layout showing reasons to choose this course.</p>
            <div>
              <label className="block text-xs font-semibold text-ink-900 mb-1">Section Title</label>
              <input type="text" value={mData.whyDigitalGhuru.title} onChange={e => updateMarketing("whyDigitalGhuru", { ...mData.whyDigitalGhuru, title: e.target.value })} className="w-full px-3 py-2 text-sm rounded-lg border border-ink-200 outline-none" />
            </div>
            <div className="space-y-4 pt-4 border-t border-ink-100">
              <h4 className="font-heading text-sm font-semibold text-ink-900">Reasons List</h4>
              {(mData.whyDigitalGhuru.reasons || []).map((reason: any, index: number) => (
                <div key={index} className="flex gap-4 p-4 border border-ink-100 rounded-xl bg-ink-50">
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-3">
                        <label className="block text-xs font-semibold text-ink-900 mb-1">Number</label>
                        <input type="text" value={reason.num} onChange={e => {
                          const newReasons = [...mData.whyDigitalGhuru.reasons];
                          newReasons[index].num = e.target.value;
                          updateMarketing("whyDigitalGhuru", { ...mData.whyDigitalGhuru, reasons: newReasons });
                        }} className="w-full px-3 py-2 text-sm rounded-lg border border-ink-200 outline-none" />
                      </div>
                      <div className="col-span-5">
                        <label className="block text-xs font-semibold text-ink-900 mb-1">Title</label>
                        <input type="text" value={reason.title} onChange={e => {
                          const newReasons = [...mData.whyDigitalGhuru.reasons];
                          newReasons[index].title = e.target.value;
                          updateMarketing("whyDigitalGhuru", { ...mData.whyDigitalGhuru, reasons: newReasons });
                        }} className="w-full px-3 py-2 text-sm rounded-lg border border-ink-200 outline-none" />
                      </div>
                      <div className="col-span-4">
                        <label className="block text-xs font-semibold text-ink-900 mb-1">Icon</label>
                        <IconPickerDropdown value={reason.iconName || 'CheckCircle'} onChange={val => {
                          const newReasons = [...mData.whyDigitalGhuru.reasons];
                          newReasons[index].iconName = val;
                          updateMarketing("whyDigitalGhuru", { ...mData.whyDigitalGhuru, reasons: newReasons });
                        }} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-900 mb-1">Description</label>
                      <textarea value={reason.description} onChange={e => {
                        const newReasons = [...mData.whyDigitalGhuru.reasons];
                        newReasons[index].description = e.target.value;
                        updateMarketing("whyDigitalGhuru", { ...mData.whyDigitalGhuru, reasons: newReasons });
                      }} rows={2} className="w-full px-3 py-2 text-sm rounded-lg border border-ink-200 outline-none" />
                    </div>
                  </div>
                  <button onClick={() => {
                    const newReasons = [...mData.whyDigitalGhuru.reasons];
                    newReasons.splice(index, 1);
                    updateMarketing("whyDigitalGhuru", { ...mData.whyDigitalGhuru, reasons: newReasons });
                  }} className="text-ink-400 hover:text-red-500 self-start mt-6">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <Button variant="outline" onClick={() => updateMarketing("whyDigitalGhuru", { ...mData.whyDigitalGhuru, reasons: [...(mData.whyDigitalGhuru.reasons || []), { num: "0" + ((mData.whyDigitalGhuru.reasons?.length || 0) + 1), title: "New Reason", description: "Desc", iconName: "CheckCircle" }] })} className="w-full border-dashed">
                <Plus className="h-4 w-4 mr-2" /> Add Reason
              </Button>
            </div>
          </div>
        )}

        {/* STEP 6: Target Audience */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <p className="text-ink-500 text-sm">Who is this course for? Define the target personas, their descriptions, and key takeaways.</p>
            {(mData.whoIsThisForData || []).map((audience: any, index: number) => (
              <div key={index} className="flex gap-4 p-5 border border-ink-100 rounded-2xl bg-ink-50">
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-ink-900 mb-1">Target Persona / Role</label>
                      <input 
                        type="text" 
                        value={audience.title || audience.role || ""} 
                        onChange={e => {
                          const newAudiences = [...mData.whoIsThisForData];
                          newAudiences[index].title = e.target.value;
                          newAudiences[index].role = e.target.value;
                          updateMarketing("whoIsThisForData", newAudiences);
                        }} 
                        placeholder="e.g. Entrepreneurs, Students, Professionals"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-ink-200 outline-none bg-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-900 mb-1">Icon</label>
                      <IconPickerDropdown value={audience.iconName || 'User'} onChange={val => {
                        const newAudiences = [...mData.whoIsThisForData];
                        newAudiences[index].iconName = val;
                        updateMarketing("whoIsThisForData", newAudiences);
                      }} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-900 mb-1">Description</label>
                    <textarea 
                      value={audience.description || audience.desc || ""} 
                      onChange={e => {
                        const newAudiences = [...mData.whoIsThisForData];
                        newAudiences[index].description = e.target.value;
                        newAudiences[index].desc = e.target.value;
                        updateMarketing("whoIsThisForData", newAudiences);
                      }} 
                      rows={2} 
                      placeholder="Summary of how this course benefits this persona..."
                      className="w-full px-3 py-2 text-sm rounded-lg border border-ink-200 outline-none bg-white" 
                    />
                  </div>

                  {/* Bullet points for this persona */}
                  <div className="pt-3 border-t border-ink-200/60 space-y-2">
                    <label className="block text-xs font-semibold text-ink-700">Key Points / Takeaways</label>
                    {(audience.points || []).map((point: string, pIdx: number) => (
                      <div key={pIdx} className="flex gap-2 items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-blue shrink-0"></span>
                        <input
                          type="text"
                          value={point}
                          onChange={e => {
                            const newAudiences = [...mData.whoIsThisForData];
                            const newPoints = [...(newAudiences[index].points || [])];
                            newPoints[pIdx] = e.target.value;
                            newAudiences[index].points = newPoints;
                            updateMarketing("whoIsThisForData", newAudiences);
                          }}
                          className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-ink-200 outline-none bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newAudiences = [...mData.whoIsThisForData];
                            const newPoints = [...(newAudiences[index].points || [])];
                            newPoints.splice(pIdx, 1);
                            newAudiences[index].points = newPoints;
                            updateMarketing("whoIsThisForData", newAudiences);
                          }}
                          className="text-ink-300 hover:text-red-500 p-1"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const newAudiences = [...mData.whoIsThisForData];
                        const newPoints = [...(newAudiences[index].points || [])];
                        newPoints.push("New key takeaway...");
                        newAudiences[index].points = newPoints;
                        updateMarketing("whoIsThisForData", newAudiences);
                      }}
                      className="text-xs text-brand-blue font-heading font-semibold hover:underline flex items-center gap-1 mt-1"
                    >
                      <Plus className="h-3 w-3" /> Add Key Point
                    </button>
                  </div>
                </div>
                <button onClick={() => {
                  const newAudiences = [...mData.whoIsThisForData];
                  newAudiences.splice(index, 1);
                  updateMarketing("whoIsThisForData", newAudiences);
                }} className="text-ink-400 hover:text-red-500 self-start mt-6" title="Delete Persona">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <Button variant="outline" onClick={() => updateMarketing("whoIsThisForData", [...mData.whoIsThisForData, { title: "New Audience", role: "New Audience", description: "Program benefits for this role...", desc: "Program benefits for this role...", iconName: "User", points: ["Gain in-demand skills", "Practical hands-on practice"] }])} className="w-full border-dashed">
              <Plus className="h-4 w-4 mr-2" /> Add Audience Persona
            </Button>
          </div>
        )}

        {/* STEP 7: Tools Mastered */}
        {currentStep === 7 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="font-heading text-base font-bold text-ink-900">Tools & Technologies Mastered</h3>
              <p className="text-ink-500 text-sm mt-0.5">Categorized list of software, platforms, and frameworks taught in this course.</p>
            </div>

            {(mData.categorizedToolsData || []).map((group: any, groupIndex: number) => {
              const currentToolsList = group.tools || group.items || [];
              const categoryTitle = group.category || group.title || "";

              return (
                <div key={groupIndex} className="p-5 border border-ink-200 bg-ink-50 rounded-2xl space-y-4 shadow-sm">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-ink-900 mb-1">Category Title</label>
                        <input 
                          type="text" 
                          value={categoryTitle} 
                          onChange={e => {
                            const newGroups = [...mData.categorizedToolsData];
                            newGroups[groupIndex].category = e.target.value;
                            newGroups[groupIndex].title = e.target.value;
                            updateMarketing("categorizedToolsData", newGroups);
                          }} 
                          placeholder="e.g. Core Marketing Tools or Frontend Stack"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-ink-200 outline-none bg-white font-medium" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-ink-900 mb-1">Description (Optional)</label>
                        <input 
                          type="text" 
                          value={group.description || ""} 
                          onChange={e => {
                            const newGroups = [...mData.categorizedToolsData];
                            newGroups[groupIndex].description = e.target.value;
                            updateMarketing("categorizedToolsData", newGroups);
                          }} 
                          placeholder="e.g. Master modern frameworks & libraries"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-ink-200 outline-none bg-white" 
                        />
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        const newGroups = [...mData.categorizedToolsData];
                        newGroups.splice(groupIndex, 1);
                        updateMarketing("categorizedToolsData", newGroups);
                      }} 
                      className="text-ink-400 hover:text-red-500 mt-6 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-ink-200/70">
                    <div className="flex items-center justify-between">
                      <h5 className="font-heading text-xs font-semibold text-ink-800 uppercase tracking-wider">
                        Tools in this Category ({currentToolsList.length})
                      </h5>
                    </div>

                    <div className="space-y-2.5">
                      {currentToolsList.map((tool: any, toolIndex: number) => (
                        <div key={toolIndex} className="flex flex-col sm:flex-row gap-2.5 items-center bg-white p-2.5 rounded-xl border border-ink-200/80 shadow-xs">
                          {/* Logo Preview */}
                          <div className="w-10 h-10 rounded-lg bg-ink-50 border border-ink-100 flex items-center justify-center overflow-hidden shrink-0">
                            {tool.iconUrl ? (
                              <img 
                                src={tool.iconUrl} 
                                alt={tool.name || "Tool"} 
                                className="w-6 h-6 object-contain" 
                                onError={(e) => {
                                  (e.currentTarget as HTMLElement).style.display = "none";
                                }} 
                              />
                            ) : (
                              <Laptop2 className="w-5 h-5 text-ink-400" />
                            )}
                          </div>

                          {/* Tool Name */}
                          <input 
                            type="text" 
                            value={tool.name || ""} 
                            onChange={e => {
                              const newGroups = [...mData.categorizedToolsData];
                              const list = [...(newGroups[groupIndex].tools || newGroups[groupIndex].items || [])];
                              const val = e.target.value;
                              const currentIcon = list[toolIndex]?.iconUrl;
                              const autoIcon = (!currentIcon || currentIcon === "/tools/openai.svg") ? getToolIcon(val) : currentIcon;
                              list[toolIndex] = { ...list[toolIndex], name: val, iconUrl: autoIcon };
                              newGroups[groupIndex].tools = list;
                              newGroups[groupIndex].items = list;
                              updateMarketing("categorizedToolsData", newGroups);
                            }} 
                            placeholder="Tool Name (e.g. ChatGPT, Canva, React)" 
                            className="w-full sm:w-1/3 px-3 py-1.5 text-sm rounded-lg border border-ink-200 outline-none font-medium text-ink-900" 
                          />

                          {/* Tool Icon URL */}
                          <input 
                            type="text" 
                            value={tool.iconUrl || ""} 
                            onChange={e => {
                              const newGroups = [...mData.categorizedToolsData];
                              const list = [...(newGroups[groupIndex].tools || newGroups[groupIndex].items || [])];
                              list[toolIndex] = { ...list[toolIndex], iconUrl: e.target.value };
                              newGroups[groupIndex].tools = list;
                              newGroups[groupIndex].items = list;
                              updateMarketing("categorizedToolsData", newGroups);
                            }} 
                            placeholder="Icon URL (e.g. /tools/openai.svg or web link)" 
                            className="w-full sm:flex-1 px-3 py-1.5 text-xs rounded-lg border border-ink-200 outline-none text-ink-600 font-mono" 
                          />

                          {/* Delete Button */}
                          <button 
                            type="button"
                            onClick={() => {
                              const newGroups = [...mData.categorizedToolsData];
                              const list = [...(newGroups[groupIndex].tools || newGroups[groupIndex].items || [])];
                              list.splice(toolIndex, 1);
                              newGroups[groupIndex].tools = list;
                              newGroups[groupIndex].items = list;
                              updateMarketing("categorizedToolsData", newGroups);
                            }} 
                            className="text-ink-300 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                            title="Remove tool"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Quick Add Suggestions */}
                    <div className="pt-2">
                      <p className="text-[11px] font-semibold text-ink-500 mb-1.5">Quick add common tools:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {["ChatGPT", "Midjourney", "Canva", "Google Ads", "Meta Ads", "WordPress", "Zapier", "Google Analytics", "React", "Node.js", "MongoDB", "Tailwind CSS", "GitHub"].map(presetName => (
                          <button
                            key={presetName}
                            type="button"
                            onClick={() => {
                              const newGroups = [...mData.categorizedToolsData];
                              const list = [...(newGroups[groupIndex].tools || newGroups[groupIndex].items || [])];
                              list.push({
                                name: presetName,
                                iconUrl: getToolIcon(presetName)
                              });
                              newGroups[groupIndex].tools = list;
                              newGroups[groupIndex].items = list;
                              updateMarketing("categorizedToolsData", newGroups);
                            }}
                            className="text-xs px-2.5 py-1 rounded-lg border border-ink-200 bg-white text-ink-700 hover:border-brand-blue hover:text-brand-blue hover:bg-blue-50/50 transition-colors flex items-center gap-1"
                          >
                            <Plus className="h-3 w-3" /> {presetName}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button 
                        type="button"
                        variant="outline" 
                        onClick={() => {
                          const newGroups = [...mData.categorizedToolsData];
                          const list = [...(newGroups[groupIndex].tools || newGroups[groupIndex].items || [])];
                          list.push({ name: "New Tool", iconUrl: "/tools/openai.svg" });
                          newGroups[groupIndex].tools = list;
                          newGroups[groupIndex].items = list;
                          updateMarketing("categorizedToolsData", newGroups);
                        }} 
                        className="text-xs py-1.5"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" /> Add Custom Tool
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

            <Button 
              type="button"
              variant="outline" 
              onClick={() => updateMarketing("categorizedToolsData", [
                ...(mData.categorizedToolsData || []), 
                { 
                  category: "New Tool Category", 
                  title: "New Tool Category", 
                  description: "Master essential industry tools and frameworks.",
                  bgClass: "bg-white",
                  textClass: "text-[#0d2f62]",
                  tools: [{ name: "ChatGPT", iconUrl: "/tools/openai.svg" }],
                  items: [{ name: "ChatGPT", iconUrl: "/tools/openai.svg" }]
                }
              ])} 
              className="w-full border-dashed py-3 hover:border-brand-blue hover:text-brand-blue font-heading font-semibold"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Tool Category
            </Button>
          </div>
        )}

        {/* STEP 8: FAQs */}
        {currentStep === 9 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <p className="text-ink-500 text-sm">Frequently Asked Questions.</p>
            {(mData.faqs || []).map((faq: any, index: number) => (
              <div key={index} className="flex gap-4 p-4 border border-ink-100 rounded-xl bg-ink-50">
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-ink-900 mb-1">Question</label>
                    <input type="text" value={faq.question} onChange={e => {
                      const newFaqs = [...mData.faqs];
                      newFaqs[index].question = e.target.value;
                      updateMarketing("faqs", newFaqs);
                    }} className="w-full px-3 py-2 text-sm rounded-lg border border-ink-200 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-900 mb-1">Answer</label>
                    <textarea value={faq.answer} onChange={e => {
                      const newFaqs = [...mData.faqs];
                      newFaqs[index].answer = e.target.value;
                      updateMarketing("faqs", newFaqs);
                    }} rows={2} className="w-full px-3 py-2 text-sm rounded-lg border border-ink-200 outline-none" />
                  </div>
                </div>
                <button onClick={() => {
                  const newFaqs = [...mData.faqs];
                  newFaqs.splice(index, 1);
                  updateMarketing("faqs", newFaqs);
                }} className="text-ink-400 hover:text-red-500 self-start mt-6">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <Button variant="outline" onClick={() => updateMarketing("faqs", [...mData.faqs, { question: "New Question?", answer: "Answer goes here." }])} className="w-full border-dashed">
              <Plus className="h-4 w-4 mr-2" /> Add FAQ
            </Button>
          </div>
        )}

        {/* STEP 9: Modules & Lessons */}
        {currentStep === 8 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-ink-100">
              <div>
                <h4 className="font-heading text-base font-bold text-ink-900">
                  Course Modules & Lessons
                </h4>
                <p className="text-ink-500 text-sm">
                  Add modules, their lessons/topics, and Google Drive video links. These will appear in the curriculum on the public website and LMS player.
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-center px-3 py-1.5 bg-brand-blue/10 text-brand-blue rounded-xl text-xs font-heading font-semibold whitespace-nowrap">
                <span>{(data.modules || []).length} Modules</span>
                <span>•</span>
                <span>
                  {(data.modules || []).reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0)} Lessons
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {(data.modules || []).map((module: any, modIdx: number) => (
                <div key={modIdx} className="border border-ink-200 rounded-2xl bg-white shadow-sm overflow-hidden hover:border-brand-blue/40 transition-colors">
                  {/* Module Header */}
                  <div className="p-4 bg-ink-50/80 border-b border-ink-200 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="h-7 px-2.5 rounded-lg bg-brand-blue text-white font-heading font-bold text-xs flex items-center justify-center flex-shrink-0">
                        Section {modIdx + 1}
                      </span>
                      <input
                        type="text"
                        value={module.title}
                        onChange={e => {
                          const newModules = [...data.modules];
                          newModules[modIdx].title = e.target.value;
                          setData({ ...data, modules: newModules });
                        }}
                        placeholder={`Module ${modIdx + 1} Title (e.g. Module ${modIdx + 1}: Audience Research)`}
                        className="w-full bg-white px-3.5 py-2 text-sm font-heading font-bold text-ink-900 rounded-xl border border-ink-200 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/30 outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (data.modules.length === 1) {
                          toast.warning("Minimum 1 Module Required", "A course must have at least one module section.");
                          return;
                        }
                        const newModules = [...data.modules];
                        newModules.splice(modIdx, 1);
                        setData({ ...data, modules: newModules });
                      }}
                      className="text-ink-400 hover:text-red-500 p-2 transition-colors"
                      title="Delete Module"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Lessons List for this Module */}
                  <div className="p-4 sm:p-6 space-y-4 bg-white">
                    <div className="flex items-center justify-between">
                      <h5 className="font-heading text-xs font-bold text-ink-700 uppercase tracking-wider flex items-center gap-2">
                        <PlayCircle className="h-4 w-4 text-brand-blue" />
                        Lessons in Section {modIdx + 1} ({module.lessons?.length || 0})
                      </h5>
                    </div>

                    <div className="space-y-3">
                      {(module.lessons || []).map((lesson: any, lessonIdx: number) => (
                        <div key={lessonIdx} className="p-3.5 rounded-xl border border-ink-100 bg-ink-50/50 hover:bg-ink-50 transition-colors space-y-3">
                          <div className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-ink-200/70 text-ink-700 text-xs font-heading font-bold flex items-center justify-center flex-shrink-0 mt-2">
                              {lessonIdx + 1}
                            </span>
                            
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3">
                              <div className="md:col-span-7">
                                <label className="block text-[11px] font-heading font-semibold text-ink-700 mb-1">
                                  Lesson / Lecture Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={lesson.title}
                                  onChange={e => {
                                    const newModules = [...data.modules];
                                    newModules[modIdx].lessons[lessonIdx].title = e.target.value;
                                    setData({ ...data, modules: newModules });
                                  }}
                                  placeholder="e.g. Understand the digital ecosystem and customer journey."
                                  className="w-full bg-white px-3 py-2 text-sm font-body rounded-lg border border-ink-200 focus:border-brand-blue outline-none"
                                />
                              </div>

                              <div className="md:col-span-5">
                                <label className="block text-[11px] font-heading font-semibold text-ink-700 mb-1 flex items-center gap-1.5">
                                  <Video className="h-3 w-3 text-brand-blue" />
                                  Video Link (Google Drive / URL)
                                </label>
                                <input
                                  type="url"
                                  value={lesson.videoUrl || ""}
                                  onChange={e => {
                                    const newModules = [...data.modules];
                                    newModules[modIdx].lessons[lessonIdx].videoUrl = e.target.value;
                                    setData({ ...data, modules: newModules });
                                  }}
                                  placeholder="https://drive.google.com/file/d/..."
                                  className="w-full bg-white px-3 py-2 text-sm font-body rounded-lg border border-ink-200 focus:border-brand-blue outline-none"
                                />
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                const newModules = [...data.modules];
                                newModules[modIdx].lessons.splice(lessonIdx, 1);
                                setData({ ...data, modules: newModules });
                              }}
                              className="text-ink-300 hover:text-red-500 p-2 mt-4 transition-colors"
                              title="Delete Lesson"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          {lesson.videoUrl && (
                            <div className="ml-9 text-xs text-brand-blue flex items-center gap-1">
                              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                              <span className="text-ink-500">Linked:</span>
                              <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer" className="hover:underline truncate max-w-md">
                                {lesson.videoUrl}
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const newModules = [...data.modules];
                        if (!newModules[modIdx].lessons) newModules[modIdx].lessons = [];
                        newModules[modIdx].lessons.push({
                          title: `New Lesson ${newModules[modIdx].lessons.length + 1}`,
                          videoUrl: ""
                        });
                        setData({ ...data, modules: newModules });
                      }}
                      className="text-xs py-2 border-dashed w-full hover:bg-blue-50 hover:text-brand-blue hover:border-brand-blue/40"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Lesson to Section {modIdx + 1}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const nextNum = (data.modules?.length || 0) + 1;
                setData({
                  ...data,
                  modules: [
                    ...(data.modules || []),
                    {
                      title: `Module ${nextNum}: New Topic Area`,
                      lessons: [
                        { title: `Introduction to Module ${nextNum}`, videoUrl: "" }
                      ]
                    }
                  ]
                });
              }}
              className="w-full py-3.5 border-dashed border-2 border-ink-300 hover:border-brand-blue hover:text-brand-blue font-heading font-semibold"
            >
              <Plus className="h-4 w-4 mr-2" /> Add New Course Module / Section
            </Button>
          </div>
        )}

      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-ink-100 shadow-sm mt-4">
        <Button variant="outline" onClick={handlePrev} disabled={currentStep === 0 || isSaving}>
          <ChevronLeft className="h-4 w-4 mr-2" /> Previous
        </Button>

        <div className="flex items-center gap-3">
          {isEditMode && currentStep < STEPS.length - 1 && (
            <Button variant="outline" onClick={handleSubmit} disabled={isSaving || !data.title}>
              {isSaving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Save className="h-4 w-4 mr-1.5 text-brand-blue" />}
              Save Changes
            </Button>
          )}

          {currentStep === STEPS.length - 1 ? (
            <Button variant="primary" onClick={handleSubmit} disabled={isSaving || !data.title}>
              {isSaving ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
              ) : (
                <><Save className="h-4 w-4 mr-2" /> {isEditMode ? "Save All Changes" : "Complete Course Creation"}</>
              )}
            </Button>
          ) : (
            <Button variant="primary" onClick={handleNext} disabled={currentStep === 0 && !data.title}>
              Next <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
