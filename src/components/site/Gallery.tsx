import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";

const images = [g1, g2, g3, g4, g5, g6];

export function Gallery() {
  return (
    <section id="gallery" className="bg-secondary/40 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">Gallery</p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">Looks &amp; Moments</h2>
          <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-accent to-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">
            A glimpse of our work · placeholder imagery to be replaced with real photos.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {images.map((src, i) => (
            <div
              key={i}
              className={`overflow-hidden rounded-2xl ${
                i === 0 ? "md:row-span-2 md:col-span-2" : ""
              }`}
            >
              <img
                src={src}
                alt={`Gallery ${i + 1}`}
                loading="lazy"
                width={1024}
                height={1024}
                className="h-full w-full object-cover transition duration-700 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
