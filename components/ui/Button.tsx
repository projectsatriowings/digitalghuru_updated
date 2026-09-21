import React from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "accent";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  target?: string;
  download?: boolean | string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-[#FFB800] to-[#FF5C00] text-white shadow-md hover:shadow-lg hover:brightness-110 focus-visible:ring-[#FF5C00]/50",
  secondary:
    "bg-brand-orange text-white shadow-md hover:shadow-lg hover:brightness-110 focus-visible:ring-brand-orange/50",
  outline:
    "bg-transparent border-2 border-brand-blue text-brand-blue hover:bg-brand-blue/5 focus-visible:ring-brand-blue/50",
  ghost:
    "bg-transparent text-brand-blue hover:underline hover:underline-offset-4 focus-visible:ring-brand-blue/50",
  accent:
    "bg-brand-gold text-ink-900 font-semibold shadow-sm hover:shadow-md hover:brightness-105 focus-visible:ring-brand-gold/50",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm rounded-lg",
  md: "px-6 py-3 text-base rounded-xl",
  lg: "px-8 py-4 text-lg rounded-xl",
};

export default function Button({
  variant = "primary",
  size = "md",
  href,
  disabled = false,
  className = "",
  children,
  onClick,
  type = "button",
  target,
  download,
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-heading font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 select-none";

  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer hover:scale-[1.02] active:scale-[0.98]";

  // Accent badge variant gets pill shape override
  const accentOverride = variant === "accent" ? "rounded-full px-5 py-2 text-sm" : "";

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${accentOverride || sizeStyles[size]} ${disabledStyles} ${className}`;

  if (href && !disabled) {
    const isExternal = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#");
    
    if (isExternal) {
      const isAnchor = href.startsWith("#");
      
      return (
        <a 
          href={href} 
          className={combinedStyles} 
          target={target} 
          download={download}
          onClick={(e) => {
            if (isAnchor && typeof window !== "undefined" && (window as any).lenis) {
              e.preventDefault();
              (window as any).lenis.scrollTo(href, { offset: -80, duration: 1.5, lock: false });
            }
            if (onClick) onClick();
          }}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={combinedStyles} target={target} download={download}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={combinedStyles}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
