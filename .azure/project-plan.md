# Approved Project Plan: ML Playground Portfolio

## Status

Approved for implementation planning only. This document defines the first implementation pass; no application code, Azure resources, or deployment will be created as part of this planning step.

## Goal

Build a polished, single-page portfolio website whose primary experience is an interactive ML Playground. The site will use local, client-side placeholder inference so every demo is usable without a backend, model hosting, API keys, or Azure services. It will be deployable to Vercel as a standard Next.js application.

## Technology Decisions

- Framework: latest stable Next.js with App Router
- Language: TypeScript with strict typing
- Styling: Tailwind CSS
- Motion: Framer Motion for intentional page-load, section, and interaction transitions
- Icons: lucide-react
- Package manager: npm
- Hosting target: Vercel
- Rendering: server components by default; client components only for interactive demos, controls, and motion where needed
- Inference: deterministic client-side placeholder logic with clearly labeled demo status and no network dependency
- Azure: explicitly out of scope for implementation, provisioning, authentication, storage, inference, telemetry, and deployment

## Information Architecture

### Home (`/`)

A single-page portfolio with anchored sections in this order:

1. **Hero**
   - Clear portfolio identity and positioning around applied machine learning
   - Primary CTA linking to the ML Playground
   - Secondary CTA linking to projects
   - Responsive visual treatment with accessible heading hierarchy

2. **ML Playground**
   - Registry-driven demo cards for the four placeholder demos
   - Short descriptions, capability labels, and links to each dedicated playground route
   - Clear indication that inference is local and illustrative

3. **Projects**
   - Data-driven project cards sourced from `src/data/projects.ts`
   - Six dummy projects with title, summary, category, stack, outcome, and slug
   - Links to `/projects/[slug]`

4. **About**
   - Profile content sourced from `src/data/profile.ts`
   - Skills, working approach, and concise professional narrative

5. **Contact/Footer**
   - Contact CTA and social/contact links from profile data
   - Footer navigation back to page sections and playground
   - Keyboard-accessible links and visible focus states

### Playground index (`/playground`)

A focused listing of all registered demos with descriptions and links to their detail pages.

### Playground detail (`/playground/[slug]`)

A dynamic route that resolves a demo from the registry and renders its interactive placeholder UI. Unknown slugs should produce a standard not-found response.

### Project detail (`/projects/[slug]`)

A dynamic route that resolves a project from `src/data/projects.ts` and renders its case-study placeholder content. Unknown slugs should produce a standard not-found response.

## Planned Project Structure

```text
.
├── .azure/
│   └── project-plan.md
├── public/
│   └── static assets as needed
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   ├── playground/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   └── projects/
│   │       └── [slug]/page.tsx
│   ├── components/
│   │   ├── layout/
│   │   ├── sections/
│   │   ├── playground/
│   │   └── ui/
│   ├── data/
│   │   ├── projects.ts
│   │   └── profile.ts
│   ├── playground/
│   │   └── demos/
│   │       ├── image-classifier/
│   │       ├── sentiment-analysis/
│   │       ├── handwritten-digit-recognizer/
│   │       └── regression-visualizer/
│   └── lib/
│       ├── playground-registry.ts
│       └── placeholder-inference.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts or Tailwind configuration supported by the selected Next.js release
├── tsconfig.json
└── eslint.config.mjs
```

The exact Tailwind configuration files may follow the latest `create-next-app` output and current Tailwind release conventions.

## Data and Registry Design

### Playground registry

Create a typed registry under `src/playground/demos` or a nearby registry module that exposes, for each demo:

- Stable slug
- Display title and short description
- Category/capability labels
- Demo component reference
- Input/output description
- Local inference disclaimer

The four required placeholder demos are:

- `image-classifier`
- `sentiment-analysis`
- `handwritten-digit-recognizer`
- `regression-visualizer`

The registry will be the single source used by the home section, `/playground`, and dynamic playground routes so links and route resolution cannot drift.

### Projects

`src/data/projects.ts` will export six typed dummy projects. Each entry should include at least:

- `slug`
- `title`
- `summary`
- `description`
- `category`
- `technologies`
- `outcome`
- Optional links or metric placeholders where useful

