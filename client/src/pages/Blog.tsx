/*
 * BLOG LISTING PAGE
 * Design: Swiss Brutalist Precision (consistent with Home)
 * - Raw, honest typography with stark contrasts
 * - Geometric precision with intentional asymmetry
 * - Colors: Pure black, warm off-white, burnt orange accent
 * - Hard edges, no soft shadows, mechanical interactions
 */

import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { Link } from "wouter";
import BlogAdsScript from "@/components/BlogAdsScript";
import BlogNavigation from "@/components/blog/BlogNavigation";
import LeadConversationCta from "@/components/LeadConversationCta";
import SiteFooter from "@/components/layout/SiteFooter";
import { getAllBlogPosts } from "@/data/blogPosts";
import { usePageMetadata } from "@/hooks/usePageMetadata";
import { absoluteUrl, siteConfig } from "@/lib/site";

function BlogHero() {
  return (
    <section className="pt-32 pb-20 bg-brand-black relative">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-brand-orange text-sm tracking-widest">
            DISPATCHES
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mt-6 leading-[0.9] tracking-tight"
        >
          THE <span className="text-brand-orange">BLOG</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-body text-xl md:text-2xl text-brand-offwhite/70 mt-8 max-w-2xl leading-relaxed"
        >
          Essays here are the evidence layer behind the consulting practice:
          operating notes, system arguments, and tool breakdowns for people who
          have to make real execution decisions.
        </motion.p>
      </div>
    </section>
  );
}

function BlogPostCard({
  post,
  index,
}: {
  post: ReturnType<typeof getAllBlogPosts>[0];
  index: number;
}) {
  const formattedDate = new Date(post.publishedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/blog/${post.slug}`}>
        <div className="bg-brand-charcoal border-l-4 border-brand-orange hover:border-brand-offwhite transition-all duration-300 cursor-pointer">
          <div className="flex flex-col lg:flex-row">
            {/* Image */}
            {post.heroImage && (
              <div className="lg:w-80 flex-shrink-0 overflow-hidden">
                <img
                  src={post.heroImage}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-48 lg:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-8 flex-1">
              {/* Meta */}
              <div className="flex items-center gap-4 mb-4">
                <span className="font-mono text-xs text-brand-orange tracking-widest">
                  {formattedDate.toUpperCase()}
                </span>
                <span className="text-brand-offwhite/30">|</span>
                <span className="font-mono text-xs text-brand-offwhite/50 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readingTime}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-display text-2xl md:text-3xl font-bold group-hover:text-brand-orange transition-colors leading-tight">
                {post.title}
              </h2>

              {/* TL;DR */}
              <p className="font-body text-brand-offwhite/70 mt-4 leading-relaxed line-clamp-3">
                {post.tldr}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-xs px-3 py-1 bg-brand-black text-brand-offwhite/60 border border-brand-offwhite/20"
                  >
                    {tag.toUpperCase()}
                  </span>
                ))}
              </div>

              {/* Read More */}
              <div className="mt-6 flex items-center gap-2 font-mono text-sm text-brand-orange group-hover:gap-4 transition-all">
                READ ARTICLE
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

function Footer() {
  return <SiteFooter />;
}

export default function Blog() {
  const posts = getAllBlogPosts();

  usePageMetadata({
    title: "Blog",
    path: "/blog",
    description:
      "Original essays and field notes from Shank Strategy Ops on strategy, operations, deterministic systems, and open-source tools.",
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "Shank Strategy Ops Blog",
        url: absoluteUrl("/blog"),
        description:
          "Original essays and field notes on strategy, operations, deterministic systems, and tools.",
        publisher: siteConfig.publisher,
      },
      {
        "@context": "https://schema.org",
        ...siteConfig.publisher,
      },
    ],
  });

  return (
    <div className="min-h-screen bg-brand-black text-brand-offwhite">
      <BlogAdsScript />
      <BlogNavigation />
      <BlogHero />

      {/* Posts List */}
      <section className="py-16 bg-brand-black">
        <div className="container">
          <div className="mb-10 max-w-3xl border border-brand-offwhite/10 bg-brand-charcoal p-6">
            <p className="font-body text-base leading-relaxed text-brand-offwhite/75">
              This archive is intentionally small and publisher-owned. Posts are selected for
              depth, not frequency, and each article is expected to stand on its own as a useful
              resource rather than a thin summary page.
            </p>
          </div>

          <LeadConversationCta
            eyebrow="TURN READING INTO ACTION"
            title="If this problem is live inside your organization, start the conversation there."
            body="The archive is public on purpose: it should help you decide whether the way we think matches the problem you need solved."
            source="blog-index"
            className="mb-10"
          />

          <div className="space-y-6">
            {posts.map((post, index) => (
              <BlogPostCard key={post.slug} post={post} index={index} />
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-20">
              <p className="font-mono text-brand-offwhite/50 text-lg">
                No posts yet. Check back soon.
              </p>
            </div>
          )}

          <LeadConversationCta
            eyebrow="READY TO TALK"
            title="Useful writing is not the end state. Better execution is."
            body="If the article helped define the problem more clearly, we can use that clarity to decide whether a bounded engagement makes sense."
            source="blog-index-bottom"
            className="mt-10"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}
