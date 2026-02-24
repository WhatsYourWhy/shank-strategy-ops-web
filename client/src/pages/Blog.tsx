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
import BlogNavigation from "@/components/blog/BlogNavigation";
import { getAllBlogPosts } from "@/data/blogPosts";

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
          Strategy, operations, and the forces reshaping how work gets done.
          Long-form thinking for people who build things that matter.
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

export default function Blog() {
  const posts = getAllBlogPosts();

  return (
    <div className="min-h-screen bg-brand-black text-brand-offwhite">
      <BlogNavigation />
      <BlogHero />

      {/* Posts List */}
      <section className="py-16 bg-brand-black">
        <div className="container">
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
        </div>
      </section>

      <Footer />
    </div>
  );
}
