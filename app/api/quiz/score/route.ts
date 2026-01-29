import { NextResponse } from "next/server";
import { rankRecipes } from "@/lib/scoring/rankRecipes";
import type { QuizInput, Recipe } from "@/lib/scoring/types";

// TODO: replace with DB fetch
const SAMPLE_RECIPES: Recipe[] = [
  {
    id: "1",
    title: "Lemon Chicken Salad",
    protocols: ["keto", "paleo", "flexible"],
    exclusions: ["nuts"],
    netCarbBucket: "very_low",
    proteinLevel: "high",
    fiberLevel: "medium",
    sodiumLevel: "medium",
    trackWeights: { insulin_resistance: 5, type2_diabetes: 4, metabolic_syndrome: 3, fatty_liver: 3, cortisol_sleep: 2 },
    tags: ["quick"],
  },
];

export async function POST(req: Request) {
  const quiz = (await req.json()) as QuizInput;
  const ranked = rankRecipes(SAMPLE_RECIPES, quiz);
  return NextResponse.json(ranked);
}
