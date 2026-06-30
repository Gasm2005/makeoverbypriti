import { Star, Phone } from "lucide-react";
import heroBride from "@/assets/hero-bride.jpg";
import type { BusinessInfo } from "@/lib/types";

export function Hero({ biz }: { biz: BusinessInfo }) {
  return (
    <section id="top" className="relative min-h-[94vh] overflow-hidden bg-[#1A1A1A]">
      {/* Background: real photo (Admin > Business Info can override this default) with a dark gradient overlay for text legibility. */}
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src={biz.hero_image_url || heroBride}
          alt=""
          className="h-full w-full object-cover object-[center_25%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/88 via-charcoal/60 to-charcoal/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-transparent to-charcoal/15" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[94vh] w-full max-w-6xl items-center gap-12 px-6 py-28 md:grid-cols-[1.15fr_0.85fr]">
        {/* Left: copy */}
        <div className="text-cream">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-charcoal/40 px-4 py-1.5 backdrop-blur">
            <Star className="h-4 w-4 fill-gold text-gold" />
            <span className="text-sm tracking-wide">5.0 · 18+ Google reviews</span>
          </div>

          <h1 className="mt-6 font-serif text-4xl leading-[1.08] sm:text-5xl md:text-6xl">
            {biz.name}
          </h1>

          <div className="mt-5 flex items-center gap-3">
            <span className="h-px w-10 bg-gold/60" />
            <p className="text-sm uppercase tracking-[0.25em] text-gold/90 md:text-base">
              {biz.tagline}
            </p>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#book"
              className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-medium tracking-wide text-primary-foreground shadow-lg shadow-primary/30 transition hover:bg-primary/90"
            >
              Book Appointment
            </a>
            <a
              href={`tel:${biz.phone}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-cream/40 bg-cream/10 px-6 py-3 text-sm font-medium text-cream backdrop-blur transition hover:bg-cream/20"
            >
              <Phone className="h-4 w-4" /> Call Now
            </a>
            <a
              href={`https://wa.me/${biz.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M20.52 3.48A11.78 11.78 0 0 0 12.05 0C5.5 0 .18 5.31.18 11.86c0 2.09.55 4.13 1.6 5.93L0 24l6.4-1.68a11.83 11.83 0 0 0 5.65 1.44h.01c6.55 0 11.87-5.32 11.87-11.86 0-3.17-1.23-6.15-3.41-8.42zM12.06 21.6h-.01a9.7 9.7 0 0 1-4.95-1.36l-.36-.21-3.8 1 .96-3.71-.23-.38a9.74 9.74 0 0 1-1.5-5.18c0-5.39 4.39-9.78 9.79-9.78 2.61 0 5.07 1.02 6.91 2.87a9.74 9.74 0 0 1 2.86 6.92c0 5.4-4.39 9.83-9.67 9.83zm5.37-7.34c-.29-.15-1.74-.86-2-.96-.27-.1-.46-.15-.66.15-.2.29-.76.96-.93 1.16-.17.19-.34.22-.63.07-.29-.15-1.24-.46-2.36-1.46-.87-.78-1.46-1.74-1.63-2.03-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.19-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.66-1.6-.9-2.18-.24-.57-.48-.5-.66-.51l-.56-.01c-.2 0-.51.07-.78.37-.27.29-1.02 1-1.02 2.43 0 1.43 1.04 2.81 1.19 3.01.15.2 2.05 3.13 4.96 4.39.69.3 1.23.48 1.65.62.69.22 1.32.19 1.82.12.55-.08 1.74-.71 1.98-1.39.24-.68.24-1.27.17-1.39-.07-.12-.27-.19-.56-.34z"/></svg>
            </a>
          </div>

          {/* Stat strip */}
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-cream/15 pt-6 text-cream/80">
            <div>
              <p className="font-serif text-2xl text-cream">18+</p>
              <p className="text-xs uppercase tracking-[0.2em] text-cream/55">Happy Brides</p>
            </div>
            <div className="h-8 w-px bg-cream/15" />
            <div>
              <p className="font-serif text-2xl text-cream">7+</p>
              <p className="text-xs uppercase tracking-[0.2em] text-cream/55">Years in Lucknow</p>
            </div>
            <div className="h-8 w-px bg-cream/15" />
            <div>
              <p className="font-serif text-2xl text-cream">12</p>
              <p className="text-xs uppercase tracking-[0.2em] text-cream/55">Signature Services</p>
            </div>
          </div>
        </div>

        {/* Right column intentionally left empty — the real photo shows through here */}
        <div aria-hidden="true" />
      </div>

      <p className="absolute bottom-6 left-6 z-10 text-xs uppercase tracking-[0.3em] text-cream/50">
        Lucknow · Since 2019
      </p>
    </section>
  );
}
