import { Star, Phone, Sparkles } from "lucide-react";
import type { BusinessInfo } from "@/lib/types";

export function Hero({ biz }: { biz: BusinessInfo }) {
  return (
    <section id="top" className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Elegant abstract placeholder background — replace with a real photo via Admin > Business Info */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#3a2329] via-[#5c2f36] to-[#1A1A1A]"
        aria-hidden="true"
      >
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,rgba(212,175,122,0.5),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(183,110,121,0.45),transparent_50%)]" />
        <Sparkles className="absolute right-[12%] top-[18%] h-10 w-10 text-gold/30" />
        <Sparkles className="absolute left-[10%] bottom-[20%] h-6 w-6 text-gold/20" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/55 to-charcoal/20" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-24 text-cream">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-charcoal/40 px-4 py-1.5 backdrop-blur">
          <Star className="h-4 w-4 fill-gold text-gold" />
          <span className="text-sm tracking-wide">5.0 · 18+ Google reviews</span>
        </div>
        <h1 className="mt-6 font-serif text-5xl leading-tight md:text-7xl">
          {biz.name}
        </h1>
        <p className="mt-4 max-w-xl text-base text-cream/85 md:text-lg">
          {biz.tagline}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
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
        <p className="mt-6 text-xs uppercase tracking-[0.3em] text-cream/60">Lucknow · Since 2019</p>
      </div>
    </section>
  );
}
