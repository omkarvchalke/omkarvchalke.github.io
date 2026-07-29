"use client";

import { useEffect, useState } from "react";

export interface GitHubUser {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  followers: number;
  following: number;
  public_repos: number;
  html_url: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork: boolean;
}

export interface GitHubEvent {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
  payload: {
    // GitHub often omits `commits` from the public events payload but still
    // reports an accurate `size` (total commits in the push) — prefer it.
    size?: number;
    commits?: { message: string }[];
    action?: string;
    ref_type?: string;
  };
}

interface GitHubData {
  user: GitHubUser;
  repos: GitHubRepo[];
  events: GitHubEvent[];
}

const CACHE_TTL_MS = 5 * 60 * 1000;

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!res.ok) {
    if (res.status === 403) {
      throw new Error("GitHub API rate limit reached — try again shortly.");
    }
    throw new Error(`GitHub API error (${res.status})`);
  }
  return res.json();
}

/**
 * Client-side only — GitHub Pages has no server, so this hits GitHub's
 * public REST API directly from the browser (Phase 3's static-hosting
 * decision). Unauthenticated requests are capped at 60/hr per IP; a short
 * sessionStorage cache keeps repeat navigations within that budget.
 */
export function useGitHubData(username: string) {
  const [data, setData] = useState<GitHubData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const cacheKey = `gh-data:${username}`;

    async function load() {
      setLoading(true);
      setError(null);

      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        try {
          const { timestamp, payload } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL_MS) {
            if (!cancelled) {
              setData(payload);
              setLoading(false);
            }
            return;
          }
        } catch {
          // fall through to a fresh fetch
        }
      }

      try {
        const [user, repos, events] = await Promise.all([
          fetchJson<GitHubUser>(`https://api.github.com/users/${username}`),
          fetchJson<GitHubRepo[]>(
            `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
          ),
          fetchJson<GitHubEvent[]>(
            `https://api.github.com/users/${username}/events/public?per_page=30`
          ),
        ]);
        const payload: GitHubData = { user, repos, events };
        if (!cancelled) {
          setData(payload);
          sessionStorage.setItem(
            cacheKey,
            JSON.stringify({ timestamp: Date.now(), payload })
          );
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "Failed to load GitHub data."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [username]);

  return { data, error, loading };
}
