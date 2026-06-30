import { Phone, Calendar } from "lucide-react";
import type { BusinessInfo } from "@/lib/types";

export function MobileBar({ biz }: { biz: BusinessInfo }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-border bg-card/95 backdrop-blur md:hidden">
      <a href={`tel:${biz.phone}`} className="flex items-center justify-center gap-2 py-3 text-sm">
        <Phone className="h-4 w-4 text-primary" /> Call
      </a>
      <a
        href={`https://wa.me/${biz.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 border-x border-border py-3 text-sm"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#25D366]"><path d="M20.52 3.48A11.78 11.78 0 0 0 12.05 0C5.5 0 .18 5.31.18 11.86c0 2.09.55 4.13 1.6 5.93L0 24l6.4-1.68a11.83 11.83 0 0 0 5.65 1.44h.01c6.55 0 11.87-5.32 11.87-11.86 0-3.17-1.23-6.15-3.41-8.42z"/></svg>
        WhatsApp
      </a>
      <a
        href="#book"
        className="flex items-center justify-center gap-2 bg-primary py-3 text-sm text-primary-foreground"
      >
        <Calendar className="h-4 w-4" /> Book
      </a>
    </div>
  );
}
