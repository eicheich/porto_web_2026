"use client";

import {
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Database,
  Info,
  Play,
  Sparkles,
} from "lucide-react";
import { FormEvent, useState } from "react";

type SampleQuery = {
  question: string;
  sql: string;
  data: Record<string, unknown>[];
};

const sampleQueries: SampleQuery[] = [
  {
    question: "Tampilkan semua karyawan divisi IT dengan gaji di atas 10 juta",
    sql: "SELECT employee_id, full_name, department, salary, hire_date\nFROM employees\nWHERE department = 'IT' AND salary > 10000000\nORDER BY salary DESC;",
    data: [
      { employee_id: 104, full_name: "Budi Santoso", department: "IT", salary: 14500000, hire_date: "2022-03-15" },
      { employee_id: 112, full_name: "Siti Rahma", department: "IT", salary: 12000000, hire_date: "2023-01-10" },
      { employee_id: 119, full_name: "Ahmad Fauzi", department: "IT", salary: 11000000, hire_date: "2023-07-01" },
    ],
  },
  {
    question: "Daftar produk kategori Elektronik dengan stok kurang dari 15",
    sql: "SELECT product_id, product_name, category, stock_quantity, price\nFROM products\nWHERE category = 'Elektronik' AND stock_quantity < 15\nORDER BY stock_quantity ASC;",
    data: [
      { product_id: 301, product_name: "Wireless Mouse Pro", category: "Elektronik", stock_quantity: 4, price: 320000 },
      { product_id: 305, product_name: "Mechanical Keyboard", category: "Elektronik", stock_quantity: 8, price: 850000 },
      { product_id: 312, product_name: "USB-C Hub 7-in-1", category: "Elektronik", stock_quantity: 11, price: 410000 },
    ],
  },
  {
    question: "Hitung rata-rata gaji karyawan berdasarkan divisi",
    sql: "SELECT department, COUNT(employee_id) AS total_employees, ROUND(AVG(salary), 2) AS average_salary\nFROM employees\nGROUP BY department\nORDER BY average_salary DESC;",
    data: [
      { department: "IT", total_employees: 18, average_salary: 11800000 },
      { department: "Data Science", total_employees: 7, average_salary: 12500000 },
      { department: "Product", total_employees: 9, average_salary: 10400000 },
      { department: "Marketing", total_employees: 12, average_salary: 8200000 },
    ],
  },
  {
    question: "Tampilkan riwayat transaksi penjualan beserta nama produknya",
    sql: "SELECT t.transaction_id, p.product_name, t.quantity, t.total_price, t.created_at\nFROM transactions t\nJOIN products p ON t.product_id = p.product_id\nORDER BY t.created_at DESC\nLIMIT 5;",
    data: [
      { transaction_id: 8841, product_name: "Mechanical Keyboard", quantity: 2, total_price: 1700000, created_at: "2024-10-28" },
      { transaction_id: 8840, product_name: "Noise-Cancelling Headphones", quantity: 1, total_price: 1450000, created_at: "2024-10-28" },
      { transaction_id: 8839, product_name: "Wireless Mouse Pro", quantity: 3, total_price: 960000, created_at: "2024-10-27" },
    ],
  },
];

