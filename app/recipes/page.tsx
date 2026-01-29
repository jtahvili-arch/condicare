"use client";
import { useEffect, useState } from "react";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/recipes/search", { method: "POST" })
      .then(r => r.json())
      .then(d => setRecipes(d.items ?? []));
  }, []);

  return (
    <section style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <h1>Recipes</h1>
      <ul>
        {recipes.map(r => (
          <li key={r.id}>
            <a href={`/recipes/${r.id}`}>{r.title}</a>
          </li>
        ))}
      </ul>
    </section>
  );
}
