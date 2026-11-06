"use client";
import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpRight, Database, ExternalLink, Mail } from "lucide-react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { useId, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { projects, type ProjectCategory } from "@/data/projects";
import { demos } from "@/playground/registry";
import logoFish from "../../porto_pict/logo/logo-fish.svg";

const logoFishSrc = typeof logoFish === "string" ? logoFish : logoFish.src;

/* ---------------------------------------------------------------- ocean bits */

/** Layered, slowly drifting SVG waves. `color` should match the next section's top colour. */
export function Waves({ color, className = "" }: { color: string; className?: string }) {
  const id = `wave-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg className={`waves ${className}`} viewBox="0 24 150 28" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <path id={id} d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352z" />
      </defs>
      <g className="wave-layers">
        <use href={`#${id}`} x="48" y="0" fill={color} opacity="0.3" />
        <use href={`#${id}`} x="48" y="3" fill={color} opacity="0.5" />
        <use href={`#${id}`} x="48" y="5" fill={color} opacity="0.75" />
        <use href={`#${id}`} x="48" y="7" fill={color} />
      </g>
    </svg>
  );
}

type BubbleSeed = { left: number; size: number; delay: number; duration: number };
const heroBubbles: BubbleSeed[] = [
  { left: 4, size: 10, delay: 0, duration: 13 }, { left: 12, size: 18, delay: -6, duration: 16 },
  { left: 23, size: 8, delay: -3, duration: 11 }, { left: 38, size: 14, delay: -9, duration: 15 },
  { left: 52, size: 9, delay: -1, duration: 12 }, { left: 63, size: 22, delay: -11, duration: 18 },
  { left: 74, size: 12, delay: -4, duration: 14 }, { left: 86, size: 16, delay: -8, duration: 17 },
  { left: 94, size: 8, delay: -2, duration: 10 },
];
const shallowBubbles: BubbleSeed[] = [
  { left: 8, size: 12, delay: -2, duration: 14 }, { left: 30, size: 8, delay: -7, duration: 12 },
  { left: 57, size: 16, delay: -4, duration: 17 }, { left: 80, size: 10, delay: -10, duration: 13 },
  { left: 92, size: 14, delay: -5, duration: 15 },
];

/** Rising bubbles. Click/tap one to pop it — it comes back a moment later. */
function Bubbles({ seeds, tone = "light" }: { seeds: BubbleSeed[]; tone?: "light" | "dark" }) {
  const [popped, setPopped] = useState<Record<number, boolean>>({});
  const pop = (index: number) => {
    setPopped((current) => ({ ...current, [index]: true }));
    window.setTimeout(() => setPopped((current) => ({ ...current, [index]: false })), 1200);
  };
  return (
    <div className={`bubbles bubbles-${tone}`} aria-hidden="true">
      {seeds.map((bubble, index) => (
        <button
          key={index}
          type="button"
          tabIndex={-1}
          className={`bubble ${popped[index] ? "is-popped" : ""}`}
          style={{ left: `${bubble.left}%`, width: bubble.size, height: bubble.size, animationDelay: `${bubble.delay}s`, animationDuration: `${bubble.duration}s` }}
          onPointerDown={() => pop(index)}
        />
      ))}
    </div>
  );
}

/** Fixed depth meter: the page is a dive from the surface to the abyss. */
export function DepthGauge() {
  const { scrollYProgress } = useScroll();
  const [depth, setDepth] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (value) => setDepth(Math.round(value * 1000)));
  const zone = depth < 60 ? "surface" : depth < 320 ? "shallows" : depth < 620 ? "reef" : depth < 900 ? "deep" : "abyss";
  return (
    <div className="depth-gauge" aria-hidden="true">
      <span className="depth-value">{depth === 0 ? "0" : `−${depth}`}m</span>
      <div className="depth-track">
        <motion.i style={{ scaleY: scrollYProgress }} />
      </div>
      <span className="depth-zone">{zone}</span>
    </div>
  );
}

/* ---------------------------------------------------------------- layout */

