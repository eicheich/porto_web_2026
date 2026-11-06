"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  AlertCircle,
  Bath,
  BedDouble,
  Building2,
  Calculator,
  Car,
  CheckCircle2,
  Home,
  Layers,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import type { DemoMetadata } from "../types";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
).replace(/\/+$/, "");

type HouseFormValues = {
  LB: string;
  LT: string;
  KT: string;
  KM: string;
  GRS: string;
};

type ValidationErrorItem = {
  loc?: (string | number)[];
  msg?: string;
};

const INITIAL_VALUES: HouseFormValues = {
  LB: "120",
  LT: "150",
  KT: "3",
  KM: "2",
  GRS: "1",
};

const PRESETS: { label: string; values: HouseFormValues }[] = [
  {
    label: "Type 45 Compact",
    values: { LB: "45", LT: "72", KT: "2", KM: "1", GRS: "1" },
  },
  {
    label: "Type 120 Family",
    values: { LB: "120", LT: "150", KT: "3", KM: "2", GRS: "1" },
  },
  {
    label: "Type 250 Executive",
    values: { LB: "250", LT: "300", KT: "4", KM: "3", GRS: "2" },
  },
];

export function formatRupiah(amount: number): string {
  const formatted = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
  return `Rp ${formatted}`;
}

