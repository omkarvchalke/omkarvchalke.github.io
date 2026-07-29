import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { User } from "lucide-react";
import { about } from "@/content/about";
import { EmptyState } from "@/components/empty-state";
import { Reveal } from "@/components/reveal";
import { SectionShell } from "./section-shell";
import { cn } from "@/lib/utils";

const CATEGORY_STYLES: Record<
  (typeof about)["timeline"][number]["category"],
  string
> = {
  education: "text-copper",
  career: "text-primary",
  research: "text-muted-foreground",
};

function hasPhotoFile() {
  return fs.existsSync(path.join(process.cwd(), "public", "photo.jpg"));
}

export function AboutSection() {
  const hasStory = about.story.trim().length > 0;
  const hasPhilosophy = about.philosophy.trim().length > 0;
  const hasTimeline = about.timeline.length > 0;
  const photoAvailable = hasPhotoFile();

  return (
    <SectionShell
      id="about"
      eyebrow="About"
      title="How I got here, and how I think about building software."
      description="Not a resume — the reasoning behind the work."
      icon={User}
    >
      <div className="grid gap-14 lg:grid-cols-[1fr_260px]">
        <div className="flex max-w-3xl flex-col gap-14">
          <Reveal>
            <section className="flex flex-col gap-4">
              <h3 className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">
                The story
              </h3>
              {hasStory ? (
                <p className="text-foreground/90 text-lg text-pretty">
                  {about.story}
                </p>
              ) : (
                <EmptyState message="Story pending — see docs/content/INTAKE.md" />
              )}
            </section>
          </Reveal>

          <Reveal delay={60}>
            <section className="flex flex-col gap-4">
              <h3 className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">
                Philosophy
              </h3>
              {hasPhilosophy ? (
                <p className="text-foreground/90 text-lg text-pretty">
                  {about.philosophy}
                </p>
              ) : (
                <EmptyState message="Philosophy pending — see docs/content/INTAKE.md" />
              )}
            </section>
          </Reveal>

          <Reveal delay={120}>
            <section className="flex flex-col gap-4">
              <h3 className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">
                Timeline
              </h3>
              {hasTimeline ? (
                <ol className="border-border flex flex-col gap-6 border-l pl-6">
                  {about.timeline.map((entry) => (
                    <li
                      key={`${entry.date}-${entry.title}`}
                      className="relative"
                    >
                      <span className="bg-primary absolute top-1.5 -left-[27px] size-2 rounded-full" />
                      <span
                        className={cn(
                          "font-mono text-xs uppercase",
                          CATEGORY_STYLES[entry.category]
                        )}
                      >
                        {entry.date} · {entry.category}
                      </span>
                      <h4 className="mt-1 font-medium">{entry.title}</h4>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {entry.description}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : (
                <EmptyState message="Timeline pending — see docs/content/INTAKE.md" />
              )}
            </section>
          </Reveal>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          {photoAvailable ? (
            <Reveal>
              <div className="border-border relative aspect-[4/5] overflow-hidden rounded-lg border">
                <Image
                  src="/photo.jpg"
                  alt="Omkar Vilas Chalke"
                  fill
                  className="object-cover"
                  sizes="260px"
                />
              </div>
            </Reveal>
          ) : (
            <EmptyState message="Photo pending — drop it at public/photo.jpg" />
          )}
        </aside>
      </div>
    </SectionShell>
  );
}
