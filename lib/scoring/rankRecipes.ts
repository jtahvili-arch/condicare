import { Recipe, QuizInput } from "./types";
import { scoreQuiz } from "./scoreQuiz";
import { scoreRecipe } from "./scoreRecipe";

export function rankRecipes(recipes: Recipe[], quiz: QuizInput) {
  const { trackScores, primary, secondary } = scoreQuiz(quiz);
  const ctx = { trackScores, primary, secondary, user: quiz };

  const scored = recipes
    .map(r => ({ recipe: r, ...scoreRecipe(r, ctx) }))
    .filter(x => Number.isFinite(x.score))
    .sort((a, b) => b.score - a.score);

  return { primary, secondary, trackScores, items: scored };
}