export function TextToSqlStudio() {
  const [question, setQuestion] = useState(sampleQueries[0].question);
  const [selectedSample, setSelectedSample] = useState<SampleQuery | null>(sampleQueries[0]);
  const [notice, setNotice] = useState<string | null>(null);

  function handleSelectSample(sample: SampleQuery) {
    setQuestion(sample.question);
    setSelectedSample(sample);
    setNotice(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("Live interactive execution is coming soon! Currently displaying curated inference preview below.");
  }

  const columns = selectedSample?.data?.length ? Object.keys(selectedSample.data[0]) : [];

  return (
    <div className="sql-studio">
      {/* Studio Header */}
      <header className="sql-studio-hero">
        <div>
          <p className="eyebrow">
            <Sparkles size={14} /> AI Studio / Natural Language to SQL
          </p>
          <h1 className="sql-studio-heading" style={{ lineHeight: 1.2, marginTop: "8px", marginBottom: "16px", overflow: "visible" }}>
            Text-to-SQL <em>Explorer</em>
          </h1>
          <p className="sql-studio-intro">
            Translate natural-language inquiries into safe, structured PostgreSQL queries using fine-tuned open-source models optimized for Indonesian context.
          </p>
        </div>
        <div className="sql-status-stack">
          <span className="sql-status-coming-soon">
            <span className="status-dot-pulse-amber" /> Live Inference Coming Soon
          </span>
          <span>
            <Database size={14} /> Base: Qwen 2.5 (1.5B) Fine-Tuned
          </span>
        </div>
      </header>

      {/* Hugging Face Repositories Showcase */}
      <section className="hf-models-section" aria-label="Official Model Repositories">
        <div className="sql-section-kicker">
          <span>01</span> Official Model Repositories
        </div>
        <div
          className="hf-models-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "16px",
          }}
        >
          {/* Model v2 */}
          <a
            className="hf-model-card"
            href="https://huggingface.co/unalivehooman/Qwen2.5-1.5B-Indo-Text2SQL-v2"
            target="_blank"
            rel="noreferrer"
            style={{
              background: "var(--white)",
              border: "1px solid var(--line)",
              borderRadius: "16px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "16px",
              textDecoration: "none",
              boxShadow: "0 4px 18px rgba(11, 60, 79, 0.05)",
            }}
          >
            <div className="hf-card-body" style={{ display: "flex", flexDirection: "column" }}>
              <div
                className="hf-card-top"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span
                  className="hf-model-tag v2"
                  style={{
                    padding: "4px 10px",
                    borderRadius: "6px",
                    background: "#ecfdf5",
                    border: "1px solid #a7f3d0",
                    color: "#047857",
                    fontSize: "11px",
                    fontWeight: 700,
                    fontFamily: "var(--font-mono), monospace",
                    textTransform: "uppercase",
                  }}
                >
                  v2 · Latest Release
                </span>
                <span
                  className="hf-icon-bubble"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "4px 10px",
                    borderRadius: "999px",
                    background: "rgba(11, 60, 79, 0.04)",
                    border: "1px solid var(--line)",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--deep)",
                  }}
                >
                  🤗 Hugging Face
                </span>
              </div>
              <h3
                className="hf-card-title"
                style={{
                  fontSize: "17px",
                  fontWeight: 700,
                  color: "var(--deep)",
                  margin: "12px 0 8px",
                  wordBreak: "break-word",
                }}
              >
                Qwen2.5-1.5B-Indo-Text2SQL-v2
              </h3>
              <p
                className="hf-card-desc"
                style={{
                  fontSize: "13px",
                  color: "var(--muted)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                Latest fine-tuned model checkpoint on Hugging Face, optimized for high query precision, multi-table joins, and schema-conditioned syntax in Indonesian.
              </p>
            </div>
            <div
              className="hf-card-link"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--sea-700)",
                marginTop: "12px",
              }}
            >
              <span>View weights & model card on Hugging Face</span>
              <ArrowUpRight size={15} />
            </div>
          </a>

          {/* Model v1 */}
          <a
            className="hf-model-card"
            href="https://huggingface.co/unalivehooman/Qwen2.5-1.5B-Indo-Text2SQL"
            target="_blank"
            rel="noreferrer"
            style={{
              background: "var(--white)",
              border: "1px solid var(--line)",
              borderRadius: "16px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "16px",
              textDecoration: "none",
              boxShadow: "0 4px 18px rgba(11, 60, 79, 0.05)",
            }}
          >
            <div className="hf-card-body" style={{ display: "flex", flexDirection: "column" }}>
              <div
                className="hf-card-top"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span
                  className="hf-model-tag"
                  style={{
                    padding: "4px 10px",
                    borderRadius: "6px",
                    background: "#eff6ff",
                    border: "1px solid #bfdbfe",
                    color: "#1d4ed8",
                    fontSize: "11px",
                    fontWeight: 700,
                    fontFamily: "var(--font-mono), monospace",
                    textTransform: "uppercase",
                  }}
                >
                  v1 · Baseline Model
                </span>
                <span
                  className="hf-icon-bubble"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "4px 10px",
                    borderRadius: "999px",
                    background: "rgba(11, 60, 79, 0.04)",
                    border: "1px solid var(--line)",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--deep)",
                  }}
                >
                  🤗 Hugging Face
                </span>
              </div>
              <h3
                className="hf-card-title"
                style={{
                  fontSize: "17px",
                  fontWeight: 700,
                  color: "var(--deep)",
                  margin: "12px 0 8px",
                  wordBreak: "break-word",
                }}
              >
                Qwen2.5-1.5B-Indo-Text2SQL
              </h3>
              <p
                className="hf-card-desc"
                style={{
                  fontSize: "13px",
                  color: "var(--muted)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                The baseline fine-tuning release trained on paired Indonesian database queries, demonstrating initial sequence-to-sequence translation accuracy.
              </p>
            </div>
            <div
              className="hf-card-link"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--sea-700)",
                marginTop: "12px",
              }}
            >
              <span>View repository on Hugging Face</span>
              <ArrowUpRight size={15} />
            </div>
          </a>
        </div>
      </section>

      {/* Coming Soon Notice Banner */}
      <div
        className="sql-coming-soon-banner"
        style={{
          background: "#fffbeb",
          border: "1px solid #fde68a",
          borderRadius: "14px",
          padding: "16px 20px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "flex-start",
          gap: "14px",
          color: "#92400e",
        }}
      >
        <Info size={20} color="#d97706" style={{ flexShrink: 0, marginTop: "2px" }} />
        <div>
          <strong style={{ display: "block", fontSize: "14px", fontWeight: 700, marginBottom: "3px", color: "#92400e" }}>
            Live Inference Coming Soon
          </strong>
          <p style={{ fontSize: "13px", lineHeight: 1.55, margin: 0, color: "#b45309" }}>
            Direct browser inference connected to a hosted endpoint is currently under deployment. In the meantime, you can explore the model cards on Hugging Face above or inspect curated query-generation samples below.
          </p>
        </div>
      </div>

      {/* Query Input Section */}
      <section className="sql-query-card">
        <div className="sql-section-kicker">
          <span>02</span> Natural Language Query Sample
        </div>
        <form onSubmit={handleSubmit}>
          <textarea
            aria-label="Database question"
            className="sql-question-input"
            onChange={(event) => {
              setQuestion(event.target.value);
              setNotice(null);
            }}
            placeholder="Type a natural language query (e.g., Tampilkan karyawan divisi IT dengan gaji di atas 10 juta)..."
            value={question}
          />
          <div className="sql-query-footer">
            <span className="sql-hint">
              <ChevronRight size={14} /> Validated for read-only SELECT queries
            </span>
            <button className="sql-run-button" type="submit">
              <Play size={15} />
              Run Query (Coming Soon)
            </button>
          </div>
        </form>

        {notice && (
          <div className="sql-interactive-notice">
            <Info size={15} />
            <span>{notice}</span>
          </div>
        )}

        {/* Suggestions Bar */}
        <div className="sql-suggestions">
          <span>Try a curated sample:</span>
          {sampleQueries.map((sample, idx) => (
            <button
              key={idx}
              className={selectedSample?.question === sample.question ? "active" : ""}
              onClick={() => handleSelectSample(sample)}
              type="button"
            >
              {sample.question}
            </button>
          ))}
        </div>
      </section>

      {/* Output Results Section */}
      {selectedSample && (
        <section className="sql-results" aria-live="polite">
          <div className="sql-section-kicker">
            <span>03</span> Model Output & Schema Execution Preview
          </div>

          <div className="sql-code-card">
            <div className="sql-card-heading">
              <span>Generated SQL Statement (Qwen2.5-1.5B-Indo-Text2SQL)</span>
              <CheckCircle2 size={16} />
            </div>
            <pre>
              <code>{selectedSample.sql}</code>
            </pre>
          </div>

          {selectedSample.data && selectedSample.data.length > 0 && (
            <div className="sql-table-card">
              <div className="sql-card-heading">
                <span>Sample Data Rows Returned</span>
                <strong>{selectedSample.data.length}</strong>
              </div>
              <div className="sql-table-wrap">
                <table>
                  <thead>
                    <tr>
                      {columns.map((column) => (
                        <th key={column}>{column.replaceAll("_", " ")}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSample.data.map((row, index) => (
                      <tr key={index}>
                        {columns.map((column) => (
                          <td key={column}>{String(row[column] ?? "—")}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
