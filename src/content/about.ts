export interface TimelineEntry {
  date: string; // e.g. "2019" or "2021–2023"
  title: string;
  description: string;
  category: "education" | "career" | "research";
}

export interface AboutContent {
  story: string;
  philosophy: string;
  timeline: TimelineEntry[];
}

// Real story/philosophy/timeline land here in your Phase 5 content pass —
// see docs/content/INTAKE.md. The About page renders an honest empty state
// until this is filled in.
export const about: AboutContent = {
  story: "",
  philosophy: "",
  timeline: [],
};
