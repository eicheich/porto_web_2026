"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { demos } from "@/playground/registry";
export function PlaygroundIndex() { const [filter, setFilter] = useState("All"); const categories = ["All", "Vision", "NLP", "Classical ML"]; const filtered = demos.filter((demo) => filter === "All" || demo.category === filter); return <div className="index-list"><div className="filter-row">{categories.map((category) => <button key={category} className={`filter-chip ${filter === category ? "is-active" : ""}`} onClick={() => setFilter(category)}>{category}</button>)}</div><div className="index-grid">{filtered.map((demo, index) => <Link className="index-card" href={`/playground/${demo.slug}`} key={demo.slug}><div className="index-art" style={{ background: demo.thumbnail }}><span>0{index + 1}</span><ArrowUpRight size={18} /></div><div><p className="eyebrow">{demo.category}</p><h2>{demo.title}</h2><p>{demo.description}</p><div className="tag-line">{demo.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div></Link>)}</div></div> }
