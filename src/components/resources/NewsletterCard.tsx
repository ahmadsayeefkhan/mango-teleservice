"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { insightsHub } from "@/content/resources";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Ink newsletter card. Client-side validation only; no backend is wired yet. */
export function NewsletterCard() {
  const n = insightsHub.newsletter;
  const id = useId();
  const [value, setValue] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL.test(value.trim())) {
      setState("error");
      return;
    }
    setState("done");
  };

  return (
    <div data-tone="ink" className="rounded-3xl border border-white/10 bg-ink p-6 text-paper md:p-8">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-6">
          <p className="font-display text-[1.375rem] font-semibold leading-tight tracking-[-0.02em] md:text-[1.5rem]">{n.title}</p>
          <p className="mt-2 text-[14.5px] text-mist">{n.body}</p>
        </div>
        <form onSubmit={submit} noValidate className="lg:col-span-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor={id} className="sr-only">
              Work email
            </label>
            <input
              id={id}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder={n.placeholder}
              value={value}
              disabled={state === "done"}
              onChange={(e) => {
                setValue(e.target.value);
                if (state === "error") setState("idle");
              }}
              aria-invalid={state === "error" || undefined}
              aria-describedby={`${id}-msg`}
              className={cn(
                "h-[52px] min-w-0 flex-1 rounded-lg border bg-graphite px-4 text-[15px] text-paper placeholder:text-mist/70 focus-visible:outline-mango",
                state === "error" ? "border-signal-red" : "border-white/15",
              )}
            />
            <Button type="submit" variant="primary" tone="dark" disabled={state === "done"}>
              {n.cta}
            </Button>
          </div>
          <p id={`${id}-msg`} role="status" aria-live="polite" className={cn("mt-2 min-h-5 text-[13px]", state === "error" ? "text-signal-red" : "text-signal-green")}>
            {state === "error" ? n.invalid : state === "done" ? n.success : ""}
          </p>
        </form>
      </div>
    </div>
  );
}