export function Nav() {
  return (
    <header className="nav-wrap">
      <nav className="nav" aria-label="Primary navigation">
        <Link className="brand" href="/">
          <span className="brand-mark">
            <img src={logoFishSrc} alt="" className="brand-logo" width={24} height={24} />
          </span>
          <span>{profile.conceptName}</span>
          <span className="brand-sub">by {profile.name}</span>
        </Link>
        <div className="nav-links">
          <Link href="/#playground">Playground</Link>
          <Link href="/#projects">Projects</Link>
          <Link href="/#about">About</Link>
          <Link href="/#contact">Contact</Link>
        </div>
        <Link className="nav-cta" href="/playground">
          Open lab <ArrowUpRight size={15} />
        </Link>
      </nav>
    </header>
  );
}

export function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
}

const buoys = [
  { label: "Vision", icon: "◌", cls: "buoy-a" },
  { label: "Language", icon: "≈", cls: "buoy-b" },
  { label: "Text → SQL", icon: "⌗", cls: "buoy-c" },
  { label: "Regression", icon: "↗", cls: "buoy-d" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [first, ...rest] = profile.conceptName.split(" ");
  const waterWaveId = `surface-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <section className="hero hero-split-ocean" id="top" ref={ref}>
      {/* Upper Atmosphere / Sky Zone */}
      <div className="hero-sky" aria-hidden="true">
        <div className="hero-cloud hero-cloud-a" />
        <div className="hero-cloud hero-cloud-b" />
        <div className="sun-glow" />
      </div>

      {/* Monumental Centered Title (sits across the horizon so line 2 dips into the waterline) */}
      <div className="section-shell hero-sky-content">
        <p className="hero-ref-eyebrow">
          BY <strong>{profile.name.toUpperCase()}</strong> · {profile.role.toUpperCase()}
        </p>
        <h1 className="hero-display-title">
          <span className="hero-title-top">{first}</span>
          <span className="hero-title-submerged">{rest.join(" ")}</span>
        </h1>
      </div>

      {/* Split Waterline Surface (Over-Under Meniscus & Waves overlapping the bottom of the title) */}
      <div className="hero-waterline" aria-hidden="true">
        <svg className="hero-surface-svg" viewBox="0 20 150 32" preserveAspectRatio="none">
          <defs>
            <path id={waterWaveId} d="M-160 36c30 0 58-10 88-10s58 10 88 10 58-10 88-10 58 10 88 10v30h-352z" />
          </defs>
          <g className="wave-layers">
            <use href={`#${waterWaveId}`} x="48" y="0" fill="rgba(166, 232, 245, 0.55)" />
            <use href={`#${waterWaveId}`} x="48" y="2" fill="rgba(76, 192, 216, 0.65)" />
            <use href={`#${waterWaveId}`} x="48" y="4" fill="rgba(19, 132, 168, 0.85)" />
            <use href={`#${waterWaveId}`} x="48" y="6" fill="#0d6e92" />
          </g>
        </svg>
      </div>

      {/* Lower Underwater Sunlit Zone */}
      <div className="hero-underwater">
        <div className="section-shell hero-underwater-inner">
          <div className="hero-actions hero-actions-centered">
            <Link className="button hero-pill-cta" href="#playground">
              DIVE INTO PLAYGROUND <ArrowDown size={15} />
            </Link>
            <Link className="button hero-pill-ghost" href="#projects">
              VIEW SELECTED WORK <ArrowUpRight size={15} />
            </Link>
          </div>
          <p className="hero-underwater-sub">
            A personal digital lab out at sea — test live machine learning prototypes right in your browser, then dive deeper into the engineering behind them.
          </p>
          <span className="hero-depth-tag">0m · surface</span>
        </div>
      </div>

      <Waves color="#d9f2f5" />
    </section>
  );
}

function DemoCard({ demo }: { demo: (typeof demos)[number] }) {
  return (
    <Link href={`/playground/${demo.slug}`} className="demo-card ocean-card">
      <div className="card-waterline" />
      <div className="demo-art" style={{ background: demo.thumbnail }}>
        <div className="art-shimmer" />
        <span className="art-label">
          <span className="ocean-dot" />
          ( {demo.category} )
        </span>
        <span className="art-symbol">
          {demo.slug === "house-price-predictor" ? "🏠" : demo.slug === "dog-cat-classifier" ? "🐾" : demo.slug === "image-classifier" ? "◌" : demo.slug === "sentiment-analysis" ? "≈" : demo.slug === "handwritten-digit-recognizer" ? "7" : "↗"}
        </span>
        <div className="art-wave-crest" />
      </div>
      <div className="card-body">
        <div className="card-kicker">
          <span className="card-tag-pill">( {demo.tags[0]} )</span>
          <span className="card-arrow-bubble">
            <ArrowUpRight size={14} />
          </span>
        </div>
        <h3>{demo.title}</h3>
        <p>{demo.description}</p>
      </div>
    </Link>
  );
}

