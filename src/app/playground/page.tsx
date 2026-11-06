import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TextToSqlStudio } from "@/components/text-to-sql-studio";

export const metadata: Metadata = {
  title: "AI Text-to-SQL Studio — Qwen2.5-1.5B Fine-Tuned",
  description: "Translate natural language questions into PostgreSQL queries with fine-tuned Qwen 2.5 models on Hugging Face.",
};

export default function PlaygroundPage() {
  return (
    <main className="sql-studio-page">
      <div className="section-shell">
        <div className="back-link-wrapper" style={{ paddingTop: "10px", marginBottom: "20px" }}>
          <Link className="back-link" href="/">
            <ArrowLeft size={16} /> Back Home
          </Link>
        </div>
        <TextToSqlStudio />
      </div>
    </main>
  );
}
