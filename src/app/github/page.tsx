import type { Metadata } from "next";
import { PageContainer } from "@/components/page-container";
import { SectionHeader } from "@/components/section-header";
import { GitHubDashboard } from "@/features/github/github-dashboard";

export const metadata: Metadata = {
  title: "GitHub Activity",
  description:
    "Live contribution activity, pinned repositories, and commit history.",
};

export default function GitHubPage() {
  return (
    <PageContainer>
      <SectionHeader
        eyebrow="GitHub Activity"
        title="Proof of work, not a highlight reel."
        description="Pulled live from the public GitHub API, client-side — this page has no backend."
      />
      <GitHubDashboard />
    </PageContainer>
  );
}
