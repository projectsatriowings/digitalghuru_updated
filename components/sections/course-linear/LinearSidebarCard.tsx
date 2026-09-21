"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { 
  ArrowRight, ShieldCheck, BookOpen, Clock, MapPin, 
  Award, Loader2, CheckCircle2, ArrowLeft, CreditCard, 
  QrCode, AlertCircle, FileDown 
} from "lucide-react";
import { useRazorpay } from "@/lib/useRazorpay";
import { QRCodeSVG } from "qrcode.react";
import { useCourseGate } from "@/components/shared/useCourseGate";

interface LinearSidebarCardProps {
  courseId?: number;
  courseTitle?: string;
  originalPrice: string;
  discountedPrice: string;
  moduleCount?: number;
  duration?: string;
  format?: string;
  previewImage?: string;
  brochureUrl?: string;
  showCareerFeatures?: boolean;
}

export default function LinearSidebarCard({
  courseId,
  courseTitle,
  originalPrice,
  discountedPrice,
  moduleCount = 12,
  duration = "6 Months",
  format = "Hybrid (Offline + Online)",
  previewImage,
  brochureUrl,
  showCareerFeatures = true,
}: LinearSidebarCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { processPayment } = useRazorpay();

  // Core States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [enrolled, setEnrolled] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);
  
  // Checkout States
  const [showCheckout, setShowCheckout] = useState(false);
  const [activeTab, setActiveTab] = useState<"razorpay" | "upi">("razorpay");
  const [utrNumber, setUtrNumber] = useState("");
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [savedUpiId, setSavedUpiId] = useState("");

  const upiId = process.env.NEXT_PUBLIC_UPI_ID || "manishmadhava91@okicici";
  const upiName = process.env.NEXT_PUBLIC_UPI_NAME || "Manish Madhava";

  // Check if user is already enrolled
  useEffect(() => {
    if (!session?.user?.id || !courseId) {
      setCheckingEnrollment(false);
      return;
    }

    fetch(`/api/enrollments/check?courseId=${courseId}`)
      .then(res => res.json())
      .then(data => {
        setEnrolled(!!data.enrolled);
        setHasPendingRequest(!!data.hasPendingRequest);
        if (data.upiId) setSavedUpiId(data.upiId);
        if (data.hasPendingRequest) {
          setSubmitted(true);
          setShowCheckout(true);
        }
      })
      .catch(() => {})
      .finally(() => setCheckingEnrollment(false));
  }, [session?.user?.id, courseId]);

  const formatPrice = (price?: string) => {
    if (!price || price === "—" || price.toLowerCase() === "contact us") return price;
    const numericValue = price.replace(/[₹,]/g, '').trim();
    if (isNaN(Number(numericValue)) || numericValue === "") return price;
    return `₹${Number(numericValue).toLocaleString('en-IN')}`;
  };

  const getNumericPrice = (price?: string | number) => {
    if (!price || price === "—" || String(price).toLowerCase() === "contact us") return 0;
    const numericValue = String(price).replace(/[₹,]/g, '').trim();
    if (isNaN(Number(numericValue)) || numericValue === "") return 0;
    return Number(numericValue);
  };

  const numericPrice = getNumericPrice(discountedPrice);
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${numericPrice}&cu=INR&tn=${encodeURIComponent(`Course Enrollment: ${courseTitle}`)}`;

  const handleEnrollClick = () => {
    if (!pathname.startsWith("/student")) {
      router.push("/signup");
      return;
    }

    if (!courseId) {
      setError("Course information is unavailable.");
      return;
    }

    setShowCheckout(true);
  };

  const handleGoToCourse = () => {
    router.push(`/student/learn/${courseId}`);
  };

  const handleRazorpay = async () => {
    setLoading(true);
    setError("");

    processPayment(
      courseId!,
      courseTitle || "Course",
      {
        name: session?.user?.name || "",
        email: session?.user?.email || "",
        upi_id: savedUpiId
      },
      () => {
        // Success
        setLoading(false);
        setEnrolled(true);
        setShowCheckout(false);
        router.push(`/student/learn/${courseId}`);
      },
      (err: any) => {
        setLoading(false);
        setError(err?.message || "Payment failed. Please try again.");
      }
    );
  };

  const handleUpiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber || utrNumber.length < 8) {
      setError("Please enter a valid UTR or Transaction Reference number.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/payments/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          utrNumber,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit payment details.");
      }

      setSubmitted(true);
      setHasPendingRequest(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getBrochureUrlFallback = (title?: string) => {
    if (!title) return null;
    const t = title.toLowerCase();
    if (t.includes('marketing')) return '/Courses/AI Powered Digital Marketing Course.pdf';
    if (t.includes('react') || t.includes('stack')) return '/Courses/React JS Full Stack Development.pdf';
    if (t.includes('data science')) return '/Courses/Data Science with AI Course.pdf';
    if (t.includes('design') || t.includes('video')) return '/Courses/Creative Design and video editing course.pdf';
    return null;
  };

  const { GateModalComponent, triggerAction } = useCourseGate(courseTitle || "Course");
  
  const handleDownloadBrochure = () => {
    triggerAction(() => {
      const url = brochureUrl || getBrochureUrlFallback(courseTitle);
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
    <div className="bg-white rounded-lg border border-ink-200 shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden relative">
      <GateModalComponent />
      
      {/* Course Image */}
      <div className="relative w-full aspect-video bg-ink-900 overflow-hidden border-b border-ink-100">
        <img 
          src={previewImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800"} 
          alt="Course Preview"
          className="w-full h-full object-cover opacity-90"
        />
      </div>

      {/* Main Content Area (Slider Container) */}
      <div className="relative overflow-hidden w-full">
        <div 
          className="flex transition-transform duration-500 ease-in-out w-full"
          style={{ transform: `translateX(${showCheckout ? '-100%' : '0'})` }}
        >
          
          {/* SLIDE 1: Course Info */}
          <div className="w-full shrink-0 p-6 md:p-8">
            <div className="flex flex-col mb-6">
              <h2 className="font-display text-4xl font-bold text-ink-900 leading-none">{formatPrice(discountedPrice)}</h2>
              {originalPrice !== "—" && (
                <span className="font-body text-lg text-ink-400 font-semibold line-through mt-2">{formatPrice(originalPrice)}</span>
              )}
            </div>

            {error && !showCheckout && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                {error}
              </div>
            )}

            {checkingEnrollment ? (
              <div className="w-full py-4 bg-ink-100 text-ink-400 rounded-lg heading-sm flex items-center justify-center gap-2 mb-3">
                <Loader2 className="h-5 w-5 animate-spin" /> Checking...
              </div>
            ) : enrolled ? (
              <button
                onClick={handleGoToCourse}
                className="w-full py-4 bg-brand-blue hover:bg-blue-800 text-white rounded-lg heading-sm transition-all flex items-center justify-center gap-2 mb-3 shadow-md hover:shadow-lg"
              >
                <CheckCircle2 className="h-5 w-5" /> Go to Course
              </button>
            ) : (
              <button
                onClick={handleEnrollClick}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-[#FFB800] to-[#FF5C00] hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg heading-sm transition-all flex items-center justify-center gap-2 mb-3 shadow-md hover:shadow-lg"
              >
                Enroll Now <ArrowRight className="h-5 w-5" />
              </button>
            )}

            <button
              onClick={handleDownloadBrochure}
              className="w-full py-3.5 bg-white border-2 border-brand-blue text-brand-blue hover:bg-blue-50 rounded-lg heading-sm transition-all flex items-center justify-center gap-2 mb-8 shadow-sm hover:shadow-md"
            >
              <FileDown className="h-5 w-5" /> Download Brochure
            </button>

            <div className="border-t border-ink-100 pt-6">
              <p className="font-heading text-base font-bold text-ink-900 mb-4">This course includes:</p>
              <ul className="space-y-3.5">
                <li className="flex items-center gap-3 font-body text-ink-700 text-base font-medium group">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 group-hover:bg-blue-100 transition-all shadow-2xs">
                    <BookOpen className="h-4 w-4 shrink-0" />
                  </div>
                  <span>{moduleCount ? `${moduleCount} comprehensive modules` : "12 comprehensive modules"}</span>
                </li>
                <li className="flex items-center gap-3 font-body text-ink-700 text-base font-medium group">
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 group-hover:bg-amber-100 transition-all shadow-2xs">
                    <Clock className="h-4 w-4 shrink-0" />
                  </div>
                  <span>{duration || "3 to 6 months"} duration</span>
                </li>
                <li className="flex items-center gap-3 font-body text-ink-700 text-base font-medium group">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-100 transition-all shadow-2xs">
                    <MapPin className="h-4 w-4 shrink-0" />
                  </div>
                  <span>{format || "Classroom + Online"}</span>
                </li>
                {showCareerFeatures && (
                  <li className="flex items-center gap-3 font-body text-ink-700 text-base font-medium group">
                    <div className="p-2 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 group-hover:bg-purple-100 transition-all shadow-2xs">
                      <ShieldCheck className="h-4 w-4 shrink-0" />
                    </div>
                    <span>Placement assistance</span>
                  </li>
                )}
                <li className="flex items-center gap-3 font-body text-ink-700 text-base font-medium group">
                  <div className="p-2 rounded-xl bg-rose-50 text-rose-600 group-hover:scale-110 group-hover:bg-rose-100 transition-all shadow-2xs">
                    <Award className="h-4 w-4 shrink-0" />
                  </div>
                  <span>Digital Ghuru + Industry certifications</span>
                </li>
              </ul>
            </div>
          </div>

          {/* SLIDE 2: Checkout / Payment Options */}
          <div className="w-full shrink-0 p-6 md:p-8 flex flex-col h-full bg-slate-50/50">
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => setShowCheckout(false)} 
                className="flex items-center gap-2 text-ink-500 hover:text-brand-blue font-semibold text-sm transition-colors"
                disabled={loading || submitted}
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <h3 className="font-heading text-sm font-bold text-ink-900 uppercase tracking-widest">Payment Method</h3>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-8">
                <div className="h-16 w-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-amber-500" />
                </div>
                <h4 className="font-display text-xl font-bold text-ink-900 mb-2">Under Review</h4>
                <p className="text-ink-500 text-sm mb-6 max-w-[250px]">
                  Your UTR has been submitted and is pending admin verification.
                </p>
                <button
                  onClick={() => router.push("/student/dashboard")}
                  className="bg-brand-blue text-white px-6 py-2.5 rounded-lg font-heading font-semibold text-sm hover:bg-blue-800 transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              <>
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setActiveTab("razorpay")}
                    className={`flex-1 py-3 px-2 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${
                      activeTab === "razorpay" 
                        ? "border-brand-blue bg-blue-50/50 text-brand-blue shadow-sm" 
                        : "border-ink-100 text-ink-500 hover:border-ink-200 bg-white"
                    }`}
                  >
                    <CreditCard className={`h-5 w-5 ${activeTab === "razorpay" ? "text-brand-blue" : "text-ink-400"}`} />
                    <span className="font-heading text-xs font-bold uppercase tracking-wide">Pay Online</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab("upi")}
                    className={`flex-1 py-3 px-2 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${
                      activeTab === "upi" 
                        ? "border-brand-blue bg-blue-50/50 text-brand-blue shadow-sm" 
                        : "border-ink-100 text-ink-500 hover:border-ink-200 bg-white"
                    }`}
                  >
                    <QrCode className={`h-5 w-5 ${activeTab === "upi" ? "text-brand-blue" : "text-ink-400"}`} />
                    <span className="font-heading text-xs font-bold uppercase tracking-wide">UPI QR</span>
                  </button>
                </div>

                {error && showCheckout && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex gap-2 items-start">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-500" />
                    <p className="text-xs leading-relaxed">{error}</p>
                  </div>
                )}

                <div className="flex-1">
                  {activeTab === "razorpay" ? (
                    <div className="flex flex-col h-full justify-between">
                      <div className="bg-white rounded-xl p-4 border border-ink-100 mb-6 text-center shadow-sm">
                        <p className="text-ink-600 text-sm leading-relaxed mb-3">
                          Pay securely using Credit/Debit Card, Netbanking, UPI, or Wallets via Razorpay.
                        </p>
                      </div>
                      
                      <button
                        onClick={handleRazorpay}
                        disabled={loading}
                        className="w-full py-3.5 bg-brand-blue hover:bg-blue-800 text-white rounded-lg heading-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-auto"
                      >
                        {loading ? (
                          <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                        ) : (
                          <>Pay {formatPrice(discountedPrice)}</>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="bg-white p-3 rounded-xl shadow-sm border border-ink-100 mb-4 inline-block">
                        <QRCodeSVG value={upiLink} size={150} level="M" includeMargin={false} />
                      </div>
                      
                      <div className="text-center mb-6">
                        <p className="font-display font-bold text-ink-900">{upiName}</p>
                        <p className="text-ink-500 text-xs font-medium font-mono mb-2">{upiId}</p>
                        <p className="text-brand-blue font-bold text-lg">{formatPrice(discountedPrice)}</p>
                      </div>

                      <form onSubmit={handleUpiSubmit} className="w-full">
                        <div className="mb-4">
                          <label htmlFor="utr" className="block text-xs font-bold text-ink-900 mb-1.5 uppercase tracking-wide">
                            UTR / Reference No.
                          </label>
                          <input
                            type="text"
                            id="utr"
                            value={utrNumber}
                            onChange={(e) => setUtrNumber(e.target.value)}
                            placeholder="e.g. 312345678901"
                            className="w-full px-3 py-2.5 rounded-lg border border-ink-200 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 outline-none transition-all font-mono text-sm"
                            required
                          />
                        </div>
                        
                        <button
                          type="submit"
                          disabled={loading || !utrNumber}
                          className="w-full py-3.5 bg-gradient-to-r from-[#FFB800] to-[#FF5C00] hover:brightness-110 text-white rounded-lg heading-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
                          ) : (
                            <>Submit UTR</>
                          )}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
