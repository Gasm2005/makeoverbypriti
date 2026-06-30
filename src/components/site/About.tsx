export function About() {
  return (
    <section id="about" className="bg-cream py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-primary">About</p>
        <h2 className="mt-3 font-serif text-4xl md:text-5xl">
          Crafted with care by Priti
        </h2>
        <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-accent to-transparent" />
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          A boutique salon &amp; academy in Lucknow where every bride and client
          is treated as the muse of the day. From timeless bridal looks to
          modern HD &amp; airbrush finishes, Priti blends technique with
          intuition — trusted by{" "}
          <span className="font-medium text-foreground">18+ happy brides</span>{" "}
          and growing.
        </p>
        <p className="mt-4 text-base text-muted-foreground">
          Also home to the <em>Makeover By Priti Academy</em>, where aspiring
          artists train under her guidance.
        </p>
      </div>
    </section>
  );
}
