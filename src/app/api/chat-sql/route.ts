import { NextResponse } from "next/server";
import { Client } from "pg";

export const runtime = "nodejs";

const DB_SCHEMA = `
CREATE TABLE karyawan (id SERIAL PRIMARY KEY, nama VARCHAR(100), divisi VARCHAR(50), gaji INT, tanggal_masuk DATE);
CREATE TABLE produk (id SERIAL PRIMARY KEY, nama_produk VARCHAR(150), kategori VARCHAR(50), harga INT, stok INT);
CREATE TABLE transaksi (id SERIAL PRIMARY KEY, id_karyawan INT REFERENCES karyawan(id), id_produk INT REFERENCES produk(id), jumlah_beli INT, tanggal_transaksi DATE);
`;

export async function POST(req: Request) {
  let client: Client | undefined;

  try {
    const body = await req.json();
    const question = typeof body?.question === "string" ? body.question.trim() : "";
    if (!question) {
      return NextResponse.json({ error: "Pertanyaan tidak boleh kosong" }, { status: 400 });
    }

    const prompt = `<|im_start|>system
Kamu adalah AI spesialis PostgreSQL/SQL. Tugasmu adalah menulis query SQL yang tepat berdasarkan skema tabel yang diberikan.<|im_end|>
<|im_start|>user
Skema Tabel:
${DB_SCHEMA}

Pertanyaan:
${question}<|im_end|>
<|im_start|>assistant
`;

    if (!process.env.HF_API_URL) {
      return NextResponse.json({ error: "HF_API_URL belum dikonfigurasi di environment." }, { status: 500 });
    }

    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (process.env.HF_TOKEN) {
      headers.Authorization = `Bearer ${process.env.HF_TOKEN}`;
    }

    let hfResponse: Response;
    try {
      hfResponse = await fetch(process.env.HF_API_URL, {
        headers,
        method: "POST",
        body: JSON.stringify({
          inputs: prompt,
          parameters: { 
            max_new_tokens: 150, 
            return_full_text: false, 
            temperature: 0.1 
          },
          options: {
            wait_for_model: true // Meminta HF menunggu jika model sedang wake-up / cold boot
          }
        }),
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Koneksi ke Hugging Face gagal.";
      return NextResponse.json({
        error: `Model AI tidak dapat dihubungi: ${message}. Periksa koneksi internet/server dan HF_TOKEN.`,
      }, { status: 502 });
    }

    const responseText = await hfResponse.text();
    let hfData: any;
    try {
      hfData = JSON.parse(responseText);
    } catch {
      return NextResponse.json({
        error: `Model AI mengembalikan respons non-JSON (HTTP ${hfResponse.status}).`,
      }, { status: 502 });
    }

    // Tangani jika HF mengembalikan error object
    if (!hfResponse.ok || (typeof hfData === "object" && !Array.isArray(hfData) && hfData?.error)) {
      const errMsg = Array.isArray(hfData?.error) ? hfData.error.join(", ") : hfData?.error;
      return NextResponse.json({ 
        error: errMsg ?? `Model AI gagal merespons (HTTP ${hfResponse.status}).` 
      }, { status: 502 });
    }

    // Ambil text output dari array response HF
    const generatedText = Array.isArray(hfData) 
      ? hfData[0]?.generated_text 
      : (typeof hfData?.generated_text === "string" ? hfData.generated_text : "");

    let generatedSQL = (generatedText || "").trim();
    generatedSQL = `${generatedSQL.replace(/```sql/gi, "").replace(/```/g, "").split(";")[0].trim()};`;

    // Validasi Keamanan Query
    const upperSQL = generatedSQL.toUpperCase();
    if (!upperSQL.startsWith("SELECT") || /\b(DROP|DELETE|UPDATE|INSERT|ALTER|TRUNCATE|CREATE)\b/.test(upperSQL)) {
      return NextResponse.json({
        error: "Query tidak diizinkan demi keamanan (hanya perintah SELECT yang diperbolehkan).",
        sql: generatedSQL,
      }, { status: 403 });
    }

    // Eksekusi ke Supabase (PostgreSQL)
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "DATABASE_URL belum dikonfigurasi.", sql: generatedSQL }, { status: 500 });
    }

    client = new Client({ 
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false } // Supabase pooler memerlukan konfigurasi SSL aktif
    });

    try {
      await client.connect();
      const dbResult = await client.query(generatedSQL);
      return NextResponse.json({ sql: generatedSQL, data: dbResult.rows });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Eksekusi SQL gagal.";
      return NextResponse.json({ error: `Query gagal dijalankan di database: ${message}`, sql: generatedSQL }, { status: 502 });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan internal.";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    if (client) await client.end().catch(() => undefined);
  }
}