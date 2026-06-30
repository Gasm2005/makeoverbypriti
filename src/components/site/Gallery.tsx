import bridalLook from "@/assets/hero-bride.jpg";

const tiles = [
  { src: bridalLook, label: "Bridal Look" },
  {
    src: "https://images.unsplash.com/photo-1550005869-5fca7db35ddb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    label: "Glam Makeup",
  },
  {
    src: "https://images.unsplash.com/photo-1621691536086-e21b2439c73a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    label: "Special Occasion",
  },
  {
    src: "https://images.unsplash.com/photo-1633029187262-333e004d4224?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGluZGlhbiUyMEdpcmwlMjBkb2luZyUyMG5haWwlMjBhcnR8ZW58MHx8MHx8fDA%3D",
    label: "Nail Art",
  },
  {
    src: "https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YmVhdXR5JTIwcGFybG91cnxlbnwwfHwwfHx8MA%3D%3D",
    label: "At The Salon",
  },
];

export function Gallery() {
  return (
    <section id="gallery" className="bg-secondary/40 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">Gallery</p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">Looks &amp; Moments</h2>
          <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-accent to-transparent" />
        </div>

        {/* Simple uniform grid — no spanning, so it never breaks on odd counts */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {tiles.map(({ src, label }, i) => (
            <div
              key={i}
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
