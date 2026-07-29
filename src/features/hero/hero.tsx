import Link from "next/link";
import { ArrowRight, FileText, Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/brand-icons";
import { NodeEcosystem } from "./node-ecosystem";

const SITE_OWNER = {
  name: "Omkar Vilas Chalke",
  github: "https://github.com/omkarvchalke",
  linkedin: "https://www.linkedin.com/in/omkarvchalke/",
  email: "chalkeomkarvilas@gmail.com",
};

export function Hero() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-16 px-6 py-20 lg:min-h-[calc(100svh-4rem)] lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:py-0">
      <div className="flex max-w-xl flex-col items-start gap-6 text-left">
        <h1 className="text-4xl leading-[1.08] font-semibold text-balance sm:text-5xl">
          I build scalable software, intelligent data platforms, and AI-powered
          applications.
        </h1>
        <p className="text-muted-foreground max-w-md text-lg text-pretty">
          I design and ship systems end to end — from data pipelines and cloud
          infrastructure to the applications and APIs people actually use. My
          focus is finding the smallest architecture that solves the real
          problem, not the most impressive one.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href="/projects"
            className="bg-primary text-primary-foreground hover:bg-primary/85 inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-medium transition-colors"
          >
            Explore Projects
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/resume"
            className="border-border hover:border-primary hover:text-primary inline-flex h-10 items-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors"
          >
            <FileText className="size-4" />
            View Resume
          </Link>
        </div>

        <div className="text-muted-foreground flex items-center gap-1 pt-1">
          <a
            href={SITE_OWNER.github}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub profile"
            className="hover:text-primary rounded-md p-2 transition-colors"
          >
            <GitHubIcon className="size-[18px]" />
          </a>
          <a
            href={SITE_OWNER.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="LinkedIn profile"
            className="hover:text-primary rounded-md p-2 transition-colors"
          >
            <LinkedInIcon className="size-[18px]" />
          </a>
          <a
            href={`mailto:${SITE_OWNER.email}`}
            aria-label="Email"
            className="hover:text-primary rounded-md p-2 transition-colors"
          >
            <Mail className="size-[18px]" />
          </a>
        </div>
      </div>

      <NodeEcosystem name={SITE_OWNER.name} />
    </section>
  );
}
