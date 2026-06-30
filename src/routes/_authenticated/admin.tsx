import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import {
  checkIsAdmin,
  claimFirstAdmin,
  listBookings,
  updateBookingStatus,
  upsertService,
  deleteService,
  upsertStaff,
  deleteStaff,
  updateBusinessInfo,
} from "@/lib/admin.functions";
import { listServices, listStaff, getBusinessInfo } from "@/lib/public.functions";
import { MessageCircle } from "lucide-react";
import type { Booking, Service, Staff, BusinessInfo } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Makeover By Priti" }] }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const isAdminFn = useServerFn(checkIsAdmin);
  const claimFn = useServerFn(claimFirstAdmin);
  const qc = useQueryClient();
  const adminQ = useQuery({ queryKey: ["is-admin"], queryFn: () => isAdminFn() });
  const [tab, setTab] = useState<"bookings" | "services" | "staff" | "business">("bookings");

  const claim = useMutation({
    mutationFn: () => claimFn(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["is-admin"] }),
  });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (adminQ.isLoading) return <div className="p-10 text-center">Loading…</div>;
  if (!adminQ.data?.isAdmin) {
    return (
      <div className="mx-auto max-w-md p-10 text-center">
        <h1 className="font-serif text-2xl">No admin access</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          You're signed in but not an admin. If you're the first user, you can claim admin access:
        </p>
        <button
          onClick={() => claim.mutate()}
          disabled={claim.isPending}
          className="mt-4 rounded-full bg-primary px-6 py-2 text-sm text-primary-foreground"
        >
          {claim.isPending ? "…" : "Claim admin"}
        </button>
        {claim.error && (
          <p className="mt-3 text-sm text-destructive">{(claim.error as any).message}</p>
        )}
        <button onClick={signOut} className="mt-6 text-xs text-muted-foreground underline">
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/20">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="font-serif text-2xl">Admin Dashboard</h1>
            <p className="text-xs text-muted-foreground">Makeover By Priti</p>
          </div>
          <button
            onClick={signOut}
            className="rounded-full border border-border px-4 py-1.5 text-sm hover:border-primary/40"
          >
            Sign out
          </button>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-6">
          {(["bookings", "services", "staff", "business"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`border-b-2 px-4 py-3 text-sm capitalize transition ${
                tab === t
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {tab === "bookings" && <BookingsView />}
        {tab === "services" && <ServicesView />}
        {tab === "staff" && <StaffView />}
        {tab === "business" && <BusinessView />}
      </main>
    </div>
  );
}

function BookingsView() {
  const fn = useServerFn(listBookings);
  const update = useServerFn(updateBookingStatus);
  const bizFn = useServerFn(getBusinessInfo);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["bookings"], queryFn: () => fn() });
  const bizQ = useQuery({ queryKey: ["biz-whatsapp"], queryFn: () => bizFn() });
  const [status, setStatus] = useState<string>("all");

  const m = useMutation({
    mutationFn: (vars: any) => update({ data: vars }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bookings"] }),
  });

  const filtered = useMemo(() => {
    const data = (q.data ?? []) as Booking[];
    if (status === "all") return data;
    return data.filter((b) => b.status === status);
  }, [q.data, status]);

  function clientWaLink(b: Booking) {
    const dateStr = format(new Date(b.booking_date), "MMM d, yyyy");
    const msg = `Hi ${b.name}, your appointment for *${b.service_name}* on ${dateStr} at ${b.booking_time.slice(
      0,
      5,
    )} with ${b.staff_name ?? "our team"} is confirmed at Makeover By Priti Academy & Salon. See you then! 💇‍♀️`;
    const phone = b.phone.replace(/[^0-9]/g, "");
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  }

  function ownerWaLink(b: Booking) {
    const dateStr = format(new Date(b.booking_date), "MMM d, yyyy");
    const msg = `New confirmed booking: ${b.name} (${b.phone}) — ${b.service_name} on ${dateStr} at ${b.booking_time.slice(
      0,
      5,
    )} with ${b.staff_name ?? "—"}.`;
    const ownerPhone = (bizQ.data as any)?.whatsapp?.replace(/[^0-9]/g, "");
    if (!ownerPhone) return null;
    return `https://wa.me/${ownerPhone}?text=${encodeURIComponent(msg)}`;
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {["all", "pending", "confirmed", "completed", "cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`rounded-full border px-3 py-1.5 text-xs capitalize ${
              status === s ? "border-primary bg-primary text-primary-foreground" : "border-border"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-3">Date / Time</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Service</th>
              <th className="p-3">Staff</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-t border-border">
                <td className="p-3">
                  <div>{format(new Date(b.booking_date), "MMM d, yyyy")}</div>
                  <div className="text-xs text-muted-foreground">{b.booking_time.slice(0, 5)}</div>
                </td>
                <td className="p-3">
                  <div>{b.name}</div>
                  <a href={`tel:${b.phone}`} className="text-xs text-primary hover:underline">
                    {b.phone}
                  </a>
                  {b.notes && (
                    <div className="mt-1 text-xs italic text-muted-foreground">{b.notes}</div>
                  )}
                </td>
                <td className="p-3">{b.service_name}</td>
                <td className="p-3">{b.staff_name}</td>
                <td className="p-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      b.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : b.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : b.status === "completed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {b.status === "confirmed" && (
                      <>
                        <a
                          href={clientWaLink(b)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Send confirmation to client on WhatsApp"
                          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </a>
                        {ownerWaLink(b) && (
                          <a
                            href={ownerWaLink(b)!}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Send a copy to my own WhatsApp"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-primary hover:bg-secondary/70"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </a>
                        )}
                      </>
                    )}
                    <select
                      value={b.status}
                      onChange={(e) => m.mutate({ id: b.id, status: e.target.value })}
                      className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  No bookings
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ServicesView() {
  const fn = useServerFn(listServices);
  const upsert = useServerFn(upsertService);
  const del = useServerFn(deleteService);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["services-all"], queryFn: () => fn() });
  const m = useMutation({
    mutationFn: (vars: any) => upsert({ data: vars }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["services-all"] });
      qc.invalidateQueries({ queryKey: ["services"] });
    },
  });
  const d = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services-all"] }),
  });

  return (
    <div className="space-y-3">
      {(q.data ?? []).map((s: Service) => (
        <div key={s.id} className="grid gap-2 rounded-xl border border-border bg-card p-4 md:grid-cols-6">
          <input
            defaultValue={s.name}
            className="input-row md:col-span-2"
            onBlur={(e) => e.target.value !== s.name && m.mutate({ ...s, name: e.target.value })}
          />
          <input
            defaultValue={s.category}
            className="input-row"
            onBlur={(e) => e.target.value !== s.category && m.mutate({ ...s, category: e.target.value })}
          />
          <input
            type="number"
            defaultValue={s.price_from ?? 0}
            className="input-row"
            onBlur={(e) =>
              m.mutate({ ...s, price_from: parseInt(e.target.value) || null })
            }
          />
          <input
            type="number"
            defaultValue={s.duration_min}
            className="input-row"
            onBlur={(e) => m.mutate({ ...s, duration_min: parseInt(e.target.value) || 60 })}
          />
          <button
            onClick={() => confirm(`Delete ${s.name}?`) && d.mutate(s.id)}
            className="rounded-md border border-destructive/30 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/5"
          >
            Delete
          </button>
        </div>
      ))}
      <button
        onClick={() =>
          m.mutate({
            name: "New Service",
            category: "Bridal & Party",
            duration_min: 60,
            sort_order: 99,
            active: true,
          })
        }
        className="rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground"
      >
        + Add service
      </button>
      <style>{`.input-row{border:1px solid var(--color-border);background:var(--color-background);border-radius:.4rem;padding:.4rem .6rem;font-size:.85rem}`}</style>
    </div>
  );
}

function StaffView() {
  const fn = useServerFn(listStaff);
  const upsert = useServerFn(upsertStaff);
  const del = useServerFn(deleteStaff);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["staff-all"], queryFn: () => fn() });
  const m = useMutation({
    mutationFn: (vars: any) => upsert({ data: vars }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["staff-all"] });
      qc.invalidateQueries({ queryKey: ["staff"] });
    },
  });
  const d = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff-all"] }),
  });

  return (
    <div className="space-y-3">
      {(q.data ?? []).map((s: Staff) => (
        <div key={s.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
          <input
            defaultValue={s.name}
            onBlur={(e) =>
              e.target.value !== s.name &&
              m.mutate({ id: s.id, name: e.target.value, active: true, sort_order: 0 })
            }
            className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
          <button
            onClick={() => confirm(`Delete ${s.name}?`) && d.mutate(s.id)}
            className="rounded-md border border-destructive/30 px-3 py-1.5 text-xs text-destructive"
          >
            Delete
          </button>
        </div>
      ))}
      <button
        onClick={() => m.mutate({ name: "New Staff", active: true, sort_order: 0 })}
        className="rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground"
      >
        + Add staff
      </button>
    </div>
  );
}

