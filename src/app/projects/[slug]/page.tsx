import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then(({ slug }) => {
    const project = getProject(slug);
    return { title: project?.title ?? "Project", description: project?.summary };
  });
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return (
    <main className="subpage project-page">
      <div className="section-shell">
        <Link className="back-link" href="/#projects">
          <ArrowLeft size={16} /> Selected work
        </Link>
        <div className="project-hero">
          <div>
            <p className="eyebrow">
              {project.category} / {project.year}
            </p>
            <h1>{project.title}</h1>
            <p>{project.summary}</p>
            <div className="tag-line">
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
          <div className="detail-cover" style={{ background: project.cover }} />
        </div>
        <div className="case-study">
          <div>
            <p className="eyebrow">The short version</p>
            <p className="lead-copy">{project.overview}</p>
          </div>
          <div className="case-grid">
            <article>
              <span>Problem</span>
              <p>{project.problem}</p>
            </article>
            <article>
              <span>Approach</span>
              <p>{project.approach}</p>
            </article>
            <article>
              <span>Results</span>
              <p>{project.results}</p>
            </article>
          </div>
        </div>
        <div className="detail-links">
          <a className="button button-primary" href={project.links.github} target="_blank" rel="noreferrer">
            GitHub <ArrowUpRight size={16} />
          </a>
          {project.links.demo && (
            <a
              className="button button-ghost"
              href={project.links.demo}
              target={project.links.demo.startsWith("http") ? "_blank" : undefined}
              rel={project.links.demo.startsWith("http") ? "noreferrer" : undefined}
            >
              {project.links.demo.startsWith("http") ? "Visit Live Site" : "Live Demo / Predict"} <ArrowUpRight size={16} />
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
