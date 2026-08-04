import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kaios sample preview",
  robots: { index: false, follow: false },
};

export default async function SamplePreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const label = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <main className="sample-preview">
      <nav className="sample-nav">
        <strong>{label}</strong>
        <div>
          <a href="#work">Work</a>
          <a href="#about">About</a>
        </div>
      </nav>
      <section className="sample-hero">
        <p>Independent design practice</p>
        <h1>Useful spaces, carefully resolved.</h1>
        <a href="#work">See selected work</a>
      </section>
      <section className="sample-project" id="work">
        <div className="sample-image sample-image-a">
          <span>Project image placeholder</span>
        </div>
        <div>
          <h2>Courtyard House</h2>
          <p>
            A compact home organized around light, shade, and a quiet outdoor
            room.
          </p>
        </div>
      </section>
      <section className="sample-project reverse">
        <div className="sample-image sample-image-b">
          <span>Project image placeholder</span>
        </div>
        <div>
          <h2>Workshop Annex</h2>
          <p>
            A flexible working space built from a direct material palette and
            durable details.
          </p>
        </div>
      </section>
      <section className="sample-about" id="about">
        <h2>Designed for the way work is lived.</h2>
        <p>
          This in-app sample keeps every Kaios preview interactive before the
          owner replaces the placeholder URL with a real template demo.
        </p>
      </section>
    </main>
  );
}

