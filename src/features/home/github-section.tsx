import { GitHubDashboard } from "@/features/github/github-dashboard";
import { SectionShell } from "./section-shell";

export function GitHubSection() {
  return (
    <SectionShell
      id="github"
      eyebrow="GitHub Activity"
      title="Proof of work, not a highlight reel."
      description="Pulled live from the public GitHub API, client-side — this section has no backend."
    >
      <GitHubDashboard />
    </SectionShell>
  );
}
