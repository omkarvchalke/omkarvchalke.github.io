import fs from "node:fs";
import path from "node:path";
import { Download, Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/brand-icons";
import { ContactForm } from "@/features/contact/contact-form";
import { SectionShell } from "./section-shell";

const CONTACT_EMAIL = "chalkeomkarvilas@gmail.com";
const GITHUB_URL = "https://github.com/omkarvchalke";
const LINKEDIN_URL = "https://www.linkedin.com/in/omkarvchalke/";

function hasResumeFile() {
  return fs.existsSync(path.join(process.cwd(), "public", "resume.pdf"));
}

export function ContactSection() {
  const resumeAvailable = hasResumeFile();

  return (
    <SectionShell
      id="contact"
      eyebrow="Contact"
      title="Get in touch."
      icon={Mail}
      tone="tint"
    >
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
          {resumeAvailable ? (
            <a
              href="/resume.pdf"
              download
              className="glow-ring-emerald bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 w-fit items-center gap-2 rounded-md px-4 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
            >
              <Download className="size-4" />
              Download résumé
            </a>
          ) : (
            <p className="text-muted-foreground font-mono text-xs">
              Résumé pending — drop it at public/resume.pdf
            </p>
          )}
        </aside>
      </div>
    </SectionShell>
  );
}
