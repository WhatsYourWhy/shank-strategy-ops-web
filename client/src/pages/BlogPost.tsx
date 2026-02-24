/*
 * BLOG POST PAGE
 * Design: Swiss Brutalist Precision (consistent with Home)
 * - Long-form reading optimized for the existing design system
 * - Section numbering with Roman numerals
 * - Generous whitespace, stark typography, burnt orange accents
 */

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Clock, ExternalLink } from "lucide-react";
import { Link, useParams, useLocation } from "wouter";
import BlogNavigation from "@/components/blog/BlogNavigation";
import { getBlogPost } from "@/data/blogPosts";
import type { BlogSection, BlogSubsection } from "@/data/blogPosts";

function PostHero({
  title,
  publishedDate,
  readingTime,
  author,
  authorTitle,
  heroImage,
  heroImageCaption,
}: {
  title: string;
  publishedDate: string;
  readingTime: string;
  author: string;
  authorTitle: string;
  heroImage?: string;
  heroImageCaption?: string;
}) {
  const formattedDate = new Date(publishedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="pt-32 pb-12 bg-brand-black relative">
      <div className="container">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-sm text-brand-offwhite/50 hover:text-brand-orange transition-colors mb-12"
          >
            <ArrowLeft className="h-4 w-4" />
            BACK TO BLOG
          </Link>
        </motion.div>

        {/* Meta */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-6"
        >
          <span className="font-mono text-xs text-brand-orange tracking-widest">
            {formattedDate.toUpperCase()}
          </span>
          <span className="text-brand-offwhite/30">|</span>
          <span className="font-mono text-xs text-brand-offwhite/50 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {readingTime}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[0.95] tracking-tight max-w-4xl"
        >
          {title}
        </motion.h1>

        {/* Author */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-brand-orange flex items-center justify-center">
            <span className="font-display font-bold text-brand-black text-lg">S</span>
          </div>
          <div>
            <p className="font-display font-bold text-brand-offwhite">{author}</p>
            <p className="font-mono text-xs text-brand-offwhite/50">{authorTitle}</p>
          </div>
        </motion.div>

        {/* Hero Image */}
        {heroImage && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12"
          >
            <div className="border-4 border-brand-charcoal overflow-hidden">
              <img
                src={heroImage}
                alt={title}
                className="w-full max-h-[500px] object-cover"
              />
            </div>
            {heroImageCaption && (
              <p className="font-mono text-xs text-brand-offwhite/40 mt-3">
                {heroImageCaption}
              </p>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}

function TldrBlock({ tldr }: { tldr: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-16 p-8 bg-brand-charcoal border-l-4 border-brand-orange"
    >
      <span className="font-mono text-xs text-brand-orange tracking-widest">TL;DR</span>
      <p className="font-body text-lg text-brand-offwhite/90 mt-4 leading-relaxed">
        {tldr}
      </p>
    </motion.div>
  );
}

function SubsectionBlock({ subsection }: { subsection: BlogSubsection }) {
  return (
    <div className="mt-10">
      {subsection.title && (
        <h4 className="font-display text-xl md:text-2xl font-bold text-brand-orange mb-6">
          {subsection.title}
        </h4>
      )}
      <div className="space-y-5">
        {subsection.content.map((paragraph, i) => (
          <p
            key={i}
            className="font-body text-lg text-brand-offwhite/85 leading-relaxed"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}

function SectionBlock({ section, index }: { section: BlogSection; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-20"
    >
      {/* Section Header */}
      <div className="flex items-start gap-6 mb-8">
        {section.number && (
          <span className="font-mono text-5xl md:text-6xl font-bold text-brand-orange leading-none flex-shrink-0">
            {section.number}
          </span>
        )}
        <div className="pt-2">
          <h3 className="font-display text-2xl md:text-3xl font-bold leading-tight">
            {section.title}
          </h3>
          <div className="w-16 h-1 bg-brand-orange mt-4" />
        </div>
      </div>

      {/* Direct content paragraphs */}
      {section.content.length > 0 && (
        <div className="space-y-5">
          {section.content.map((paragraph, i) => (
            <p
              key={i}
              className="font-body text-lg text-brand-offwhite/85 leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>
      )}

      {/* Subsections */}
      {section.subsections &&
        section.subsections.map((sub, i) => (
          <SubsectionBlock key={i} subsection={sub} />
        ))}
    </motion.div>
  );
}

function Footer() {
  return (
    <footer className="py-12 bg-brand-black border-t border-border">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-orange flex items-center justify-center">
              <span className="font-display font-bold text-brand-black">S</span>
            </div>
            <span className="font-display font-bold tracking-tight">
              SHANK STRATEGY OPS
            </span>
          </Link>

          <p className="font-mono text-sm text-brand-offwhite/50">
            &copy; {new Date().getFullYear()} Shank Strategy Ops. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const post = getBlogPost(params.slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params.slug]);

  if (!post) {
    setLocation("/404");
    return null;
  }

  return (
    <div className="min-h-screen bg-brand-black text-brand-offwhite">
      <BlogNavigation />

      <PostHero
        title={post.title}
        publishedDate={post.publishedDate}
        readingTime={post.readingTime}
        author={post.author}
        authorTitle={post.authorTitle}
        heroImage={post.heroImage}
        heroImageCaption={post.heroImageCaption}
      />

      {/* Article Body */}
      <article className="py-16 bg-brand-black">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {/* TL;DR */}
            <TldrBlock tldr={post.tldr} />

            {/* Sections */}
            {post.sections.map((section, index) => (
              <SectionBlock key={section.id} section={section} index={index} />
            ))}

            {/* Original Source Link */}
            {post.originalUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mt-16 pt-12 border-t border-brand-offwhite/20"
              >
                <a
                  href={post.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-sm text-brand-offwhite/50 hover:text-brand-orange transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  ORIGINALLY PUBLISHED ON LINKEDIN
                </a>
              </motion.div>
            )}

            {/* Back to Blog */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-12 pt-8 border-t border-brand-offwhite/10"
            >
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 font-mono text-sm text-brand-orange hover:text-brand-offwhite transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                BACK TO ALL POSTS
              </Link>
            </motion.div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
