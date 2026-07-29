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
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[900px] opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 72% 20%, color-mix(in srgb, var(--primary) 16%, transparent), transparent 65%), radial-gradient(ellipse 40% 40% at 15% 70%, color-mix(in srgb, var(--copper) 10%, transparent), transparent 70%)",
        }}
      />

      <div className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-16 px-6 py-20 lg:min-h-[calc(100svh-4rem)] lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:py-0">
        <div className="flex max-w-xl flex-col items-start gap-6 text-left">
          <h1 className="animate-rise-in text-4xl leading-[1.08] font-semibold text-balance sm:text-5xl">
            I build scalable software, intelligent data platforms, and
            AI-powered applications.
          </h1>
          <p
            className="animate-rise-in text-muted-foreground max-w-md text-lg text-pretty"
            style={{ animationDelay: "90ms" }}
          >
            I design and ship systems end to end — from data pipelines and cloud
            infrastructure to the applications and APIs people actually use. My
            focus is finding the smallest architecture that solves the real
            problem, not the most impressive one.
          </p>

          <div
            className="animate-rise-in flex flex-wrap items-center gap-3 pt-2"
            style={{ animationDelay: "170ms" }}
          >
            <a
              href="#work"
              className="glow-ring-emerald bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
            >
              Explore Projects
              <ArrowRight className="size-4" />
            </a>
            <a
              href="#contact"
              className="border-border hover:border-primary hover:text-primary hover:bg-primary/5 inline-flex h-10 items-center gap-2 rounded-md border px-4 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
            >
              <FileText className="size-4" />
              View Resume
            </a>
          </div>

          <div
            className="text-muted-foreground animate-rise-in flex items-center gap-1 pt-1"
            style={{ animationDelay: "230ms" }}
          >
            <a
              href={SITE_OWNER.github}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub profile"
              className="hover:text-primary hover:bg-primary/10 rounded-md p-2 transition-all duration-200"
            >
              <GitHubIcon className="size-[18px]" />
            </a>
            <a
              href={SITE_OWNER.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="LinkedIn profile"
              className="hover:text-primary hover:bg-primary/10 rounded-md p-2 transition-all duration-200"
            >
              <LinkedInIcon className="size-[18px]" />
            </a>
            <a
              href={`mailto:${SITE_OWNER.email}`}
              aria-label="Email"
              className="hover:text-primary hover:bg-primary/10 rounded-md p-2 transition-all duration-200"
            >
              <Mail className="size-[18px]" />
            </a>
          </div>
        </div>

        <div
          className="animate-rise-in w-full"
          style={{ animationDelay: "120ms" }}
        >
          <NodeEcosystem name={SITE_OWNER.name} />
        </div>
      </div>
    </section>
  );
}
