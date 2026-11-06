import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { demos } from "@/playground/registry";
export default function sitemap(): MetadataRoute.Sitemap { const base = "https://mayachen.dev"; return [{ url: base }, { url: `${base}/playground` }, ...demos.map((demo) => ({ url: `${base}/playground/${demo.slug}` })), ...projects.map((project) => ({ url: `${base}/projects/${project.slug}` }))]; }