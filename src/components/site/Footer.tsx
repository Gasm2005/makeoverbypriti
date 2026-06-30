import { Instagram, Phone } from "lucide-react";
import type { BusinessInfo } from "@/lib/types";

export function Footer({ biz }: { biz: BusinessInfo }) {
  return (
    <footer className="bg-charcoal py-12 text-cream">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-3">
        <div>
          <h3 className="font-serif text-2xl">{biz.name}</h3>
          <p className="mt-2 text-sm text-cream/70">{biz.tagline}</p>
        </div>
        <div className="text-sm">
          <p className="text-xs uppercase tracking-widest text-cream/50">Explore</p>
          <ul className="mt-3 space-y-2">
            <li><a href="#services" className="hover:text-accent">Services</a></li>
            <li><a href="#gallery" className="hover:text-accent">Gallery</a></li>
            <li><a href="#book" className="hover:text-accent">Booking</a></li>
            <li><a href="#contact" className="hover:text-accent">Contact</a></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="text-xs uppercase tracking-widest text-cream/50">Connect</p>
          <div className="mt-3 flex gap-3">
            <a href={biz.instagram_url ?? "#"} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="rounded-full border border-cream/20 p-2 hover:border-accent">
              <Instagram className="h-4 w-4" />
            </a>
            <a href={`https://wa.me/${biz.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="rounded-full border border-cream/20 p-2 hover:border-accent">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M20.52 3.48A11.78 11.78 0 0 0 12.05 0C5.5 0 .18 5.31.18 11.86c0 2.09.55 4.13 1.6 5.93L0 24l6.4-1.68a11.83 11.83 0 0 0 5.65 1.44h.01c6.55 0 11.87-5.32 11.87-11.86 0-3.17-1.23-6.15-3.41-8.42z"/></svg>
            </a>
            <a href={`tel:${biz.phone}`} aria-label="Call" className="rounded-full border border-cream/20 p-2 hover:border-accent">
              <Phone className="h-4 w-4" />
            </a>
          </div>
          <p className="mt-4 text-xs text-cream/50">{biz.address}</p>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl border-t border-cream/10 px-6 pt-6 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} {biz.name}. All rights reserved.
      </div>
    </footer>
  );
}
