import Link from "next/link";

export default function HomePage() {
  return (
    <section style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <h1>Personalized meals and habits for metabolic and adrenal balance</h1>
      <p>Recipes + 7-day meal plans tailored to your condition and eating style.</p>
      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <Link href="/quiz">Start free 7-day trial</Link>
        <Link href="/pricing">View pricing</Link>
      </div>
    </section>
  );
}
