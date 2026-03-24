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
import { absoluteUrl, siteConfig } from "@/lib/site";

function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}

export default function Home() {
  const posts = getAllBlogPosts().slice(0, 3);

  usePageMetadata({
    path: "/",
    title: "Strategy execution, operator notes, and deterministic tools",
    description:
      "Shank Strategy Ops helps leaders repair execution drift, clarify decision rights, and install operating systems that hold under real conditions.",
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
      <SiteFooter />
    </div>
  );
}
