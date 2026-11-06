export function analyzeSentiment(text: string) {
  const positive = ["love", "great", "joy", "good", "helpful", "excited", "beautiful", "calm"];
  const negative = ["hate", "bad", "broken", "sad", "angry", "hard", "confusing", "worry"];
  const normalized = text.toLowerCase();
  const score = positive.filter((word) => normalized.includes(word)).length - negative.filter((word) => normalized.includes(word)).length;
  const label = score > 0 ? "Positive" : score < 0 ? "Needs care" : "Neutral";
  return { label, confidence: Math.min(0.98, 0.62 + Math.abs(score) * 0.1), note: label === "Neutral" ? "The language feels balanced or observational." : "The language carries a clear emotional signal." };
}

export function classifyImage(fileName: string) {
  const options = fileName.toLowerCase().includes("plant") ? [["houseplant", 0.91], ["leaf", 0.74], ["garden", 0.52]] : [["coastal scene", 0.88], ["landscape", 0.67], ["outdoor photo", 0.49]];
  return options.map(([label, confidence]) => ({ label: String(label), confidence: Number(confidence) }));
}
