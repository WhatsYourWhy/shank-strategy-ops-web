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
import { getStaticPageMetadata } from "@/lib/pageMetadata";
import { FIXED_HEADER_OFFSET, scrollToElementWithOffset } from "@/lib/scroll";
import { useEffect } from "react";

function scrollToSection(id: string) {
  scrollToElementWithOffset(id, {
    focusTarget: `${id}-heading`,
    offset: FIXED_HEADER_OFFSET,
  });
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

  usePageMetadata(getStaticPageMetadata("/"));

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
