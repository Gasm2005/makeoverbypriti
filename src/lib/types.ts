export type BusinessInfo = {
  id: string;
  name: string;
  tagline: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  maps_embed_url: string | null;
  instagram_url: string | null;
  google_reviews_url: string | null;
  hours: string | null;
  hero_image_url: string | null;
  color_primary: string | null;
  color_accent: string | null;
  color_bg: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  og_image_url: string | null;
};

export type Service = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price_from: number | null;
  duration_min: number;
  icon: string | null;
  sort_order: number;
  active: boolean;
};

export type Staff = { id: string; name: string };

export type Booking = {
  id: string;
  name: string;
  phone: string;
  service_id: string | null;
  service_name: string;
  staff_id: string | null;
  staff_name: string | null;
  booking_date: string;
  booking_time: string;
  duration_min: number;
  notes: string | null;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  created_at: string;
};
