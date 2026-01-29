import { Recipe, QuizInput } from "./types";
import { rankRecipes } from "./rankRecipes";

type MealSlot = "breakfast" | "lunch" | "dinner" | "snack";

export function generate7DayPlan(recipes: Recipe[], quiz: QuizInput) {
  const ranked = rankRecipes(recipes, quiz).items.map(x => x.recipe);

  // naive buckets based on tags; you can replace with recipe.mealType field
  const byType = {
    breakfast: ranked.filter(r => r.tags?.includes("breakfast")),
    lunch: ranked.filter(r => r.tags?.includes("lunch")),
    dinner: ranked.filter(r => r.tags?.includes("dinner")),
    snack: ranked.filter(r => r.tags?.includes("snack")),
  };

  const plan: Record<string, Partial<Record<MealSlot, Recipe>>> = {};
  for (let day = 1; day <= 7; day++) {
    plan[`day${day}`] = {
      breakfast: pickDistinct(byType.breakfast, day),
      lunch: pickDistinct(byType.lunch, day),
      dinner: pickDistinct(byType.dinner, day),
      ...(quiz.snacks ? { snack: pickDistinct(byType.snack, day) } : {}),
    };
  }

  return plan;
}

function pickDistinct(list: Recipe[], seed: number) {
  if (list.length === 0) return undefined;
  return list[(seed - 1) % list.length];
}
