import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { Download } from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { SectionHeader } from "@/components/section-header";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = {
  title: "Resume",
  description: "View or download the full resume.",
};

function hasResumeFile() {
  return fs.existsSync(path.join(process.cwd(), "public", "resume.pdf"));
}

export default function ResumePage() {
  const available = hasResumeFile();

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Resume"
        title="View or download the full resume."
      />
      {available ? (
        <div className="flex flex-col gap-6">
          <a
            href="/resume.pdf"
            download
            className="glow-ring-emerald bg-primary text-primary-foreground hover:bg-primary/90 inline-flex w-fit items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
          >
            <Download className="size-4" />
            Download PDF
          </a>
          <object
            data="/resume.pdf"
            type="application/pdf"
            className="border-border h-[80vh] w-full rounded-lg border"
            aria-label="Resume preview"
          >
            <p className="text-muted-foreground p-4 text-sm">
              Preview unavailable —{" "}
              <a href="/resume.pdf" className="text-primary hover:underline">
                download the PDF directly
              </a>
              .
            </p>
          </object>
        </div>
      ) : (
        <EmptyState message="Resume PDF pending — drop it at public/resume.pdf" />
      )}
    </PageContainer>
  );
}
