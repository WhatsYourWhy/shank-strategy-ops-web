import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";

export default function BlogNavigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = location === "/";

  const scrollToSection = (id: string) => {
    if (!isHome) {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav
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
              onClick={() => scrollToSection("principles")}
              className="font-mono text-sm text-brand-offwhite/70 hover:text-brand-orange transition-colors"
            >
              PRINCIPLES
            </button>
            <button
              onClick={() => scrollToSection("engagement")}
              className="font-mono text-sm text-brand-offwhite/70 hover:text-brand-orange transition-colors"
            >
              ENGAGEMENT
            </button>
            <button
              onClick={() => scrollToSection("models")}
              className="font-mono text-sm text-brand-offwhite/70 hover:text-brand-orange transition-colors"
            >
              MODELS
            </button>
            <Link
              href="/blog"
              className={`font-mono text-sm transition-colors ${
                location.startsWith("/blog")
                  ? "text-brand-orange"
                  : "text-brand-offwhite/70 hover:text-brand-orange"
              }`}
            >
              BLOG
            </Link>
            <button
              onClick={() => scrollToSection("contact")}
              className="font-mono text-sm bg-brand-orange text-brand-black px-6 py-2 hover:bg-brand-offwhite transition-colors"
            >
              START CONVERSATION
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden py-6 border-t border-border"
          >
            <div className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection("principles")}
                className="font-mono text-sm text-brand-offwhite/70 hover:text-brand-orange transition-colors text-left"
              >
                PRINCIPLES
              </button>
              <button
                onClick={() => scrollToSection("engagement")}
                className="font-mono text-sm text-brand-offwhite/70 hover:text-brand-orange transition-colors text-left"
              >
                ENGAGEMENT
              </button>
              <button
                onClick={() => scrollToSection("models")}
                className="font-mono text-sm text-brand-offwhite/70 hover:text-brand-orange transition-colors text-left"
              >
                MODELS
              </button>
              <Link
                href="/blog"
                className={`font-mono text-sm transition-colors text-left ${
                  location.startsWith("/blog")
                    ? "text-brand-orange"
                    : "text-brand-offwhite/70 hover:text-brand-orange"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                BLOG
              </Link>
              <button
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
