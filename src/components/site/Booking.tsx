import { useState, useMemo, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CheckCircle2, CalendarHeart } from "lucide-react";
import { createBooking, getBookedSlots } from "@/lib/public.functions";
import type { Service, Staff } from "@/lib/types";

const OPEN = 11 * 60;
const CLOSE = 20 * 60;
const STEP = 30;

function generateSlots() {
  const out: string[] = [];
  for (let t = OPEN; t + STEP <= CLOSE; t += STEP) {
    const h = Math.floor(t / 60);
    const m = t % 60;
    out.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }
  return out;
}

export function Booking({ services, staff }: { services: Service[]; staff: Staff[] }) {
  const qc = useQueryClient();
  const create = useServerFn(createBooking);
  const getBooked = useServerFn(getBookedSlots);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [staffId, setStaffId] = useState(staff[0]?.id ?? "");
  const [date, setDate] = useState(format(new Date(Date.now() + 86400000), "yyyy-MM-dd"));
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!serviceId && services[0]) setServiceId(services[0].id);
    if (!staffId && staff[0]) setStaffId(staff[0].id);
  }, [services, staff, serviceId, staffId]);

  const selectedService = services.find((s) => s.id === serviceId);
  const slots = useMemo(generateSlots, []);

  const bookedQuery = useQuery({
    queryKey: ["booked-slots", staffId, date],
    queryFn: () => getBooked({ data: { staffId, date } }),
    enabled: !!staffId && !!date,
  });

  const busy = useMemo(() => {
    const dur = selectedService?.duration_min || 60;
    const bookedRanges = (bookedQuery.data ?? []).map((b) => {
      const [h, m] = b.booking_time.slice(0, 5).split(":").map(Number);
      const s = h * 60 + m;
      return [s, s + (b.duration_min || 60)] as [number, number];
    });
    const set = new Set<string>();
    for (const t of slots) {
      const [h, m] = t.split(":").map(Number);
      const s = h * 60 + m;
      const e = s + dur;
      if (e > CLOSE) {
        set.add(t);
        continue;
      }
      if (bookedRanges.some(([bs, be]) => s < be && e > bs)) set.add(t);
    }
    return set;
  }, [bookedQuery.data, slots, selectedService]);

  const mutation = useMutation({
    mutationFn: (vars: any) => create({ data: vars }),
    onSuccess: () => {
      setDone(true);
      qc.invalidateQueries({ queryKey: ["booked-slots", staffId, date] });
    },
    onError: (e: any) => setError(e?.message ?? "Something went wrong"),
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!time) {
      setError("Please pick a time slot");
      return;
    }
    mutation.mutate({ name, phone, serviceId, staffId, date, time, notes: notes || null });
  }

  if (done) {
    return (
      <section id="book" className="bg-cream py-24">
        <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-10 text-center shadow-lg">
          <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
          <h2 className="mt-4 font-serif text-3xl">Thank you, {name.split(" ")[0]}!</h2>
          <p className="mt-3 text-muted-foreground">
            Your appointment request for{" "}
            <strong className="text-foreground">{selectedService?.name}</strong> on{" "}
            <strong className="text-foreground">
              {format(new Date(date), "PPP")} at {time}
            </strong>{" "}
            has been received. We'll confirm shortly via WhatsApp or a call.
          </p>
          <button
            onClick={() => {
              setDone(false);
              setName("");
              setPhone("");
              setTime("");
              setNotes("");
            }}
            className="mt-6 rounded-full border border-border px-6 py-2 text-sm hover:border-primary/40"
          >
            Book another
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="book" className="bg-cream py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
            <CalendarHeart className="h-5 w-5" />
          </div>
          <p className="text-xs uppercase tracking-[0.4em] text-primary">Booking</p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">Reserve Your Appointment</h2>
          <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-accent to-transparent" />
        </div>

        <form
          onSubmit={submit}
          className="mt-10 grid gap-4 rounded-3xl border border-border bg-card p-6 shadow-xl shadow-primary/5 md:p-10"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Your name">
              <input
                required
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="Full name"
              />
            </Field>
            <Field label="Phone number">
              <input
                required
                type="tel"
                maxLength={20}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input"
                placeholder="+91 …"
              />
            </Field>
          </div>

          <Field label="Service">
            <select
              required
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="input"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.price_from ? `· from ₹${s.price_from}` : ""}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Staff">
              <select
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                className="input"
              >
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Date">
              <input
                required
                type="date"
                min={format(new Date(), "yyyy-MM-dd")}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setTime("");
                }}
                className="input"
              />
            </Field>
          </div>

          <Field label={`Time slot${selectedService ? ` · ${selectedService.duration_min} min` : ""}`}>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {slots.map((s) => {
                const isBusy = busy.has(s);
                const selected = time === s;
                return (
                  <button
                    type="button"
                    key={s}
                    disabled={isBusy}
                    onClick={() => setTime(s)}
                    className={`rounded-lg border px-2 py-2 text-sm transition ${
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : isBusy
                        ? "border-border bg-muted text-muted-foreground line-through opacity-50"
                        : "border-border bg-background hover:border-primary/50"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Notes (optional)">
            <textarea
              maxLength={500}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="input"
              placeholder="Any special requests?"
            />
          </Field>

          {error && (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="mt-2 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-medium tracking-wide text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
          >
            {mutation.isPending ? "Sending…" : "Request Appointment"}
          </button>
          <p className="text-center text-xs text-muted-foreground">
            We'll confirm via WhatsApp or call before your slot.
          </p>
        </form>
      </div>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid var(--color-border);
          background: var(--color-background);
          padding: 0.65rem 0.85rem;
          font-size: 0.95rem;
          outline: none;
          transition: border-color .15s;
        }
        .input:focus { border-color: var(--color-primary); }
      `}</style>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