### Profile

`src/data/profile.ts` will export typed profile data for name, role, bio, skills, contact details, and social links. Components should consume this data rather than duplicating profile strings.

## Demo Behavior

All demos are client-side placeholders designed to demonstrate interaction and presentation, not production model quality:

- **Image classifier:** image selection or a sample-image control produces deterministic mock labels and confidence bars.
- **Sentiment analysis:** text input produces a deterministic sentiment label, score, and short explanation.
- **Handwritten digit recognizer:** canvas input supports drawing/clearing and returns a deterministic mock digit prediction based on a simple client-side signal or placeholder action.
- **Regression visualizer:** numeric controls or generated sample points update a responsive chart/visualization and a placeholder fit summary.

Each demo must include loading/processing, result, reset, empty, and error-safe states where applicable. Inputs must have labels, keyboard paths, sufficient contrast, and status text that is announced appropriately. The UI must explain that results are illustrative and run locally in the browser.

## Visual and UX Direction

- Create a distinctive portfolio interface with an intentional editorial/technical visual language rather than a generic dashboard.
- Use purposeful typography, a restrained multi-color palette, strong hierarchy, and responsive spacing.
- Use Framer Motion for meaningful entrance sequencing, section reveals, and demo state transitions; respect `prefers-reduced-motion`.
- Use lucide-react icons for navigation, actions, status indicators, and external links.
- Keep cards and panels purposeful; avoid nesting cards inside cards.
- Ensure layouts work from mobile through wide desktop without horizontal overflow or overlapping content.
- Provide a skip link, semantic landmarks, visible focus rings, keyboard-accessible controls, descriptive link labels, and appropriate ARIA only where native semantics are insufficient.

## SEO and Metadata

- Define site-wide metadata in `src/app/layout.tsx` with title templates, description, canonical metadata strategy, Open Graph basics, and robots defaults.
- Add `src/app/sitemap.ts` covering `/`, `/playground`, all four playground detail URLs, and all six project detail URLs.
- Add `src/app/robots.ts` allowing public crawling and pointing to the generated sitemap.
- Keep metadata values centralized or derived from the typed profile/project/registry data where practical.

## Implementation Sequence

1. Bootstrap the latest stable Next.js App Router project with TypeScript, Tailwind CSS, ESLint, `src/`, and npm.
2. Add `framer-motion` and `lucide-react`.
3. Establish global styles, typography, color tokens, responsive layout primitives, and accessibility foundations.
4. Add typed profile data, six project records, the playground registry, and placeholder inference helpers.
5. Build shared navigation, section layout, buttons, links, cards, and status/result primitives.
6. Implement the home page sections and anchor navigation.
7. Implement the four demo modules and the `/playground` index.
8. Implement dynamic playground and project detail routes with not-found handling.
9. Add metadata, sitemap, robots, and route-aware link validation.
10. Validate responsive behavior, accessibility, keyboard interaction, reduced motion, build output, and Vercel compatibility.

## Validation Gates

- `npm run lint` passes with no new warnings treated as errors.
- `npm run build` succeeds using the production Next.js build.
- Every required route renders, including all demo and project slugs.
- Invalid dynamic slugs render the intended not-found experience.
- Playground controls work without a network connection or API credentials.
- No Azure SDK, Azure environment variable, Azure resource, or provisioning file is introduced.
- Keyboard navigation, focus visibility, labels, status announcements, and reduced-motion behavior are verified.
- Mobile and desktop layouts have no overflow, clipped controls, or overlapping text.
- Sitemap and robots output contain the expected public routes.
- The project can be imported into Vercel with the default Next.js build settings.

## Explicit Non-Goals

- No Azure service integration or provisioning
- No real ML model hosting or inference API
- No authentication, database, CMS, contact form backend, or email delivery
- No analytics or telemetry requirement
- No deployment during this phase
- No application implementation in this planning step

## Next Action

After approval to proceed with implementation, scaffold the latest stable Next.js project in this empty workspace, install the two requested UI dependencies, and implement the shared data/registry foundations before building the page sections and demo routes.
