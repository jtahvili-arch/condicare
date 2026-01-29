import { TrackKey } from "./types";

export const TRACKS: { key: TrackKey; label: string }[] = [
  { key: "insulin_resistance", label: "Insulin Resistance / Prediabetes" },
  { key: "type2_diabetes", label: "Type 2 Diabetes Support" },
  { key: "metabolic_syndrome", label: "Metabolic Syndrome" },
  { key: "fatty_liver", label: "Fatty Liver (MASLD/NAFLD)" },
  { key: "pcos", label: "PCOS" },
  { key: "hypothyroid_support", label: "Hypothyroidism Support" },
  { key: "cortisol_sleep", label: "Cortisol / Sleep Support" },
  { key: "adrenal_insufficiency", label: "Adrenal Insufficiency Support" },
  { key: "cushings_support", label: "Cushing’s Support" },
  { key: "cah_support", label: "CAH Support" },
];

export const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
