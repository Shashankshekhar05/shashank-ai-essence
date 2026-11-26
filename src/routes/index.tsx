import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { Hero } from "@/components/site/Hero";
import { Credibility } from "@/components/site/Credibility";
import { SelectedWork } from "@/components/site/SelectedWork";
import { VoiceCaseStudy } from "@/components/site/VoiceCaseStudy";
import { TokenSaverCaseStudySection } from "@/components/site/VisualProjectCaseStudy";
import { ConstitutionCaseStudy } from "@/components/site/ConstitutionCaseStudy";
import { AiJudgmentCaseStudy } from "@/components/site/AiJudgmentCaseStudy";
import { Engineering } from "@/components/site/Engineering";
import { ExperienceSection } from "@/components/site/ExperienceSection";
import { ProjectsSection } from "@/components/site/ProjectsSection";
import { CredentialsSection } from "@/components/site/CredentialsSection";
import { About } from "@/components/site/About";
import { ContactFooter } from "@/components/site/ContactFooter";
import { ChatWidget } from "@/components/site/ChatWidget";
import { profile } from "@/data/profile";

const title = "Shashank Shekhar — AI Engineer | Generative AI & LLMs";
const description =
  "AI Engineer building production Generative AI: voice AI infrastructure, RAG systems, LLM agent workflows and FastAPI backends. Open to AI roles in India and globally.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: profile.name,
          jobTitle: "AI Engineer",
          email: `mailto:${profile.email}`,
          url: profile.linkedin,
          sameAs: [profile.github, profile.linkedin],
          address: { "@type": "PostalAddress", addressLocality: "Chandigarh", addressCountry: "IN" },
          worksFor: { "@type": "Organization", name: "Socomo Technologies Pvt. Ltd. / JungleWorks" },
          alumniOf: { "@type": "CollegeOrUniversity", name: "Chandigarh Engineering College" },
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <Credibility />
        <SelectedWork />
        <VoiceCaseStudy />
        <TokenSaverCaseStudySection />
        <ConstitutionCaseStudy />
        <AiJudgmentCaseStudy />
        <Engineering />
        <ExperienceSection />
        <ProjectsSection />
        <CredentialsSection />
        <About />
      </main>
      <ContactFooter />
      <ChatWidget />
    </>
  );
}
