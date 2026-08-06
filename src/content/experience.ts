import type { Experience } from "./types";

// Sourced from LinkedIn (linkedin.com/in/omkarvchalke) — ordered most
// recent first, matching how it's listed there. Entries LinkedIn didn't
// have bullet detail for (Prairie Research Institute, Medlaunch, Trivia
// Softwares) are left thin rather than padded with invented specifics.
export const experience: Experience[] = [
  {
    slug: "prairie-research-institute",
    company: "Prairie Research Institute",
    role: "Graduate Research Assistant",
    startDate: "2025-11",
    overview:
      "Graduate Research Assistant at the Prairie Research Institute, University of Illinois Urbana-Champaign.",
    challenges: [],
    responsibilities: [],
    impact: [],
    techSlugs: [],
    disciplines: ["research"],
    metrics: [],
    relatedProjectSlugs: [],
  },
  {
    slug: "business-intelligence-group-uiuc",
    company: "Business Intelligence Group (UIUC)",
    role: "Technical Consultant",
    startDate: "2025-09",
    endDate: "2025-12",
    overview:
      "Led a go-to-market strategy engagement, translating business requirements into technical solution architecture and a scalable GTM roadmap.",
    challenges: [],
    responsibilities: [
      "Led a go-to-market strategy engagement — market assessment, solution positioning, and operating-model analysis — delivering a scalable GTM roadmap aligned with enterprise revenue growth, digital transformation, and technology adoption objectives.",
      "Collaborated with senior stakeholders and cross-functional teams to translate business requirements into technical solution architecture, integration strategy, and deployment models, supporting pilot execution, risk mitigation, and commercialization readiness.",
    ],
    impact: [
      "Developed executive-level insights and performance metrics through data analysis, stakeholder workshops, and feasibility assessments, enabling leadership to prioritize target segments, partnership strategy, and investment decisions across the value chain.",
    ],
    techSlugs: [],
    disciplines: ["data", "architecture"],
    metrics: [],
    relatedProjectSlugs: [],
  },
  {
    slug: "ischool-illinois-health-informatics",
    company: "iSchool at Illinois",
    role: "Graduate Research Assistant — Center for Health Informatics",
    startDate: "2025-01",
    endDate: "2025-12",
    overview:
      "Built data-cleaning, ETL, and entity-resolution pipelines to standardize multilingual drug stockpile data reported by PAHO member states.",
    architecture:
      "Python/Pandas/Regex/FuzzyWuzzy cleaning and normalization → ETL for entity resolution, unit harmonization, and schema alignment → ontology mapping for automated classification → LLM-assisted text normalization and entity linking with human-in-the-loop validation.",
    challenges: [],
    responsibilities: [
      "Developed data-cleaning and normalization pipelines using Python, Pandas, Regex, and FuzzyWuzzy to standardize multilingual drug stockpile data (English, Spanish, Portuguese) reported by PAHO member states.",
      "Designed and implemented ETL workflows for entity resolution, unit harmonization, and schema alignment, transforming unstructured datasets into a unified, analytics-ready data model.",
      "Applied ontology mapping and semantic similarity techniques to enhance data quality and enable automated classification and metadata tagging across diverse pharmaceutical inventories.",
      "Explored Large Language Models (LLMs) for semi-automated text normalization and entity linking, integrating human-in-the-loop validation to improve model precision and standardization accuracy.",
    ],
    impact: [],
    techSlugs: ["python", "pandas", "fuzzywuzzy"],
    disciplines: ["data", "ai", "research"],
    metrics: [],
    relatedProjectSlugs: [],
  },
  {
    slug: "medlaunch-concepts",
    company: "Medlaunch Concepts",
    role: "Data Engineer Intern",
    startDate: "2025-06",
    endDate: "2025-08",
    overview: "Data Engineer Intern at Medlaunch Concepts, Florida.",
    challenges: [],
    responsibilities: [],
    impact: [],
    techSlugs: [],
    disciplines: ["data"],
    metrics: [],
    relatedProjectSlugs: [],
  },
  {
    slug: "ltimindtree",
    company: "LTIMindtree",
    role: "Senior Software Engineer",
    startDate: "2022-12",
    endDate: "2024-07",
    overview:
      "Developed enterprise applications for the financial services industry — built microservices, optimized SQL queries, and contributed to production systems used at scale.",
    challenges: [],
    responsibilities: [
      "Built microservices for production systems used at scale in the financial services industry.",
      "Optimized SQL queries across enterprise applications.",
    ],
    impact: [
      "Contributed to production systems used at scale in the financial services industry.",
    ],
    techSlugs: ["java", "springboot"],
    disciplines: ["backend"],
    metrics: [],
    relatedProjectSlugs: [],
  },
  {
    slug: "lti-larsen-toubro-infotech",
    company: "LTI - Larsen & Toubro Infotech",
    role: "Software Engineer",
    startDate: "2021-06",
    endDate: "2022-11",
    overview:
      "Software Engineer at LTI (Larsen & Toubro Infotech) — the same engineering organization that became LTIMindtree following its November 2022 merger with Mindtree.",
    challenges: [],
    responsibilities: [],
    impact: [],
    techSlugs: ["java", "springboot"],
    disciplines: ["backend"],
    metrics: [],
    relatedProjectSlugs: [],
  },
  {
    slug: "trivia-softwares",
    company: "Trivia Softwares - India",
    role: "Project Intern",
    startDate: "2020-05",
    endDate: "2020-07",
    overview: "Project Intern at Trivia Softwares, Thane, Maharashtra.",
    challenges: [],
    responsibilities: [],
    impact: [],
    techSlugs: [],
    disciplines: [],
    metrics: [],
    relatedProjectSlugs: [],
  },
];