function TextToSqlCard() {
  return (
    <Link href="/playground" className="demo-card studio-card ocean-card">
      <div className="card-waterline" />
      <div className="demo-art studio-card-art">
        <div className="art-shimmer" />
        <div className="studio-sonar-ring" />
        <span className="art-label">
          <span className="ocean-dot" />
          ( AI / SQL )
        </span>
        <div className="studio-icon-wrap">
          <Database size={38} strokeWidth={1.4} />
        </div>
        <span className="studio-card-sql">SELECT * FROM curiosity;</span>
        <div className="art-wave-crest" />
      </div>
      <div className="card-body">
        <div className="card-kicker">
          <span className="card-tag-pill">( Coming Soon · Hugging Face )</span>
          <span className="card-arrow-bubble">
            <ArrowUpRight size={14} />
          </span>
        </div>
        <h3>AI Text-to-SQL Studio</h3>
        <p>Translate natural language into PostgreSQL queries using fine-tuned Qwen2.5-1.5B models. View models on Hugging Face.</p>
      </div>
    </Link>
  );
}

export function PlaygroundSection() {
  return (
    <section id="playground" className="section section-foam">
      <div className="section-shell">
        <Reveal>
          <div className="ref-stagger-header">
            <p className="eyebrow">/ −10m · the shallows · interactive laboratory</p>
            <h2 className="ref-display-h2 ref-stagger-title">
              <span className="stagger-line-left">TRY THE MODELS</span>
              <span className="stagger-line-right">MAKE SOME WAVES</span>
            </h2>
            <div className="ref-stagger-aside">
              <p>
                Interactive prototypes running right in your browser. Feel how machine learning models turn your inputs into live predictions — no code required.
              </p>
              <Link className="text-link" href="/playground">
                See all demos <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </Reveal>
        <div className="demo-grid">
          <Reveal>
            <TextToSqlCard />
          </Reveal>
          {demos.map((demo) => (
            <Reveal key={demo.slug}>
              <DemoCard demo={demo} />
            </Reveal>
          ))}
        </div>
      </div>
      <Waves color="#3fb6c8" />
    </section>
  );
}

