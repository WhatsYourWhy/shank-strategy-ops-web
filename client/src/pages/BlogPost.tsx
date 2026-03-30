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
import BlogAdsScript from "@/components/BlogAdsScript";
import BlogNavigation from "@/components/blog/BlogNavigation";
import LeadConversationCta from "@/components/LeadConversationCta";
import SiteFooter from "@/components/layout/SiteFooter";
import { getBlogPost } from "@/data/blogPosts";
import type { BlogSection, BlogSubsection } from "@/data/blogPosts";
import { usePageMetadata } from "@/hooks/usePageMetadata";
import { absoluteUrl, siteConfig } from "@/lib/site";

function PostHero({
  title,
  subtitle,
  publishedDate,
  readingTime,
  author,
  authorTitle,
  heroImage,
  heroImageAlt,
  heroImageCaption,
}: {
  title: string;
  subtitle?: string;
  publishedDate: string;
  readingTime: string;
  author: string;
  authorTitle: string;
  heroImage?: string;
  heroImageAlt?: string;
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
            className="inline-flex items-center gap-2 font-mono text-sm text-brand-offwhite/60 hover:text-brand-offwhite transition-colors mb-12"
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
          <span className="font-mono text-xs text-brand-offwhite/78 tracking-widest">
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

        {subtitle ? (
          <motion.p
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-5 max-w-3xl font-body text-xl leading-relaxed text-brand-offwhite/72 md:text-2xl"
          >
            {subtitle}
          </motion.p>
        ) : null}

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
                alt={heroImageAlt ?? title}
                loading="eager"
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
      <span className="font-mono text-xs text-brand-offwhite/78 tracking-widest">TL;DR</span>
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
        <h4 className="font-display text-xl md:text-2xl font-bold text-brand-offwhite mb-6">
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
  return <SiteFooter />;
}

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const post = getBlogPost(params.slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params.slug]);

  useEffect(() => {
    if (!post && params.slug) setLocation("/404");
  }, [post, params.slug, setLocation]);

  usePageMetadata({
    title: post?.title ?? "Article",
    path: post ? `/blog/${post.slug}` : `/blog/${params.slug}`,
    description: post?.tldr ?? "Article from Shank Strategy Ops.",
    type: "article",
    image: post?.heroImage,
    robots: post ? "index,follow" : "noindex,follow",
    structuredData: post
      ? {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          alternativeHeadline: post.subtitle,
          description: post.tldr,
          image: post.heroImage ? absoluteUrl(post.heroImage) : undefined,
          datePublished: post.publishedDate,
          dateModified: post.publishedDate,
          author: {
            "@type": "Organization",
            name: post.author,
          },
          publisher: siteConfig.publisher,
          keywords: post.tags.join(", "),
          articleSection: post.tags[0],
          inLanguage: "en-US",
          isAccessibleForFree: true,
          mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
        }
      : undefined,
  });

  if (!post) return null;

  return (
    <div className="min-h-screen bg-brand-black text-brand-offwhite">
      <BlogAdsScript />
      <BlogNavigation />
      <main
        id="main-content"
        tabIndex={-1}
      >
        <PostHero
          title={post.title}
          subtitle={post.subtitle}
          publishedDate={post.publishedDate}
          readingTime={post.readingTime}
        author={post.author}
        authorTitle={post.authorTitle}
        heroImage={post.heroImage}
        heroImageAlt={post.heroImageAlt}
        heroImageCaption={post.heroImageCaption}
      />

        {/* Article Body */}
        <article className="py-16 bg-brand-black">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              {/* TL;DR */}
              <TldrBlock tldr={post.tldr} />

              {post.originalUrl && (
                <div className="mb-12 border border-brand-offwhite/10 bg-brand-charcoal/60 p-5">
                  <p className="font-body text-sm leading-relaxed text-brand-offwhite/72">
                    This website version is the primary readable edition of the piece. If a related
                    public post exists elsewhere, it is linked near the end for reference.
                  </p>
                </div>
              )}

              {/* Sections */}
              {post.sections.map((section, index) => (
                <SectionBlock key={section.id} section={section} index={index} />
              ))}

              <LeadConversationCta
                eyebrow="FROM NOTE TO EXECUTION"
                title="If this issue is active in your organization, we can pressure-test it together."
                body="The article is there to sharpen the model. The engagement is there to change the operating reality."
                source={`blog-post-${post.slug}`}
                className="mt-16"
              />

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
                    className="inline-flex items-center gap-2 font-mono text-sm text-brand-offwhite/50 hover:text-brand-offwhite transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    RELATED PUBLIC VERSION
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
                  className="inline-flex items-center gap-2 font-mono text-sm text-brand-offwhite/80 hover:text-brand-offwhite transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  BACK TO ALL POSTS
                </Link>
              </motion.div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
