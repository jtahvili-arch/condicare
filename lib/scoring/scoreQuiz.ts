import { QuizInput, TrackKey } from "./types";

type TrackScores = Record<TrackKey, number>;

const baseScores = (): TrackScores => ({
  insulin_resistance: 0,
  type2_diabetes: 0,
  metabolic_syndrome: 0,
  fatty_liver: 0,
  pcos: 0,
  hypothyroid_support: 0,
  cortisol_sleep: 0,
  adrenal_insufficiency: 0,
  cushings_support: 0,
  cah_support: 0,
});

export function scoreQuiz(input: QuizInput) {
  const s = baseScores();

  // Diagnoses (strong signals)
  for (const d of input.diagnoses) {
    if (d === "insulin_resistance") s.insulin_resistance += 12;
    if (d === "type2_diabetes") s.type2_diabetes += 14;
    if (d === "metabolic_syndrome") s.metabolic_syndrome += 12;
    if (d === "fatty_liver") s.fatty_liver += 12;
    if (d === "pcos") s.pcos += 12;
    if (d === "hypothyroidism") s.hypothyroid_support += 10;
    if (d === "adrenal_insufficiency") s.adrenal_insufficiency += 12;
    if (d === "cushings") s.cushings_support += 12;
    if (d === "cah") s.cah_support += 12;
  }

  // Symptoms (medium signals)
  for (const sym of input.symptoms) {
    if (sym === "afternoon_crash") { s.insulin_resistance += 5; s.cortisol_sleep += 3; }
    if (sym === "sugar_cravings") { s.insulin_resistance += 6; s.type2_diabetes += 3; }
    if (sym === "poor_sleep") { s.cortisol_sleep += 7; s.insulin_resistance += 2; }
    if (sym === "wired_tired") { s.cortisol_sleep += 7; }
    if (sym === "central_weight") { s.insulin_resistance += 4; s.metabolic_syndrome += 4; s.fatty_liver += 3; }
    if (sym === "brain_fog") { s.cortisol_sleep += 3; s.hypothyroid_support += 2; }
    if (sym === "cold_sensitive") { s.hypothyroid_support += 6; }
    if (sym === "irregular_cycles") { s.pcos += 6; }
    if (sym === "high_stress") { s.cortisol_sleep += 6; }
    if (sym === "digestive_discomfort") { /* not a track; used later for exclusions */ }
  }

  // Labs (optional, high value if present)
  const a1c = asNum(input.labs?.a1c);
  if (a1c !== null) {
    if (a1c >= 6.5) s.type2_diabetes += 14;
    else if (a1c >= 5.7) s.insulin_resistance += 12;
  }

  const fastingGlucose = asNum(input.labs?.fasting_glucose);
  if (fastingGlucose !== null) {
    if (fastingGlucose >= 126) s.type2_diabetes += 12;
    else if (fastingGlucose >= 100) s.insulin_resistance += 10;
  }

  const tg = asNum(input.labs?.triglycerides);
  const hdl = asNum(input.labs?.hdl);
  if (tg !== null && tg >= 150) { s.metabolic_syndrome += 8; s.fatty_liver += 6; }
  if (hdl !== null && ((input.labs?.sex === "male" && hdl < 40) || (input.labs?.sex === "female" && hdl < 50))) {
    s.metabolic_syndrome += 6;
  }

  const alt = asNum(input.labs?.alt);
  const ast = asNum(input.labs?.ast);
  if ((alt !== null && alt > 35) || (ast !== null && ast > 35)) s.fatty_liver += 8;

  const tsh = asNum(input.labs?.tsh);
  if (tsh !== null && tsh > 4) s.hypothyroid_support += 8;

  // Goals (light signals)
  for (const g of input.goals) {
    if (g === "better_blood_sugar") { s.insulin_resistance += 4; s.type2_diabetes += 3; }
    if (g === "weight_loss") { s.metabolic_syndrome += 3; s.fatty_liver += 3; }
    if (g === "better_sleep") { s.cortisol_sleep += 4; }
    if (g === "hormone_balance") { s.pcos += 3; s.cortisol_sleep += 2; }
    if (g === "steady_energy") { s.insulin_resistance += 2; s.cortisol_sleep += 2; s.hypothyroid_support += 1; }
  }

  // Determine primary + secondary tracks
  const sorted = Object.entries(s).sort((a, b) => b[1] - a[1]) as [TrackKey, number][];
  const primary = sorted[0]?.[0] ?? "insulin_resistance";
  const secondary = sorted[1]?.[0] ?? "cortisol_sleep";

  return { trackScores: s, primary, secondary };
}

function asNum(v: any): number | null {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