export function ProjectsSection() {
  const categories: (ProjectCategory | "All")[] = ["All", "ML", "Web", "Mobile", "Data", "Other"];
  const [selected, setSelected] = useState<ProjectCategory | "All">("All");
  const visible = projects.filter((project) => selected === "All" || project.category === selected);

  return (
    <section id="projects" className="section section-reef">
      <div className="section-shell">
        <Reveal>
          <div className="ref-trips-header">
            <p className="eyebrow">// −200m · the reef · selected case studies</p>
            <h2 className="ref-display-h2 ref-center-title">SELECTED WORK & PROJECTS</h2>
            <div className="ref-editorial-split">
              <ul className="ref-editorial-list">
                <li>Applied Machine Learning & Vision</li>
                <li>Calm, Human-Centered Web Systems</li>
                <li>Data Storytelling & Analytics</li>
              </ul>
              <p className="ref-editorial-copy">
                Every project bridges a practical data question with clean, measurable engineering. From coastal sensor forecasting to readable interfaces, each study is built with intent.
              </p>
            </div>
          </div>
        </Reveal>
        <div className="filter-row filter-row-centered" role="group" aria-label="Filter projects">
          {categories.map((category) => (
            <button key={category} className={`filter-chip ${selected === category ? "is-active" : ""}`} onClick={() => setSelected(category)}>
              {category}
            </button>
          ))}
        </div>
        <div className="project-grid">
          {visible.map((project) => (
            <Reveal key={project.slug}>
              <Link className="project-card ocean-card" href={`/projects/${project.slug}`}>
                <div className="card-waterline" />
                <div className="project-cover" style={{ background: project.cover }}>
                  <div className="art-shimmer" />
                  <span className="project-depth-tag">
                    <span className="ocean-dot" />
                    {project.year}
                  </span>
                  <span className="card-arrow-bubble">
                    <ArrowUpRight size={14} />
                  </span>
                  <div className="art-wave-crest" />
                </div>
                <div className="card-body project-body">
                  <div className="project-meta">
                    <span className="card-tag-pill">( {project.category} )</span>
                    <span className="project-subtags">{project.tags.slice(0, 2).join(" · ")}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
      <Waves color="#0b3c4f" />
    </section>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="section section-deep">
      <div className="plankton" aria-hidden="true" />
      <div className="section-shell about-ref-grid">
        <Reveal className="about-col-left">
          <p className="ref-slash-heading">/ RIGOR & WONDER</p>
          <p className="ref-about-text">{profile.bio}</p>
          <div className="skill-list">
            {profile.skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </Reveal>

        <Reveal className="about-col-center">
          <p className="eyebrow eyebrow-light">−600m · the deep</p>
          <h2 className="ref-display-h2 ref-stacked-title">
            <span>WHO</span>
            <span>I</span>
            <span>AM</span>
          </h2>
        </Reveal>

        <Reveal className="about-col-right">
          {profile.education.map((item, idx) => (
            <div className="ref-about-block" key={item.year}>
              <p className="ref-slash-heading">
                {"/".repeat(idx + 2)} {item.title.toUpperCase()}
              </p>
              <span className="ref-about-year">{item.year}</span>
              <p className="ref-about-text">{item.detail}</p>
            </div>
          ))}
        </Reveal>
      </div>
      <Waves color="#062633" />
    </section>
  );
}

export function ContactSection() {
  return (
    <footer id="contact" className="footer-ocean">
      <div className="plankton plankton-faint" aria-hidden="true" />
      <div className="section-shell footer">
        <div className="ref-contact-center">
          <p className="eyebrow">/// −1000m · the abyss</p>
          <h2 className="ref-display-h2 ref-center-title">READY TO DIVE IN?</h2>
          <p className="ref-contact-sub">
            Have a good idea, research question, or collaboration in mind? Reach out and let&apos;s build something thoughtful together.
          </p>
          <div className="ref-contact-pill-wrap">
            <a className="ref-contact-pill" href={`mailto:${profile.email}`}>
              <span>{profile.email}</span>
              <span className="ref-contact-go">
                SEND EMAIL <ArrowUpRight size={15} />
              </span>
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © 2026 {profile.name} · {profile.conceptName}
          </span>
          <div className="socials">
            <a href={profile.links.github} target="_blank" rel="noreferrer" aria-label="GitHub">
              <ExternalLink size={18} />
            </a>
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <ExternalLink size={18} />
            </a>
            <a href={`mailto:${profile.email}`} aria-label="Email">
              <Mail size={18} />
            </a>
          </div>
          <a className="footer-note" href="#top">
            <ArrowUp size={14} /> back to the surface
          </a>
        </div>
      </div>
    </footer>
  );
}

export function DemoWorkbench({ slug }: { slug: string }) {
  const demo = demos.find((item) => item.slug === slug);
  if (!demo) return null;
  const Component = demo.component;
  const steps = (demo as any).steps;

  return (
    <>
      <div className="demo-panel">
        <Component />
      </div>
      <details className="how-panel">
        <summary>
          How it works <span>+</span>
        </summary>
        {steps && Array.isArray(steps) && steps.length > 0 ? (
          <div className="how-steps-grid">
            {steps.map((s: any) => (
              <div key={s.num} className="how-step-card">
                <span className="how-step-num">{s.num}</span>
                <strong>{s.title}</strong>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>
            This interactive sandbox runs a client-side inference pipeline for <strong>{demo.title}</strong>. It simulates real-time feature extraction and model evaluation directly within the browser interface.
          </p>
        )}
      </details>
      <div className="model-info">
        <div>
          <span>Architecture</span>
          <strong>{demo.architecture}</strong>
        </div>
        <div>
          <span>Dataset</span>
          <strong>{demo.dataset}</strong>
        </div>
        <div>
          <span>Accuracy</span>
          <strong>{demo.accuracy}</strong>
        </div>
      </div>
    </>
  );
}
