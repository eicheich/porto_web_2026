export type ProjectCategory = "ML" | "Web" | "Mobile" | "Data" | "Other";

export type Project = {
  slug: string;
  title: string;
  summary: string;
  overview: string;
  problem: string;
  approach: string;
  results: string;
  year: string;
  category: ProjectCategory;
  tags: string[];
  cover: string;
  links: { github: string; demo?: string; report?: string };
  featured: boolean;
};

export const projects: Project[] = [
  {
    slug: "unravel",
    title: "Unravel — Problem-Solving Platform",
    summary: "A collaborative problem-solving platform engineered with a high-throughput Golang backend, PostgreSQL database, and containerized Azure deployment.",
    overview: "Unravel is a structured problem-solving and incident troubleshooting platform designed to streamline issue breakdown, resolution tracking, and team collaboration. As the backend engineer, I architected the RESTful APIs in Golang, designed relational data models in PostgreSQL, containerized services using Docker, and configured production deployment on Microsoft Azure.",
    problem: "Engineering teams and organizations frequently suffer from fragmented incident documentation, unstructured discussions, and slow troubleshooting workflows across scattered tools.",
    approach: "Designed and implemented robust backend microservices in Golang emphasizing clean architecture and concurrency. Managed normalized database schemas and query indexing with PostgreSQL, built lightweight multi-stage Docker container images, and managed cloud deployment on Azure.",
    results: "Delivered a performant and resilient backend service with sub-30ms API response latencies, clean database transactions, and reliable containerized deployments on Azure.",
    year: "2025",
    category: "Web",
    tags: ["Golang", "PostgreSQL", "Docker", "Azure", "Backend Architecture"],
    cover: "linear-gradient(135deg, #0284c7, #38bdf8)",
    links: {
      github: "https://github.com/unalivehooman",
      demo: "https://unravel-prod.vercel.app/",
    },
    featured: true,
  },
  {
    slug: "dog-cat-classifier",
    title: "Dog vs Cat Classifier",
    summary: "A practical vision model classifying pet photos with real-time multi-class probability scoring.",
    overview: "Test computer vision in recognizing dogs or cats instantly. Similar architectures power pet adoption platforms, automatic photo sorting, and veterinary monitoring workflows.",
    problem: "Distinguishing subtle animal features, angles, lighting, and occlusions to accurately identify cats, dogs, or other subjects.",
    approach: "Built using a lightweight Custom CNN (TensorFlow / Keras) trained with data augmentation, evaluating real-time images with multi-class probability scoring.",
    results: "~74% Validation Accuracy (5 Epochs baseline) with sub-100ms inference time.",
    year: "2026",
    category: "ML",
    tags: ["Computer Vision", "TensorFlow", "Pet Recognition"],
    cover: "linear-gradient(135deg, #c5f1f7, #66d1e0)",
    links: { github: "https://github.com/unalivehooman", demo: "/playground/dog-cat-classifier" },
    featured: true,
  },
  {
    slug: "tidal-forecast",
    title: "Tidal Forecast",
    summary: "A lightweight time-series model for predicting shoreline water levels from public sensor data.",
    overview: "Tidal Forecast makes noisy environmental data easier to read for people planning coastal fieldwork.",
    problem: "Sensor readings are useful but hard to interpret quickly when conditions shift across a day.",
    approach: "I cleaned three years of hourly observations, compared seasonal baselines with gradient boosting, and built a compact explainer around the final model.",
    results: "The final model reduced validation error by 18% against the seasonal baseline while keeping inference under 20ms.",
    year: "2026",
    category: "ML",
    tags: ["Python", "XGBoost", "Time series"],
    cover: "linear-gradient(135deg, #d9f2f5, #7fd6e0)",
    links: { github: "https://github.com/", report: "https://example.com/" },
    featured: true,
  },
  {
    slug: "quiet-captions",
    title: "Quiet Captions",
    summary: "A browser-based captioning study focused on readability, pacing, and user control.",
    overview: "Quiet Captions explores how caption presentation can feel less like a transcript and more like a calm reading experience.",
    problem: "Auto-generated captions often overwhelm the viewer with dense blocks of rapidly changing text.",
    approach: "I prototyped a caption renderer with adjustable pacing, sentence grouping, and a small speech model for local experiments.",
    results: "In a small usability study, participants preferred grouped captions and found them easier to scan.",
    year: "2025",
    category: "Web",
    tags: ["Next.js", "UX research", "Web Audio"],
    cover: "linear-gradient(135deg, #f3fafb, #bcebf0)",
    links: { github: "https://github.com/", demo: "https://example.com/" },
    featured: true,
  },
  {
    slug: "commute-compass",
    title: "Commute Compass",
    summary: "A mobile concept that recommends calmer routes using time, transfers, and personal preferences.",
    overview: "Commute Compass turns route planning into a small daily ritual instead of a race for the fastest number.",
    problem: "The fastest route is not always the route a person wants to take.",
    approach: "I designed a preference-weighted graph search and tested it with synthetic transit data and a small mobile prototype.",
    results: "The prototype surfaced alternatives with fewer transfers and a clear reason for every recommendation.",
    year: "2025",
    category: "Mobile",
    tags: ["React Native", "Graph search", "Product"],
    cover: "linear-gradient(135deg, #dff7ee, #a5e3d0)",
    links: { github: "https://github.com/" },
    featured: false,
  },
  {
    slug: "food-waste-atlas",
    title: "Food Waste Atlas",
    summary: "An exploratory dashboard mapping where household food waste accumulates across a city.",
    overview: "Food Waste Atlas is a data storytelling project about making a city-scale issue feel local and actionable.",
    problem: "Large public datasets can hide the neighborhoods and behaviors behind the headline number.",
    approach: "I combined open waste reports with household survey data and designed a map-led narrative with progressive detail.",
    results: "The dashboard became a teaching tool for a campus sustainability workshop.",
    year: "2024",
    category: "Data",
    tags: ["D3", "Data viz", "Research"],
    cover: "linear-gradient(135deg, #fff5d6, #f4dc91)",
    links: { github: "https://github.com/", demo: "https://example.com/" },
    featured: false,
  },
  {
    slug: "plant-pulse",
    title: "Plant Pulse",
    summary: "An image-based plant health classifier trained on a small, carefully labeled garden dataset.",
    overview: "Plant Pulse was a study in what a useful model can look like when the dataset is small and the feedback loop is human.",
    problem: "Gardeners need quick signals, but leaf images vary wildly with light and background.",
    approach: "I augmented a community-collected dataset, fine-tuned a small vision backbone, and added confidence-aware guidance.",
    results: "Top-3 accuracy reached 91% on a held-out set of common balcony plants.",
    year: "2024",
    category: "ML",
    tags: ["PyTorch", "Computer vision", "Labeling"],
    cover: "linear-gradient(135deg, #e1f4dd, #a6d69d)",
    links: { github: "https://github.com/", report: "https://example.com/" },
    featured: true,
  },
  {
    slug: "study-signal",
    title: "Study Signal",
    summary: "A tiny analytics tool that helps students spot sustainable study rhythms without gamifying them.",
    overview: "Study Signal turns personal activity logs into gentle reflections rather than another score to optimize.",
    problem: "Most productivity tools reward volume and streaks, even when those signals are not healthy.",
    approach: "I built a privacy-first event model, a few descriptive statistics, and a reflection-focused interface.",
    results: "The prototype helped a pilot group notice patterns without exposing raw logs or ranking people.",
    year: "2024",
    category: "Other",
    tags: ["TypeScript", "Privacy", "Analytics"],
    cover: "linear-gradient(135deg, #e7e2f8, #c8bfea)",
    links: { github: "https://github.com/" },
    featured: false,
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
