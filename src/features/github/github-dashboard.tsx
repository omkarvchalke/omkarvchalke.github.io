"use client";

import { useMemo, useState } from "react";
import { GitFork, Star, Users } from "lucide-react";
import { useGitHubData, type GitHubEvent } from "./use-github-data";
import { GitHubIcon } from "@/components/brand-icons";
import { Reveal } from "@/components/reveal";
import { useCountUp } from "@/lib/use-count-up";

const USERNAME = "omkarvchalke";
const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

function relativeTime(iso: string) {
  const diffMs = new Date(iso).getTime() - Date.now();
  const diffMin = Math.round(diffMs / 60000);
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, "minute");
  const diffHr = Math.round(diffMin / 60);
  if (Math.abs(diffHr) < 24) return rtf.format(diffHr, "hour");
  const diffDay = Math.round(diffHr / 24);
  return rtf.format(diffDay, "day");
}

function describeEvent(event: GitHubEvent): string {
  const repo = event.repo.name.split("/")[1] ?? event.repo.name;
  switch (event.type) {
    case "PushEvent": {
      const n = event.payload.size ?? event.payload.commits?.length ?? 0;
      return `Pushed ${n} commit${n === 1 ? "" : "s"} to ${repo}`;
    }
    case "CreateEvent":
      return `Created ${event.payload.ref_type ?? "a ref"} in ${repo}`;
    case "PullRequestEvent":
      return `${event.payload.action ?? "Updated"} a pull request in ${repo}`;
    case "IssuesEvent":
      return `${event.payload.action ?? "Updated"} an issue in ${repo}`;
    case "WatchEvent":
      return `Starred ${repo}`;
    case "ForkEvent":
      return `Forked ${repo}`;
    default:
      return `${event.type.replace(/Event$/, "")} in ${repo}`;
  }
}

function StatTile({ label, value }: { label: string; value: number }) {
  const displayed = useCountUp(value);
  return (
    <div className="surface-card border-border rounded-lg border p-4">
      <span className="text-muted-foreground font-mono text-[10px] tracking-[0.08em] uppercase">
        {label}
      </span>
      <div className="text-primary mt-1 font-mono text-2xl tabular-nums [text-shadow:0_0_20px_color-mix(in_srgb,var(--primary)_45%,transparent)]">
        {displayed}
      </div>
    </div>
  );
}

