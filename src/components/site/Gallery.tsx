import { Crown, Sparkles, Eye, Heart, Camera, Wand2 } from "lucide-react";

const tiles = [
  { icon: Crown, label: "Bridal Look", tone: "from-[#B76E79]/30 via-[#8a4a52]/20 to-transparent" },
  { icon: Sparkles, label: "Party Glam", tone: "from-[#D4AF7A]/30 via-[#a87c45]/20 to-transparent" },
  { icon: Eye, label: "Eye Makeup", tone: "from-[#7a4452]/30 via-[#3a2329]/20 to-transparent" },
  { icon: Heart, label: "Special Occasion", tone: "from-[#D4AF7A]/25 via-[#B76E79]/20 to-transparent" },
  { icon: Camera, label: "Photo Ready", tone: "from-[#8a4a52]/30 via-[#D4AF7A]/15 to-transparent" },
  { icon: Wand2, label: "Hairstyling", tone: "from-[#B76E79]/25 via-[#3a2329]/25 to-transparent" },
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
            Real client photos uploading soon — add yours anytime from Admin
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
          {tiles.map(({ icon: Icon, label, tone }, i) => (
            <div
              key={i}
              className={`group relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#1A1A1A] shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg ${
                i === 0 ? "md:col-span-2 md:row-span-2 md:aspect-auto" : ""
              }`}
            >
              {/* Layered soft "bokeh" blobs to mimic a photography placeholder */}
              <div className={`absolute inset-0 bg-gradient-to-br ${tone}`} />
              <div className="absolute -left-6 -top-6 h-28 w-28 rounded-full bg-gold/20 blur-2xl" />
              <div className="absolute -right-8 bottom-0 h-32 w-32 rounded-full bg-primary/25 blur-3xl" />
              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(250,246,241,0.9) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              <div className="relative flex h-full flex-col items-center justify-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-black/20 backdrop-blur-sm transition group-hover:scale-110">
                  <Icon className="h-6 w-6 text-gold" />
                </div>
              </div>
              <span className="absolute bottom-3 left-4 text-xs font-medium uppercase tracking-[0.15em] text-cream/85">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
