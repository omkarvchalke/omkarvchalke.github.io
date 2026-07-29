import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { SectionHeader } from "@/components/section-header";
import { ContactForm } from "@/features/contact/contact-form";
import { GitHubIcon, LinkedInIcon } from "@/components/brand-icons";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch.",
};

const CONTACT_EMAIL = "chalkeomkarvilas@gmail.com";
const GITHUB_URL = "https://github.com/omkarvchalke";
const LINKEDIN_URL = "https://www.linkedin.com/in/omkarvchalke/";

export default function ContactPage() {
  return (
    <PageContainer>
      <SectionHeader eyebrow="Contact" title="Get in touch." />
      <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
        <ContactForm />
        <aside className="flex flex-col gap-6">
          <div className="border-primary/30 bg-primary/5 flex items-center gap-2 rounded-md border px-3 py-2">
            <span className="bg-primary size-1.5 rounded-full" />
            <span className="text-primary font-mono text-xs">
              Open to opportunities
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-muted-foreground hover:text-primary flex items-center gap-2.5 text-sm"
            >
              <Mail className="size-4" />
              {CONTACT_EMAIL}
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="text-muted-foreground hover:text-primary flex items-center gap-2.5 text-sm"
            >
              <GitHubIcon className="size-4" />
              github.com/omkarvchalke
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="text-muted-foreground hover:text-primary flex items-center gap-2.5 text-sm"
            >
              <LinkedInIcon className="size-4" />
              linkedin.com/in/omkarvchalke
            </a>
          </div>
        </aside>
      </div>
    </PageContainer>
  );
}
