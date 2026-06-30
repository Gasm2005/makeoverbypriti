import { Crown, Sparkles, GraduationCap } from "lucide-react";

export function About() {
  return (
    <section id="about" className="bg-cream py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 md:grid-cols-[0.85fr_1.15fr]">
        {/* Decorative emblem — echoes the hero motif for visual consistency */}
        <div className="relative mx-auto flex h-64 w-64 items-center justify-center md:h-72 md:w-72">
          <div className="absolute inset-0 rounded-full border border-primary/20" />
          <div className="absolute inset-6 rounded-full border border-accent/30" />
          <div className="relative flex h-36 w-36 flex-col items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#B76E79]/15 to-[#D4AF7A]/10">
            <Crown className="h-9 w-9 text-primary" />
            <span className="font-serif text-sm text-primary/80">Priti</span>
          </div>
          <Sparkles className="absolute -right-1 top-4 h-5 w-5 text-accent/60" />
          <Sparkles className="absolute -left-2 bottom-6 h-4 w-4 text-accent/40" />
        </div>

        {/* Copy */}
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-primary">About</p>
          <h2 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">
            Crafted with care by Priti
          </h2>
          <div className="mt-4 h-px w-16 bg-gradient-to-r from-accent to-transparent" />
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            A boutique salon &amp; academy in Lucknow where every bride and client
            is treated as the muse of the day. From timeless bridal looks to
            modern HD &amp; airbrush finishes, Priti blends technique with
            intuition — trusted by{" "}
            <span className="font-medium text-foreground">18+ happy brides</span>{" "}
            and growing.
          </p>

          <div className="mt-8 flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
              <GraduationCap className="h-5 w-5" />
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Also home to the <span className="font-medium text-foreground">Makeover By Priti Academy</span>,
              where aspiring makeup artists train under her guidance — from
              fundamentals to bridal-ready mastery.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
