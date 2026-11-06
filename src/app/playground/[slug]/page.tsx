import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { getDemo } from "@/playground/registry";
import { DemoWorkbench } from "@/components/portfolio";

export function generateStaticParams() {
  return [
    { slug: "house-price-predictor" },
    { slug: "dog-cat-classifier" },
    { slug: "image-classifier" },
    { slug: "sentiment-analysis" },
    { slug: "handwritten-digit-recognizer" },
    { slug: "regression-visualizer" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const demo = getDemo(slug);
  return {
    title: demo ? `${demo.title} — Houselab Playground` : "Interactive Demo — Houselab Playground",
    description: demo?.description ?? "Interactive Machine Learning Playground Demo",
  };
}

export default async function DemoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const demo = getDemo(slug);

  if (!demo) {
    notFound();
  }

  return (
    <main className="subpage demo-page">
      <div className="section-shell">
        <Link className="back-link" href="/">
          <ArrowLeft size={16} /> Back Home
        </Link>
        <div className="demo-heading">
          <div>
            <p className="eyebrow">{demo.category} / interactive demo</p>
            <h1>{demo.title}</h1>
            <p>{demo.description}</p>
            <div className="tag-line">
              {demo.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
          {slug === "dog-cat-classifier" && (
            <a
              className="text-link"
              href="https://huggingface.co/unalivehooman/cats-dogs-others-classifier"
              target="_blank"
              rel="noreferrer"
            >
              View on Huggingface <ArrowUpRight size={16} />
            </a>
          )}
        </div>
        <DemoWorkbench slug={slug} />
      </div>
    </main>
  );
}