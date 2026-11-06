import { digitMetadata } from "./demos/handwritten-digit-recognizer";
import { dogCatMetadata } from "./demos/dog-cat-classifier";
import { housePriceMetadata } from "./demos/house-price-predictor";
import { imageClassifierMetadata } from "./demos/image-classifier";
import { regressionMetadata } from "./demos/regression-visualizer";
import { sentimentMetadata } from "./demos/sentiment-analysis";
import type { HowItWorksStep } from "./demos/types";

export type DemoInfo = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  category: "Vision" | "NLP" | "Classical ML";
  thumbnail: string;
  architecture: string;
  dataset: string;
  accuracy: string;
  howItWorks?: string;
  steps?: HowItWorksStep[];
};

export const demoData: DemoInfo[] = [
  {
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
  },
  {
    slug: "dog-cat-classifier",
    title: "Dog vs Cat Classifier",
    description:
      "Test computer vision in recognizing dogs or cats instantly. Similar architectures power pet adoption platforms, automatic photo sorting, and veterinary monitoring workflows.",
    tags: ["Computer Vision", "Pet Recognition", "Multi-class Classification"],
    category: "Vision",
    thumbnail: "linear-gradient(135deg, #c5f1f7, #66d1e0)",
    architecture: "Custom CNN (TensorFlow / Keras)",
    dataset: "Oxford-IIIT Pet & Dogs vs Cats Dataset",
    accuracy: "~74% Validation Accuracy (5 Epochs baseline)",
    steps: [
      {
        num: "01",
        title: "Upload & Preprocessing",
        desc: "Input photos are normalized and resized to a standard 150×150 resolution before entering the neural network layers.",
      },
      {
        num: "02",
        title: "Feature Extraction",
        desc: "Convolutional layers extract key discriminative patterns, from fur textures to ear contours and muzzle shapes.",
      },
      {
        num: "03",
        title: "Confidence Scoring",
        desc: "Output layer probabilities evaluate whether the visual features most closely correspond to a dog, cat, or other subject.",
      },
    ],
  },
  {
    slug: "image-classifier",
    title: "Image Classifier",
    description: "Upload a photo and see a small top-k prediction panel appear in the browser.",
    tags: ["Vision", "Top-k predictions"],
    category: "Vision",
    thumbnail: "linear-gradient(135deg, #d9f2f5, #7fd6e0)",
    architecture: "MobileNet-style image encoder",
    dataset: "Placeholder garden + coastal set",
    accuracy: "91% top-3",
  },
  {
    slug: "sentiment-analysis",
    title: "Text Sentiment",
    description: "Type a short phrase and watch the model estimate positive or negative tone.",
    tags: ["NLP", "Text classification"],
    category: "NLP",
    thumbnail: "linear-gradient(135deg, #f4ecd8, #e0cb8f)",
    architecture: "DistilBERT-style sequence classifier",
    dataset: "Product & feedback reviews",
    accuracy: "88% test accuracy",
  },
  {
    slug: "handwritten-digit-recognizer",
    title: "Digit Recognizer",
    description: "Draw a single digit in the grid and see the top predicted number in real time.",
    tags: ["Vision", "Interactive canvas"],
    category: "Vision",
    thumbnail: "linear-gradient(135deg, #e3f2fd, #90caf9)",
    architecture: "Small convolutional net (MNIST style)",
    dataset: "MNIST handwritten digits",
    accuracy: "99.1% test accuracy",
  },
  {
    slug: "regression-visualizer",
    title: "Regression Studio",
    description: "Drag a few target points and watch the fitted trendline respond immediately.",
    tags: ["Classical ML", "Trend fitting"],
    category: "Classical ML",
    thumbnail: "linear-gradient(135deg, #fce4ec, #f48fb1)",
    architecture: "Polynomial ridge regression",
    dataset: "Interactive synthetic points",
    accuracy: "Direct MSE minimization",
  },
];

export const demos = [
  housePriceMetadata,
  dogCatMetadata,
  imageClassifierMetadata,
  sentimentMetadata,
  digitMetadata,
  regressionMetadata,
] as const;

export function getDemo(slug: string): DemoInfo | undefined {
  return demoData.find((demo) => demo.slug === slug);
}
