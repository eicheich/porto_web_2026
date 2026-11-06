import type { ComponentType } from "react";

export type DemoCategory = "Vision" | "NLP" | "Classical ML";

export type HowItWorksStep = {
  num: string;
  title: string;
  desc: string;
};

export type DemoMetadata = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  category: DemoCategory;
  thumbnail: string;
  architecture: string;
  dataset: string;
  accuracy: string;
  component: ComponentType;
  howItWorks?: string;
  steps?: HowItWorksStep[];
};
