import { Phone, MapPin, Clock, Instagram } from "lucide-react";
import type { BusinessInfo } from "@/lib/types";

export function Contact({ biz }: { biz: BusinessInfo }) {
  return (
    <section id="contact" className="bg-secondary/40 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">Visit</p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">Find Us in Lucknow</h2>
          <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-accent to-transparent" />
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-border shadow-lg">
            {biz.maps_embed_url ? (
              <iframe
                title="Map"
                src={biz.maps_embed_url}
                className="h-80 w-full md:h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="flex h-80 items-center justify-center bg-muted">Map unavailable</div>
            )}
          </div>

          <div className="flex flex-col gap-5">
            <Item icon={<MapPin className="h-5 w-5" />} label="Address">
              {biz.address}
            </Item>
            <Item icon={<Phone className="h-5 w-5" />} label="Phone">
              <a href={`tel:${biz.phone}`} className="hover:text-primary">{biz.phone}</a>
            </Item>
            <Item icon={<Clock className="h-5 w-5" />} label="Hours">
              {biz.hours}
            </Item>
            <Item icon={<Instagram className="h-5 w-5" />} label="Instagram">
              <a
                href={biz.instagram_url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                @makeoverbypriti_
              </a>
            </Item>

            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={`tel:${biz.phone}`}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground hover:bg-primary/90"
              >
                <Phone className="h-4 w-4" /> Call
              </a>
              <a
                href={`https://wa.me/${biz.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm text-white hover:opacity-90"
              >
                WhatsApp
              </a>
              <a
                href={biz.instagram_url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm hover:border-primary/40"
              >
                <Instagram className="h-4 w-4" /> Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Item({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-border bg-card p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="mt-1 text-sm leading-relaxed">{children}</p>
      </div>
    </div>
  );
}
