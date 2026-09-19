import React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";

/* ─── Footer Data (PLACEHOLDER: Replace with real Digital Ghuru data) ─── */
const locations = [
  {
    name: "Anna Nagar Office",
    address: "45, A Block, 3rd Avenue, Kumaran Nagar, Anna Nagar East - 600102",
    phone: "+91 8825948859",
  },
  {
    name: "Ameerpet Office",
    address: "F8, First Floor, Kallu Compound Rd, Pratap Nagar, Nagarjuna Nagar colony, Yella Reddy Guda, Ameerpet, Hyderabad - 500073",
    phone: "+91 8825948859",
  },
  {
    name: "Korattur Office",
    address: '2nd Floor, No. 1A, "Gurudev Complex", S1, 57th St, Venkatraman Nagar, Korattur, Chennai 600050',
    phone: "+91 8825948859",
  }
];

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Institute", href: "/about-us" },
  { label: "Our Courses", href: "/courses/ai-powered-digital-marketing" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

const courseLinks = [
  { label: "AI-Powered Digital Marketing", href: "/courses/ai-powered-digital-marketing" },
  { label: "React JS Full Stack Development", href: "/courses/react-js-full-stack-development" },
];

/* PLACEHOLDER: Replace with real Digital Ghuru social media URLs */
const socialLinks = [
  { icon: Facebook, href: "https://www.facebook.com/share/1D1vTjqQWX/", label: "Facebook", hoverClass: "hover:bg-[#1877F2]" },
  { icon: Instagram, href: "https://www.instagram.com/digitalghuru?igsi=MWlqanV6MnZ4cW1vYg==", label: "Instagram", hoverClass: "hover:bg-[#E4405F]" },
  { icon: Linkedin, href: "https://linkedin.com/company/digitalghuru", label: "LinkedIn", hoverClass: "hover:bg-[#0A66C2]" },
  { icon: Twitter, href: "https://x.com/digital_ghuru?s=20", label: "X", hoverClass: "hover:bg-[#000000]" },
];

export default function Footer() {
  return (
    <footer className="bg-[#006FFF] text-white">
      <div className="section-container pt-10 pb-8 md:pt-12 md:pb-10">
        {/* ── Top Section: Our Campuses (Horizontal) ── */}
        <div className="pb-8 border-b border-white/15">
          <h4 className="font-display text-xl font-bold text-white mb-5">
            Our Campuses
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {locations.map((loc) => (
              <div key={loc.name} className="space-y-2">
                <h5 className="font-heading font-semibold text-white text-base">
                  {loc.name}
                </h5>
                <div className="flex items-start gap-2 text-white/90 text-sm leading-relaxed">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{loc.address}</span>
                </div>
                <a
                  href={`tel:${loc.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 text-white/90 text-sm hover:text-brand-gold transition-colors duration-200"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{loc.phone}</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom Section: Brand & Links ── */}
        <div className="pt-8 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* ── Brand + Collaboration + Social ── */}
          <div className="md:col-span-6 lg:col-span-6">
            {/* Logos: Digital Ghuru X Jaighurudeva */}
            <div className="flex items-center gap-4 mb-4">
              <Link href="/" className="shrink-0">
                <img
                  src="/logo-final dG.webp"
                  alt="Digital Ghuru Logo"
                  className="h-14 w-auto object-contain"
                />
              </Link>
              <span className="text-white/60 font-medium text-lg shrink-0">✕</span>
              <a
                href="https://jaighurudeva.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0"
              >
                <img
                  src="/partners/jaighurudevalogo.png"
                  alt="Jaighurudeva Educational Academy"
                  className="h-14 w-auto object-contain scale-110"
                />
              </a>
            </div>

            <p className="font-body text-sm md:text-base text-white/90 leading-relaxed mb-5 max-w-lg">
              In proud collaboration with{" "}
              <a
                href="https://jaighurudeva.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-semibold hover:text-brand-gold transition-colors"
              >
                Jaighurudeva Educational Academy
              </a>
              , combining our digital expertise with their legacy of academic
              excellence and personalized mentorship.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center text-white/90 hover:text-white transition-all duration-200 ${social.hoverClass}`}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div className="md:col-span-3 lg:col-span-3">
            <h4 className="font-display text-lg font-bold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm md:text-base text-white/90 hover:text-brand-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Course Links ── */}
          <div className="md:col-span-3 lg:col-span-3">
            <h4 className="font-display text-lg font-bold text-white mb-4">
              Our Courses
            </h4>
            <ul className="space-y-2.5">
              {courseLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm md:text-base text-white/90 hover:text-brand-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-white/10">
        <div className="section-container py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-sm text-white/70">
            © {new Date().getFullYear()} Digital Ghuru. All rights reserved.
          </p>
          <p className="text-sm text-white/60">
            Crafted with passion for digital excellence
          </p>
        </div>
      </div>
    </footer>
  );
}
