"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { useSession } from "next-auth/react";

/* ─── Navigation Data ─── */
interface NavSubItem {
  label: string;
  href: string;
  target?: string;
}

interface NavDropdownItem {
  label: string;
  href?: string;
  target?: string;
  children?: NavSubItem[];
}

interface NavItem {
  label: string;
  href?: string;
  children?: NavDropdownItem[];
}

const staticNavItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Courses",
    children: [], // filled dynamically
  },
  {
    label: "Resources",
    children: [
      { label: "About Us", href: "/about-us" },
      { label: "Digital Marketing Tools & Deals", href: "/resources/tools" },
    ],
  },
  { label: "Contact Us", href: "/contact" },
  { label: "Careers", href: "/careers" },
];

function buildNavItems(courses: { title: string; slug: string }[]): NavItem[] {
  const courseChildren: NavDropdownItem[] = [];
  for (const course of courses) {
    courseChildren.push(
      { label: course.title, href: `/courses/${course.slug}` },
      { label: `${course.title} in Hyderabad`, href: `/courses/${course.slug}/hyderabad`, target: "_blank" },
    );
  }
  return staticNavItems.map((item) =>
    item.label === "Courses" ? { ...item, children: courseChildren } : item
  );
}

/* ─── Dropdown Animations ─── */
const dropdownVariants: any = {
  hidden: { opacity: 0, y: -8, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.18, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.12, ease: "easeIn" },
  },
};

const flyoutVariants: any = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.18, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    x: -8,
    transition: { duration: 0.12, ease: "easeIn" },
  },
};

/* ─── Desktop Nested Sub-Dropdown ─── */
function DesktopSubDropdown({ item }: { item: NavDropdownItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex w-full items-center justify-between gap-2 px-4 py-2.5 font-body text-sm text-ink-700 hover:bg-brand-blue/5 hover:text-brand-blue transition-colors duration-150 rounded-lg">
        <span>{item.label}</span>
        <ChevronRight className="h-3.5 w-3.5 text-ink-400" />
      </button>

      <AnimatePresence>
        {open && item.children && (
          <motion.div
            variants={flyoutVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute left-full top-0 ml-1 min-w-[220px] rounded-xl bg-white p-2 shadow-lg border border-ink-100"
          >
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                target={child.target}
                rel={child.target === "_blank" ? "noopener noreferrer" : undefined}
                className="block px-4 py-2.5 font-body text-sm text-ink-700 hover:bg-brand-blue/5 hover:text-brand-blue rounded-lg transition-colors duration-150 whitespace-nowrap"
              >
                {child.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Desktop Dropdown ─── */
function DesktopDropdown({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center gap-1 px-3 py-2 text-base font-heading font-semibold text-white/90 hover:text-white transition-colors duration-200">
        {item.label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && item.children && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute left-0 top-full mt-1 min-w-[260px] rounded-xl bg-white p-2 shadow-lg border border-ink-100 z-50"
          >
            {item.children.map((child) =>
              child.children ? (
                <DesktopSubDropdown key={child.label} item={child} />
              ) : (
                <Link
                  key={child.href || child.label}
                  href={child.href || "#"}
                  target={child.target}
                  rel={child.target === "_blank" ? "noopener noreferrer" : undefined}
                  className="block px-4 py-2.5 font-body text-base text-ink-700 hover:bg-brand-blue/5 hover:text-brand-blue rounded-lg transition-colors duration-150 whitespace-nowrap"
                >
                  {child.label}
                </Link>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Mobile Accordion Sub-Items ─── */
function MobileAccordion({
  item,
  onClose,
}: {
  item: NavDropdownItem;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-heading font-semibold text-ink-600"
        >
          {item.label}
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          />
        </button>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden pl-4"
            >
              {item.children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  target={child.target}
                  rel={child.target === "_blank" ? "noopener noreferrer" : undefined}
                  onClick={child.target === "_blank" ? undefined : onClose}
                  className="block px-4 py-2.5 text-sm text-ink-500 hover:text-brand-blue transition-colors"
                >
                  {child.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <Link
      href={item.href || "#"}
      onClick={onClose}
      className="block px-4 py-3 text-sm font-heading font-semibold text-ink-600 hover:text-brand-blue transition-colors"
    >
      {item.label}
    </Link>
  );
}

/* ─── Mobile Nav Group ─── */
function MobileNavGroup({
  item,
  onClose,
}: {
  item: NavItem;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  if (item.children) {
    return (
      <div className="border-b border-ink-100">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between px-6 py-4 text-base font-heading font-bold text-ink-800"
        >
          {item.label}
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          />
        </button>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden pl-2 pb-2"
            >
              {item.children.map((child) => (
                <MobileAccordion
                  key={child.label}
                  item={child}
                  onClose={onClose}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <Link
      href={item.href || "/"}
      onClick={onClose}
      className="block border-b border-ink-100 px-6 py-4 text-base font-heading font-bold text-ink-800 hover:text-brand-blue transition-colors"
    >
      {item.label}
    </Link>
  );
}

/* ─── Main Navbar ─── */
export default function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>(staticNavItems);
  const pathname = usePathname();

  // Fetch courses and build dynamic nav
  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/courses");
        if (res.ok) {
          const courses = await res.json();
          if (Array.isArray(courses) && courses.length > 0) {
            setNavItems(buildNavItems(courses));
          }
        }
      } catch (err) {
        console.error("Failed to fetch courses for nav:", err);
      }
    }
    fetchCourses();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#006FFF]/90 backdrop-blur-md shadow-nav border-b border-white/10"
          : "bg-[#006FFF]"
      }`}
    >
      <nav className="section-container flex items-center justify-between h-[88px]">
        {/* ── Logo ── */}
        <Link href="/" className="flex items-center shrink-0">
          <img
            src="/logo-final dG.webp"
            alt="Digital Ghuru Logo"
            className="h-16 w-auto object-contain"
          />
        </Link>

        {/* ── Desktop Nav ── */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) =>
            item.children ? (
              <DesktopDropdown key={item.label} item={item} />
            ) : (
              <Link
                key={item.label}
                href={item.href || "/"}
                className={`px-3 py-2 text-base font-heading font-semibold transition-colors duration-200 ${
                  pathname === item.href
                    ? "text-brand-gold"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {item.label}
                {pathname === item.href && (
                  <span className="block h-0.5 mt-0.5 bg-brand-gold rounded-full" />
                )}
              </Link>
            )
          )}
        </div>

        {/* ── Desktop CTA ── */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/signin"
            className="text-base font-heading font-semibold text-white/90 hover:text-white transition-colors"
          >
            Log In
          </Link>
          <Button variant="primary" size="md" href="/signup">
            Sign Up
          </Button>
        </div>

        {/* ── Mobile: CTA + Hamburger ── */}
        <div className="flex items-center gap-3 lg:hidden">
          <Button variant="primary" size="sm" href="/signin">
            Log In
          </Button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-white hover:text-brand-gold transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu Panel ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-[88px] bg-white z-40 overflow-y-auto lg:hidden"
          >
            <div className="pb-8">
              {navItems.map((item) => (
                <MobileNavGroup
                  key={item.label}
                  item={item}
                  onClose={() => setMobileOpen(false)}
                />
              ))}
              
              {/* Mobile Auth Links */}
              <div className="border-t border-ink-100 mt-2 p-6 flex flex-col gap-3">
                <Button
                  variant="outline"
                  className="w-full"
                  href="/signin"
                  onClick={() => setMobileOpen(false)}
                >
                  Log In
                </Button>
                <Button
                  variant="primary"
                  className="w-full"
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
