import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

export const getBusinessInfo = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const { data, error } = await sb.from("business_info").select("*").limit(1).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
});

export const listServices = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const { data, error } = await sb
    .from("services")
    .select("*")
    .eq("active", true)
    .order("sort_order");
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const listGalleryImages = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const { data, error } = await sb
    .from("gallery_images")
    .select("*")
    .eq("active", true)
    .order("sort_order");
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const listStaff = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const { data, error } = await sb
    .from("staff")
    .select("id,name")
    .eq("active", true)
    .order("sort_order");
  if (error) throw new Error(error.message);
  return data ?? [];
});


const bookedSlotsInput = z.object({
  staffId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const getBookedSlots = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => bookedSlotsInput.parse(d))
  .handler(async ({ data }) => {
    const sb = publicClient();
    const { data: rows, error } = await sb
      .from("bookings")
      .select("booking_time,duration_min")
      .eq("staff_id", data.staffId)
      .eq("booking_date", data.date)
      .in("status", ["pending", "confirmed"]);
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

const createBookingInput = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(20),
  serviceId: z.string().uuid(),
  staffId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  notes: z.string().max(500).optional().nullable(),
});

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => createBookingInput.parse(d))
  .handler(async ({ data }) => {
    const sb = publicClient();
    const [{ data: svc }, { data: staff }] = await Promise.all([
      sb.from("services").select("name,duration_min").eq("id", data.serviceId).maybeSingle(),
      sb.from("staff").select("name").eq("id", data.staffId).maybeSingle(),
    ]);
    if (!svc || !staff) throw new Error("Invalid service or staff");

    // Conflict check
    const { data: existing } = await sb
      .from("bookings")
      .select("booking_time,duration_min")
      .eq("staff_id", data.staffId)
      .eq("booking_date", data.date)
      .in("status", ["pending", "confirmed"]);

    const toMin = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };
    const newStart = toMin(data.time);
    const newEnd = newStart + (svc.duration_min || 60);
    const conflict = (existing ?? []).some((b) => {
      const s = toMin(b.booking_time.slice(0, 5));
      const e = s + (b.duration_min || 60);
      return newStart < e && newEnd > s;
    });
    if (conflict) throw new Error("This slot was just taken. Please pick another time.");

    const { error } = await sb.from("bookings").insert({
      name: data.name,
      phone: data.phone,
      service_id: data.serviceId,
      service_name: svc.name,
      staff_id: data.staffId,
      staff_name: staff.name,
      booking_date: data.date,
      booking_time: data.time + ":00",
      duration_min: svc.duration_min || 60,
      notes: data.notes ?? null,
      status: "pending",
    });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
