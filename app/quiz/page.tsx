"use client";

import { useState } from "react";

export default function QuizPage() {
  const [form, setForm] = useState({
    goals: [] as string[],
    diagnoses: [] as string[],
    symptoms: [] as string[],
    labs: {} as Record<string, any>,
    protocol: "flexible",
    exclusions: [] as string[],
    mealsPerDay: 3,
    snacks: true,
    fasting: false,
  });

  async function submit() {
    const res = await fetch("/api/quiz/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    // store in local state, supabase, or redirect with id
    console.log(data);
  }

  return (
    <section style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <h1>Quiz</h1>
      <p>Replace this with your stepper UI. This is wired to scoring API.</p>
      <button onClick={submit}>Submit Quiz</button>
    </section>
  );
}
