import BlogNavigation from "@/components/blog/BlogNavigation";
import SiteFooter from "@/components/layout/SiteFooter";
import {
  HomeContactSection,
  HomeEngagementSection,
  HomeHeroSection,
  HomeInsightsSection,
  HomeModelsSection,
  HomeOutcomesSection,
  HomePrinciplesSection,
  HomeProofStrip,
  HomePublishingSection,
  HomeStandardsSection,
} from "@/components/home/HomeSections";
import { getAllBlogPosts } from "@/data/blogPosts";
import { usePageMetadata } from "@/hooks/usePageMetadata";
import { consumeHomeSectionNavigation } from "@/lib/homeNavigation";
import { FIXED_HEADER_OFFSET, scrollToElementWithOffset } from "@/lib/scroll";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { useEffect } from "react";

function scrollToSection(id: string) {
  scrollToElementWithOffset(id, FIXED_HEADER_OFFSET);
}

export default function Home() {
  const posts = getAllBlogPosts().slice(0, 3);

  useEffect(() => {
    const targetSection = consumeHomeSectionNavigation();
    if (!targetSection) {
      return;
    }

    window.setTimeout(() => {
      scrollToSection(targetSection);
    }, 0);
  }, []);

  usePageMetadata({
    path: "/",
    title: "Strategic Operations Consulting, Operator Notes, and Tools",
    description:
      "Shank Strategy Ops provides strategic operations consulting for leaders fixing execution drift, decision bottlenecks, and operating systems that no longer hold under real conditions.",
    structuredData: [
      {
        "@context": "https://schema.org",
        ...siteConfig.publisher,
      },
      {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: siteConfig.name,
        url: absoluteUrl("/"),
        email: siteConfig.email,
        description:
          "Strategy execution and operational repair for leaders who need clearer control, bounded engagements, and durable systems.",
        areaServed: "United States",
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteConfig.name,
        url: absoluteUrl("/"),
      },
    ],
  });

  return (
    <div className="min-h-screen bg-brand-black text-brand-offwhite">
      <BlogNavigation />
      <main
        id="main-content"
        tabIndex={-1}
      >
        <HomeHeroSection scrollToSection={scrollToSection} />
        <HomeProofStrip />
        <HomeOutcomesSection />
        <HomePrinciplesSection />
        <HomeEngagementSection />
        <HomeModelsSection />
        <HomePublishingSection />
        <HomeInsightsSection posts={posts} />
        <HomeStandardsSection />
        <HomeContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}
