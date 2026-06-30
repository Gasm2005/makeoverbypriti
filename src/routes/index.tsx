import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { getBusinessInfo, listServices, listStaff, listGalleryImages } from "@/lib/public.functions";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Services } from "@/components/site/Services";
import { Gallery } from "@/components/site/Gallery";
import { Booking } from "@/components/site/Booking";
import { Reviews } from "@/components/site/Reviews";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { MobileBar } from "@/components/site/MobileBar";

const bizQO = queryOptions({ queryKey: ["business"], queryFn: () => getBusinessInfo() });
const servicesQO = queryOptions({ queryKey: ["services"], queryFn: () => listServices() });
const staffQO = queryOptions({ queryKey: ["staff"], queryFn: () => listStaff() });
const galleryQO = queryOptions({ queryKey: ["gallery"], queryFn: () => listGalleryImages() });

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Makeover By Priti Academy & Salon — Bridal Makeup in Lucknow" },
      {
        name: "description",
        content:
          "Premium bridal, party & HD makeup, hair straightening, and makeup academy in Lucknow. 5★ rated. Book your appointment with Priti today.",
      },
      { property: "og:title", content: "Makeover By Priti Academy & Salon" },
      {
        property: "og:description",
        content:
          "Bridal, party, airbrush & HD makeup · Hair straightening · Skincare · Academy classes in Lucknow.",
      },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(bizQO),
      context.queryClient.ensureQueryData(servicesQO),
      context.queryClient.ensureQueryData(staffQO),
      context.queryClient.ensureQueryData(galleryQO),
    ]);
  },
  errorComponent: ({ error }) => (
    <div className="flex min-h-screen items-center justify-center px-6 text-center">
      <div>
        <h1 className="font-serif text-2xl">We couldn't load the page</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      </div>
    </div>
  ),
  notFoundComponent: () => <div className="p-10 text-center">Not found</div>,
  component: Index,
});

function Index() {
  const { data: biz } = useSuspenseQuery(bizQO);
  const { data: services } = useSuspenseQuery(servicesQO);
  const { data: staff } = useSuspenseQuery(staffQO);
  const { data: gallery } = useSuspenseQuery(galleryQO);
  if (!biz) return null;
  return (
    <main className="pb-16 md:pb-0">
      <Header biz={biz} />
      <Hero biz={biz} />
      <About />
      <Services services={services} />
      <Gallery images={gallery} />
      <Booking services={services} staff={staff} />
      <Reviews biz={biz} />
      <Contact biz={biz} />
      <Footer biz={biz} />
      <MobileBar biz={biz} />
    </main>
  );
}
