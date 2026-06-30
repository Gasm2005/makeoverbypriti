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

export function Header({ biz }: { biz: BusinessInfo }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cream/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-cream/80"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="#top"
          className={`font-serif text-lg tracking-wide transition md:text-xl ${
            scrolled ? "text-charcoal" : "text-cream"
          }`}
        >
          {biz.name}
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition hover:text-primary ${
                scrolled ? "text-charcoal/80" : "text-cream/90"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={`tel:${biz.phone}`}
            className={`inline-flex items-center gap-1.5 text-sm font-medium transition ${
              scrolled ? "text-charcoal/80" : "text-cream/90"
            }`}
          >
            <Phone className="h-3.5 w-3.5" /> {biz.phone}
          </a>
          <a
            href="#book"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-medium tracking-wide text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            Book Appointment
          </a>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition md:hidden ${
            scrolled ? "text-charcoal" : "text-cream"
          }`}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-cream px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium tracking-wide text-charcoal/80"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#book"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium tracking-wide text-primary-foreground"
            >
              Book Appointment
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
