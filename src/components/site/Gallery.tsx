import { Crown, Sparkles, Eye, Heart, Camera, Wand2 } from "lucide-react";

const placeholders = [
  { icon: Crown, label: "Bridal Look" },
  { icon: Sparkles, label: "Party Glam" },
  { icon: Eye, label: "Eye Makeup" },
  { icon: Heart, label: "Special Occasion" },
  { icon: Camera, label: "Photo Ready" },
  { icon: Wand2, label: "Hairstyling" },
];

export function Gallery() {
  return (
    <section id="gallery" className="bg-secondary/40 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">Gallery</p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">Looks &amp; Moments</h2>
          <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-accent to-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">
            A glimpse of our work · photos coming soon — upload real photos via Admin
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {placeholders.map(({ icon: Icon, label }, i) => (
            <div
              key={i}
              className={`group relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#B76E79]/15 via-[#D4AF7A]/10 to-[#1A1A1A]/5 ${
                i === 0 ? "md:row-span-2 md:col-span-2 md:aspect-auto" : ""
              }`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(212,175,122,0.25),transparent_60%)]" />
              <div className="relative flex flex-col items-center gap-2 text-center">
                <Icon className="h-8 w-8 text-primary/60 transition group-hover:scale-110 md:h-10 md:w-10" />
                <span className="text-xs font-medium tracking-wide text-muted-foreground">
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
