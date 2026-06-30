import bridalLook from "@/assets/hero-bride.jpg";

type GalleryImage = { id: string; image_url: string; label: string };

export function Gallery({ images }: { images: GalleryImage[] }) {
  const tiles = [{ id: "default", src: bridalLook, label: "Bridal Look" }, ...images.map((g) => ({
    id: g.id,
    src: g.image_url,
    label: g.label || "Gallery",
  }))];

  return (
    <section id="gallery" className="bg-secondary/40 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">Gallery</p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">Looks &amp; Moments</h2>
          <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-accent to-transparent" />
        </div>

        {/* Simple uniform grid — no spanning, so it never breaks regardless of count */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {tiles.map(({ id, src, label }) => (
            <div
              key={id}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#1A1A1A] shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <img
                src={src}
                alt={label}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
              <span className="absolute bottom-3 left-4 text-xs font-medium uppercase tracking-[0.15em] text-cream/90">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