export function HousePricePredictorDemo() {
  const [form, setForm] = useState<HouseFormValues>(INITIAL_VALUES);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof HouseFormValues, string>>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    estimasi_harga: number;
    status: string;
    payload: { LB: number; LT: number; KT: number; KM: number; GRS: number };
  } | null>(null);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE_URL}/`, { method: "GET" })
      .then((res) => {
        if (active) setApiOnline(res.ok);
      })
      .catch(() => {
        if (active) setApiOnline(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleChange = (field: keyof HouseFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    setError(null);
  };

  const validateClient = (): {
    valid: boolean;
    parsed?: { LB: number; LT: number; KT: number; KM: number; GRS: number };
  } => {
    const errors: Partial<Record<keyof HouseFormValues, string>> = {};

    const lb = Number(form.LB);
    if (form.LB.trim() === "" || Number.isNaN(lb) || lb <= 0) {
      errors.LB = "Building area (LB) is required and must be greater than 0.";
    }

    const lt = Number(form.LT);
    if (form.LT.trim() === "" || Number.isNaN(lt) || lt <= 0) {
      errors.LT = "Land area (LT) is required and must be greater than 0.";
    }

    const kt = Number(form.KT);
    if (form.KT.trim() === "" || Number.isNaN(kt) || !Number.isInteger(kt) || kt < 0) {
      errors.KT = "Bedrooms (KT) must be a whole number (0 or more).";
    }

    const km = Number(form.KM);
    if (form.KM.trim() === "" || Number.isNaN(km) || !Number.isInteger(km) || km < 0) {
      errors.KM = "Bathrooms (KM) must be a whole number (0 or more).";
    }

    const grs = Number(form.GRS);
    if (form.GRS.trim() === "" || Number.isNaN(grs) || !Number.isInteger(grs) || grs < 0) {
      errors.GRS = "Garage capacity (GRS) must be a whole number (0 or more).";
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setError("Please fix the highlighted input fields before calculating.");
      return { valid: false };
    }

    return {
      valid: true,
      parsed: {
        LB: lb,
        LT: lt,
        KT: kt,
        KM: km,
        GRS: grs,
      },
    };
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const check = validateClient();
    if (!check.valid || !check.parsed) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/predict-house-pricing`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(check.parsed),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data && typeof data.estimasi_harga === "number") {
        setResult({
          estimasi_harga: data.estimasi_harga,
          status: data.status || "sukses",
          payload: check.parsed,
        });
        setApiOnline(true);
        return;
      }

      if (response.status === 422 && data?.detail) {
        if (Array.isArray(data.detail)) {
          const nextFieldErrors: Partial<Record<keyof HouseFormValues, string>> = {};
          const messages = (data.detail as ValidationErrorItem[]).map((item) => {
            const fieldName = item.loc?.[item.loc.length - 1];
            const msg = item.msg || "Invalid value";
            if (
              typeof fieldName === "string" &&
              ["LB", "LT", "KT", "KM", "GRS"].includes(fieldName)
            ) {
              nextFieldErrors[fieldName as keyof HouseFormValues] = msg;
            }
            return fieldName ? `${fieldName}: ${msg}` : msg;
          });
          setFieldErrors(nextFieldErrors);
          setError(`Validation error (422): ${messages.join(" • ")}`);
        } else {
          setError(`Validation error (422): ${String(data.detail)}`);
        }
        return;
      }

      if (response.status >= 500) {
        const serverMsg =
          typeof data?.detail === "string"
            ? data.detail
            : "Internal server error occurred while predicting house price.";
        setError(`Server error (${response.status}): ${serverMsg}`);
        return;
      }

      setError(
        typeof data?.detail === "string"
          ? data.detail
          : `Unexpected response (HTTP ${response.status}).`
      );
    } catch (err) {
      console.warn("House pricing API unreachable:", err);
      setApiOnline(false);
      setError(
        "The FastAPI inference server is currently unreachable. Please ensure the backend service is running and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ LB: "", LT: "", KT: "", KM: "", GRS: "" });
    setFieldErrors({});
    setError(null);
    setResult(null);
  };

  const applyPreset = (values: HouseFormValues) => {
    setForm(values);
    setFieldErrors({});
    setError(null);
  };

  return (
    <div className="classifier-studio-wrap">
      {/* Top Status Bar */}
      <div className="classifier-topbar">
        <div className="model-status-indicator">
          <span className="status-dot-pulse" />
          <span>
            {apiOnline === false
              ? "Regression Studio • Waiting for Backend"
              : "Regression Model Ready • IDR Valuation"}
          </span>
        </div>
        <div className="classifier-spec-tags">
          <span>5 Property Features (LB, LT, KT, KM, GRS)</span>
          <span className="dot-sep">•</span>
          <span>Output: IDR (Rp)</span>
        </div>
      </div>

      {/* Main 2-Column Studio Grid */}
      <div className="classifier-grid">
        {/* Left Column: Input Form */}
        <div className="classifier-col-input">
          <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-[#d9edf0] bg-[#f9fdfe] p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="m-0 text-base font-bold text-[#0b3c4f]">Property Specifications</h3>
                <p className="m-0 mt-1 text-xs text-[#5b7a86]">
                  Enter the building, land, and room specifications below.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => applyPreset(preset.values)}
                    className="rounded-full border border-[#bfe8ee] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0e7c91] transition hover:border-[#1fb5c9] hover:bg-[#e8f8fa]"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* LB: Building Area */}
              <div>
                <label htmlFor="input-LB" className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[#0b3c4f]">
                  <Building2 size={14} className="text-[#0e7c91]" />
                  Building Area (LB) <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    id="input-LB"
                    type="number"
                    step="any"
                    min="1"
                    placeholder="e.g. 120"
                    value={form.LB}
                    onChange={(e) => handleChange("LB", e.target.value)}
                    className={`w-full rounded-xl border bg-white py-2.5 pl-3.5 pr-12 text-sm font-medium text-[#0b3c4f] outline-none transition ${
                      fieldErrors.LB
                        ? "border-red-400 focus:border-red-500"
                        : "border-[#cfe7ec] focus:border-[#1fb5c9]"
                    }`}
                  />
                  <span className="pointer-events-none absolute right-3 rounded-md bg-[#eef8fa] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#0e7c91]">
                    m²
                  </span>
                </div>
                {fieldErrors.LB && <p className="mt-1 text-[11px] font-medium text-red-600">{fieldErrors.LB}</p>}
              </div>

              {/* LT: Land Area */}
              <div>
                <label htmlFor="input-LT" className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[#0b3c4f]">
                  <Layers size={14} className="text-[#0e7c91]" />
                  Land Area (LT) <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    id="input-LT"
                    type="number"
                    step="any"
                    min="1"
                    placeholder="e.g. 150"
                    value={form.LT}
                    onChange={(e) => handleChange("LT", e.target.value)}
                    className={`w-full rounded-xl border bg-white py-2.5 pl-3.5 pr-12 text-sm font-medium text-[#0b3c4f] outline-none transition ${
                      fieldErrors.LT
                        ? "border-red-400 focus:border-red-500"
                        : "border-[#cfe7ec] focus:border-[#1fb5c9]"
                    }`}
                  />
                  <span className="pointer-events-none absolute right-3 rounded-md bg-[#eef8fa] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#0e7c91]">
                    m²
                  </span>
                </div>
                {fieldErrors.LT && <p className="mt-1 text-[11px] font-medium text-red-600">{fieldErrors.LT}</p>}
              </div>

              {/* KT: Bedrooms */}
              <div>
                <label htmlFor="input-KT" className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[#0b3c4f]">
                  <BedDouble size={14} className="text-[#0e7c91]" />
                  Bedrooms (KT) <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    id="input-KT"
                    type="number"
                    step="1"
                    min="0"
                    placeholder="e.g. 3"
                    value={form.KT}
                    onChange={(e) => handleChange("KT", e.target.value)}
                    className={`w-full rounded-xl border bg-white py-2.5 pl-3.5 pr-16 text-sm font-medium text-[#0b3c4f] outline-none transition ${
                      fieldErrors.KT
                        ? "border-red-400 focus:border-red-500"
                        : "border-[#cfe7ec] focus:border-[#1fb5c9]"
                    }`}
                  />
                  <span className="pointer-events-none absolute right-3 rounded-md bg-[#eef8fa] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#0e7c91]">
                    rooms
                  </span>
                </div>
                {fieldErrors.KT && <p className="mt-1 text-[11px] font-medium text-red-600">{fieldErrors.KT}</p>}
              </div>

              {/* KM: Bathrooms */}
              <div>
                <label htmlFor="input-KM" className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[#0b3c4f]">
                  <Bath size={14} className="text-[#0e7c91]" />
                  Bathrooms (KM) <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    id="input-KM"
                    type="number"
                    step="1"
                    min="0"
                    placeholder="e.g. 2"
                    value={form.KM}
                    onChange={(e) => handleChange("KM", e.target.value)}
                    className={`w-full rounded-xl border bg-white py-2.5 pl-3.5 pr-16 text-sm font-medium text-[#0b3c4f] outline-none transition ${
                      fieldErrors.KM
                        ? "border-red-400 focus:border-red-500"
                        : "border-[#cfe7ec] focus:border-[#1fb5c9]"
                    }`}
                  />
                  <span className="pointer-events-none absolute right-3 rounded-md bg-[#eef8fa] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#0e7c91]">
                    rooms
                  </span>
                </div>
                {fieldErrors.KM && <p className="mt-1 text-[11px] font-medium text-red-600">{fieldErrors.KM}</p>}
              </div>

              {/* GRS: Garage Capacity */}
              <div className="sm:col-span-2">
                <label htmlFor="input-GRS" className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[#0b3c4f]">
                  <Car size={14} className="text-[#0e7c91]" />
                  Garage Capacity (GRS) <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    id="input-GRS"
                    type="number"
                    step="1"
                    min="0"
                    placeholder="e.g. 1"
                    value={form.GRS}
                    onChange={(e) => handleChange("GRS", e.target.value)}
                    className={`w-full rounded-xl border bg-white py-2.5 pl-3.5 pr-16 text-sm font-medium text-[#0b3c4f] outline-none transition ${
                      fieldErrors.GRS
                        ? "border-red-400 focus:border-red-500"
                        : "border-[#cfe7ec] focus:border-[#1fb5c9]"
                    }`}
                  />
                  <span className="pointer-events-none absolute right-3 rounded-md bg-[#eef8fa] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#0e7c91]">
                    cars
                  </span>
                </div>
                {fieldErrors.GRS && <p className="mt-1 text-[11px] font-medium text-red-600">{fieldErrors.GRS}</p>}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#0b3c4f] px-5 py-3 text-xs font-bold tracking-wider text-white uppercase transition hover:bg-[#0e7c91] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Calculating Estimate...
                  </>
                ) : (
                  <>
                    <Calculator size={15} />
                    Predict House Price
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#cfe7ec] bg-white px-4 py-3 text-xs font-bold text-[#315a67] transition hover:border-[#1fb5c9] hover:text-[#0b3c4f] disabled:opacity-50"
              >
                <RefreshCw size={14} />
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Result / Loading / Error / Empty State */}
        <div className="classifier-col-output">
          {loading ? (
            <div className="state-card loading-state-card">
              <div className="scanner-ring">
                <Sparkles size={26} className="spin" />
              </div>
              <h4>Running Valuation Model...</h4>
              <p>Evaluating building area, land size, and room configuration against trained housing regression weights.</p>
              <div className="shimmer-bar" />
            </div>
          ) : error ? (
            <div className="state-card error-state-card">
              <div className="error-icon-wrap">
                <AlertCircle size={26} />
              </div>
              <h4>Prediction Failed</h4>
              <p>{error}</p>
              <button type="button" className="retry-btn" onClick={() => setError(null)}>
                <RefreshCw size={14} /> Dismiss & Edit Inputs
              </button>
            </div>
          ) : result ? (
            <div className="state-card result-state-card">
              <div className="result-header-badge">
                <CheckCircle2 size={15} />
                <span>Valuation Complete ({result.status})</span>
              </div>

              <div className="result-main-box">
                <span className="result-kicker">Estimated Market Price</span>
                <div className="mt-2 text-2xl font-extrabold tracking-tight text-[#0b3c4f] sm:text-3xl">
                  {formatRupiah(result.estimasi_harga)}
                </div>
                <p className="mt-1.5 mb-0 font-mono text-xs text-[#0e7c91]">
                  ≈ {formatRupiah(result.estimasi_harga / result.payload.LB)} / m² building
                </p>
              </div>

              <div className="prob-breakdown">
                <div className="prob-breakdown-head">
                  <span>Submitted Property Profile</span>
                  <span>5 features</span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
                  <div className="rounded-xl border border-[#d9edf0] bg-[#f3fafb] p-2.5">
                    <span className="block text-[10px] uppercase text-[#5b7a86]">Building (LB)</span>
                    <strong className="text-sm text-[#0b3c4f]">{result.payload.LB} m²</strong>
                  </div>
                  <div className="rounded-xl border border-[#d9edf0] bg-[#f3fafb] p-2.5">
                    <span className="block text-[10px] uppercase text-[#5b7a86]">Land (LT)</span>
                    <strong className="text-sm text-[#0b3c4f]">{result.payload.LT} m²</strong>
                  </div>
                  <div className="rounded-xl border border-[#d9edf0] bg-[#f3fafb] p-2.5">
                    <span className="block text-[10px] uppercase text-[#5b7a86]">Bedrooms (KT)</span>
                    <strong className="text-sm text-[#0b3c4f]">{result.payload.KT}</strong>
                  </div>
                  <div className="rounded-xl border border-[#d9edf0] bg-[#f3fafb] p-2.5">
                    <span className="block text-[10px] uppercase text-[#5b7a86]">Bathrooms (KM)</span>
                    <strong className="text-sm text-[#0b3c4f]">{result.payload.KM}</strong>
                  </div>
                  <div className="rounded-xl border border-[#d9edf0] bg-[#f3fafb] p-2.5">
                    <span className="block text-[10px] uppercase text-[#5b7a86]">Garage (GRS)</span>
                    <strong className="text-sm text-[#0b3c4f]">{result.payload.GRS} cars</strong>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#cfe7ec] bg-[#f3fafb] py-2.5 text-xs font-bold text-[#0e7c91] transition hover:bg-[#e3f5f8]"
              >
                <RefreshCw size={14} /> Calculate Another Property
              </button>
            </div>
          ) : (
            <div className="state-card empty-state-card">
              <div className="empty-icon-wrap">
                <Home size={28} />
              </div>
              <h4>Ready to Estimate</h4>
              <p>
                Fill in the 5 property features on the left and click <strong>Predict House Price</strong> to get an instant valuation in Indonesian Rupiah (IDR).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const housePriceMetadata: DemoMetadata = {
  slug: "house-price-predictor",
  title: "House Pricing Calculator",
  description:
    "Estimate residential property prices in Indonesian Rupiah (IDR) from building area (LB), land area (LT), bedrooms (KT), bathrooms (KM), and garage capacity (GRS).",
  tags: ["Regression", "Real Estate Valuation", "FastAPI"],
  category: "Classical ML",
  thumbnail: "linear-gradient(135deg, #d4f5e9, #6ad5cb)",
  architecture: "Supervised Tabular Regression (Scikit-Learn / FastAPI)",
  dataset: "Indonesian Residential Property Listings (LB, LT, KT, KM, GRS)",
  accuracy: "R² > 0.85 on validation split",
  component: HousePricePredictorDemo,
  steps: [
    {
      num: "01",
      title: "Feature Validation",
      desc: "Validates building area (LB > 0), land size (LT > 0), bedroom/bathroom counts, and garage capacity before sending the payload.",
    },
    {
      num: "02",
      title: "Regression Inference",
      desc: "Sends a structured JSON payload to the FastAPI model endpoint (/predict-house-pricing) to compute the predicted market value.",
    },
    {
      num: "03",
      title: "IDR Valuation Output",
      desc: "Formats the predicted price into Indonesian Rupiah (IDR) alongside a per-square-meter building valuation breakdown.",
    },
  ],
};

