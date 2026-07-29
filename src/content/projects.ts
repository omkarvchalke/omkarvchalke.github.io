import type { Project } from "./types";

// Sourced from your real GitHub repos (omkarvchalke) — summaries, architecture,
// challenges, tradeoffs, and metrics below are drawn directly from each repo's
// own README, not invented. Narrative fields that weren't documented in the
// README are left minimal rather than guessed. Depth tiers follow the Phase 1
// decision: `full` where the README had enough real substance for the whole
// case-study template, `light` where it didn't.
export const projects: Project[] = [
  {
    slug: "illiniassist-ai",
    name: "IlliniAssist AI",
    summary:
      "A RAG chatbot that answers UIUC student questions grounded exclusively in official university sources — no PII collected, no fabricated answers.",
    problem:
      "Prospective and current UIUC students (freshman, transfer, graduate, international) need answers to admissions and enrollment questions that are actually current and grounded in official sources, without the app collecting personally identifiable information or confidently hallucinating when it doesn't know something.",
    architecture:
      "A LangGraph StateGraph orchestrates intent detection, profile-aware clarification, hybrid retrieval, cross-encoder reranking, and citation generation. Retrieval fuses pgvector cosine-distance search with an in-process BM25 index via Reciprocal Rank Fusion — pgvector lives inside the same PostgreSQL instance rather than a separate vector-store service. Generation goes through Groq (llama-3.3-70b-versatile) in strict JSON mode, and every answer self-reports whether it's actually grounded in the cited context.",
    techSlugs: [
      "typescript",
      "nextjs",
      "react",
      "tailwindcss",
      "python",
      "fastapi",
      "langgraph",
      "postgresql",
      "pgvector",
      "groq",
      "docker",
    ],
    database:
      "PostgreSQL with pgvector — the vector store lives in the same database as everything else rather than a separate service.",
    infrastructure:
      "Docker Compose (Postgres+pgvector, backend, frontend); an explicit production overlay sets resource limits, log rotation, and real CORS origins rather than stacking on the local-dev override.",
    apiFlow:
      "Chat message → LangGraph state graph → intent detection → hybrid retrieval (pgvector + BM25, fused via Reciprocal Rank Fusion) → cross-encoder reranking → Groq generation in a strict JSON envelope → citation filtering against only the sections the model actually cited → response, with every turn persisted for the analytics dashboard.",
    deployment:
      "Docker Compose with an explicit production overlay behind a reverse proxy that terminates TLS; both services declare a container HEALTHCHECK.",
    challenges: [
      "student_type was a hard filter in retrieval — a document scoped to one student type never surfaced for another. The two original admissions sources were both freshman-only, so a transfer or graduate student asking any admissions question got zero results. Found via live testing, not unit tests, and fixed by adding student-type-specific sources.",
      "An embedding-based topic classifier confidently misclassified 'How do I apply for OPT?' as admissions, and that classification was being used as a hard retrieval filter — so a wrong classification returned zero results even though unfiltered hybrid search ranked the real OPT page first. Fixed by dropping topic as a retrieval filter entirely.",
      "The originally-selected Groq model was pulled from the provider's catalog entirely mid-project, forcing a re-evaluation of available models against real token-budget and reliability constraints, not just capability.",
    ],
    tradeoffs: [
      "Local CPU-only embeddings (BAAI/bge-small-en-v1.5) over a paid embedding API — no per-query cost, at some retrieval-quality ceiling.",
      "pgvector inside the existing Postgres instance over a dedicated vector database — one fewer service to operate, at the cost of some specialized vector-search features.",
      "A self-reported groundedness check adds its own failure mode (a parse failure is treated as ungrounded) but was chosen over silently trusting the model — an overconfident wrong answer is worse than an honest 'I don't know.'",
    ],
    metrics: [
      { label: "Backend tests", value: "259/259 passing" },
      { label: "Frontend tests", value: "70/70 passing" },
      { label: "Line coverage", value: "~88%" },
      { label: "Live E2E soak test", value: "20/20 answered, 0 crashes" },
      { label: "Indexed documents", value: "1,301" },
      { label: "Avg / p95 chat latency", value: "~3.7s / ~10.3s" },
    ],
    lessons: [
      "Unit tests verify the app doesn't crash; they don't verify answers are actually good or well-retrieved — that needed a separate golden-set evaluation harness (precision/recall/MRR + faithfulness) run against the real ingested corpus.",
      "An honest 'I don't have enough information' is a feature, not a gap to hide — documenting exactly which topics the corpus doesn't cover well beats claiming completeness.",
      "A model available today isn't guaranteed available tomorrow — a documented fallback/re-evaluation process for the LLM provider's model lineup mattered as much as the initial model choice.",
    ],
    githubUrl: "https://github.com/omkarvchalke/UIUC_BOT",
    hasArchitectureDiagram: true,
    diagram: {
      nodes: [
        {
          id: "client",
          label: "Chat UI (Next.js)",
          kind: "client",
          description:
            "Chat interface, source panel, analytics dashboard — built directly against the real backend endpoints.",
          x: 8,
          y: 50,
        },
        {
          id: "api",
          label: "FastAPI",
          kind: "api",
          description:
            "Routes /chat, /sessions, /retrieve, /feedback, /analytics; rate-limited per IP via slowapi.",
          x: 28,
          y: 50,
        },
        {
          id: "graph",
          label: "LangGraph Orchestrator",
          kind: "service",
          description:
            "StateGraph with conditional routing: intent detection, clarification, retrieval, reranking, citation generation. Checkpointed to Postgres so conversation state survives restarts.",
          x: 50,
          y: 50,
        },
        {
          id: "retrieval",
          label: "Hybrid Retrieval",
          kind: "service",
          description:
            "Fuses pgvector cosine search with an in-process BM25 index via Reciprocal Rank Fusion.",
          x: 50,
          y: 18,
        },
        {
          id: "rerank",
          label: "Cross-Encoder Reranker",
          kind: "service",
          description:
            "Reranks fused retrieval results before they're passed to generation.",
          x: 50,
          y: 82,
        },
        {
          id: "db",
          label: "Postgres + pgvector",
          kind: "database",
          description:
            "Vector store, chat checkpoints, analytics events — one database, no separate vector service.",
          x: 74,
          y: 18,
        },
        {
          id: "llm",
          label: "Groq (llama-3.3-70b)",
          kind: "external",
          description:
            "Generation in strict JSON mode, with a self-reported groundedness check on every answer.",
          x: 90,
          y: 50,
        },
      ],
      edges: [
        { from: "client", to: "api" },
        { from: "api", to: "graph" },
        { from: "graph", to: "retrieval" },
        { from: "retrieval", to: "db" },
        { from: "graph", to: "rerank" },
        { from: "graph", to: "db" },
        { from: "rerank", to: "llm" },
      ],
    },
    disciplines: ["ai", "backend", "frontend"],
    depth: "full",
  },
  {
    slug: "network-intrusion-detection-api",
    name: "Network Intrusion Detection API",
    summary:
      "A two-stage ML pipeline (Isolation Forest + CatBoost) that screens network flow records for anomalies and classifies attacks, with a SHAP explanation attached to every flagged prediction.",
    problem:
      "Network intrusion detection needs to flag anomalous traffic and explain why, without running an expensive classifier and explainer on every single flow — most traffic is normal, and that path needs to stay cheap.",
    architecture:
      "A cascade, not a single classifier: an unsupervised IsolationForest screens every incoming flow first, and only flows it flags as anomalous are passed to a CatBoost multiclass classifier and a SHAP TreeExplainer (built once at startup, reused across requests) that returns the top 5 contributing features for that specific prediction.",
    techSlugs: [
      "python",
      "fastapi",
      "scikit-learn",
      "catboost",
      "shap",
      "docker",
    ],
    infrastructure:
      "Dockerized FastAPI service; model artifacts (IsolationForest + CatBoost, pinned to the scikit-learn version they were pickled with) are loaded once at process startup.",
    apiFlow:
      "POST /score with a 44-field flow record → Stage 1 IsolationForest screen (short-circuits to 'Normal' immediately if not flagged, so Stage 2 never runs) → Stage 2 CatBoost attack-category classification → SHAP explanation of the top 5 contributing features → JSON response with a risk score.",
    deployment:
      "Docker container exposing the API on port 8000, with interactive docs at /docs; CI runs the pytest suite on every push.",
    challenges: [
      "The raw UNSW-NB15 dataset had real data-quality issues — duplicate category labels differing only by stray whitespace, an inconsistent Backdoor/Backdoors label, and hex-encoded ports — all needing cleaning before the 44-field schema was usable.",
      "A random train/test split would have let temporally-correlated flows leak between train and test and overstated performance, so evaluation used a time-aware split instead: train on the first three UNSW-NB15 capture files, test on the fourth, held out entirely.",
    ],
    tradeoffs: [
      "A two-stage cascade over a single classifier, specifically to keep the expensive CatBoost+SHAP path off the hot path for ordinary traffic.",
      "Tuned the IsolationForest's contamination parameter to 0.09 over 0.11 — both had the same attack recall, so the lower value was chosen to send fewer flows to the costlier, more error-prone Stage 2 classifier.",
      "Sqrt-dampened class weights on CatBoost rather than straight 'balanced' weighting, since balanced weighting over-inflated tiny classes like Worms.",
    ],
    metrics: [
      { label: "End-to-end detection rate", value: "87.2%" },
      { label: "Test suite", value: "22 tests, in-process via TestClient" },
    ],
    lessons: [
      "A cascade architecture is a real latency/cost tradeoff, not just an accuracy one — screening cheaply first changes what 'expensive' means for the system as a whole.",
      "Confidence scores from a gradient-boosted classifier aren't calibrated probabilities — treating them as such would overstate certainty, especially on the weakest-precision classes.",
    ],
    demoUrl: "https://www.kaggle.com/code/ovchalke/api-anomaly-detection",
    githubUrl: "https://github.com/omkarvchalke/api-anomoly",
    hasArchitectureDiagram: true,
    diagram: {
      nodes: [
        {
          id: "client",
          label: "Client Request",
          kind: "client",
          description: "POST /score with a 44-field network flow record.",
          x: 10,
          y: 50,
        },
        {
          id: "api",
          label: "FastAPI",
          kind: "api",
          description:
            "Validates input (422 on invalid fields, not a 500), routes to the scoring pipeline.",
          x: 32,
          y: 50,
        },
        {
          id: "stage1",
          label: "Stage 1: Isolation Forest",
          kind: "service",
          description:
            "Unsupervised anomaly filter. If a flow isn't flagged, short-circuits straight to 'Normal' — Stage 2 never runs.",
          x: 55,
          y: 50,
        },
        {
          id: "stage2",
          label: "Stage 2: CatBoost",
          kind: "service",
          description:
            "Multiclass attack-category classifier, only runs on flows Stage 1 flagged.",
          x: 76,
          y: 28,
        },
        {
          id: "shap",
          label: "SHAP Explainer",
          kind: "service",
          description:
            "Returns the top 5 features driving that specific prediction, ranked by absolute SHAP value.",
          x: 92,
          y: 50,
        },
      ],
      edges: [
        { from: "client", to: "api" },
        { from: "api", to: "stage1" },
        { from: "stage1", to: "stage2" },
        { from: "stage2", to: "shap" },
      ],
    },
    disciplines: ["ai", "backend", "data"],
    depth: "full",
  },
  {
    slug: "vehicle-license-plate-recognition",
    name: "Vehicle License Plate Recognition",
    summary:
      "A deep-learning pipeline combining YOLOv4 detection with Tesseract OCR to automatically detect and read vehicle license plates from images.",
    problem:
      "Manual license plate identification doesn't scale for toll automation, parking management, or traffic enforcement, especially for vehicles moving at speed.",
    architecture:
      "A five-stage pipeline: image acquisition, YOLOv4-based plate detection, plate extraction, OpenCV-based character segmentation (grayscale conversion, binarization, contour detection), and Tesseract OCR character recognition.",
    techSlugs: ["python", "tensorflow", "opencv", "tesseract"],
    apiFlow:
      "Image in → YOLOv4 detects the plate region → region is cropped and segmented into individual characters via OpenCV → Tesseract OCR converts the segmented characters into machine-readable text.",
    challenges: [
      "Benchmarked six detection architectures (YOLOv4, YOLOv3, SSD512, Mask R-CNN, Faster R-CNN, Fast R-CNN) on a ~1,500-image hand-annotated dataset before selecting one, rather than assuming the newest model would win.",
      "Recognition accuracy measurably degrades under real-world conditions — rain, fog, inclined plates, poor lighting — which the project's own evaluation documents rather than glosses over.",
    ],
    tradeoffs: [
      "YOLOv4 over YOLOv3 for roughly 10% higher accuracy and 12% higher speed in this setup, despite being a heavier model to train.",
      "A two-stage detect-then-OCR pipeline over a single end-to-end model, trading some latency for the ability to tune or swap each stage independently.",
    ],
    metrics: [
      { label: "YOLOv4 mAP", value: "47.5" },
      { label: "YOLOv4 speed", value: "73 FPS" },
      { label: "Training images", value: "~1,500 annotated" },
    ],
    lessons: [
      "Benchmarking multiple architectures directly, rather than picking the newest one, surfaced a real, quantified accuracy/speed tradeoff instead of an assumption.",
      "Real-world conditions (weather, angle, lighting) matter as much as model choice — worth scoping explicitly rather than only reporting best-case accuracy.",
    ],
    githubUrl: "https://github.com/omkarvchalke/VLPR",
    hasArchitectureDiagram: true,
    diagram: {
      nodes: [
        {
          id: "input",
          label: "Image Input",
          kind: "client",
          description:
            "Vehicle image — from a still photo or CCTV/toll-camera footage.",
          x: 8,
          y: 50,
        },
        {
          id: "detect",
          label: "YOLOv4 Detector",
          kind: "service",
          description:
            "Real-time object detection, selected after benchmarking against 5 other architectures on accuracy and speed.",
          x: 32,
          y: 50,
        },
        {
          id: "extract",
          label: "Plate Extraction",
          kind: "service",
          description: "Crops the detected plate region from the source image.",
          x: 54,
          y: 50,
        },
        {
          id: "segment",
          label: "Character Segmentation",
          kind: "service",
          description:
            "OpenCV: grayscale, binarization, contour detection to isolate individual characters.",
          x: 76,
          y: 50,
        },
        {
          id: "ocr",
          label: "Tesseract OCR",
          kind: "external",
          description:
            "Converts the segmented characters into machine-readable text.",
          x: 94,
          y: 50,
        },
      ],
      edges: [
        { from: "input", to: "detect" },
        { from: "detect", to: "extract" },
        { from: "extract", to: "segment" },
        { from: "segment", to: "ocr" },
      ],
    },
    disciplines: ["ai"],
    depth: "full",
  },
  {
    slug: "quiz-app-microservices",
    name: "Quiz App — Spring Boot Microservices",
    summary:
      "A backend microservices system (Question Service + Quiz Service) built with Spring Boot 3 and Java 17, using Eureka service discovery, Feign clients, and an API Gateway.",
    problem:
      "A deliberate practice project to implement a real microservices architecture — service discovery, declarative inter-service calls, and an API gateway — instead of a single monolith.",
    architecture:
      "Two independently deployable services: a Question Service (CRUD on questions) and a Quiz Service (quiz creation, response collection, scoring), both registered with a Eureka service registry and fronted by a single API Gateway. The Quiz Service calls the Question Service via a Feign declarative client rather than a hardcoded URL.",
    techSlugs: ["java", "springboot", "eureka", "postgresql"],
    database: "PostgreSQL, one schema per service.",
    apiFlow:
      "Client request → API Gateway → routed to the Question Service or Quiz Service (both discovered via Eureka) → the Quiz Service calls the Question Service through a Feign client to assemble quiz questions → PostgreSQL for persistence.",
    challenges: [
      "Coordinating two independently deployable services that still need to call each other synchronously (the Quiz Service depends on the Question Service for question data) without hardcoding service locations.",
    ],
    tradeoffs: [
      "Split into two services along a clear ownership boundary (questions vs. quiz-taking) rather than one service, at the cost of an inter-service network call and the operational overhead of running a registry and gateway for a project this size — a deliberate tradeoff for the sake of practicing the pattern properly.",
    ],
    metrics: [],
    lessons: [
      "Service discovery and declarative clients remove hardcoded URLs between services, but they add real infrastructure a monolith wouldn't need — worth it here specifically as a microservices-pattern exercise, not assumed to be worth it everywhere.",
    ],
    githubUrl: "https://github.com/omkarvchalke/QuizApp-Microservices",
    hasArchitectureDiagram: true,
    diagram: {
      nodes: [
        {
          id: "client",
          label: "Client",
          kind: "client",
          description: "Any REST client of the quiz API.",
          x: 8,
          y: 50,
        },
        {
          id: "gateway",
          label: "API Gateway",
          kind: "api",
          description:
            "Single entry point, routes to whichever service Eureka resolves.",
          x: 30,
          y: 50,
        },
        {
          id: "eureka",
          label: "Eureka Registry",
          kind: "service",
          description:
            "Service discovery — both services register here instead of using hardcoded URLs.",
          x: 30,
          y: 15,
        },
        {
          id: "question",
          label: "Question Service",
          kind: "service",
          description: "CRUD operations on quiz questions.",
          x: 58,
          y: 22,
        },
        {
          id: "quiz",
          label: "Quiz Service",
          kind: "service",
          description:
            "Quiz creation, collects responses, calculates the result. Calls Question Service via a Feign client.",
          x: 58,
          y: 78,
        },
        {
          id: "db",
          label: "PostgreSQL",
          kind: "database",
          description: "Persistence for both services.",
          x: 88,
          y: 50,
        },
      ],
      edges: [
        { from: "client", to: "gateway" },
        { from: "gateway", to: "question" },
        { from: "gateway", to: "quiz" },
        { from: "quiz", to: "question" },
        { from: "question", to: "db" },
        { from: "quiz", to: "db" },
        { from: "eureka", to: "question" },
        { from: "eureka", to: "quiz" },
      ],
    },
    disciplines: ["backend", "architecture"],
    depth: "full",
  },
  {
    slug: "hr-attrition-retention-analytics",
    name: "HR Attrition & Retention Analytics",
    summary:
      "An interactive Tableau dashboard analyzing employee attrition and retention across 11,760 employees to help HR identify at-risk segments.",
    problem:
      "HR needed to understand who's leaving and where attrition concentrates — department, role, tenure, comp — to target retention efforts instead of guessing from a single headline attrition rate.",
    architecture:
      "A Tableau Public dashboard built from a cleaned HR dataset, with interactive filtering across department, job role, age band, education field, overtime status, and a binned salary slab.",
    techSlugs: ["tableau"],
    challenges: [
      "Binning continuous fields (monthly income into salary slabs, age into bands) to make patterns visually legible without losing the underlying signal.",
    ],
    tradeoffs: [],
    metrics: [
      { label: "Employees analyzed", value: "11,760" },
      { label: "Active employees", value: "9,864" },
      { label: "Attrition count", value: "1,896" },
    ],
    lessons: [
      "A single headline attrition rate hides where the problem concentrates — breaking it down by department, role, and overtime status is what actually points to an action.",
    ],
    demoUrl:
      "https://public.tableau.com/app/profile/omkar.chalke3447/viz/HRAnalyticsDashboard_17706707347890/HRAnalyticsDashboard?publish=yes",
    githubUrl: "https://github.com/omkarvchalke/Attrition-Retention-Analytics",
    hasArchitectureDiagram: false,
    disciplines: ["data"],
    depth: "light",
  },
  {
    slug: "bank-telemarketing-campaign-analysis",
    name: "Bank Telemarketing Campaign Analysis",
    summary:
      "A statistical research project in R analyzing what drives term-deposit subscriptions in a bank's telemarketing campaign, across five distinct research questions.",
    problem:
      "The bank needed to understand which factors actually predict a customer subscribing to a term deposit, to target telemarketing more efficiently.",
    architecture:
      "Five research questions, each answered with a different statistical method — logistic regression with odds ratios and ROC/AUC, chi-square tests for demographic associations, survival analysis, a random forest, and clustering — run as a linear R pipeline (setup → cleaning → EDA → RQ1 through RQ5) from a shared train/test split.",
    techSlugs: ["r"],
    challenges: [
      "Structuring five distinct statistical methods (parametric, non-parametric, survival, ensemble, unsupervised) into one coherent, reproducible R pipeline feeding from a consistent train/test split.",
    ],
    tradeoffs: [],
    metrics: [],
    lessons: [
      "Different research questions call for genuinely different statistical tools — logistic regression, chi-square, survival analysis, random forest, and clustering each answer a distinct question the others can't.",
    ],
    githubUrl: "https://github.com/omkarvchalke/Bank-Telemarketing-Campaigns",
    hasArchitectureDiagram: false,
    disciplines: ["data", "research"],
    depth: "light",
  },
  {
    slug: "smart-parking",
    name: "Smart Car Parking (IoT)",
    summary:
      "An IoT-based smart car parking system on Raspberry Pi with ultrasonic, IR, and gas sensors.",
    problem:
      "Automating car-park occupancy and safety detection with low-cost embedded hardware.",
    architecture:
      "A Raspberry Pi 3 reads an ultrasonic sensor (distance/occupancy), an IR sensor, and an MQ2 gas sensor, driving an LED/buzzer output over configurable GPIO pins.",
    techSlugs: ["python", "raspberrypi"],
    challenges: [],
    tradeoffs: [],
    metrics: [],
    lessons: [],
    githubUrl: "https://github.com/omkarvchalke/SmartParking",
    hasArchitectureDiagram: false,
    disciplines: ["backend"],
    depth: "light",
  },
];