function BusinessView() {
  const fn = useServerFn(getBusinessInfo);
  const upd = useServerFn(updateBusinessInfo);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["biz"], queryFn: () => fn() });
  const m = useMutation({
    mutationFn: (vars: any) => upd({ data: vars }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["biz"] });
      qc.invalidateQueries({ queryKey: ["business"] });
    },
  });

  if (!q.data) return <div>Loading…</div>;
  const b = q.data as BusinessInfo;

  function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    m.mutate({
      id: b.id,
      name: String(fd.get("name") ?? ""),
      tagline: String(fd.get("tagline") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      whatsapp: String(fd.get("whatsapp") ?? ""),
      address: String(fd.get("address") ?? ""),
      maps_embed_url: String(fd.get("maps_embed_url") ?? ""),
      instagram_url: String(fd.get("instagram_url") ?? ""),
      google_reviews_url: String(fd.get("google_reviews_url") ?? ""),
      hours: String(fd.get("hours") ?? ""),
    });
  }

  return (
    <form onSubmit={save} className="grid max-w-2xl gap-4 rounded-2xl border border-border bg-card p-6">
      {[
        ["name", "Salon name"],
        ["tagline", "Tagline"],
        ["phone", "Phone"],
        ["whatsapp", "WhatsApp (with country code)"],
        ["address", "Address"],
        ["hours", "Hours"],
        ["instagram_url", "Instagram URL"],
        ["google_reviews_url", "Google reviews URL"],
        ["maps_embed_url", "Google Maps embed URL"],
      ].map(([key, label]) => (
        <label key={key} className="block">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
          <input
            name={key}
            defaultValue={(b as any)[key] ?? ""}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </label>
      ))}
      <button
        disabled={m.isPending}
        className="rounded-full bg-primary px-6 py-2 text-sm text-primary-foreground disabled:opacity-60"
      >
        {m.isPending ? "Saving…" : "Save"}
      </button>
      {m.isSuccess && <p className="text-sm text-green-700">Saved.</p>}
    </form>
  );
}
