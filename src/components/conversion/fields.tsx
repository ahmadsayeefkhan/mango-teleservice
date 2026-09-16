"use client";

import { ChevronDown } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------
   Shared, accessible form primitives for the conversion pages.
   Inputs: 8px radius, 1px Stone border, Paper fill, 48px tall; errors in
   signal-red with aria-invalid + aria-describedby wiring.
   ------------------------------------------------------------------ */

export const controlClass = (invalid?: boolean, extra?: string) =>
  cn(
    "block w-full rounded-lg border bg-paper px-4 text-[15px] leading-none text-ink placeholder:text-slate/70",
    "transition-[border-color,box-shadow] duration-200 focus:outline-none focus-visible:border-ink focus-visible:ring-2 focus-visible:ring-signal-blue/40",
    invalid ? "border-signal-red" : "border-stone hover:border-slate/50",
    extra,
  );

export type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: (a11y: { id: string; "aria-invalid": boolean | undefined; "aria-describedby": string | undefined }) => ReactNode;
};

/** Label + control + hint/error, with the aria wiring passed to the control via render prop. */
export function Field({ id, label, hint, error, optional, className, children }: FieldProps) {
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-[13px] font-medium text-ink">
        <span>{label}</span>
        {optional && <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-slate">Optional</span>}
      </label>
      {children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy })}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-[12.5px] leading-snug text-slate">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="flex items-start gap-1.5 text-[12.5px] font-medium leading-snug text-signal-red">
          <span aria-hidden="true" className="mt-[5px] inline-block size-1.5 shrink-0 rounded-full bg-signal-red" />
          {error}
        </p>
      )}
    </div>
  );
}

export function TextInput({ invalid, className, ...rest }: ComponentPropsWithoutRef<"input"> & { invalid?: boolean }) {
  return <input {...rest} className={controlClass(invalid, cn("h-12", className))} />;
}

export function TextArea({ invalid, className, ...rest }: ComponentPropsWithoutRef<"textarea"> & { invalid?: boolean }) {
  return <textarea {...rest} className={controlClass(invalid, cn("min-h-32 resize-y py-3 leading-relaxed", className))} />;
}

export function Select({ invalid, className, children, ...rest }: ComponentPropsWithoutRef<"select"> & { invalid?: boolean }) {
  return (
    <span className="relative block">
      <select {...rest} className={controlClass(invalid, cn("h-12 appearance-none pr-10", className))}>
        {children}
      </select>
      <ChevronDown size={16} strokeWidth={1.75} aria-hidden="true" className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate" />
    </span>
  );
}

/** Mono step/section label used above field groups. */
export function GroupLabel({ children, id, className }: { children: ReactNode; id?: string; className?: string }) {
  return (
    <p id={id} className={cn("text-[13px] font-medium text-ink", className)}>
      {children}
    </p>
  );
}
