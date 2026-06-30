import { useEffect, useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import type { BusinessInfo } from "@/lib/types";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#gallery", label: "Gallery" },
  { href: "#reviews", label: "Reviews" },
  { href: "#contact", label: "Contact" },
];

// Short brand mark shown in the nav bar — keeps it from feeling cramped.
// The full legal name still appears in the Hero, Footer and page <title>.
function shortBrand(name: string) {
  const first = name.split(/[&|]/)[0].trim(); // "Makeover By Priti Academy" -> before any & or |
  const words = first.split(" ");
  if (words.length <= 2) return first;
  return words.slice(-2).join(" "); // fallback: last two words e.g. "Priti Academy"
}

export function Header({ biz }: { biz: BusinessInfo }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const brand = shortBrand(biz.name);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-cream/10 bg-[#1A1A1A]/92 shadow-md backdrop-blur-md"
          : "border-transparent bg-gradient-to-b from-[#1A1A1A]/60 to-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:h-[72px] md:px-8">
        {/* Brand */}
        <a href="#top" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/50 bg-gradient-to-br from-[#B76E79]/35 to-[#D4AF7A]/20 font-serif text-[15px] text-gold">
            P
          </span>
          <span className="font-serif text-[17px] leading-none tracking-wide text-cream">
            {brand}
          </span>
        </a>

        {/* Nav */}
        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium uppercase tracking-[0.12em] text-cream/70 transition hover:text-gold"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href={`tel:${biz.phone}`}
            aria-label="Call"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 text-cream/80 transition hover:border-gold/50 hover:text-gold"
          >
            <Phone className="h-4 w-4" />
          </a>
          <a
            href="#book"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-[13px] font-medium uppercase tracking-[0.1em] text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            Book Now
          </a>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-cream lg:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-cream/10 bg-[#1A1A1A] px-6 py-5 lg:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium tracking-wide text-cream/80"
              >
                {link.label}
              </a>
            ))}
            <a
              href={`tel:${biz.phone}`}
              className="flex items-center gap-2 text-sm font-medium text-cream/80"
            >
              <Phone className="h-4 w-4" /> {biz.phone}
            </a>
            <a
              href="#book"
              onClick={() => setOpen(false)}
              className="mt-1 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium tracking-wide text-primary-foreground"
            >
              Book Appointment
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
