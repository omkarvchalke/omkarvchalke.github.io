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

// PLACEHOLDER CONTENT — replace with the real thing via docs/content/INTAKE.md.
// Bracketed fields are literal placeholders, not real claims.
export const about: AboutContent = {
  story:
    "[Placeholder — replace with your real story.] I've been drawn to systems that connect pieces most people treat as separate: a data pipeline, the model sitting on top of it, and the interface someone actually uses. That pattern shows up across the projects on this site — a RAG chatbot with its own retrieval pipeline, an intrusion-detection API with an explainability layer built in, a microservices backend built specifically to practice service-to-service architecture.",
  philosophy:
    "[Placeholder — replace with your real philosophy.] The smallest system that actually solves the problem beats the most impressive one. Most of the engineering calls documented in these case studies — a cascade instead of a single classifier, a vector index inside the existing database instead of a separate service, a time-aware train/test split instead of a random one — come from that same instinct: pick the defensible choice and document why.",
  timeline: [
    {
      date: "2017–2021",
      title: "B.E. in Information Technology, University of Mumbai",
      description: "GPA: 3.46/4.00.",
      category: "education",
    },
    {
      date: "2024–2026",
      title:
        "M.S. in Information Management, University of Illinois Urbana-Champaign",
      description: "GPA: 3.88/4.00.",
      category: "education",
    },
    {
      date: "[20XX–Present]",
      title: "[Job Title], [Company Name]",
      description:
        "[Placeholder — replace with real role details; full history lives on the Experience page.]",
      category: "career",
    },
  ],
};
