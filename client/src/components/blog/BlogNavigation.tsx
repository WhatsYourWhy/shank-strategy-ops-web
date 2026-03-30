import { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { queueHomeSectionNavigation } from "@/lib/homeNavigation";
import { FIXED_HEADER_OFFSET, scrollToElementWithOffset } from "@/lib/scroll";

const homeNavSections = [
  { id: "principles", label: "CORE PRINCIPLES" },
  { id: "engagement", label: "ENGAGEMENT FLOW" },
  { id: "models", label: "OPERATING MODELS" },
] as const;

export default function BlogNavigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [location, setLocation] = useLocation();
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const firstMobileItemRef = useRef<HTMLButtonElement | null>(null);
  const restoreFocusRef = useRef(false);
  const mobileMenuId = useId();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = location === "/";

  const closeMobileMenu = ({ restoreFocus = false }: { restoreFocus?: boolean } = {}) => {
    restoreFocusRef.current = restoreFocus;
    setMobileMenuOpen(false);
  };

  const scrollToSection = (id: string) => {
    if (!isHome) {
      queueHomeSectionNavigation(id, setLocation);
      closeMobileMenu();
      return;
    }

    scrollToElementWithOffset(id, {
      focusTarget: `${id}-heading`,
      offset: FIXED_HEADER_OFFSET,
    });
    closeMobileMenu();
  };

  const getSectionButtonClass = (id: string) =>
    `font-mono text-sm transition-colors ${
      isHome && activeSection === id
        ? "border-b border-brand-orange pb-1 text-brand-offwhite"
        : "text-brand-offwhite/72 hover:text-brand-offwhite"
    }`;

  useEffect(() => {
    if (!mobileMenuOpen) {
      if (restoreFocusRef.current) {
        restoreFocusRef.current = false;
        window.requestAnimationFrame(() => {
          toggleButtonRef.current?.focus();
        });
      }
      return;
    }

    window.requestAnimationFrame(() => {
      firstMobileItemRef.current?.focus();
    });
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMobileMenu({ restoreFocus: true });
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    closeMobileMenu();
  }, [location]);

  useEffect(() => {
    if (!isHome) {
      setActiveSection(null);
      return;
    }

    const updateActiveSection = () => {
      const marker = window.scrollY + FIXED_HEADER_OFFSET + 24;
      let nextActiveSection: string | null = null;

      for (const section of homeNavSections) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= marker) {
          nextActiveSection = section.id;
        }
      }

      setActiveSection(nextActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });

    return () => window.removeEventListener("scroll", updateActiveSection);
  }, [isHome]);

  return (
    <nav
      aria-label="Primary"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-brand-black/95 backdrop-blur-sm border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-orange flex items-center justify-center">
              <span className="font-display font-bold text-brand-black text-xl">S</span>
            </div>
            <span className="font-display font-bold text-xl tracking-tight hidden sm:block">
              SHANK STRATEGY OPS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <button
              type="button"
              onClick={() => scrollToSection("principles")}
              className={getSectionButtonClass("principles")}
            >
              {homeNavSections[0].label}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("engagement")}
              className={getSectionButtonClass("engagement")}
            >
              {homeNavSections[1].label}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("models")}
              className={getSectionButtonClass("models")}
            >
              {homeNavSections[2].label}
            </button>
            <Link
              href="/about"
              aria-current={
                location === "/about" ||
                location === "/methodology" ||
                location === "/editorial-policy" ||
                location === "/privacy" ||
                location === "/terms"
                  ? "page"
                  : undefined
              }
              className={`font-mono text-sm transition-colors ${
                location === "/about" ||
                location === "/methodology" ||
                location === "/editorial-policy" ||
                location === "/privacy" ||
                location === "/terms"
                  ? "text-brand-offwhite"
                  : "text-brand-offwhite/72 hover:text-brand-offwhite"
              }`}
            >
              ABOUT
            </Link>
            <Link
              href="/tools"
              aria-current={location === "/tools" ? "page" : undefined}
              className={`font-mono text-sm transition-colors ${
                location === "/tools"
                  ? "text-brand-offwhite"
                  : "text-brand-offwhite/72 hover:text-brand-offwhite"
              }`}
            >
              TOOLS
            </Link>
            <Link
              href="/blog"
              aria-current={location.startsWith("/blog") ? "page" : undefined}
              className={`font-mono text-sm transition-colors ${
                location.startsWith("/blog")
                  ? "text-brand-offwhite"
                  : "text-brand-offwhite/72 hover:text-brand-offwhite"
              }`}
            >
              BLOG
            </Link>
            <button
              type="button"
              onClick={() => scrollToSection("contact")}
              className="font-mono text-sm bg-brand-orange text-brand-black px-6 py-2 hover:bg-brand-offwhite transition-colors"
            >
              START CONVERSATION
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={toggleButtonRef}
            type="button"
            aria-expanded={mobileMenuOpen}
            aria-controls={mobileMenuId}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => {
              if (mobileMenuOpen) {
                closeMobileMenu();
                return;
              }

              setMobileMenuOpen(true);
            }}
            className="lg:hidden p-2"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`block h-0.5 bg-brand-offwhite transition-transform ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`block h-0.5 bg-brand-offwhite transition-opacity ${mobileMenuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 bg-brand-offwhite transition-transform ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            id={mobileMenuId}
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden py-6 border-t border-border"
          >
            <div className="flex flex-col gap-4">
              <button
                ref={firstMobileItemRef}
                type="button"
                onClick={() => scrollToSection("principles")}
                className={`${getSectionButtonClass("principles")} text-left`}
              >
                {homeNavSections[0].label}
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("engagement")}
                className={`${getSectionButtonClass("engagement")} text-left`}
              >
                {homeNavSections[1].label}
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("models")}
                className={`${getSectionButtonClass("models")} text-left`}
              >
                {homeNavSections[2].label}
              </button>
              <Link
                href="/about"
                aria-current={
                  location === "/about" ||
                  location === "/methodology" ||
                  location === "/editorial-policy" ||
                  location === "/privacy" ||
                  location === "/terms"
                    ? "page"
                    : undefined
                }
                className={`font-mono text-sm transition-colors text-left ${
                  location === "/about" ||
                  location === "/methodology" ||
                  location === "/editorial-policy" ||
                  location === "/privacy" ||
                  location === "/terms"
                    ? "text-brand-offwhite"
                    : "text-brand-offwhite/72 hover:text-brand-offwhite"
                }`}
                onClick={() => closeMobileMenu()}
              >
                ABOUT
              </Link>
              <Link
                href="/tools"
                aria-current={location === "/tools" ? "page" : undefined}
                className={`font-mono text-sm transition-colors text-left ${
                  location === "/tools"
                    ? "text-brand-offwhite"
                    : "text-brand-offwhite/72 hover:text-brand-offwhite"
                }`}
                onClick={() => closeMobileMenu()}
              >
                TOOLS
              </Link>
              <Link
                href="/blog"
                aria-current={location.startsWith("/blog") ? "page" : undefined}
                className={`font-mono text-sm transition-colors text-left ${
                  location.startsWith("/blog")
                    ? "text-brand-offwhite"
                    : "text-brand-offwhite/72 hover:text-brand-offwhite"
                }`}
                onClick={() => closeMobileMenu()}
              >
                BLOG
              </Link>
              <button
                type="button"
                onClick={() => scrollToSection("contact")}
                className="font-mono text-sm bg-brand-orange text-brand-black px-6 py-3 hover:bg-brand-offwhite transition-colors text-left"
              >
                START CONVERSATION
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