export function GitHubDashboard() {
  const { data, error, loading } = useGitHubData(USERNAME);
  const [chartFailed, setChartFailed] = useState(false);

  const derived = useMemo(() => {
    if (!data) return null;
    const owned = data.repos.filter((r) => !r.fork);
    const totalStars = owned.reduce((sum, r) => sum + r.stargazers_count, 0);
    const totalForks = owned.reduce((sum, r) => sum + r.forks_count, 0);

    const languageCounts = new Map<string, number>();
    owned.forEach((r) => {
      if (!r.language) return;
      languageCounts.set(r.language, (languageCounts.get(r.language) ?? 0) + 1);
    });
    const languageTotal = Array.from(languageCounts.values()).reduce(
      (a, b) => a + b,
      0
    );
    const languages = Array.from(languageCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({
        name,
        pct: languageTotal > 0 ? Math.round((count / languageTotal) * 100) : 0,
      }));

    const topRepos = [...owned]
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6);

    const recentEvents = data.events.slice(0, 8);

    return { totalStars, totalForks, languages, topRepos, recentEvents };
  }, [data]);

  if (loading) {
    return (
      <p className="text-muted-foreground font-mono text-sm">
        Loading live data from GitHub…
      </p>
    );
  }

  if (error || !data || !derived) {
    return (
      <div className="border-border rounded-lg border border-dashed px-6 py-16 text-center">
        <p className="text-muted-foreground font-mono text-sm">
          {error ?? "Couldn't load GitHub data."}
        </p>
        <a
          href={`https://github.com/${USERNAME}`}
          target="_blank"
          rel="noreferrer noopener"
          className="text-primary mt-3 inline-flex items-center gap-1.5 text-sm hover:underline"
        >
          View profile on GitHub directly →
        </a>
      </div>
    );
  }

  const { user } = data;

  return (
    <div className="flex flex-col gap-10">
      <Reveal>
        <div className="flex flex-wrap items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, no image loader */}
          <img
            src={user.avatar_url}
            alt={user.name ?? user.login}
            className="border-border size-14 rounded-full border"
          />
          <div>
            <h3 className="font-medium">{user.name ?? user.login}</h3>
            {user.bio && (
              <p className="text-muted-foreground text-sm">{user.bio}</p>
            )}
          </div>
          <a
            href={user.html_url}
            target="_blank"
            rel="noreferrer noopener"
            className="border-border hover:border-primary hover:text-primary hover:bg-primary/5 ml-auto inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-all duration-300 hover:-translate-y-0.5"
          >
            <GitHubIcon className="size-4" />
            Follow
          </a>
        </div>
      </Reveal>

      <Reveal delay={60}>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatTile label="Public repos" value={user.public_repos} />
          <StatTile label="Followers" value={user.followers} />
          <StatTile label="Total stars" value={derived.totalStars} />
          <StatTile label="Total forks" value={derived.totalForks} />
        </div>
      </Reveal>

      <Reveal delay={90}>
        <section className="flex flex-col gap-3">
          <h3 className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">
            Contribution activity
          </h3>
          {!chartFailed ? (
            // Third-party rendered chart (GitHub's own contribution calendar
            // isn't in the public REST API without an auth token). Swappable
            // for a build-time authenticated fetch later if preferred.
            // eslint-disable-next-line @next/next/no-img-element -- third-party SVG, not an optimizable asset
            <img
              src={`https://ghchart.rshah.org/34A876/${USERNAME}`}
              alt={`${USERNAME}'s GitHub contribution chart`}
              className="border-border bg-card w-full rounded-lg border p-2"
              onError={() => setChartFailed(true)}
            />
          ) : (
            <p className="text-muted-foreground font-mono text-xs">
              Contribution chart unavailable right now.
            </p>
          )}
        </section>
      </Reveal>

      {derived.languages.length > 0 && (
        <Reveal delay={120}>
          <section className="flex flex-col gap-3">
            <h3 className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">
              Language breakdown
            </h3>
            <div className="flex flex-col gap-2.5">
              {derived.languages.map((lang) => (
                <div key={lang.name} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 text-sm">{lang.name}</span>
                  <div className="bg-border h-1.5 flex-1 overflow-hidden rounded-full">
                    <div
                      className="from-copper to-primary h-full rounded-full bg-gradient-to-r shadow-[0_0_10px_-1px_var(--primary)] transition-[width] duration-700 ease-out"
                      style={{ width: `${lang.pct}%` }}
                    />
                  </div>
                  <span className="text-muted-foreground w-10 shrink-0 text-right font-mono text-xs tabular-nums">
                    {lang.pct}%
                  </span>
                </div>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      <Reveal delay={150}>
        <section className="flex flex-col gap-3">
          <h3 className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">
            Pinned repositories
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {derived.topRepos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer noopener"
                className="surface-card border-border flex flex-col gap-2 rounded-lg border p-5"
              >
                <h4 className="font-medium">{repo.name}</h4>
                <p className="text-muted-foreground line-clamp-2 flex-1 text-sm">
                  {repo.description ?? "No description."}
                </p>
                <div className="text-muted-foreground flex items-center gap-3 font-mono text-xs">
                  {repo.language && <span>{repo.language}</span>}
                  <span className="flex items-center gap-1">
                    <Star className="size-3" />
                    {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="size-3" />
                    {repo.forks_count}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>
      </Reveal>

      {derived.recentEvents.length > 0 && (
        <Reveal delay={180}>
          <section className="flex flex-col gap-3">
            <h3 className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">
              Recent activity
            </h3>
            <ul className="divide-border surface-panel border-border flex flex-col divide-y rounded-lg border">
              {derived.recentEvents.map((event) => (
                <li
                  key={event.id}
                  className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
                >
                  <span className="text-muted-foreground">
                    {describeEvent(event)}
                  </span>
                  <span className="text-muted-foreground shrink-0 font-mono text-xs">
                    {relativeTime(event.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      )}

      <Reveal delay={210}>
        <p className="text-muted-foreground flex items-center gap-1.5 font-mono text-[11px]">
          <Users className="size-3" />
          Live data, fetched client-side from the public GitHub API — no backend
          involved.
        </p>
      </Reveal>
    </div>
  );
}
