import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import type { Service } from "@/lib/types";

const CATEGORIES = ["Bridal & Party", "Hair", "Skin & Beauty", "Academy"] as const;

export function Services({ services }: { services: Service[] }) {
  const [active, setActive] = useState<string>(CATEGORIES[0]);
  const filtered = useMemo(
    () => services.filter((s) => s.category === active),
    [services, active],
  );
  return (
    <section id="services" className="bg-background py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">Services</p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">Our Signature Offerings</h2>
          <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-accent to-transparent" />
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`rounded-full border px-5 py-2 text-sm transition ${
                active === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary/40"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => {
            const Icon =
              (s.icon &&
                (Icons as unknown as Record<string, any>)[
                  toPascal(s.icon)
                ]) ||
              Icons.Sparkles;
            return (
              <article
                key={s.id}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-serif text-2xl">{s.name}</h3>
                {s.description && (
                  <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                )}
                <div className="mt-6 flex items-end justify-between border-t border-border pt-4">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">
                    Starting from
                  </span>
                  <span className="font-serif text-xl text-primary">
                    {s.price_from ? `₹${s.price_from.toLocaleString("en-IN")}` : "On request"}
                  </span>
                </div>
                <a
                  href="#book"
                  className="absolute inset-0"
                  aria-label={`Book ${s.name}`}
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function toPascal(s: string) {
  return s
    .split(/[-_\s]/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}
