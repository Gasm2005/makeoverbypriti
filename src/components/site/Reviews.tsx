import { Star } from "lucide-react";
import type { BusinessInfo } from "@/lib/types";

const reviews = [
  { name: "Happy Client", text: "Amazing Service really Nice behavior of Priti Ma'am, love to her work." },
  { name: "Bride", text: "Best place for hair chemical and bridal makeup. Very hygienic." },
  { name: "Customer", text: "Very good experience" },
];

export function Reviews({ biz }: { biz: BusinessInfo }) {
  return (
    <section id="reviews" className="bg-background py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">Reviews</p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">Loved by Our Clients</h2>
          <div className="mt-4 flex items-center justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-accent text-accent" />
            ))}
            <span className="ml-2 text-sm text-muted-foreground">5.0 · 18+ reviews</span>
          </div>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <figure
              key={i}
              className="rounded-2xl border border-border bg-card p-7 shadow-sm"
            >
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <blockquote className="mt-4 font-serif text-lg leading-relaxed text-foreground">
                "{r.text}"
              </blockquote>
              <figcaption className="mt-4 text-sm text-muted-foreground">— {r.name}</figcaption>
            </figure>
          ))}
        </div>
        {biz.google_reviews_url && (
          <div className="mt-10 text-center">
            <a
              href={biz.google_reviews_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-2.5 text-sm transition hover:border-primary/40"
            >
              Read more reviews on Google →
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
