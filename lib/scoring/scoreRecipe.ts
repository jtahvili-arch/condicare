import { QuizInput, Recipe, TrackKey } from "./types";

type ScoreContext = {
  trackScores: Record<TrackKey, number>;
  primary: TrackKey;
  secondary: TrackKey;
  user: QuizInput;
};

export function scoreRecipe(recipe: Recipe, ctx: ScoreContext) {
  // 1) Hard filters (protocol + exclusions)
  const protocolOK = ctx.user.protocol === "flexible" || recipe.protocols.includes(ctx.user.protocol);
  if (!protocolOK) return { score: -Infinity, reasons: ["protocol_mismatch"] };

  const userEx = new Set((ctx.user.exclusions || []).map(x => x.toLowerCase()));
  const recipeContains = new Set((recipe.exclusions || []).map(x => x.toLowerCase()));
  for (const ex of userEx) {
    // If recipe contains an excluded item, reject
    if (recipeContains.has(ex)) return { score: -Infinity, reasons: ["exclusion_conflict:" + ex] };
  }

  // 2) Track match score (dominant component)
  // Normalize trackScores into weights; primary/secondary get a boost.
  const raw = ctx.trackScores;
  const total = Object.values(raw).reduce((a, b) => a + Math.max(0, b), 0) || 1;

  const trackWeight = (k: TrackKey) => {
    const base = Math.max(0, raw[k]) / total; // 0..1
    const boost = k === ctx.primary ? 0.20 : k === ctx.secondary ? 0.10 : 0;
    return base + boost;
  };

  // Weighted dot product: recipe trackWeights(0..5) × user track weights
  let trackScore = 0;
  let trackExplain: string[] = [];
  for (const k of Object.keys(raw) as TrackKey[]) {
    const rw = recipe.trackWeights?.[k] ?? 0;
    if (rw <= 0) continue;
    const tw = trackWeight(k);
    trackScore += rw * tw;
    if (k === ctx.primary && rw >= 3) trackExplain.push(`strong_primary_match:${k}:${rw}`);
    if (k === ctx.secondary && rw >= 3) trackExplain.push(`strong_secondary_match:${k}:${rw}`);
  }

  // 3) Macro heuristics by track (small nudges, not medical rules)
  const macroBonus = scoreMacroHeuristics(recipe, ctx);

  // 4) Variety/prep-time nudges (optional, keep light)
  const convenienceBonus = (recipe.tags?.includes("quick") ? 0.15 : 0);

  const final = trackScore + macroBonus + convenienceBonus;
  return { score: final, reasons: [...trackExplain, ...macroBonusReasons(recipe, ctx)] };
}

function scoreMacroHeuristics(recipe: Recipe, ctx: ScoreContext) {
  let bonus = 0;

  // If primary is insulin resistance or T2D, prefer lower carbs + higher protein
  if (ctx.primary === "insulin_resistance" || ctx.primary === "type2_diabetes" || ctx.secondary === "type2_diabetes") {
    if (recipe.netCarbBucket === "very_low") bonus += 0.6;
    else if (recipe.netCarbBucket === "low") bonus += 0.35;

    if (recipe.proteinLevel === "high") bonus += 0.25;
    if (recipe.fiberLevel === "high") bonus += 0.15;
  }

  // Fatty liver: fiber + lean-ish patterns (we only have buckets)
  if (ctx.primary === "fatty_liver" || ctx.secondary === "fatty_liver") {
    if (recipe.fiberLevel === "high") bonus += 0.25;
    if (recipe.netCarbBucket !== "moderate") bonus += 0.10;
  }

  // Cortisol/sleep: steady meals, avoid “very low carb” bias (some users feel worse)
  // We don't block; we gently prefer low/moderate unless user chose keto.
  if (ctx.primary === "cortisol_sleep" || ctx.secondary === "cortisol_sleep") {
    if (ctx.user.protocol !== "keto") {
      if (recipe.netCarbBucket === "low") bonus += 0.15;
      if (recipe.netCarbBucket === "moderate") bonus += 0.10;
    }
    if (recipe.sodiumLevel === "medium") bonus += 0.05;
  }

  // Adrenal insufficiency support: gentle nudge to sodium medium/high (educational)
  if (ctx.primary === "adrenal_insufficiency" || ctx.secondary === "adrenal_insufficiency") {
    if (recipe.sodiumLevel === "medium") bonus += 0.15;
    if (recipe.sodiumLevel === "high") bonus += 0.20;
  }

  return bonus;
}

function macroBonusReasons(recipe: Recipe, ctx: ScoreContext): string[] {
  const reasons: string[] = [];
  if (ctx.primary === "insulin_resistance" || ctx.primary === "type2_diabetes") {
    if (recipe.netCarbBucket === "very_low") reasons.push("low_carb_support");
    if (recipe.proteinLevel === "high") reasons.push("higher_protein_support");
  }
  if (ctx.primary === "fatty_liver" && recipe.fiberLevel === "high") reasons.push("fiber_support");
  if ((ctx.primary === "adrenal_insufficiency") && (recipe.sodiumLevel === "medium" || recipe.sodiumLevel === "high")) {
    reasons.push("electrolyte_support");
  }
  return reasons;
}
