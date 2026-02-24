/*
 * PRODUCTS / TOOLS PAGE
 * Design: Swiss Brutalist Precision (consistent with Home and Blog)
 * - Raw, honest typography with stark contrasts
 * - Geometric precision with intentional asymmetry
 * - Colors: Pure black, warm off-white, burnt orange accent
 * - Hard edges, no soft shadows, mechanical interactions
 */

import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import { Link } from "wouter";
import BlogNavigation from "@/components/blog/BlogNavigation";

// ─── Product Data ────────────────────────────────────────────────────────────

interface Product {
  id: string;
  number: string;
  name: string;
  tagline: string;
  oneLiner: string;
  problem: string;
  whatItDoes: string[];
  differentiator: string;
  whoItsFor: string;
  tags: string[];
  githubUrl: string;
  pypiUrl?: string;
  status: "PRODUCTION" | "BETA" | "RESEARCH";
}

const products: Product[] = [
  {
    id: "hardstop",
    number: "01",
    name: "HARDSTOP",
    tagline: "Deterministic Supply Chain Risk Intelligence",
    oneLiner:
      "Stop manually checking dozens of feeds. Hardstop monitors your external risk sources, filters the noise, links events to your operational network, and generates auditable daily briefs — entirely offline.",
    problem:
      "Supply chain risk is not a data problem. You have too much data. The problem is signal — knowing which of the hundreds of daily alerts from NWS, FDA, USCG, and RSS feeds actually touches your network, and which are noise. Most teams either drown in feeds or ignore them entirely. Both are losing positions.",
    whatItDoes: [
      "Monitors public sources: NWS weather alerts, FDA recalls, USCG notices, RSS feeds",
      "Filters noise using configurable suppression rules and trust-tier weighting",
      "Links events to your specific facilities, lanes, and shipments",
      "Assesses risk using deterministic impact scoring — same input, same output, always",
      "Generates tier-aware daily briefs with actionable alerts",
      "All data stays local in SQLite — no cloud, no subscriptions, no data leaving your environment",
    ],
    differentiator:
      "Every alert is auditable. Every run has an exit code (healthy / warning / broken). No silent failures. Self-evaluating architecture means the system tells you when something is wrong — not after you've already missed it.",
    whoItsFor:
      "Operations leaders, supply chain managers, and risk officers at mid-market companies who need daily situational awareness without a six-figure software contract.",
    tags: ["SUPPLY CHAIN", "RISK INTELLIGENCE", "LOCAL-FIRST", "DETERMINISTIC"],
    githubUrl: "https://github.com/WhatsYourWhy/Hardstop",
    status: "PRODUCTION",
  },
  {
    id: "alert-axolotl-evo",
    number: "02",
    name: "ALERT-AXOLOTL-EVO",
    tagline: "Anomaly Detection That Explains Itself",
    oneLiner:
      "Genetic programming that evolves alert rules you can read, edit, and hand to the next person — no black boxes, no 'the model said so.'",
    problem:
      "Most anomaly detection tools hand you a score and say 'trust me.' When an alert fires at 3 AM and your on-call engineer asks why, the answer is usually 'the model said so.' In production systems where people need to understand, debug, and trust their alerts, that is not good enough.",
    whatItDoes: [
      "Breeds populations of explicit symbolic logic rules selected for real-world operational fitness",
      "Enforces precision floors (≥30%), false positive ceilings (≤15%), and sensible alert rate bands",
      "Produces rules you can read: ('if_alert', ('>', ('avg', 'latency'), 100), 'High alert!')",
      "PromotionManager enforces economic constraints — patterns must demonstrate causal contribution or get evicted",
      "Meta-evolution layer breeds its own hyperparameters — no manual tuning",
      "Determinism guarantee: same seed, same Python version, single-threaded = identical results, always",
    ],
    differentiator:
      "Interpretable AI is not an academic concern. In operations, you need to know why something alerted so you can tune it, trust it, and hand it to the next person. GP-evolved symbolic rules give you that transparency without sacrificing the ability to discover non-obvious patterns.",
    whoItsFor:
      "Engineering and ops teams running monitoring pipelines who are drowning in alert noise and need a system that discovers non-obvious patterns without sacrificing explainability.",
    tags: ["ANOMALY DETECTION", "GENETIC PROGRAMMING", "INTERPRETABLE AI", "OPEN SOURCE"],
    githubUrl: "https://github.com/WhatsYourWhy/Alert-Axolotl-Evo",
    pypiUrl: "https://pypi.org/project/alert-axolotl-evo/1.0.0/",
    status: "PRODUCTION",
  },
  {
    id: "strainer-cli",
    number: "03",
    name: "STRAINER-CLI",
    tagline: "Offline Document Intelligence for Pipelines",
    oneLiner:
      "Turn .txt and .md files into structured summaries, tags, and metrics — entirely offline, no API calls, no uploads, no black boxes.",
    problem:
      "Most summarizers assume a web app, cloud processing, and opaque models. That breaks when notes must stay on disk (privacy, compliance, or operational security), when you need outputs that plug into scripts and agents, or when you need repeatable behavior — not a 'maybe it summarizes' black box.",
    whatItDoes: [
      "Produces extractive summaries — top-ranked sentences from the source, not hallucinated rewrites",
      "Infers topic tags from the text for search, indexing, or retrieval systems",
      "Outputs word count and compression ratio metrics",
      "Evidence anchors map every summary sentence and tag back to its exact position in the source",
      "Output is clean JSON or Obsidian-compatible Markdown — drops cleanly into scripts and agents",
      "Fast mode requires zero dependencies; Smart mode uses local sentence embeddings for higher quality",
    ],
    differentiator:
      "Built for pipelines, not dashboards. Every summary is traceable back to the source — evidence anchors tell you exactly where each claim came from. No network required. No data leaves the machine.",
    whoItsFor:
      "Knowledge workers, analysts, and teams managing large document repositories who need structured, machine-readable summaries without sending documents to third-party services.",
    tags: ["DOCUMENT INTELLIGENCE", "LOCAL-FIRST", "PIPELINES", "PRIVACY"],
    githubUrl: "https://github.com/WhatsYourWhy/strainer-cli",
    status: "PRODUCTION",
  },
  {
    id: "temporal-gradient",
    number: "04",
    name: "THE TEMPORAL GRADIENT",
    tagline: "Salience-Aware Compute Scheduling",
    oneLiner:
      "A dynamics framework that modulates processing rate based on information salience — so your system spends compute where it matters, not uniformly across everything.",
    problem:
      "Most systems treat all inputs equally — processing everything at the same rate regardless of urgency or novelty. A CRITICAL SECURITY BREACH DETECTED alert and a routine status update should not consume the same processing resources or trigger the same response latency. Uniform polling is computationally wasteful and operationally blind.",
    whatItDoes: [
      "Maintains an internal timebase (τ) whose rate is modulated by salience load (Ψ)",
      "Salience is a function of novelty and value — high-salience inputs accelerate the internal clock",
      "Memory strength decays over internal time and reconsolidates on access",
      "Configurable cooldown policies prevent rapid repeated reinforcement",
      "Full structured telemetry with canonical schema validation",
      "Deterministic behavior: testable invariants, reproducible state, no hidden stochasticity",
    ],
    differentiator:
      "This is a dynamics framework, not a cognitive model. All claims are limited to defined state variables and testable invariants. Designed to be embedded in larger systems — agents, pipelines, monitoring infrastructure — as a principled compute scheduling layer.",
    whoItsFor:
      "AI engineers and systems architects building agents or pipelines that need principled, salience-aware resource allocation rather than uniform polling or naive priority queues.",
    tags: ["AI INFRASTRUCTURE", "COMPUTE SCHEDULING", "AGENT SYSTEMS", "RESEARCH"],
    githubUrl: "https://github.com/WhatsYourWhy/The-Temporal-Gradient",
    status: "BETA",
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

function ProductsHero() {
  return (
    <section className="pt-32 pb-20 bg-brand-black relative overflow-hidden">
      {/* Background geometric element */}
      <div className="absolute top-0 right-0 w-64 h-64 border border-brand-orange/10 rotate-45 translate-x-32 -translate-y-32 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 border border-brand-offwhite/5 rotate-12 -translate-x-48 translate-y-48 pointer-events-none" />

      <div className="container">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-brand-orange text-sm tracking-widest">
            INSTRUMENTS
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mt-6 leading-[0.9] tracking-tight"
        >
          THE <span className="text-brand-orange">TOOLS</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-body text-xl md:text-2xl text-brand-offwhite/70 mt-8 max-w-2xl leading-relaxed"
        >
          Every tool here was built to solve a real problem. No dashboards. No vibes.
          Deterministic outputs, local-first architecture, and zero tolerance for systems
          that can't explain themselves.
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 h-px bg-brand-orange origin-left"
        />
      </div>
    </section>
  );
}

function StatusBadge({ status }: { status: Product["status"] }) {
  const config = {
    PRODUCTION: { label: "PRODUCTION", className: "bg-brand-orange text-brand-black" },
    BETA: { label: "BETA", className: "bg-brand-offwhite/20 text-brand-offwhite border border-brand-offwhite/40" },
    RESEARCH: { label: "RESEARCH", className: "bg-transparent text-brand-offwhite/50 border border-brand-offwhite/20" },
  };
  const { label, className } = config[status];
  return (
    <span className={`font-mono text-xs px-3 py-1 ${className}`}>
      {label}
    </span>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <motion.section
      id={product.id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="py-20 border-b border-border last:border-b-0"
    >
      <div className="container">
        {/* Header row */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-12">
          <div className="flex items-start gap-6">
            {/* Number */}
            <span className="font-display text-6xl md:text-8xl font-bold text-brand-orange/20 leading-none select-none flex-shrink-0">
              {product.number}
            </span>
            <div>
              <div className="flex items-center gap-4 mb-3">
                <StatusBadge status={product.status} />
              </div>
              <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight">
                {product.name}
              </h2>
              <p className="font-mono text-brand-orange text-sm mt-2 tracking-wide">
                {product.tagline}
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 flex-shrink-0 lg:mt-2">
            <a
              href={product.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-mono text-sm text-brand-offwhite/70 hover:text-brand-orange transition-colors border border-brand-offwhite/20 hover:border-brand-orange px-4 py-2"
            >
              <Github className="h-4 w-4" />
              GITHUB
            </a>
            {product.pypiUrl && (
              <a
                href={product.pypiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-mono text-sm text-brand-offwhite/70 hover:text-brand-orange transition-colors border border-brand-offwhite/20 hover:border-brand-orange px-4 py-2"
              >
                <ExternalLink className="h-4 w-4" />
                PYPI
              </a>
            )}
          </div>
        </div>

        {/* One-liner */}
        <div className="border-l-4 border-brand-orange pl-6 mb-12">
          <p className="font-body text-xl md:text-2xl text-brand-offwhite leading-relaxed">
            {product.oneLiner}
          </p>
        </div>

        {/* Content grid */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 ${isEven ? "" : "lg:grid-flow-dense"}`}>
          {/* Problem + Differentiator */}
          <div className={`space-y-8 ${isEven ? "" : "lg:col-start-2"}`}>
            <div>
              <h3 className="font-mono text-xs text-brand-orange tracking-widest mb-4">
                THE PROBLEM
              </h3>
              <p className="font-body text-brand-offwhite/80 leading-relaxed">
                {product.problem}
              </p>
            </div>

            <div>
              <h3 className="font-mono text-xs text-brand-orange tracking-widest mb-4">
                THE DIFFERENTIATOR
              </h3>
              <p className="font-body text-brand-offwhite/80 leading-relaxed">
                {product.differentiator}
              </p>
            </div>

            <div>
              <h3 className="font-mono text-xs text-brand-orange tracking-widest mb-4">
                WHO IT'S FOR
              </h3>
              <p className="font-body text-brand-offwhite/80 leading-relaxed">
                {product.whoItsFor}
              </p>
            </div>
          </div>

          {/* What it does */}
          <div className={`${isEven ? "" : "lg:col-start-1 lg:row-start-1"}`}>
            <h3 className="font-mono text-xs text-brand-orange tracking-widest mb-6">
              WHAT IT DOES
            </h3>
            <div className="space-y-3">
              {product.whatItDoes.map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="font-mono text-xs text-brand-orange mt-1 flex-shrink-0 w-5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-body text-brand-offwhite/80 leading-relaxed text-sm">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-8">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-xs px-3 py-1 bg-brand-black text-brand-offwhite/50 border border-brand-offwhite/15"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function ProductsNav() {
  return (
    <section className="py-8 bg-brand-charcoal border-b border-border sticky top-20 z-40">
      <div className="container">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <span className="font-mono text-xs text-brand-offwhite/40 mr-4 flex-shrink-0">
            JUMP TO:
          </span>
          {products.map((p) => (
            <a
              key={p.id}
              href={`#${p.id}`}
              className="font-mono text-xs text-brand-offwhite/60 hover:text-brand-orange transition-colors px-4 py-2 border border-brand-offwhite/15 hover:border-brand-orange flex-shrink-0 whitespace-nowrap"
            >
              {p.number} {p.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductsCTA() {
  return (
    <section className="py-24 bg-brand-charcoal">
      <div className="container">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-mono text-brand-orange text-sm tracking-widest">
              ENGAGEMENT
            </span>
            <h2 className="font-display text-4xl md:text-6xl font-bold mt-4 leading-tight">
              THESE TOOLS ARE{" "}
              <span className="text-brand-orange">HOW I WORK</span>
            </h2>
            <p className="font-body text-xl text-brand-offwhite/70 mt-6 leading-relaxed">
              These tools are open source and production-shaped. They're also the instruments
              I use in consulting engagements — when I recommend a solution, I've already
              built and run it. If any of these could solve a problem in your organization,
              let's talk.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-3 font-mono text-sm bg-brand-orange text-brand-black px-8 py-4 hover:bg-brand-offwhite transition-colors"
              >
                START A CONVERSATION
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center gap-3 font-mono text-sm border border-brand-offwhite/30 text-brand-offwhite px-8 py-4 hover:border-brand-orange hover:text-brand-orange transition-colors"
              >
                READ THE BLOG
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Products() {
  return (
    <div className="min-h-screen bg-brand-black text-brand-offwhite">
      <BlogNavigation />
      <ProductsHero />
      <ProductsNav />

      {/* Product Cards */}
      <div className="bg-brand-black">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>

      <ProductsCTA />
      <Footer />
    </div>
  );
}
